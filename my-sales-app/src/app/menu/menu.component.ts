import {Component} from '@angular/core';
import {MenuItem} from "../../interface/MenuItem";
import {MaterialModule} from "../material.module";

@Component({
    selector: 'app-menu',
    imports: [MaterialModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: Array<MenuItem> = [
    {
      path: '',
      label: 'Início'
    },
    {
      path: 'categorias',
      label: 'Categorias'
    },
    {
      path: 'fornecedores',
      label: 'Fornecedores'
    },
    {
      path: 'produtos',
      label: 'Produtos'
    }
  ];
}
