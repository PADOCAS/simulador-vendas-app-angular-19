import {Fornecedor} from "./Fornecedor";
import {Categoria} from "./Categoria";

export interface Produto {
  id: number
  fornecedor: Fornecedor
  categoria: Categoria
  unidadeMedida: string
  precoUnitario: number | null
  qtdeEstoque: number | null
  ativo: boolean
  descricao: string
}
