import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Spinner component for loading states.
 *
 * Displays a Bootstrap spinner centered on the page. Reusable throughout
 * the application to indicate loading operations.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-spinner />
 * ```
 *
 * ### With Conditional Display
 * ```html
 * @if (loading()) {
 *   <lib-spinner />
 * }
 * ```
 *
 * @see ConfirmModalComponent
 * @category Shared UI
 */
@Component({
  selector: 'lib-spinner',
  imports: [],
  template: `
    <div class="spinner-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
  `,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}

