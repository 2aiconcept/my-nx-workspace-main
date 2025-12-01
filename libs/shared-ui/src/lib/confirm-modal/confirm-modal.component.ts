import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild,
  effect,
  ElementRef,
} from '@angular/core';

// Bootstrap Modal type from @types/bootstrap
declare const bootstrap: {
  Modal: new (
    element: HTMLElement,
    options?: { backdrop?: boolean | string; keyboard?: boolean }
  ) => {
    show: () => void;
    hide: () => void;
    dispose: () => void;
  };
};

/**
 * Confirmation modal component for reusable confirmation dialogs.
 *
 * Displays a Bootstrap modal with customizable title and message.
 * Emits a confirmation event when the user confirms the action.
 * Uses Bootstrap JavaScript API to manage modal state.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-confirm-modal
 *   [modalId]="'deleteOrderModal'"
 *   [title]="'Supprimer la commande'"
 *   [message]="'Êtes-vous sûr de vouloir supprimer cette commande ?'"
 *   (confirm)="onConfirm()"
 * />
 * ```
 *
 * ### With Default Title
 * ```html
 * <lib-confirm-modal
 *   [modalId]="'confirmModal'"
 *   [message]="'Voulez-vous continuer ?'"
 *   (confirm)="handleConfirm()"
 * />
 * ```
 *
 * ### Multiple Modals on Same Page
 * Each modal must have a unique `modalId`:
 * ```html
 * <lib-confirm-modal [modalId]="'deleteModal'" ... />
 * <lib-confirm-modal [modalId]="'cancelModal'" ... />
 * ```
 *
 * @see SpinnerComponent
 * @category Shared UI
 */
@Component({
  selector: 'lib-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  /**
   * Unique identifier for the modal element.
   * Required to manage multiple modals on the same page.
   * @required
   */
  modalId = input.required<string>();

  /**
   * Modal title displayed in the header.
   * @default 'Confirmation'
   */
  title = input<string>('Confirmation');

  /**
   * Confirmation message displayed in the modal body.
   */
  message = input<string>();

  /**
   * Emitted when the user confirms the action.
   * @event
   */
  confirm = output<void>();

  /**
   * Reference to the modal DOM element for Bootstrap API access.
   */
  private readonly modalElement = viewChild<ElementRef<HTMLElement>>('modalElement');

  /**
   * Bootstrap Modal instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private modalInstance: any | null = null;

  constructor() {
    // Initialize Bootstrap Modal instance when element is available
    effect(() => {
      const element = this.modalElement()?.nativeElement;
      if (element && !this.modalInstance && typeof bootstrap !== 'undefined') {
        this.modalInstance = new bootstrap.Modal(element, {
          backdrop: true,
          keyboard: true,
        });
      }
    });
  }

  /**
   * Handles the confirm button click.
   * Emits the confirm event and closes the modal.
   */
  onConfirm(): void {
    this.confirm.emit();
    this.hideModal();
  }

  /**
   * Closes the modal using Bootstrap API.
   */
  private hideModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}

