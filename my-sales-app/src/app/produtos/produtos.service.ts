import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Produto} from "../../interface/Produto";
import {Categoria} from "../../interface/Categoria";
import {Fornecedor} from "../../interface/Fornecedor";

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor(private http: HttpClient) {
  }

  public getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(environment.api + "produtos");
  }

  public salvar(produto: Produto): Observable<Produto> {
    if (produto.id !== null
      && produto.id !== 0) {
      //Caso for alteração de um Produto}:
      return this.http.put<Produto>(environment.api + 'produtos/' + produto.id, produto);
    } else {
      //Insert de novo Produto:
      return this.http.post<Produto>(environment.api + 'produtos', produto);
    }
  }

  public async existsProdutoComCategoria(categoria: Categoria): Promise<boolean> {
    if (categoria !== null
      && categoria.id !== null) {
      //Verifica se tem algum produto com o id da Categoria recebida por parâmetro:
      //Deve ser feito em 2 linhas com then nao funciona o await e nem com subscribe:
      let produtos = await firstValueFrom(this.getProdutos());
      return produtos.some(produto => produto.categoria?.id === categoria.id);
    }

    return false;
  }

  public async existsProdutoComFornecedor(fornecedor: Fornecedor): Promise<boolean> {
    if (fornecedor !== null
      && fornecedor.id !== null) {
      //Verifica se tem algum produto com o id do Fornecedor recebido por parâmetro:
      //Deve ser feito em 2 linhas com then nao funciona o await e nem com subscribe:
      let produtos = await firstValueFrom(this.getProdutos());
      return produtos.some(produto => produto.fornecedorId === fornecedor.id);
    }

    return false;
  }

  public pegar(id: number): Observable<Produto> {
    return this.http.get<Produto>(environment.api + 'produtos/' + id);
  }

  public deletar(id: number): Observable<Produto> {
    return this.http.delete<Produto>(environment.api + 'produtos/' + id);
  }
}
