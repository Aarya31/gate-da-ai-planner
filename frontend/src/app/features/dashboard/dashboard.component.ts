import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { CalendarService } from '../../core/services/calendar.service';
import { DashboardStats } from '../../core/models/dashboard.model';
import { StudyEvent, EventStatus } from '../../core/models/event.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      <!-- Top Banner / Streak & Target Header -->
      <div class="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-cyan-500/20">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="space-y-2 z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <span>🔥 {{ stats?.currentStreakDays || 0 }}-Day Active Study Streak</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            GATE DA <span class="gradient-text-cyan">2027</span> Command Center
          </h1>
          <p class="text-slate-400 text-sm max-w-xl">
            Adaptive AI study planner designed for working software engineers. 2.5-3h weekdays, 5-6h weekends.
          </p>
        </div>

        <div class="flex items-center gap-4 z-10 w-full md:w-auto">
          <a routerLink="/ai-assistant" class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 text-sm">
            <span>✨ Ask AI Planner</span>
          </a>
          <a routerLink="/calendar" class="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold border border-slate-700 transition-all text-sm">
            <span>📅 View Schedule</span>
          </a>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Weekly Study Time Card -->
        <div class="glass-card glass-card-hover rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">Weekly Target</span>
            <span class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-lg">⏱️</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{{ stats?.thisWeekCompletedHours || 0 }} <span class="text-slate-400 text-sm font-normal">/ {{ stats?.thisWeekTargetHours || 21 }} hrs</span></div>
            <div class="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                   [style.width.%]="stats?.thisWeekTargetHours ? ((stats?.thisWeekCompletedHours || 0) / stats!.thisWeekTargetHours) * 100 : 0"></div>
            </div>
          </div>
        </div>

        <!-- Today's Completion Card -->
        <div class="glass-card glass-card-hover rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">Today's Progress</span>
            <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">🎯</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{{ stats?.todayCompletedSessions || 0 }} <span class="text-slate-400 text-sm font-normal">/ {{ stats?.todayTotalSessions || 0 }} Sessions</span></div>
            <div class="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                   [style.width.%]="stats?.todayTotalSessions ? ((stats?.todayCompletedSessions || 0) / stats!.todayTotalSessions) * 100 : 0"></div>
            </div>
          </div>
        </div>

        <!-- Session Status Breakdown Card -->
        <div class="glass-card glass-card-hover rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">Sessions Status</span>
            <span class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg">📊</span>
          </div>
          <div class="flex items-center justify-between text-xs pt-1">
            <div class="text-center">
              <p class="font-bold text-emerald-400 text-base">{{ stats?.totalCompletedSessions || 0 }}</p>
              <p class="text-slate-400">Completed</p>
            </div>
            <div class="text-center border-x border-slate-800 px-3">
              <p class="font-bold text-amber-400 text-base">{{ stats?.totalPendingSessions || 0 }}</p>
              <p class="text-slate-400">Pending</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-red-400 text-base">{{ stats?.totalMissedSessions || 0 }}</p>
              <p class="text-slate-400">Missed</p>
            </div>
          </div>
        </div>

        <!-- Overall Syllabus Completion Card -->
        <div class="glass-card glass-card-hover rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">Syllabus Completion</span>
            <span class="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-lg">📚</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{{ stats?.overallSyllabusProgressPercentage || 0 }}%</div>
            <div class="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                   [style.width.%]="stats?.overallSyllabusProgressPercentage || 0"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Main Section Grid: Today's Timeline + Weak Subjects & Recommendations -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Today's Study Timeline -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-6 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <span>📅 Today's Study Sessions</span>
                <span class="text-xs font-normal text-slate-400">({{ todaysSessions.length }} Scheduled)</span>
              </h2>
              <p class="text-xs text-slate-400">Mark your progress as you complete each study module.</p>
            </div>
            <a routerLink="/calendar" class="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              <span>Full Schedule</span>
              <span>→</span>
            </a>
          </div>

          <!-- Session List -->
          <div class="space-y-4" *ngIf="todaysSessions.length > 0; else emptyState">
            <div *ngFor="let session of todaysSessions" 
                 class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {{ session.subjectName }}
                    </span>
                    <span class="text-xs text-slate-400">⏰ {{ session.startTime || '19:30' }} - {{ session.endTime || '22:00' }} ({{ session.durationMinutes }}m)</span>
                  </div>
                  <h3 class="font-semibold text-white text-base">{{ session.title }}</h3>
                  <p class="text-xs text-slate-400">{{ session.goal }}</p>
                </div>

                <!-- Status Badge / Quick Toggle Buttons -->
                <div class="flex items-center gap-2 self-start sm:self-center">
                  <button (click)="updateStatus(session, 'COMPLETED')" 
                          [class.bg-emerald-500]="session.status === 'COMPLETED'"
                          class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all">
                    ✓ Done
                  </button>
                  <button (click)="updateStatus(session, 'IN_PROGRESS')" 
                          [class.bg-cyan-500]="session.status === 'IN_PROGRESS'"
                          class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 transition-all">
                    ▶ Active
                  </button>
                  <button (click)="updateStatus(session, 'MISSED')" 
                          [class.bg-red-500]="session.status === 'MISSED'"
                          class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-all">
                    ! Missed
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ng-template #emptyState>
            <div class="p-8 text-center space-y-3 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              <span class="text-3xl">🌱</span>
              <p class="text-sm text-slate-300 font-medium">Welcome! No study sessions scheduled yet today.</p>
              <p class="text-xs text-slate-400">Click below to let GATE AI generate your custom study schedule based on your available hours!</p>
              <a routerLink="/ai-assistant" class="inline-block px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all">
                ✨ Generate Study Schedule with AI
              </a>
            </div>
          </ng-template>
        </div>

        <!-- Right Col: Weak Topics & Upcoming Mock Test Banner -->
        <div class="space-y-6">
          
          <!-- Upcoming Mock Test Card -->
          <div class="glass-card rounded-2xl p-6 border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/60 space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider">GATE DA Target</span>
              <span class="text-slate-400 text-xs">Feb 6, 2027</span>
            </div>
            <div>
              <h3 class="font-bold text-white text-lg">GATE DA 2027 Exam Preparation</h3>
              <p class="text-xs text-slate-400 mt-1">Full Syllabus • 10 Core Subject Modules</p>
            </div>
            <a routerLink="/mock-tests" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
              <span>View Mock Tests</span>
              <span>→</span>
            </a>
          </div>

          <!-- Weak Areas / Recommended Action Card -->
          <div class="glass-card rounded-2xl p-6 space-y-4">
            <h3 class="font-bold text-white text-base flex items-center gap-2">
              <span>🎯 Study Priority & Recommendations</span>
            </h3>
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p class="font-semibold text-white">Initial Study Plan</p>
              <p class="text-slate-400">Start with high-weightage topics in <strong>Probability & Statistics</strong> and <strong>Linear Algebra</strong>.</p>
            </div>

            <a routerLink="/ai-assistant" class="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1">
              <span>Create AI Schedule</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  todaysSessions: StudyEvent[] = [];

  constructor(
    private dashboardService: DashboardService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.todaysSessions = data.todaysSessions || [];
      },
      error: () => {
        this.todaysSessions = [];
      }
    });
  }

  updateStatus(session: StudyEvent, status: EventStatus): void {
    session.status = status;
    if (session.id) {
      this.calendarService.updateStatus(session.id, status).subscribe();
    }
  }
}
