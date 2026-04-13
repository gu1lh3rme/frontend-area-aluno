/**
 * Modelos relacionados aos documentos do aluno.
 */

/** Representa um documento enviado pelo aluno */
export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: number;
  criado_em: string;
  url?: string;
}

/** Resposta da listagem de documentos */
export interface DocumentosResponse {
  documentos: Documento[];
  total: number;
}

/** Resposta após upload de documento */
export interface UploadResponse {
  id: string;
  nome: string;
  mensagem: string;
}
