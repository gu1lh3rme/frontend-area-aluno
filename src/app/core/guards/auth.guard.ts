import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticação.
 * Protege as rotas que exigem login.
 * Redireciona para /login caso o usuário não esteja autenticado.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário possui token válido
  if (authService.isAutenticado()) {
    return true;
  }

  // Redireciona para a página de login
  return router.createUrlTree(['/login']);
};
