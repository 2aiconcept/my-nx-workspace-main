import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Header component for the application.
 *
 * Displays the application logo (briefcase icon) and title "Mini CRM".
 * Visible after user authentication. Features dark background with white text.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-header />
 * ```
 *
 * ### With Layout Component
 * ```html
 * <lib-layout>
 *   <lib-header layout-header />
 *   <!-- other content -->
 * </lib-layout>
 * ```
 *
 * @see LayoutComponent
 * @see SidebarComponent
 * @category Layout
 */
@Component({
  selector: 'lib-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}

