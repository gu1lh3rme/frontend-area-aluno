import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Componente de Login.
 * Exibe o formulário de autenticação e redireciona para /home após login.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Formulário de login com validações
  readonly formulario: FormGroup;

  // Estado de carregamento durante a requisição
  readonly carregando = signal(false);

  // Controla visibilidade da senha
  readonly mostrarSenha = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inicializa o formulário com validações
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Alterna a visibilidade da senha.
   */
  alternarSenha(): void {
    this.mostrarSenha.update(v => !v);
  }

  /**
   * Realiza o login ao submeter o formulário.
   */
  onSubmit(): void {
    if (this.formulario.invalid || this.carregando()) return;

    this.carregando.set(true);

    this.authService.login(this.formulario.value).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.carregando.set(false);
        const mensagem = erro.status === 401
          ? 'Email ou senha incorretos.'
          : 'Erro ao conectar com o servidor. Tente novamente.';
        this.snackBar.open(mensagem, 'Fechar', {
          duration: 4000,
          panelClass: ['snack-erro']
        });
      }
    });
  }

  /** Atalho para acessar os controles do formulário */
  get f() {
    return this.formulario.controls;
  }
}
