# 🎓 Área do Aluno — Frontend Angular 18+

Frontend completo da plataforma **Área do Aluno**, desenvolvido com **Angular 18+**, **Angular Material** e integração com backend **FastAPI** (autenticação JWT, upload de documentos e chatbot com RAG).

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Instalar e Rodar](#como-instalar-e-rodar)
- [Configurar o Backend (environment.ts)](#configurar-o-backend)
- [Fluxo da Aplicação](#fluxo-da-aplicação)
- [Integração com o RAG do Backend](#integração-com-o-rag-do-backend)
- [Próximos Passos](#próximos-passos)

---

## 🌟 Visão Geral

Esta aplicação é o frontend de uma plataforma de estudos estilo Alura/Hotmart, com:

- **Autenticação JWT** com login seguro.
- **Upload de documentos** (PDF e TXT) para análise pela IA.
- **Chatbot inteligente (RAG)** que responde perguntas com base nos documentos do aluno.
- Interface moderna, responsiva e acessível usando Angular Material.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 18+ | Framework principal |
| Angular Material | 18+ | Componentes visuais |
| Angular CDK | 18+ | Utilitários (layout, text-field) |
| TypeScript | 5.4+ | Linguagem principal |
| RxJS | 7.8+ | Programação reativa |
| Angular Signals | 18+ | Gerenciamento de estado reativo |

**Arquitetura:**
- ✅ Standalone Components (sem NgModules)
- ✅ Signals para estado reativo
- ✅ Novo Control Flow (`@if`, `@for`, `@switch`)
- ✅ HTTP Interceptors funcionais
- ✅ Lazy loading de rotas
- ✅ Guards de autenticação

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── core/                     # Serviços globais, guards e interceptors
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Protege rotas autenticadas
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Adiciona JWT em todas as requisições
│   │   └── services/
│   │       ├── auth.service.ts   # Login, logout, token JWT
│   │       ├── document.service.ts  # Upload, listagem, deleção de docs
│   │       └── chat.service.ts   # Envio de mensagens para o RAG
│   ├── features/
│   │   ├── auth/login/           # Página de login
│   │   ├── home/                 # Dashboard com resumo
│   │   ├── documents/            # Gerenciamento de documentos
│   │   └── chat/                 # Interface do chatbot
│   ├── layouts/
│   │   └── main-layout/          # Layout com sidebar de navegação
│   ├── models/                   # Interfaces TypeScript
│   │   ├── auth.model.ts
│   │   ├── document.model.ts
│   │   └── chat.model.ts
│   ├── app.component.ts          # Componente raiz
│   ├── app.config.ts             # Configuração da aplicação
│   └── app.routes.ts             # Definição de rotas
├── environments/
│   ├── environment.ts            # Desenvolvimento
│   └── environment.prod.ts       # Produção
└── styles.scss                   # Estilos globais + tema Material
```

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** 9+ (incluído com Node.js)
- **Angular CLI** 18+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/gu1lh3rme/frontend-area-aluno.git
cd frontend-area-aluno

# 2. Instale o Angular CLI globalmente (se não tiver)
npm install -g @angular/cli@18

# 3. Instale as dependências do projeto
npm install

# 4. Configure a URL do backend (veja seção abaixo)

# 5. Inicie o servidor de desenvolvimento
ng serve
```

A aplicação estará disponível em: **http://localhost:4200**

### Build para Produção

```bash
ng build --configuration production
```

Os arquivos serão gerados em `dist/frontend-area-aluno/`.

---

## ⚙️ Configurar o Backend

Edite o arquivo `src/environments/environment.ts` e defina a URL do seu backend FastAPI:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'  // ← Altere aqui
};
```

Para produção, edite `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seudominio.com'  // ← URL de produção
};
```

### Endpoints esperados no backend FastAPI

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login com form-urlencoded (`username` + `password`) |
| `GET` | `/documents` | Listar documentos do usuário |
| `POST` | `/documents/upload` | Upload de arquivo (multipart/form-data) |
| `DELETE` | `/documents/{id}` | Remover documento |
| `POST` | `/chat` | Enviar mensagem para o RAG |

---

## 🔄 Fluxo da Aplicação

```
/login  →  Autentica com JWT  →  Salva token no localStorage
    ↓
/home   →  Dashboard com resumo (docs, mensagens)
    ↓
/documentos  →  Upload de PDFs/TXTs + listagem + deleção
    ↓
/chat   →  Chatbot que usa os documentos para responder (RAG)
```

**Guard de autenticação:** Todas as rotas exceto `/login` são protegidas pelo `authGuard`. Se o token não estiver presente, o usuário é redirecionado para `/login`.

**Interceptor JWT:** Todas as requisições HTTP (exceto `/auth/login`) recebem automaticamente o header `Authorization: Bearer <token>`.

---

## 🤖 Integração com o RAG do Backend

O `ChatService` envia mensagens para o endpoint `/chat` com o seguinte payload:

```json
{
  "mensagem": "Qual o tema principal do documento?",
  "historico": [
    { "role": "user", "content": "Mensagem anterior" },
    { "role": "assistant", "content": "Resposta anterior" }
  ]
}
```

E espera a seguinte resposta:

```json
{
  "resposta": "O tema principal é...",
  "fontes": ["documento1.pdf", "documento2.pdf"]
}
```

O histórico das últimas 10 mensagens é enviado para manter o contexto da conversa.

---

## 📈 Próximos Passos

Sugestões de melhorias e funcionalidades a implementar:

1. **Histórico persistente de conversas** — Salvar e recuperar conversas por documento via API.
2. **Streaming de respostas** — Usar `EventSource` ou WebSocket para exibir a resposta da IA em tempo real (token por token).
3. **Seleção de documento no chat** — Permitir que o aluno escolha quais documentos a IA deve consultar.
4. **Preview de documentos** — Visualizar PDFs diretamente no navegador (usando `pdf.js`).
5. **Página de perfil** — Edição de dados do usuário (nome, senha, foto).
6. **Dark mode** — Implementar o toggle de tema escuro com persistência no localStorage.
7. **Notificações push** — Alertar o aluno quando o processamento do documento for concluído.
8. **Testes E2E** — Adicionar Cypress ou Playwright para testes automatizados.
9. **PWA** — Transformar a aplicação em Progressive Web App para acesso offline.
10. **Internacionalização (i18n)** — Suporte a múltiplos idiomas com Angular i18n.

---

## 🎨 Design

A interface usa a paleta de cores educacional:
- **Primária:** Índigo 700 (`#283593`) — cabeçalhos, sidebar, botões principais
- **Destaque:** Azul A200 — botões de ação
- **Fundo:** Cinza claro (`#f5f7fa`) — área de conteúdo
- **Alerta:** Vermelho — erros e botões de exclusão

---

## 📄 Licença

Projeto educacional. Livre para uso e modificação.
