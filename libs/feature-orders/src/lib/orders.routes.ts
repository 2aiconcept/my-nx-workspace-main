import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderAddComponent } from './components/order-add/order-add.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';

/**
 * Orders routes configuration.
 *
 * Defines routes for order list, add, and edit pages.
 * Used for lazy loading in the main application routes.
 *
 * @usageNotes
 * ### Lazy Loading in app.routes.ts
 * ```typescript
 * {
 *   path: 'orders',
 *   canActivate: [authGuard],
 *   loadChildren: () => import('@mini-crm/feature-orders').then((m) => m.ORDERS_ROUTES),
 * }
 * ```
 *
 * ### Route Structure
 * - `/orders` → OrderListComponent
 * - `/orders/add` → OrderAddComponent
 * - `/orders/edit/:id` → OrderEditComponent
 *
 * @see OrderListComponent
 * @see OrderAddComponent
 * @see OrderEditComponent
 * @category Feature Orders
 */
export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent,
  },
  {
    path: 'add',
    component: OrderAddComponent,
  },
  {
    path: 'edit/:id',
    component: OrderEditComponent,
  },
];

