import { Component, OnInit, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { Documento } from '../../models/document.model';

/**
 * Componente de Meus Documentos.
 * Permite upload, listagem e exclusão de documentos do aluno.
 */
@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  // Lista de documentos carregados
  readonly documentos = signal<Documento[]>([]);

  // Estados de carregamento
  readonly carregando = signal<boolean>(false);
  readonly enviando = signal<boolean>(false);

  // Arquivo selecionado para upload
  readonly arquivoSelecionado = signal<File | null>(null);

  // Colunas da tabela de documentos
  readonly colunas = ['nome', 'tipo', 'tamanho', 'criado_em', 'acoes'];

  private readonly documentService = inject(DocumentService);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  /**
   * Carrega a lista de documentos do aluno.
   */
  carregarDocumentos(): void {
    this.carregando.set(true);
    this.documentService.listar().subscribe({
      next: (docs) => {
        this.documentos.set(docs);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.snackBar.open('Erro ao carregar documentos.', 'Fechar', { duration: 3000 });
      }
    });
  }

  /**
   * Trata a seleção de arquivo pelo input.
   */
  onArquivoSelecionado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const arquivo = input.files[0];

      // Valida tipo de arquivo (PDF ou TXT)
      const tiposPermitidos = ['application/pdf', 'text/plain'];
      if (!tiposPermitidos.includes(arquivo.type)) {
        this.snackBar.open('Tipo inválido. Envie apenas PDF ou TXT.', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-aviso']
        });
        return;
      }

      // Valida tamanho (máximo 10MB)
      const maxTamanho = 10 * 1024 * 1024;
      if (arquivo.size > maxTamanho) {
        this.snackBar.open('Arquivo muito grande. Máximo de 10MB.', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-aviso']
        });
        return;
      }

      this.arquivoSelecionado.set(arquivo);
    }
  }

  /**
   * Envia o arquivo selecionado para o backend.
   */
  enviarArquivo(): void {
    const arquivo = this.arquivoSelecionado();
    if (!arquivo || this.enviando()) return;

    this.enviando.set(true);
    this.documentService.upload(arquivo).subscribe({
      next: () => {
        this.enviando.set(false);
        this.arquivoSelecionado.set(null);
        this.snackBar.open('Documento enviado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-sucesso']
        });
        this.carregarDocumentos();
      },
      error: (erro) => {
        this.enviando.set(false);
        const msg = erro.error?.detail || 'Erro ao enviar documento.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
      }
    });
  }

  /**
   * Remove um documento pelo ID.
   */
  deletarDocumento(doc: Documento): void {
    if (!confirm(`Deseja remover "${doc.nome}"?`)) return;

    this.documentService.deletar(doc.id).subscribe({
      next: () => {
        this.documentos.update(docs => docs.filter(d => d.id !== doc.id));
        this.snackBar.open('Documento removido.', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erro ao remover documento.', 'Fechar', { duration: 3000 });
      }
    });
  }

  /**
   * Cancela a seleção do arquivo.
   */
  cancelarSelecao(): void {
    this.arquivoSelecionado.set(null);
  }

  /**
   * Formata o tamanho do arquivo em KB/MB.
   */
  formatarTamanho(bytes?: number): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  /**
   * Retorna ícone baseado no tipo do arquivo.
   */
  iconeArquivo(tipo: string): string {
    if (tipo?.includes('pdf')) return 'picture_as_pdf';
    if (tipo?.includes('text')) return 'article';
    return 'insert_drive_file';
  }
}
