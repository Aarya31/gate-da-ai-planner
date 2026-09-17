import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-[#0b0f19]">
      <app-sidebar *ngIf="authService.isAuthenticated()"></app-sidebar>
      <main class="flex-1 overflow-x-hidden min-h-screen">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
