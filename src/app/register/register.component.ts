import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

/* Angular Material Components */
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Validador personalizado para verificar se as senhas coincidem
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword 
      ? { passwordMismatch: true } 
      : null;
  };
}

// Validador personalizado para força da senha
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLengthValid = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLengthValid;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    
    // Angular Material Modules
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s']+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator() });
  }

  // Getters para acessar os controles do formulário facilmente
  get f() {
    return this.registerForm.controls;
  }

  // Atualiza a força da senha enquanto o usuário digita
  onPasswordInput() {
    const password = this.registerForm.get('password')?.value;
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    
    // Verifica o comprimento
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Verifica caracteres diversos
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    this.passwordStrength = Math.min(Math.floor(strength / 2), 4);
  }

  // Retorna o texto descritivo da força da senha
  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 0: return 'Muito fraca';
      case 1: return 'Fraca';
      case 2: return 'Moderada';
      case 3: return 'Forte';
      case 4: return 'Muito forte';
      default: return '';
    }
  }

  // Alterna a visibilidade da senha
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // Alterna a visibilidade da confirmação de senha
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // Envia o formulário
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open('Registro realizado com sucesso!', 'Fechar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Erro no registro';
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        if (err.status === 409) {
          this.registerForm.get('email')?.setErrors({ emailExists: true });
        }
      }
    });
  }

  // Retorna mensagens de erro para o campo de nome
  getNameErrorMessage() {
    const nameControl = this.registerForm.get('name');
    
    if (nameControl?.hasError('required')) {
      return 'Nome é obrigatório';
    }
    
    if (nameControl?.hasError('minlength')) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (nameControl?.hasError('maxlength')) {
      return 'Nome não pode exceder 50 caracteres';
    }
    
    if (nameControl?.hasError('pattern')) {
      return 'Nome não pode conter números ou caracteres especiais';
    }
    
    return '';
  }

  // Retorna mensagens de erro para o campo de email
  getEmailErrorMessage() {
    const emailControl = this.registerForm.get('email');
    
    if (emailControl?.hasError('required')) {
      return 'Email é obrigatório';
    }
    
    if (emailControl?.hasError('email')) {
      return 'Por favor, insira um email válido';
    }
    
    if (emailControl?.hasError('maxlength')) {
      return 'Email não pode exceder 100 caracteres';
    }
    
    if (emailControl?.hasError('emailExists')) {
      return 'Este email já está cadastrado';
    }
    
    return '';
  }

  // Retorna mensagens de erro para o campo de senha
  getPasswordErrorMessage() {
    const passwordControl = this.registerForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (passwordControl?.hasError('passwordStrength')) {
      return 'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais';
    }
    
    return '';
  }

  // Retorna mensagens de erro para o campo de confirmação de senha
  getConfirmPasswordErrorMessage() {
    const confirmControl = this.registerForm.get('confirmPassword');
    const passwordControl = this.registerForm.get('password');
    
    if (confirmControl?.hasError('required')) {
      return 'Confirmação de senha é obrigatória';
    }
    
    if (this.registerForm?.hasError('passwordMismatch') && 
        passwordControl?.value && 
        confirmControl?.value) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }
}