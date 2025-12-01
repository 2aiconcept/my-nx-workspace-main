import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@mini-crm/data-access';
import type { RegisterRequest } from '@mini-crm/data-access';

/**
 * Custom validator to check if password and confirmPassword match.
 *
 * @param control - The form group containing password and confirmPassword
 * @returns ValidationErrors if passwords don't match, null otherwise
 */
function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}

/**
 * Sign-up component for user registration.
 *
 * Displays a full-screen centered Bootstrap card with a registration form.
 * Validates email, password, and password confirmation fields with Bootstrap validation styling.
 * Includes a custom validator to ensure passwords match.
 * Redirects to orders page on successful registration.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-sign-up />
 * ```
 *
 * ### With Routing
 * Add to routes:
 * ```typescript
 * { path: 'auth/sign-up', component: SignUpComponent }
 * ```
 *
 * @see SignInComponent
 * @see AuthService
 * @category Feature Auth
 */
@Component({
  selector: 'lib-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /**
   * Loading state for form submission.
   */
  loading = signal(false);

  /**
   * Error message to display if registration fails.
   */
  error = signal<string | null>(null);

  /**
   * Reactive form for sign-up.
   * Includes custom validator at FormGroup level to check password match.
   */
  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  /**
   * Handles form submission.
   * Calls AuthService.signUp() and handles success/error.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.form.value;
    if (!formValue.email || !formValue.password) {
      this.loading.set(false);
      return;
    }

    const credentials: RegisterRequest = {
      email: formValue.email,
      password: formValue.password,
    };

    this.authService.signUp(credentials).subscribe({
      next: () => {
        this.loading.set(false);
        // Redirect to orders page on successful registration
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.message || 'Une erreur est survenue lors de l\'inscription'
        );
      },
    });
  }

  /**
   * Checks if a form field has validation errors and has been touched.
   *
   * @param fieldName - Name of the form field
   * @returns True if field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  /**
   * Gets the error message for a form field.
   *
   * @param fieldName - Name of the form field
   * @returns Error message or null
   */
  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (field.errors['email']) {
      return 'Veuillez entrer une adresse email valide';
    }

    if (field.errors['minlength']) {
      return `Le mot de passe doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
    }

    return null;
  }

  /**
   * Checks if the form has a password mismatch error.
   *
   * @returns True if passwords don't match
   */
  hasPasswordMismatch(): boolean {
    return !!(
      this.form.errors &&
      this.form.errors['passwordMismatch'] &&
      (this.form.touched || this.form.dirty)
    );
  }
}

