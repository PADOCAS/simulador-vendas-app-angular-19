import {Component, Input} from '@angular/core';
import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {MaterialModule} from "../../../material.module";
import {Produto} from "../../../../interface/Produto";
import {VendaService} from "../../venda.service";
import {CarrinhoItem} from "../../../../interface/carrinho-item";

@Component({
  selector: 'app-produto-card',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MaterialModule
  ],
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.css'
})
export class ProdutoCardComponent {
  @Input() produto!: Produto;

  constructor(private vendaService: VendaService) {
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
