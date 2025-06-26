import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,  // Substitui BrowserModule
    RouterOutlet,  // Para <router-outlet>
    // Adicione outros componentes/diretivas necessárias aqui
  ],
  template: '<router-outlet></router-outlet>',
  // Remova styleUrls se não estiver usando
})
export class AppComponent {}