import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, forkJoin, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Produto} from "../../interface/Produto";
import {Categoria} from "../../interface/Categoria";
import {Fornecedor} from "../../interface/Fornecedor";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor(private http: HttpClient) {
  }

  public getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(environment.api + "produtos");
  }

  public getProdutosComFiltro(search?: string | undefined | null): Observable<Produto[]> {
    // let searchTerm = search != '' ? '&q=' + search : '';
    //Expand não funciona, pois ele faz o join apenas se o objeto fornecedores estiver no singular 'fornecedor', por isso não vai funcionar, vamos forçar um join:
    // return this.http.get<Produto[]>(environment.api + 'produtos?_expand=fornecedores' + searchTerm);

    //Para resolver fazendo a busca por todos os objetos envolvidos com produtos, vamos fazer um join entre produtos e fornecedores, e filtrar nos campos desejados:
    let produtoFiltro = this.http.get<Produto[]>(environment.api + 'produtos?ativo=true');
    let fornecedorFiltro = this.http.get<Fornecedor[]>(environment.api + 'fornecedores');

    return forkJoin({produtos: produtoFiltro, fornecedores: fornecedorFiltro}).pipe(
      map(({produtos, fornecedores}) => {
        return produtos.map(prod => ({
          ...prod,
          fornecedor: fornecedores.find(f => f.id === prod.fornecedorId)
        }));
      }),
      map(produtosComFornecedor => {
        if (!search || search.trim() === '') return produtosComFornecedor;

        let lowerSearch = search.toLowerCase();

        return produtosComFornecedor.filter(prod =>
          prod.id?.toString().includes(lowerSearch) ||
          prod.descricao?.toLowerCase().includes(lowerSearch) ||
          prod.categoria?.id?.toString().toLowerCase().includes(lowerSearch) ||
          prod.categoria?.nome?.toLowerCase().includes(lowerSearch) ||
          prod.categoria?.descricao?.toLowerCase().includes(lowerSearch) ||
          prod.fornecedor?.id?.toString().toLowerCase().includes(lowerSearch) ||
          prod.fornecedor?.razaoSocial?.toLowerCase().includes(lowerSearch) ||
          prod.fornecedor?.nomeFantasia?.toLowerCase().includes(lowerSearch)
        );
      })
    );
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
