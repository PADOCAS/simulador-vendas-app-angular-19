import {Component, OnInit} from '@angular/core';
import {LoadingBarComponent} from "../../util/loading-bar/loading-bar.component";
import {MaterialModule} from "../../material.module";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FornecedoresService} from "../fornecedores.service";
import {Fornecedor} from "../../../interface/Fornecedor";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-cad-fornecedor',
  standalone: true,
  imports: [
    ReactiveFormsModule, MaterialModule, NgIf, LoadingBarComponent
  ],
  templateUrl: './cad-fornecedor.component.html',
  styleUrl: './cad-fornecedor.component.css'
})
export class CadFornecedorComponent implements OnInit {
  showLoading: Boolean = false;
// Vamos trabalhar com formulário reativo, usando FormBuilder, que agrupa um conjunto de campos de formulário,
// Ele nos ajuda com esqueleto do formulário, validações, valor padrão... muito bom!

  // fornecedorForm -> é uma variável do tipo FormGroup que representa os dados que estarão
  // presentes no formulário. Cada campo no formulário é representado pela classe FormControl
  fornecedorForm = this.form.group({
    id: [null as number | null],
    razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
    tituloContato: ['', [Validators.required, Validators.minLength(3)]],
    nomeFantasia: ['', [Validators.required, Validators.minLength(3)]],
    endereco: this.form.group({
      rua: [''],
      cidade: [''],
      bairro: [''],
      cep: [null as number | null],
      pais: [''],
      telefone: ['']
    })
  })

  constructor(private fornecedoresService: FornecedoresService, private form: FormBuilder, private router: Router, private routeActive: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (this.routeActive !== undefined
      && this.routeActive !== null
      && this.routeActive.snapshot !== undefined
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.paramMap !== undefined
      && this.routeActive.snapshot.paramMap !== null
      && this.routeActive.snapshot.paramMap.get('id') !== undefined
      && this.routeActive.snapshot.paramMap.get('id') !== null) {
      this.fornecedoresService.pegar(Number(this.routeActive.snapshot.paramMap.get('id'))).subscribe(
        data => {
          if (data !== undefined
            && data !== null) {
            let fornecedor = data as Fornecedor;

            //Endereço pode ser NULO, tratar certinho para os casos especificos
            this.fornecedorForm.setValue({
              id: fornecedor.id,
              razaoSocial: fornecedor.razaoSocial,
              tituloContato: fornecedor.tituloContato,
              nomeFantasia: fornecedor.nomeFantasia,
              endereco: {
                rua: fornecedor.endereco?.rua || null,
                cidade: fornecedor.endereco?.cidade || null,
                cep: fornecedor.endereco?.cep || null,
                bairro: fornecedor.endereco?.bairro || null,
                pais: fornecedor.endereco?.pais || null,
                telefone: fornecedor.endereco?.telefone || null
              }
            });

            //Desabilita o ID quando é consulta, apenas mostra
            this.fornecedorForm.get('id')?.disable();
          }
        }
      );
    }
  }

  onSubmit() {
    console.log('Submit', this.fornecedorForm.value);
    this.onSave(this.convertFormBuilderGroupToFornecedor());
  }

  //Converte o formBuilderGroup com seu value para o objeto fornecedor:
  private convertFormBuilderGroupToFornecedor(): Fornecedor {
    // Habilita o campo 'id' antes de capturar os valores (Usamos o optional chaining ? para validar se ta nulo ou undefined ele ignorar (casos de inclusào))
    this.fornecedorForm.get('id')?.enable();

    let value = this.fornecedorForm.value;

    // Desahabilita o campo 'id' depois que completou o salvar (Usamos o optional chaining ? para validar se ta nulo ou undefined ele ignorar (casos de inclusào))
    this.fornecedorForm.get('id')?.disable();

    return {
      id: value.id ?? 0,
      razaoSocial: value.razaoSocial || '',
      tituloContato: value.tituloContato || '',
      nomeFantasia: value.nomeFantasia || '',
      endereco: {
        rua: value.endereco?.rua || null,
        cidade: value.endereco?.cidade || null,
        cep: value.endereco?.cep || null,
        bairro: value.endereco?.bairro || null,
        pais: value.endereco?.pais || null,
        telefone: value.endereco?.telefone || null
      }
    };
  }

  async onSave(fornecedor: Fornecedor) {
    //Async/Await -> Esperando a resposta do salvar para ai sim redirecionar a página, já com a alteração sendo carregada lá na listagem!
    this.showLoading = true;
    let saved = await lastValueFrom(this.fornecedoresService.salvar(fornecedor));
    console.log('Fornecedor salvo: ', saved);
    this.showLoading = false;
    //Ao salvar redireciona para a listagem:
    this.router.navigate(["/fornecedores"]);
  }

  cancelar() {
    this.router.navigate(["/fornecedores"]);
  }
}
