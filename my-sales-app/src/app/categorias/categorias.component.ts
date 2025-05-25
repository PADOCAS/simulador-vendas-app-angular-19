import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CategoriasItem} from './categorias-datasource';
import {MatButton} from "@angular/material/button";
import {Categoria} from "../../interface/Categoria";
import {CategoriasService} from "./categorias.service";
import {lastValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {LoadingBarComponent} from "../util/loading-bar/loading-bar.component";
import {MaterialModule} from "../material.module";
import {ProdutosService} from "../produtos/produtos.service";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  imports: [MaterialModule, MatButton, LoadingBarComponent]
})
export class CategoriasComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CategoriasItem>;
  dataSource = new MatTableDataSource<Categoria>();
  showLoading: Boolean = false;

  constructor(private categoriaService: CategoriasService, private produtosService: ProdutosService, private router: Router) {
  }

  /** Colunas da tabela, servem para reordenar, etc.. */
  displayedColumns = ['id', 'nome', 'descricao', 'editar', 'excluir'];

  ngAfterViewInit(): void {
    this.loadCategorias();
  }

  async loadCategorias(): Promise<void> {
    //Chamada assincrona, para alimentar  o data source ele aguarda a resposta do service com as categorias:
    this.showLoading = true;
    let categorias = await lastValueFrom(this.categoriaService.getCategorias());
    this.dataSource = new MatTableDataSource(categorias);
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.showLoading = false;
  }

  navegarParaCadCategoria() {
    this.router.navigate(['/cad-categoria']);  // Navegue para a rota desejada
  }

  onClickEditar(categoria: Categoria) {
    console.log('Editando Categoria: ', categoria);

    if (categoria !== undefined
      && categoria !== null
      && categoria.id !== undefined
      && categoria.id !== null) {
      this.router.navigate(['/cad-categoria-edit', categoria.id]);
    }
  }

  async onClickDeletar(categoria: Categoria) {
    console.log('Excluindo Categoria: ', categoria);

    if (categoria !== undefined
      && categoria !== null
      && categoria.id !== undefined
      && categoria.id !== null) {
      if (confirm(`Deletar Categoria (${categoria.id}) ${categoria.nome} ?`)) {
        this.showLoading = true;

        //Verifica se é possível excluir, se não tem produto cadastrado com essa categoria:
        if (await this.produtosService.existsProdutoComCategoria(categoria)) {
          alert('Não é possível excluir uma categoria que possui produtos cadastrados.');
          this.showLoading = false;
        } else {
          this.categoriaService.deletar(categoria.id).subscribe(
            data => {
              this.showLoading = false;
              //Carregar Categorias após deletar:
              this.loadCategorias();
            }
          );
        }
      }
    }
  }
}
