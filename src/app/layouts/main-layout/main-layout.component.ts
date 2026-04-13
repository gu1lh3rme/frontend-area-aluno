import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

/**
 * Layout principal da aplicação após o login.
 * Contém a sidebar de navegação e o conteúdo das rotas filhas.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  // Itens do menu de navegação
  readonly menuItems = [
    { icon: 'home', label: 'Home', rota: '/home' },
    { icon: 'description', label: 'Meus Documentos', rota: '/documentos' },
    { icon: 'smart_toy', label: 'Assistente IA', rota: '/chat' }
  ];

  // Detecta se é dispositivo móvel para controlar o modo do sidenav
  private readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  // Modo do sidenav: 'over' para mobile (fecha ao clicar), 'side' para desktop
  readonly sidenavMode = computed(() => this.isMobile() ? 'over' : 'side');

  // Controla se o sidenav está aberto (sempre aberto no desktop)
  readonly sidenavAberto = computed(() => !this.isMobile());

  // Informações do usuário logado
  readonly usuario = computed(() => this.authService.obterUsuario());

  constructor(readonly authService: AuthService) {}

  /**
   * Realiza o logout e redireciona para o login.
   */
  sair(): void {
    this.authService.logout();
  }
}
