import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../../models/auth.model';

/**
 * Serviço de autenticação.
 * Gerencia login, logout, token JWT e estado do usuário autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Chave usada para armazenar o token no localStorage
  private readonly TOKEN_KEY = 'area_aluno_token';

  // Signal reativo que armazena o token atual
  private readonly _token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  // Signal computado que indica se o usuário está autenticado
  readonly isAutenticado = computed(() => !!this._token());

  // Token atual (somente leitura)
  readonly token = this._token.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Realiza o login do usuário.
   * Envia as credenciais para o backend e armazena o token JWT.
   */
  login(dados: LoginRequest): Observable<LoginResponse> {
    // O FastAPI com OAuth2PasswordRequestForm espera form-urlencoded
    const body = new URLSearchParams();
    body.set('username', dados.email);
    body.set('password', dados.password);

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).pipe(
      tap(resposta => this.salvarToken(resposta.access_token))
    );
  }

  /**
   * Realiza o logout do usuário.
   * Remove o token do localStorage e redireciona para o login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Salva o token JWT no localStorage e atualiza o signal.
   */
  private salvarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  /**
   * Retorna o token atual (para uso no interceptor).
   */
  obterToken(): string | null {
    return this._token();
  }

  /**
   * Decodifica o payload do JWT (sem verificar assinatura).
   * Útil para obter informações básicas do usuário.
   */
  obterUsuario(): Usuario | null {
    const token = this._token();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.sub || decoded.id || '',
        email: decoded.email || decoded.sub || '',
        nome: decoded.nome || decoded.name || ''
      };
    } catch {
      return null;
    }
  }
}
