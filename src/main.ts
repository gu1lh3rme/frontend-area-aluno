import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Ponto de entrada da aplicação Angular.
 * Inicializa o AppComponent com a configuração definida em app.config.ts.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
