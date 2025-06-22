import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {ProdutosService} from "../../produtos/produtos.service";
import {FormBuilder} from "@angular/forms";
import {Produto} from "../../../interface/Produto";
import {LoadingBarComponent} from "../../util/loading-bar/loading-bar.component";
import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {VendaService} from "../venda.service";
import {CarrinhoItem} from "../../../interface/carrinho-item";

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

  constructor(private produtoService: ProdutosService, private vendaService: VendaService, private form: FormBuilder) {
  }

  ngOnInit(): void {
    this.showLoading = true;
    this.getProdutos().then(() => {
      this.showLoading = false;
    }, error => {
      console.log('Erro ao carregar Produtos: ' + error);
      this.showLoading = false;
    });
  }

  async getProdutos(): Promise<void> {
    this.produtos = await this.produtoService.getProdutosComFiltro(this.searchForm?.value?.searchTerm).toPromise();
  }

  async onSearch() {
    this.showLoading = true;
    this.getProdutos().then(() => {
      this.showLoading = false;
    }, error => {
      this.showLoading = false;
      console.log('Erro ao carregar Produtos: ' + error);
    });
  }

  onAddToCart(item: Produto) {
    let carrinhoItem: CarrinhoItem = {
      produtoId: item.id,
      descricao: item.descricao,
      qtdeEstoque: item.qtdeEstoque,
      quantidade: 1,
      precoUnitario: item.precoUnitario
    };

    this.vendaService.addItem(carrinhoItem);
  }

}
