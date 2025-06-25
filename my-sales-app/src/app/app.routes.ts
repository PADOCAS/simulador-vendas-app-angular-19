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
    //Isso deixa a aplicação mais leve e dinâmica, onde só carrega a página de categorias se o usuário acessar a rota!!
    loadComponent: () =>
      import('./categorias/categorias.component').then(
        (c) => c.CategoriasComponent
      )
  },
  //Jeito padrão onde carrega sempre, não dinâmico e carrego mesmo sem o usuário acessar a rota!!
  // {path: 'cad-categoria', component: CadCategoriaComponent},
  // {path: 'cad-categoria-edit/:id', component: CadCategoriaComponent},
  {
    path: 'cad-categoria',
    loadComponent: () =>
      import('./categorias/cad-categoria/cad-categoria.component').then(
        (c) => c.CadCategoriaComponent
      )
  },
  {
    path: 'cad-categoria-edit/:id',
    loadComponent: () =>
      import('./categorias/cad-categoria/cad-categoria.component').then(
        (c) => c.CadCategoriaComponent
      )
  },
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
  //Simulador de Venda:
  //Padrão - não dinâmico e pesado mesmo sem acessar:
  // {path: '',
  //   component: VendaComponent,
  //   children: [{
  //     path: '',
  //     component: ProdutoListaComponent
  //   }]
  // },
  //Dinâmico, carregando apenas quando necessário:
  {
    path: '',
    loadComponent: () =>
      import('./venda/venda.component').then(
        (c) => c.VendaComponent
      ),
    children: [{
      path: '',
      loadComponent: () =>
        import('./venda/produto-lista/produto-lista.component').then(
          (c) => c.ProdutoListaComponent
        )
    }]
  },



];
