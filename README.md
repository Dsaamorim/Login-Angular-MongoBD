# FrontendAuth

Este projeto foi gerado usando o Angular CLI versão 20.0.3.

## Servidor de desenvolvimento

Para iniciar um servidor de desenvolvimento local, execute:

```bash
ng serve
```

Assim que o servidor estiver em execução, abra seu navegador e acesse http://localhost:4200/. O aplicativo será recarregado automaticamente sempre que você modificar qualquer um dos arquivos de código-fonte.

## Estruturação de código

O Angular CLI tem ferramentas avançadas para scaffolding. Para gerar um componente novo, use:

```bash
ng generate component component-name
```

Para ver uma lista completa de schematics disponíveis (como components, directives ou pipes), execute:

```bash
ng generate --help
```

## Building

Para construir o projeto, execute:

```bash
ng build
```

Isso irá compilar seu projeto e armazenar os artefatos de build no diretório dist/. Por padrão, a build de produção otimiza seu aplicativo para desempenho e velocidade.

## Executar testes unitários

Para executar testes unitários com o executor de testes Karma, utilize o seguinte comando:

```bash
ng test
```

## Executar e2e testes

Para testes end-to-end (e2e), execute:

```bash
ng e2e
```

O Angular CLI não inclui um framework de teste end-to-end (E2E) por padrão. Você pode escolher um que atenda às suas necessidades.

## Recursos adicionais

Para mais informações sobre como usar o Angular CLI, incluindo referências detalhadas de comandos, visite a página Visão Geral do Angular CLI e Referência de Comandos [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
=======
## Demonstração

![Login Angular](https://github.com/Dsaamorim/Login-Angular-MongoBD/blob/main/Login-Angular.gif?raw=true)

## Node.js Authentication API

API de autenticação com JWT, MongoDB e validação Zod.

## Features

- Login/logout com tokens JWT
- Validação de dados com Zod
- Middleware de autenticação
- Blacklist de tokens (em memória/MongoDB)

## Configuração

1. Instale as dependências:

```bash```
npm install

=======
## Angular Auth App — Configuração Mínima

Este repositório demonstra uma configuração **essencial** para um fluxo de autenticação completo em Angular — com lazy loading, guards e UI em Angular Material.

---

## Visão Geral

- **Rotas** declaradas em `src/app/app.routes.ts` com `loadComponent` e redirecionamentos seguros.  
- **Login / Registro / Perfil** como componentes independentes.  
- **Auth Guard** protegendo a rota `/profile`.  
- **Reactive Forms** com validações e feedback visual amigável.  
- **LocalStorage** opcional para lembrar o e-mail do usuário.  
- **UI** estilizada com Angular Material.  

---

## Estrutura de Pastas

```
src/
 └─ app/
    ├─ app.routes.ts
    ├─ app.component.ts
    ├─ auth.guard.ts
    ├─ login/
    │   ├─ login.component.ts
    │   ├─ login.component.html
    │   └─ login.component.scss
    ├─ register/
    │   └─ register.component.ts
    └─ profile/
        └─ profile.component.ts
```

Caminho	Componente	Proteção
/ ou /login	LoginComponent	—
/register	RegisterComponent	—
/profile	ProfileComponent	authGuard
** (inválida)	Redireciona → /login	—

A definição existe tanto em standalone routes (app.routes.ts) quanto em AppRoutingModule tradicional, permitindo comparar estilos.

Principais Recursos do Login
SubmitErrorStateMatcher → erros visíveis após submit.

Alternância de visibilidade da senha.

Remember e-mail salvo em localStorage.

Indicador de carregamento (MatProgressSpinner).

Feedback de sucesso/erro via MatSnackBar.

Tecnologias Utilizadas
Angular 17+ com Standalone Components

Angular Router com Lazy Loading

Angular Reactive Forms

Angular Material

RxJS para manipulação de streams

TypeScript

HTML5 & SCSS

![Login Angularll](https://github.com/Dsaamorim/Login-Angular-MongoBD/blob/main/Login-Angularll.gif?raw=true)

