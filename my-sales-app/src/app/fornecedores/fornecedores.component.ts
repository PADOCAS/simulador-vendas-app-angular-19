import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MaterialModule} from "../material.module";
import {LoadingBarComponent} from "../util/loading-bar/loading-bar.component";
import {Router} from "@angular/router";
import {FornecedoresService} from "./fornecedores.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Fornecedor} from "../../interface/Fornecedor";
import {FornecedoresItem} from "./fornecedores-datasource";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [MaterialModule, LoadingBarComponent],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.css'
})
export class FornecedoresComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<FornecedoresItem>;
  dataSource = new MatTableDataSource<Fornecedor>();
  showLoading: Boolean = false;

  constructor(private fornecedorService: FornecedoresService, private router: Router) {
  }

  /** Colunas da tabela, servem para reordenar, etc.. */
  displayedColumns = ['id', 'razaoSocial', 'tituloContato', 'editar', 'excluir'];

  ngAfterViewInit(): void {
    this.loadFornecedores();
  }

  async loadFornecedores(): Promise<void> {
    //Chamada assincrona, para alimentar o data source ele aguarda a resposta do service com os Fornecedores:
    this.showLoading = true;
    let fornecedores = await lastValueFrom(this.fornecedorService.getFornecedores());
    this.dataSource = new MatTableDataSource(fornecedores);
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.showLoading = false;
  }

  navegarParaCadFornecedor() {
    this.router.navigate(['/cad-fornecedor']);
  }

  onClickEditar(fornecedor: Fornecedor) {
    console.log('Editando Fornecedor: ', fornecedor);

    if (fornecedor !== undefined
      && fornecedor !== null
      && fornecedor.id !== undefined
      && fornecedor.id !== null) {
      this.router.navigate(['/cad-fornecedor-edit', fornecedor.id]);
    }
  }

  async onClickDeletar(fornecedor: Fornecedor) {
    console.log('Excluindo Fornecedor: ', fornecedor);

    if (fornecedor !== undefined
      && fornecedor !== null
      && fornecedor.id !== undefined
      && fornecedor.id !== null) {
      if (confirm(`Deletar Fornecedor (${fornecedor.id}) ${fornecedor.razaoSocial} ?`)) {
        this.showLoading = true;
        this.fornecedorService.deletar(fornecedor.id).subscribe(
          data => {
            this.showLoading = false;
            //Carregar Fornecedores após deletar:
            this.loadFornecedores();
          }
        );
      }
    }
  }


}
