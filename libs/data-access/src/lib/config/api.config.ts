import { InjectionToken } from '@angular/core';

/**
 * Configuration de l'API
 *
 * @category Configuration
 */
export interface ApiConfig {
  /**
   * URL de base de l'API
   * @example 'http://localhost:3000'
   */
  apiUrl: string;
}

/**
 * Token d'injection pour la configuration de l'API
 *
 * Permet d'injecter la configuration de l'API dans les services.
 *
 * @usageNotes
 * Injecter dans un service :
 * ```typescript
 * private config = inject(API_CONFIG);
 * ```
 *
 * @category Configuration
 * @see ApiConfig
 */
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiUrl: 'http://localhost:3000',
  }),
});
