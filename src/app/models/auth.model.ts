/**
 * Modelos relacionados à autenticação do usuário.
 */

/** Dados enviados no formulário de login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Resposta do backend após login bem-sucedido */
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

/** Informações do usuário autenticado (decodificadas do JWT) */
export interface Usuario {
  id: string;
  email: string;
  nome?: string;
}
