import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'skills', loadComponent: () => import('./pages/skills/skills.component').then(m => m.SkillsComponent) },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: '**', redirectTo: '/about' }
];
