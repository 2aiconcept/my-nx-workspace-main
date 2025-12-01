import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Sidebar component for vertical navigation.
 *
 * Displays navigation links in a vertical sidebar. Visible after user authentication.
 * Features active state styling for the current route.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-sidebar />
 * ```
 *
 * ### With Layout Component
 * ```html
 * <lib-layout>
 *   <lib-sidebar layout-sidebar />
 *   <!-- other content -->
 * </lib-layout>
 * ```
 *
 * @see LayoutComponent
 * @see HeaderComponent
 * @category Layout
 */
@Component({
  selector: 'lib-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}

