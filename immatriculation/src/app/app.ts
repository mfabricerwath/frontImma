import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeurComponent } from './employeur/employeur';

@Component({
  selector: 'app-root',
  imports: [EmployeurComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('immatriculation');
}
