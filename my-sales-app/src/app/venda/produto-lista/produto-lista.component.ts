import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {ProdutosService} from "../../produtos/produtos.service";
import {FormBuilder} from "@angular/forms";
import {Produto} from "../../../interface/Produto";
import {LoadingBarComponent} from "../../util/loading-bar/loading-bar.component";
import {CurrencyPipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-produto-lista',
  imports: [MaterialModule, LoadingBarComponent, CurrencyPipe, DecimalPipe],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.css'
})
export class ProdutoListaComponent implements OnInit {
  showLoading: Boolean = false;
  produtos: Produto[] | any;
  searchForm = this.form.group({
    searchTerm: ['']
  });

  constructor(private produtoService: ProdutosService, private form: FormBuilder) {
  }

  ngOnInit(): void {
    this.getProdutos().then(() => {
    }, error => {
      console.log('Erro ao carregar Produtos: ' + error);
    });
  }

  async getProdutos(): Promise<void> {
    this.produtos = await this.produtoService.getProdutosComFiltro(this.searchForm?.value?.searchTerm).toPromise();
  }

  async onSearch() {
    this.getProdutos().then(() => {
    }, error => {
      console.log('Erro ao carregar Produtos: ' + error);
    });
  }

}
