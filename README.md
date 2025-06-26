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

```bash
npm install

Este repositório demonstra a configuração mínima de um fluxo de autenticação completo em Angular:

Rotas declaradas em src/app/app.routes.ts com carregamento preguiçoso (loadComponent) e redirecionamentos seguros.

Login / Registro / Perfil implementados como components independentes.

Auth Guard protegendo a rota /profile.

Reactive Forms com validações e feedback visual amigável.

LocalStorage para lembrar o e‑mail do usuário opcionalmente.

UI baseada em Angular Material.

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

/ → lazy‑load LoginComponent.

/login → LoginComponent.

/register → RegisterComponent.

/profile → ProfileComponent (precisa estar autenticado – authGuard).

Qualquer rota inválida redireciona para /login.

A definição aparece tanto no formato de routes standalone (app.routes.ts) quanto em um AppRoutingModule tradicional, possibilitando comparar os dois estilos.

Principais Recursos do Login

SubmitErrorStateMatcher garante que mensagens de erro só apareçam depois do submit.

Alternância de visibilidade da senha.

Remember e‑mail salvo em localStorage.

Indicador de carregamento (MatProgressSpinner).

Feedback de sucesso/erro com MatSnackBar.

Pré‑requisitos

Node.js ≥ 18
Angular CLI ≥ 17

git clone https://github.com/Dsaamorim/angular-auth-app.git
cd angular-auth-app
npm install
ng serve -o

Acesse http://localhost:4200 no navegador. O aplicativo recarrega automaticamente a cada alteração de código.

login(email: string, password: string): Observable<{ token: string }>

Ao obter o token o componente armazena‑o em localStorage e redireciona o usuário para /dashboard.
Substitua a URL do endpoint em auth.service.ts e adapte o payload conforme o seu backend

Testes
ng test
