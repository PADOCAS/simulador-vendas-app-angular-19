import {Fornecedor} from "./Fornecedor";
import {Categoria} from "./Categoria";

export interface Produto {
  id: number
  fornecedor: Fornecedor | null
  categoria: Categoria | null
  unidadeMedida: string
  precoUnitario: number
  qtdeEstoque: number
  ativo: boolean
  descricao: string
}
