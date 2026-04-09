import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatRequest, ChatResponse, MensagemChat } from '../../models/chat.model';

/**
 * Serviço de chat com IA (RAG).
 * Gerencia o envio de mensagens e o histórico da conversa.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Signal reativo com o histórico de mensagens da conversa atual
  readonly historico = signal<MensagemChat[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Envia uma mensagem para o endpoint de chat com RAG.
   * Adiciona a mensagem do usuário e a resposta da IA ao histórico.
   *
   * @param mensagem - Texto da pergunta do aluno
   */
  enviarMensagem(mensagem: string): Observable<ChatResponse> {
    // Adiciona a mensagem do usuário ao histórico imediatamente
    const novaMensagemUsuario: MensagemChat = {
      role: 'user',
      content: mensagem,
      timestamp: new Date()
    };
    this.historico.update(hist => [...hist, novaMensagemUsuario]);

    // Prepara o payload com histórico para contexto
    const payload: ChatRequest = {
      mensagem,
      historico: this.historico().slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }))
    };

    return this.http.post<ChatResponse>(
      `${environment.apiUrl}/chat`,
      payload
    ).pipe(
      tap(resposta => {
        // Adiciona a resposta da IA ao histórico
        const mensagemIA: MensagemChat = {
          role: 'assistant',
          content: resposta.resposta,
          timestamp: new Date()
        };
        this.historico.update(hist => [...hist, mensagemIA]);
      })
    );
  }

  /**
   * Limpa todo o histórico da conversa atual.
   */
  limparHistorico(): void {
    this.historico.set([]);
  }
}
