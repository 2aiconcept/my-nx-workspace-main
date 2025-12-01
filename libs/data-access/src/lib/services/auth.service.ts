import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';

/**
 * Authentication service for user login, registration, and session management.
 *
 * **Note**: This service is currently mocked for training purposes.
 * Methods return mock data without making actual API calls.
 * Will be connected to json-server-auth in training.
 *
 * @usageNotes
 * ### Injecting the Service
 * ```typescript
 * private readonly authService = inject(AuthService);
 * ```
 *
 * ### Checking Authentication Status
 * ```typescript
 * if (this.authService.isAuthenticated()) {
 *   // User is authenticated
 * }
 * ```
 *
 * ### Signing In
 * ```typescript
 * this.authService.signIn({ email: 'user@example.com', password: 'password' })
 *   .subscribe({
 *     next: (response) => {
 *       // Token and user are automatically updated
 *       console.log('Logged in:', response.user);
 *     },
 *     error: (error) => console.error('Login failed:', error)
 *   });
 * ```
 *
 * @see User
 * @see LoginRequest
 * @see RegisterRequest
 * @see AuthResponse
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Private writable signals
  #token = signal<string | null>(null);
  #user = signal<User | null>(null);

  // Public readonly signals
  /**
   * Current authentication token.
   * @readonly
   */
  token = this.#token.asReadonly();

  /**
   * Current authenticated user.
   * @readonly
   */
  user = this.#user.asReadonly();

  /**
   * Authentication status computed from token presence.
   * @computed
   */
  isAuthenticated = computed(() => !!this.#token());

  /**
   * Signs in a user with email and password.
   *
   * **Mock implementation**: Returns mock data without API call.
   * Updates token and user signals on success.
   *
   * @param credentials - Login credentials (email and password)
   * @returns Observable of authentication response with access token and user data
   *
   * @example
   * ```typescript
   * this.authService.signIn({ email: 'user@example.com', password: 'password123' })
   *   .subscribe({
   *     next: (response) => console.log('Logged in:', response.user),
   *     error: (error) => console.error('Login failed:', error)
   *   });
   * ```
   */
  signIn(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock implementation - returns mock data after a delay
    const mockResponse: AuthResponse = {
      accessToken: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        email: credentials.email,
      },
    };

    return of(mockResponse).pipe(
      delay(500), // Simulate network delay
      tap((response) => this.updateAuthState(response)) // Update signals automatically
    );
  }

  /**
   * Registers a new user account.
   *
   * **Mock implementation**: Returns mock data without API call.
   * Updates token and user signals on success.
   *
   * @param credentials - Registration credentials (email and password)
   * @returns Observable of authentication response with access token and user data
   *
   * @example
   * ```typescript
   * this.authService.signUp({ email: 'new@example.com', password: 'password123' })
   *   .subscribe({
   *     next: (response) => console.log('Registered:', response.user),
   *     error: (error) => console.error('Registration failed:', error)
   *   });
   * ```
   */
  signUp(credentials: RegisterRequest): Observable<AuthResponse> {
    // Mock implementation - returns mock data after a delay
    const mockResponse: AuthResponse = {
      accessToken: 'mock-jwt-token-' + Date.now(),
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        email: credentials.email,
      },
    };

    return of(mockResponse).pipe(
      delay(500), // Simulate network delay
      tap((response) => this.updateAuthState(response)) // Update signals automatically
    );
  }

  /**
   * Signs out the current user.
   *
   * Clears the authentication token and user data.
   *
   * @example
   * ```typescript
   * this.authService.logout();
   * // Token and user signals are cleared
   * ```
   */
  logout(): void {
    this.#token.set(null);
    this.#user.set(null);
  }

  /**
   * Updates authentication state from an AuthResponse.
   * Internal method used by signIn and signUp after successful authentication.
   *
   * @internal
   * @param response - Authentication response containing token and user
   */
  private updateAuthState(response: AuthResponse): void {
    this.#token.set(response.accessToken);
    this.#user.set(response.user);
  }
}

