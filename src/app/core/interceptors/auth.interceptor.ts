import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP para autenticação JWT.
 * Adiciona automaticamente o token Bearer em todas as requisições
 * para o backend, exceto a rota de login.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.obterToken();

  // Não adiciona token em requisições de login/registro
  const isRotaPublica = req.url.includes('/auth/login') ||
                        req.url.includes('/auth/register');

  if (token && !isRotaPublica) {
    // Clona a requisição adicionando o header de autorização
    const requisicaoAutenticada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(requisicaoAutenticada);
  }

  return next(req);
};
