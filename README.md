<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1e0ca18771e2ff2283d563f8df225ddde08392da
# FrontendAuth

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
## Demonstração

![Login Angular](https://github.com/Dsaamorim/Login-Angular-MongoBD/blob/main/Login-Angular.gif?raw=true)

![Login Angularll](https://github.com/Dsaamorim/Login-Angular-MongoBD/blob/main/Login-Angularll.gif?raw=true)

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

<<<<<<< HEAD
>>>>>>> 3ea66694c5b523c06efc59988d6a7397d94aab55
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
>>>>>>> 1e0ca18771e2ff2283d563f8df225ddde08392da
