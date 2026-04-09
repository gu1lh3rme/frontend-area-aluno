import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Definição das rotas da aplicação.
 * Rotas protegidas exigem autenticação via AuthGuard.
 */
export const routes: Routes = [
  // Rota raiz redireciona para home (ou login se não autenticado)
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Rota pública de login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Rotas protegidas — dentro do layout principal com sidebar
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'documentos',
        loadComponent: () =>
          import('./features/documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/chat.component').then(m => m.ChatComponent)
      }
    ]
  },

  // Redireciona rotas desconhecidas para home
  {
    path: '**',
    redirectTo: 'home'
  }
];
