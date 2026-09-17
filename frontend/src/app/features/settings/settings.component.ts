import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserAvailability } from '../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      <!-- Settings Header -->
      <div class="glass-card rounded-2xl p-6">
        <h1 class="text-2xl font-bold text-white tracking-tight">Study Preferences & Availability Settings</h1>
        <p class="text-xs text-slate-400">Configure your daily study capacity so the AI planner creates realistic schedules.</p>
      </div>

      <!-- Study Availability Configuration -->
      <div class="glass-card rounded-2xl p-6 space-y-6 border-slate-800">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 class="font-bold text-white text-base">Weekly Study Availability (Hours / Day)</h2>
          <span class="text-xs text-cyan-400 font-semibold">Working Software Engineer Profile</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let day of availabilities" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="font-bold text-white text-sm block">{{ getDayName(day.dayOfWeek) }}</span>
              <span class="text-[11px] text-slate-400">{{ day.dayOfWeek >= 6 ? 'Weekend Window (10:00 AM)' : 'Weekday Window (7:30 PM)' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="number" step="0.5" min="1" max="10" [(ngModel)]="day.maxHours" 
                     class="w-20 p-2 rounded-xl glass-input text-center text-xs font-bold text-cyan-400">
              <span class="text-xs text-slate-400">hrs</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-3">
          <button (click)="saveAvailability()" class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20">
            Save Availability Settings
          </button>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="glass-card rounded-2xl p-6 space-y-4 border-slate-800">
        <h2 class="font-bold text-white text-base border-b border-slate-800 pb-3">Reminders & Notifications</h2>
        
        <div class="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 class="font-semibold text-white text-sm">Browser Push Notifications</h4>
            <p class="text-xs text-slate-400">Receive alerts 30 minutes before your scheduled study session starts.</p>
          </div>
          <button (click)="enableBrowserNotifications()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold">
            Enable Notifications
          </button>
        </div>
      </div>

    </div>
  `
})
export class SettingsComponent implements OnInit {
  availabilities: UserAvailability[] = [];

  constructor(private authService: AuthService, private notifService: NotificationService) {}

  ngOnInit(): void {
    this.authService.getAvailability().subscribe(data => {
      if (data && data.length > 0) {
        this.availabilities = data;
      } else {
        this.seedDefaults();
      }
    });
  }

  seedDefaults(): void {
    const days = [1, 2, 3, 4, 5, 6, 7];
    this.availabilities = days.map(d => ({
      dayOfWeek: d,
      maxHours: d >= 6 ? 6.0 : 3.0
    }));
  }

  getDayName(day: number): string {
    const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names[day - 1] || 'Day';
  }

  saveAvailability(): void {
    this.authService.updateAvailability(this.availabilities).subscribe(() => {
      alert('Study availability preferences updated successfully!');
    });
  }

  enableBrowserNotifications(): void {
    this.notifService.requestBrowserPermission();
    alert('Browser notifications requested.');
  }
}
