import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      <div class="glass-card rounded-3xl p-8 max-w-md w-full space-y-6 border-cyan-500/20 shadow-2xl relative z-10">
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Create GATE DA Account</h1>
          <p class="text-xs text-slate-400">Initialize your personal AI study planner profile</p>
        </div>

        <form (ngSubmit)="onRegister()" class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" required class="w-full p-3 rounded-xl glass-input text-xs" placeholder="e.g. Aarya Prajapat">
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required class="w-full p-3 rounded-xl glass-input text-xs" placeholder="e.g. aspirant@gate.ac.in">
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required class="w-full p-3 rounded-xl glass-input text-xs" placeholder="Create a password (min 6 chars)">
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="isLoading || !fullName.trim() || !email.trim() || !password.trim()" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all">
            {{ isLoading ? 'Creating Account...' : 'Create Account →' }}
          </button>
        </form>

        <div class="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Already have an account? 
          <a routerLink="/login" class="text-cyan-400 font-semibold hover:underline">Sign In</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.email, this.password, this.fullName).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect to login page requiring explicit sign-in after account creation
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Wrong credentials';
      }
    });
  }
}
