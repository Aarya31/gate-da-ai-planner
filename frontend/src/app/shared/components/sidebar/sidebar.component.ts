import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between p-4 z-40">
      <div>
        <!-- Brand Header -->
        <div class="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/60">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span class="text-xl">🤖</span>
          </div>
          <div>
            <h1 class="font-extrabold text-lg text-white tracking-wide">GATE DA <span class="text-cyan-400">2027</span></h1>
            <p class="text-xs text-slate-400 font-medium">AI Command Center</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1.5">
          <a routerLink="/dashboard" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">🏠</span>
            <span>Dashboard</span>
          </a>

          <a routerLink="/calendar" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">📅</span>
            <span>Calendar</span>
          </a>

          <a routerLink="/syllabus" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">📚</span>
            <span>Syllabus</span>
          </a>

          <a routerLink="/pyqs" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">📝</span>
            <span>PYQs</span>
          </a>

          <a routerLink="/mock-tests" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">🧪</span>
            <span>Mock Tests</span>
          </a>

          <a routerLink="/ai-assistant" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent relative">
            <span class="text-lg">✨</span>
            <span>AI Assistant</span>
            <span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white uppercase tracking-wider">AI</span>
          </a>

          <a routerLink="/settings" routerLinkActive="bg-cyan-500/10 text-cyan-400 border-cyan-500/40" 
             class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium border border-transparent">
            <span class="text-lg">⚙️</span>
            <span>Settings</span>
          </a>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="pt-4 border-t border-slate-800/60">
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              {{ authService.currentUser()?.fullName?.charAt(0) || 'A' }}
            </div>
            <div class="truncate">
              <p class="text-xs font-semibold text-white truncate">{{ authService.currentUser()?.fullName || 'GATE Aspirant' }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ authService.currentUser()?.email || 'aspirant@gate.ac.in' }}</p>
            </div>
          </div>
          <button (click)="logout()" title="Logout" class="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
            <span class="text-base">🚪</span>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
