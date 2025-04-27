import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoadingBarComponent} from "../../util/loading-bar/loading-bar.component";
import {NgForOf, NgIf} from "@angular/common";
import {MaterialModule} from "../../material.module";
import {ActivatedRoute, Router} from "@angular/router";
import {ProdutosService} from "../produtos.service";
import {Produto} from "../../../interface/Produto";
import {lastValueFrom} from "rxjs";
import {Fornecedor} from "../../../interface/Fornecedor";
import {FornecedoresService} from "../../fornecedores/fornecedores.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {Categoria} from "../../../interface/Categoria";
import {CategoriasService} from "../../categorias/categorias.service";

@Component({
  selector: 'app-cad-produto',
  imports: [
    ReactiveFormsModule, MaterialModule, NgIf, LoadingBarComponent, MatSelect, MatOption, NgForOf
  ],
  templateUrl: './cad-produto.component.html',
  styleUrl: './cad-produto.component.css'
})
export class CadProdutoComponent implements OnInit {
  showLoading: Boolean = false;
  listFornecedor: Array<Fornecedor> | any = null;
  listCategoria: Array<Categoria> | any = null;
  @ViewChild('inputCategoria') inputCategoria: ElementRef<HTMLInputElement> | any;
  filteredCategoriaOptions: Categoria[] | undefined;

  // Vamos trabalhar com formulário reativo, usando FormBuilder, que agrupa um conjunto de campos de formulário,
  // Ele nos ajuda com esqueleto do formulário, validações, valor padrão... muito bom!
  // produtoForm -> é uma variável do tipo FormGroup que representa os dados que estarão
  // presentes no formulário. Cada campo no formulário é representado pela classe FormControl
  produtoForm = this.form.group({
    id: [null as number | null],
    fornecedorId: [null as number | null, Validators.required],
    categoria: [null as Categoria | null, [Validators.required, this.categoriaValidaValidator()]],
    unidadeMedida: ['', [Validators.required, Validators.minLength(2)]],
    precoUnitario: [null as number | null, [Validators.required]],
    qtdeEstoque: [null as number | null, [Validators.required]],
    ativo: [true as boolean, [Validators.required]],
    descricao: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private produtosService: ProdutosService, private fornecedoresService: FornecedoresService, private categoriasService: CategoriasService, private form: FormBuilder, private router: Router, private routeActive: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.carregarCategorias().then(() => {
      if (this.listCategoria !== null
        && this.listCategoria.length > 0) {
        this.filteredCategoriaOptions = this.listCategoria.slice();
      }

      this.carregarFornecedores().then((data) => {
        if (this.routeActive !== undefined
          && this.routeActive !== null
          && this.routeActive.snapshot !== undefined
          && this.routeActive.snapshot !== null
          && this.routeActive.snapshot.paramMap !== undefined
          && this.routeActive.snapshot.paramMap !== null
          && this.routeActive.snapshot.paramMap.get('id') !== undefined
          && this.routeActive.snapshot.paramMap.get('id') !== null) {
          this.produtosService.pegar(Number(this.routeActive.snapshot.paramMap.get('id'))).subscribe(
            data => {
              if (data !== undefined
                && data !== null) {
                let produto = data as Produto;
                this.produtoForm.setValue({
                  id: produto.id,
                  fornecedorId: produto.fornecedorId || null,  // Apenas o ID do fornecedor
                  categoria: produto.categoria || null, //Categoria
                  unidadeMedida: produto.unidadeMedida,
                  precoUnitario: produto.precoUnitario,
                  qtdeEstoque: produto.qtdeEstoque,
                  ativo: produto.ativo !== null && produto.ativo !== undefined ? produto.ativo : true,
                  descricao: produto.descricao
                });

                //Desabilita o ID quando é consulta, apenas mostra
                this.produtoForm.get('id')?.disable();
              }
            }
          );
        }
        //Para conseguir pegar os métodos, atributos, tudo via console do navegador e validar dados... usar isso aqui:
        //Ai no navegador console é so colocar comp.... e vai acessando os métodos tal, atributos... MUITO BOM!!!!
        (window as any).comp = this;
      }, error => {
        console.log('Erro ao carregar Fornecedores: ' + error);
      })
    }, error => {
      console.log('Erro ao carregar Categorias: ' + error);
    });
  }

  //Carregamento com Promisse, vamos aguardar finalizar para carregar os campos do formulário no onInit:
  async carregarCategorias(): Promise<void> {
    this.listCategoria = await this.categoriasService.getCategorias().toPromise();
  }

  //Carregamento com Promisse, vamos aguardar finalizar para carregar os campos do formulário no onInit:
  async carregarFornecedores(): Promise<void> {
    this.listFornecedor = await this.fornecedoresService.getFornecedores().toPromise();
  }

  displayCategoria = (categoria: Categoria): string => {
    return categoria ? `(${categoria.id}) ${categoria.nome}` : '';
  };

  filterCategoria(): void {
    const input = this.inputCategoria.nativeElement.value?.toLowerCase() || '';
    this.filteredCategoriaOptions = this.listCategoria?.filter((c: Categoria) =>
      c.nome.toLowerCase().includes(input) || c.id.toString().includes(input)
    ) || [];
  }

  onCategoriaSelected(categoria: Categoria): void {
    this.produtoForm.controls['categoria'].setValue(categoria);
    this.produtoForm.controls['categoria'].markAsTouched(); // Força atualização do estado
    this.produtoForm.updateValueAndValidity(); // Atualiza validação do formulário
  }

  categoriaValidaValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && typeof value === 'object' && 'id' in value && 'nome' in value) {
        control.markAsTouched(); // Marca como tocado para atualizar o estado
        return null; // válido
      }
      return {invalidCategoria: true}; // inválido
    };
  }

  onSubmit() {
    this.onSave(this.convertFormBuilderGroupToProduto());
  }

  //Converte o formBuilderGroup com seu value para o objeto produto:
  private convertFormBuilderGroupToProduto(): Produto {
    // Habilita o campo 'id' antes de capturar os valores (Usamos o optional chaining ? para validar se ta nulo ou undefined ele ignorar (casos de inclusào))
    this.produtoForm.get('id')?.enable();

    let value = this.produtoForm.value;

    // Desahabilita o campo 'id' depois que completou o salvar (Usamos o optional chaining ? para validar se ta nulo ou undefined ele ignorar (casos de inclusào))
    this.produtoForm.get('id')?.disable();

    return {
      id: value.id ?? 0,
      fornecedorId: value.fornecedorId ?? 0,
      categoria: value.categoria || null,
      unidadeMedida: value.unidadeMedida || '',
      precoUnitario: value.precoUnitario || null,
      qtdeEstoque: value.qtdeEstoque || null,
      ativo: value.ativo !== null && value.ativo !== undefined ? value.ativo : true,
      descricao: value.descricao || ''
    };
  }

  async onSave(produto: Produto) {
    //Async/Await -> Esperando a resposta do salvar para ai sim redirecionar a página, já com a alteração sendo carregada lá na listagem!
    this.showLoading = true;
    let saved = await lastValueFrom(this.produtosService.salvar(produto));
    this.showLoading = false;
    //Ao salvar redireciona para a listagem:
    this.router.navigate(["/produtos"]);
  }

  cancelar() {
    this.router.navigate(["/produtos"]);
  }
}
