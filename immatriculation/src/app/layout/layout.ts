import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- AJOUTER
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- AJOUTER
import { MatIconModule } from '@angular/material/icon'; // <-- AJOUTER
import { MatButtonModule } from '@angular/material/button'; // <-- AJOUTER

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,        // <-- AJOUTER
    MatToolbarModule,    // <-- AJOUTER
    MatIconModule,       // <-- AJOUTER
    MatButtonModule      // <-- AJOUTER
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  // ...
}