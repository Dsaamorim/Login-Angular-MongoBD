import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

// 🔧 Mostra erro apenas após submit (evita erros ao desfocar)
export class SubmitErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form && form.submitted);
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  matcher = new SubmitErrorStateMatcher(); // 🔧 controla quando mostrar erros
  isLoading = false;
  submitted = false;
  showPassword = false;
  rememberEmail = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inicializa o form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    const savedEmail = localStorage.getItem('remembered_email');
    const remember = localStorage.getItem('remember_email_preference');

    if (savedEmail && remember === 'true') {
      this.loginForm.patchValue({ email: savedEmail });
      this.rememberEmail = true;
    }
  }

  // Getters para facilitar o acesso no template
  get emailCtrl() {
    return this.loginForm.get('email');
  }

  get passwordCtrl() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRememberEmail(): void {
    this.rememberEmail = !this.rememberEmail;
    localStorage.setItem('remember_email_preference', String(this.rememberEmail));

    if (!this.rememberEmail) {
      localStorage.removeItem('remembered_email');
    } else if (this.emailCtrl?.value) {
      localStorage.setItem('remembered_email', this.emailCtrl.value);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    if (this.rememberEmail && email) {
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remembered_email');
    }

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.token) {
          localStorage.setItem('token', res.token);

          this.snackBar.open('Login realizado com sucesso', 'Fechar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open('Resposta inválida do servidor', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.message || 'Erro no login';
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Erro no login:', err);
      }
    });
  }
}
