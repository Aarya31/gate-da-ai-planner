import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'calendar', 
    loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'syllabus', 
    loadComponent: () => import('./features/syllabus/syllabus.component').then(m => m.SyllabusComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'pyqs', 
    loadComponent: () => import('./features/pyq/pyq.component').then(m => m.PyqComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'mock-tests', 
    loadComponent: () => import('./features/mock-test/mock-test.component').then(m => m.MockTestComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'ai-assistant', 
    loadComponent: () => import('./features/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: 'login' }
];
