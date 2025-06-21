import { Component } from '@angular/core';
import {MaterialModule} from "../material.module";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-venda',
  imports: [MaterialModule, RouterOutlet],
  templateUrl: './venda.component.html',
  styleUrl: './venda.component.css'
})
export class VendaComponent {

}
