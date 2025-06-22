import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {MenuComponent} from "../menu/menu.component";
import {RouterOutlet} from "@angular/router";
import {MaterialModule} from "../material.module";
import {VendaService} from "../venda/venda.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        MaterialModule,
        AsyncPipe,
        MenuComponent,
        RouterOutlet
    ]
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  vendaService = inject(VendaService) //Adicionando o serviço de vendas

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
