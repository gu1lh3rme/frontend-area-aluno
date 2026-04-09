import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * Componente do dashboard principal (Home).
 * Exibe boas-vindas ao aluno e um resumo rápido da plataforma.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Dados do resumo
  readonly totalDocumentos = signal<number>(0);
  readonly totalMensagens = signal<number>(0);
  readonly carregando = signal<boolean>(true);

  // Data atual para exibição
  readonly agora = new Date();

  // Serviços injetados
  private readonly authService = inject(AuthService);
  private readonly documentService = inject(DocumentService);
  private readonly chatService = inject(ChatService);

  // Informações do usuário logado
  readonly usuario = this.authService.obterUsuario();

  // Histórico do chat (para contar mensagens)
  readonly historicoChat = this.chatService.historico;

  ngOnInit(): void {
    this.carregarResumo();
  }

  /**
   * Carrega o resumo do dashboard com informações do aluno.
   */
  private carregarResumo(): void {
    this.carregando.set(true);
    this.documentService.listar().subscribe({
      next: (docs) => {
        this.totalDocumentos.set(docs.length);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });

    // Conta mensagens do chat armazenadas em memória
    this.totalMensagens.set(this.chatService.historico().length);
  }

  /** Retorna saudação baseada no horário atual */
  get saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }
}
