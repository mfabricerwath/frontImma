import { Routes } from '@angular/router';
import { EmployeurComponent } from './employeur/employeur';
import { TravailleurComponent } from './travailleur/travailleur';

export const routes: Routes = [
  { path: '', redirectTo: '/employeur', pathMatch: 'full' }, // Page par défaut
  { path: 'employeur', component: EmployeurComponent },
  { path: 'travailleur', component: TravailleurComponent },
  { path: '**', redirectTo: '/employeur' }
];
