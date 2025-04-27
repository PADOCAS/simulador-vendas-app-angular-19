import {Categoria} from "./Categoria";

export interface Produto {
  id: number
  fornecedorId: number
  categoria: Categoria | null
  unidadeMedida: string
  precoUnitario: number | null
  qtdeEstoque: number | null
  ativo: boolean
  descricao: string
}
