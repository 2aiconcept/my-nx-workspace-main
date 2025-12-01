import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

/**
 * Authentication routes configuration.
 *
 * Defines routes for sign-in and sign-up pages.
 * Used for lazy loading in the main application routes.
 *
 * @usageNotes
 * ### Lazy Loading in app.routes.ts
 * ```typescript
 * {
 *   path: 'auth',
 *   loadChildren: () => import('@mini-crm/feature-auth').then((m) => m.AUTH_ROUTES),
 * }
 * ```
 *
 * ### Route Structure
 * - `/auth` → redirects to `/auth/sign-in`
 * - `/auth/sign-in` → SignInComponent
 * - `/auth/sign-up` → SignUpComponent
 *
 * @see SignInComponent
 * @see SignUpComponent
 * @category Feature Auth
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
];

