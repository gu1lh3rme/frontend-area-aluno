/**
 * Modelos relacionados ao chat com IA (RAG).
 */

/** Papel do remetente da mensagem */
export type RoleMensagem = 'user' | 'assistant';

/** Representa uma mensagem no histórico do chat */
export interface MensagemChat {
  role: RoleMensagem;
  content: string;
  timestamp?: Date;
}

/** Requisição enviada ao endpoint /chat */
export interface ChatRequest {
  mensagem: string;
  historico?: { role: RoleMensagem; content: string }[];
}

/** Resposta do endpoint /chat */
export interface ChatResponse {
  resposta: string;
  fontes?: string[];
}

/** Resumo do dashboard */
export interface ResumoDashboard {
  total_documentos: number;
  ultima_conversa?: string;
  total_mensagens?: number;
}
