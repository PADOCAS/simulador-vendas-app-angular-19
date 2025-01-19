import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HomeComponent} from "./home/home.component";
import {MaterialModule} from "./material.module";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MaterialModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // Cada roteamento ele vai atualizar os labels do Paginator:
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.updatePaginatorLabels(); // Chame a função exportada
        }, 0); //Timeout para garantir que de tempo de trocar
      }
    });
  }

  updatePaginatorLabels() {
    const paginatorElements = document.querySelectorAll('.mat-mdc-paginator-page-size-label');

    paginatorElements.forEach(element => {
      element.innerHTML = 'Itens por página';
    });
  }
}
