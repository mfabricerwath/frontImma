import { Component, signal } from '@angular/core';
import { RouterOutlet} from '@angular/router'; // Ajout des imports de routage
import { MatToolbarModule } from '@angular/material/toolbar'; // Ajout du module Toolbar
import { MatButtonModule } from '@angular/material/button'; // Ajout du module Button
import { MatIconModule } from '@angular/material/icon'; // Ajout du module Icon
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('immatriculation');
}
