import { Routes } from '@angular/router';
import {DashboardComponent as Dashboard} from './dashboard/dashboard';
import { EmployeurComponent } from './employeur/employeur';
import { LayoutComponent } from './layout/layout';
import { TravailleurComponent } from './travailleur/travailleur';

export const routes: Routes = [
  
  // 1. La page d'accueil (Plein écran, sans menu)
  { 
    path: '', 
    component: Dashboard
  },

  // 2. Les pages avec le menu (Routage imbriqué)
  {
    path: '',
    component: LayoutComponent, // <-- Le conteneur avec la barre rouge
    children: [
      { path: 'employeur', component: EmployeurComponent },
      { path: 'travailleur', component: TravailleurComponent }
    ]
  },

  // 3. Redirection
  { path: '**', redirectTo: '' }
];