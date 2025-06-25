import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth.guard'; // Verifique se é export const ou export class

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireciona raiz para login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] // Verifique a implementação do guard
  },
  // Rota de fallback (opcional)
  { path: '**', redirectTo: 'login' } // Captura rotas inexistentes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }