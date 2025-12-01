import { Component, ChangeDetectionStrategy, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '@mini-crm/data-access';
import { OrderFormComponent } from '../order-form/order-form.component';
import type { Order, UpdateOrder } from '@mini-crm/data-access';

/**
 * Component for editing an existing order.
 *
 * Retrieves the order ID from route parameters and loads the order data.
 * Uses OrderFormComponent in edit mode with the loaded order.
 * Handles order update and navigation back to the orders list.
 *
 * @usageNotes
 * ### In Routes
 * ```typescript
 * {
 *   path: 'orders/edit/:id',
 *   component: OrderEditComponent
 * }
 * ```
 *
 * ### Error Handling
 * If the order ID is invalid or the order doesn't exist,
 * the component automatically redirects to the orders list.
 *
 * @see OrderFormComponent
 * @see OrdersService
 * @see OrderAddComponent
 * @category Feature Orders
 */
@Component({
  selector: 'lib-order-edit',
  imports: [OrderFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEditComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Order to edit, loaded from the service.
   * @readonly
   */
  order = signal<Order | null>(null);

  /**
   * Loading state from the service.
   * @readonly
   */
  loading = this.ordersService.loading;

  /**
   * Error message from the service.
   * @readonly
   */
  error = this.ordersService.error;

  constructor() {
    // Redirect to orders list if order becomes null (not found)
    effect(() => {
      const orderValue = this.order();
      const errorValue = this.error();
      
      // If order is null and we have an error, redirect to list
      if (orderValue === null && errorValue && !this.loading()) {
        console.error('Order not found, redirecting to orders list');
        this.router.navigate(['/orders']);
      }
    });
  }

  ngOnInit(): void {
    // Get order ID from route parameters
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    
    if (!orderIdParam) {
      console.error('Order ID is missing from route parameters');
      this.router.navigate(['/orders']);
      return;
    }

    const orderId = Number.parseInt(orderIdParam, 10);
    
    if (Number.isNaN(orderId)) {
      console.error(`Invalid order ID: ${orderIdParam}`);
      this.router.navigate(['/orders']);
      return;
    }

    // Load order by ID
    this.ordersService.getById(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
      },
      error: (err) => {
        console.error('Failed to load order:', err);
        // Error handling will trigger redirect via effect
        this.order.set(null);
      },
    });
  }

  /**
   * Handles the save event from OrderFormComponent.
   * Updates the order and navigates to the orders list on success.
   *
   * @param orderData - Order data to update
   */
  onSave(orderData: UpdateOrder): void {
    this.ordersService.update(orderData).subscribe({
      next: () => {
        // Navigate to orders list after successful update
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Failed to update order:', err);
        // Stay on the page to allow user to retry
      },
    });
  }

  /**
   * Handles the cancel event from OrderFormComponent.
   * Navigates back to the orders list without saving.
   */
  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}

