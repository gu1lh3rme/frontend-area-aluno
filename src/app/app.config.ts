import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

/**
 * Configuração principal da aplicação Angular 18+.
 * Utiliza o padrão standalone sem NgModules.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita o Zone.js para detecção de mudanças
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configura o roteamento com as rotas definidas
    provideRouter(routes),

    // Configura o HttpClient com o interceptor de autenticação JWT
    provideHttpClient(withInterceptors([authInterceptor])),

    // Habilita animações assíncronas do Angular Material
    provideAnimationsAsync()
  ]
};
