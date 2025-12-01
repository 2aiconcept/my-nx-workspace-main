import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@mini-crm/data-access';

/**
 * Main layout component with conditional header and sidebar display.
 *
 * Displays header and sidebar only when user is authenticated.
 * When not authenticated, shows main content centered full screen.
 * Uses content projection for header and sidebar components.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-layout>
 *   <lib-header layout-header />
 *   <lib-sidebar layout-sidebar />
 * </lib-layout>
 * ```
 *
 * The router-outlet is automatically included in the main area.
 *
 * @see HeaderComponent
 * @see SidebarComponent
 * @see AuthService
 * @category Layout
 */
@Component({
  selector: 'lib-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;
}
