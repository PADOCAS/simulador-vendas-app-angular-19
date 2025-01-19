export interface Produto {
  id: number
  fornecedorId: number
  categoriaId: number
  unidadeMedida: string
  precoUnitario: number | null
  qtdeEstoque: number | null
  ativo: boolean
  descricao: string
}
