import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CadCategoriaComponent} from "./categorias/cad-categoria/cad-categoria.component";
import {FornecedoresComponent} from "./fornecedores/fornecedores.component";
import {VendaComponent} from "./venda/venda.component";
import {ProdutoListaComponent} from "./venda/produto-lista/produto-lista.component";

export const routes: Routes = [
  //Categorias:
  {
    // {path: 'categorias',component: CategoriasComponent},   // Esse modo é da forma que fica tudo junto
    path: 'categorias',
    //Dessa forma o deploy fica mais leve, náo fica tudo num unico arquivo -> Deixando o arquivo de categoria isolado, onde só será carregado se o usuário acessar a página categorias!
    loadComponent: () =>
      import('./categorias/categorias.component').then(
        (c) => c.CategoriasComponent
      )
  },
  {path: 'cad-categoria', component: CadCategoriaComponent},
  {path: 'cad-categoria-edit/:id', component: CadCategoriaComponent},
  //Fornecedores:
  {
    path: 'fornecedores',
    loadComponent: () =>
      import('./fornecedores/fornecedores.component').then(
        (c) => c.FornecedoresComponent
      )
  },
  {
    path: 'cad-fornecedor',
    loadComponent: () =>
      import('./fornecedores/cad-fornecedor/cad-fornecedor.component').then(
        (c) => c.CadFornecedorComponent
      )
  },
  {
    path: 'cad-fornecedor-edit/:id',
    loadComponent: () =>
      import('./fornecedores/cad-fornecedor/cad-fornecedor.component').then(
        (c) => c.CadFornecedorComponent
      )
  },
  //Produtos:
  {
    path: 'produtos',
    loadComponent: () =>
      import('./produtos/produtos.component').then(
        (c) => c.ProdutosComponent
      )
  },
  {
    path: 'cad-produto',
    loadComponent: () =>
      import('./produtos/cad-produto/cad-produto.component').then(
        (c) => c.CadProdutoComponent
      )
  },
  {
    path: 'cad-produto-edit/:id',
    loadComponent: () =>
      import('./produtos/cad-produto/cad-produto.component').then(
        (c) => c.CadProdutoComponent
      )
  },
  //Checkout:
  {
    path: 'checkout',
    loadComponent: () =>
      import('./venda/checkout/checkout.component').then(
        (c) => c.CheckoutComponent
      )
  },
  {path: '',
    component: VendaComponent,
    children: [{
      path: '',
      component: ProdutoListaComponent
    }]
  }
];
