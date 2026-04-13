/**
 * Configurações de ambiente para desenvolvimento.
 * Para produção, utilize environment.prod.ts.
 *
 * Altere a apiUrl para apontar para o seu backend FastAPI.
 */
export const environment = {
  production: false,
  // URL base do backend FastAPI
  apiUrl: 'http://localhost:8000'
};
