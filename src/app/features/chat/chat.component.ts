import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ChatService } from '../../core/services/chat.service';
import { MensagemChat } from '../../models/chat.model';

/**
 * Componente de Chat com Assistente IA (RAG).
 * Interface estilo ChatGPT para conversar com o assistente
 * baseado nos documentos enviados pelo aluno.
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    DatePipe,
    TextFieldModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {
  // Referência ao container de mensagens para auto-scroll
  @ViewChild('mensagensContainer') mensagensContainer!: ElementRef<HTMLDivElement>;

  // Texto digitado no campo de input
  inputMensagem = '';

  // Indica se está aguardando resposta da IA
  readonly aguardandoResposta = signal<boolean>(false);

  // Flag para controlar o scroll automático
  private deveRolarParaBaixo = false;

  private readonly chatService = inject(ChatService);
  private readonly snackBar = inject(MatSnackBar);

  // Histórico de mensagens (signal reativo do ChatService)
  readonly historico = this.chatService.historico;

  /**
   * Após cada atualização da view, rola para o final das mensagens.
   */
  ngAfterViewChecked(): void {
    if (this.deveRolarParaBaixo) {
      this.rolarParaBaixo();
      this.deveRolarParaBaixo = false;
    }
  }

  /**
   * Envia a mensagem digitada pelo usuário.
   */
  enviarMensagem(): void {
    const texto = this.inputMensagem.trim();
    if (!texto || this.aguardandoResposta()) return;

    this.inputMensagem = '';
    this.aguardandoResposta.set(true);
    this.deveRolarParaBaixo = true;

    this.chatService.enviarMensagem(texto).subscribe({
      next: () => {
        this.aguardandoResposta.set(false);
        this.deveRolarParaBaixo = true;
      },
      error: (erro) => {
        this.aguardandoResposta.set(false);
        const msg = erro.status === 404
          ? 'Nenhum documento encontrado. Envie documentos antes de usar o chat.'
          : 'Erro ao obter resposta. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        this.deveRolarParaBaixo = true;
      }
    });
  }

  /**
   * Limpa todo o histórico da conversa.
   */
  limparConversa(): void {
    if (this.historico().length === 0) return;
    if (!confirm('Deseja limpar todo o histórico da conversa?')) return;
    this.chatService.limparHistorico();
  }

  /**
   * Permite envio com Enter (sem Shift).
   */
  onKeyDown(evento: KeyboardEvent): void {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      this.enviarMensagem();
    }
  }

  /**
   * Rola o container de mensagens para o final.
   */
  private rolarParaBaixo(): void {
    try {
      const container = this.mensagensContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch {
      // Ignora erros de scroll
    }
  }

  /**
   * Verifica se uma mensagem é do usuário.
   */
  isMensagemUsuario(msg: MensagemChat): boolean {
    return msg.role === 'user';
  }
}
