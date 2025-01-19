import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ProdutosItem} from './produtos-datasource';
import {Produto} from "../../interface/Produto";
import {MaterialModule} from "../material.module";
import {LoadingBarComponent} from "../util/loading-bar/loading-bar.component";
import {Router} from "@angular/router";
import {ProdutosService} from "./produtos.service";
import {lastValueFrom} from "rxjs";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-produtos',
    templateUrl: './produtos.component.html',
    styleUrl: './produtos.component.css',
    imports: [MaterialModule, LoadingBarComponent, NgClass]
})
export class ProdutosComponent implements AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<ProdutosItem>;
    dataSource = new MatTableDataSource<Produto>();
    showLoading: Boolean = false;


    constructor(private produtoService: ProdutosService, private router: Router) {
    }

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['id', 'descricao', 'unidadeMedida', 'ativo', 'editar', 'excluir'];

    ngAfterViewInit(): void {
        this.loadProdutos();
    }

    async loadProdutos(): Promise<void> {
        //Chamada assincrona, para alimentar o data source ele aguarda a resposta do service com os Produtos:
        this.showLoading = true;
        let produtos = await lastValueFrom(this.produtoService.getProdutos());
        this.dataSource = new MatTableDataSource(produtos);
        this.table.dataSource = this.dataSource;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.showLoading = false;
    }

    navegarParaCadFornecedor() {
        this.router.navigate(['/cad-produto']);
    }

    onClickEditar(produto: Produto) {
        if (produto !== undefined
            && produto !== null
            && produto.id !== undefined
            && produto.id !== null) {
            this.router.navigate(['/cad-produto-edit', produto.id]);
        }
    }

    async onClickDeletar(produto: Produto) {
        if (produto !== undefined
            && produto !== null
            && produto.id !== undefined
            && produto.id !== null) {
            if (confirm(`Deletar Produto (${produto.id}) ${produto.descricao} ?`)) {
                this.showLoading = true;
                this.produtoService.deletar(produto.id).subscribe(
                    data => {
                        this.showLoading = false;
                        //Carregar Produtos após deletar:
                        this.loadProdutos();
                    }
                );
            }
        }
    }
}
