import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Ajout des imports de routage
import { MatToolbarModule } from '@angular/material/toolbar'; // Ajout du module Toolbar
import { MatButtonModule } from '@angular/material/button'; // Ajout du module Button
import { MatIconModule } from '@angular/material/icon'; // Ajout du module Icon


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('immatriculation');
}
