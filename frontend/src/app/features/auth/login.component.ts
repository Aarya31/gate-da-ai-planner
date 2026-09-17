import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      <div class="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

      <div class="glass-card rounded-3xl p-8 max-w-md w-full space-y-6 border-cyan-500/20 shadow-2xl relative z-10">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
            🤖
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">GATE DA <span class="gradient-text-cyan">2027</span></h1>
          <p class="text-xs text-slate-400">AI-Powered Personal Study Planner & Command Center</p>
        </div>

        <!-- Registration Success Notification -->
        <div *ngIf="successMessage" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {{ successMessage }}
        </div>

        <form (ngSubmit)="onLogin()" class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required class="w-full p-3 rounded-xl glass-input text-xs" placeholder="Enter your email address">
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required class="w-full p-3 rounded-xl glass-input text-xs" placeholder="Enter your password">
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="isLoading || !email.trim() || !password.trim()" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all">
            {{ isLoading ? 'Authenticating...' : 'Sign In to Command Center →' }}
          </button>
        </form>

        <div class="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Don't have an account? 
          <a routerLink="/register" class="text-cyan-400 font-semibold hover:underline">Create GATE DA Account</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = '✓ Account created successfully! Please sign in with your email and password.';
      }
    });
  }

  onLogin(): void {
    if (!this.email.trim() || !this.password.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Wrong credentials';
      }
    });
  }
}
