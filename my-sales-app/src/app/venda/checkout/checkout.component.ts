import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {VendaService} from "../venda.service";
import {CarrinhoItem} from "../../../interface/carrinho-item";
import {CurrencyPipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-checkout',
  imports: [MaterialModule, CurrencyPipe, DecimalPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  public items: CarrinhoItem[] = [];

  constructor(public vendaService: VendaService) {
  }

  ngOnInit(): void {
    this.items = this.vendaService.getItems();
  }

  onRemoveItem(item: CarrinhoItem) {
    this.vendaService.removeItem(item);
    this.items = this.vendaService.getItems();
  }

  onAddItem(item:CarrinhoItem) {
    this.vendaService.addItem(item);
    this.items = this.vendaService.getItems();
  }

}
