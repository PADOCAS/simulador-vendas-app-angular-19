import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  constructor() { }

  initializePaginator() {
    const script = document.createElement('script');
    script.src = './path/to/src/js/global-paginator-script.js'; // Ajuste o caminho conforme necessário
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      console.log('Script do paginator carregado com sucesso');
    };
    document.body.appendChild(script);
  }
}
