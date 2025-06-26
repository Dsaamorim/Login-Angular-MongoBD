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

# Angular Auth App — Configuração Mínima

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

```text
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
