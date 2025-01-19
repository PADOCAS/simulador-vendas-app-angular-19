import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Produto} from "../../interface/Produto";

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

  public pegar(id: number): Observable<Produto> {
    return this.http.get<Produto>(environment.api + 'produtos/' + id);
  }

  public deletar(id: number): Observable<Produto> {
    return this.http.delete<Produto>(environment.api + 'produtos/' + id);
  }
}
