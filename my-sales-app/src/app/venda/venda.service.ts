import {Injectable} from '@angular/core';
import {CarrinhoItem} from "../../interface/carrinho-item";

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  //Vamos controlar as variáveis do carrinho no localStorage do navegador, teremos 2:
  //1-CARRINHO (chave -> carrinho) -> Array com todos os items do carrinho
  //2-CARRINHO_QTDE (chave -> carrinho_qtde) -> QTDE de items no carrinho
  readonly CARRINHO: string = 'carrinho';
  readonly CARRINHO_QTDE: string = 'carrinho_qtde';

  constructor() {
  }

  public getItems(): Array<CarrinhoItem> {
    //Retorna o array de CarrinhoItem (INTERFACE) que está no localstorage do navegador:
    let carrinhoItems = localStorage.getItem(this.CARRINHO);

    if (carrinhoItems) {
      return JSON.parse(carrinhoItems);
    }

    return [];
  }

  public addItem(item: CarrinhoItem): void {
    //Adiciona um produto novo ao carrinho no localstorage do navegador ao atualiza um existente com sua quantidade:
    let found = false;
    const items = this.getItems();

    items.forEach((element) => {
      if (element.produtoId === item.produtoId) {
        //Atualiza o atributo qtdeEstoque, pode ser que o estoque esteja alterado depois de um tempo, já fica sempre atualizado aqui ao tentar adicionar:
        if (item.qtdeEstoque !== null
          && item.qtdeEstoque !== undefined) {
          element.qtdeEstoque = item.qtdeEstoque;
        }

        if (element.quantidade !== null) {
          //Valida Estoque:
          let qtdeEstoqueDisponivel = element.qtdeEstoque === null ? 0 : element.qtdeEstoque;

          if ((element.quantidade + 1) <= qtdeEstoqueDisponivel) {
            element.quantidade++;
          }
        }
        found = true
      }
    });

    if (!found) {
      items.push(item)
    }
    localStorage.setItem(this.CARRINHO, JSON.stringify(items));
    localStorage.setItem(this.CARRINHO_QTDE, items.length.toString());
  }

  public removeItem(item: CarrinhoItem): void {
    //Remove uma Qtde de um produto no localstorage do navegador
    let found = false
    let items = this.getItems()
    items.forEach((element) => {
      if (element.produtoId === item.produtoId) {
        if (element.quantidade !== null) {
          element.quantidade--;
        }

        found = true
      }
    });

    let newItens = items.filter((element) => element.quantidade !== null && element.quantidade > 0);
    localStorage.setItem(this.CARRINHO, JSON.stringify(newItens));
    localStorage.setItem(this.CARRINHO_QTDE, newItens.length.toString());
  }

  get qtdeItensNoCarrinho(): number {
    //Retorna a qtde de produtos existentes no carrinho:
    return this.getItems().length;
  }

  get valorTotalCarrinho(): number {
    //Retorna o Valor total de todos os items do carrinho:
    let total = 0
    let items = this.getItems();
    items.forEach((element) => {
      if (element.precoUnitario !== null
        && element.quantidade !== null) {
        total += element.precoUnitario * element.quantidade;
      }
    });

    return total;
  }
}
