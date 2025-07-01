import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

export class SubmitErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterLink
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  matcher = new SubmitErrorStateMatcher();
  isLoading = false;
  submitted = false;
  hidePassword = true;
  rememberEmail = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
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

  get emailCtrl() {
    return this.loginForm.get('email');
  }

  get passwordCtrl() {
    return this.loginForm.get('password');
  }

  onPasswordInput(event: any): void {
    // Apenas para garantir que o evento está sendo capturado
    console.log('Input detected:', event.target.value);
  }

  // Alterna a visibilidade da senha
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
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
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.message || 'Erro no login';
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}