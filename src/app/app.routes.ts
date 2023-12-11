import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/watch-list/watch-list.component').then(m => m.WatchListComponent)
  },
  {
    path: 'title/:id',
    loadComponent: () => import('./pages/title/title.component').then(m => m.TitleComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  }
];
