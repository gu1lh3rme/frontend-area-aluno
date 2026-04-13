import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Documento, DocumentosResponse, UploadResponse } from '../../models/document.model';

/**
 * Serviço de documentos.
 * Gerencia upload, listagem e exclusão de documentos do aluno.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os documentos do usuário autenticado.
   */
  listar(): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${environment.apiUrl}/documents`);
  }

  /**
   * Faz upload de um arquivo (PDF ou TXT) para o backend.
   * @param arquivo - Arquivo a ser enviado
   */
  upload(arquivo: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', arquivo);
    return this.http.post<UploadResponse>(
      `${environment.apiUrl}/documents/upload`,
      formData
    );
  }

  /**
   * Remove um documento pelo ID.
   * @param id - ID do documento a ser removido
   */
  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/documents/${id}`);
  }
}
