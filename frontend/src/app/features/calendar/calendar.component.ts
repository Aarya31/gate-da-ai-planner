import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../core/services/calendar.service';
import { AiService } from '../../core/services/ai.service';
import { StudyEvent, EventStatus, EventType, Priority } from '../../core/models/event.model';

interface MonthCell {
  date: Date;
  dateNum: number;
  dateIso: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      
      <!-- Top Calendar Header & Navigation Bar -->
      <div class="glass-card rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-cyan-500/20">
        
        <!-- Left: Month/Year Display & Prev/Today/Next Controls -->
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button (click)="navigatePeriod(-1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all text-sm font-bold">
              ◄
            </button>
            <button (click)="goToToday()" class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700">
              Today
            </button>
            <button (click)="navigatePeriod(1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all text-sm font-bold">
              ►
            </button>
          </div>

          <div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{{ currentPeriodTitle }}</span>
              <span class="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/30">GATE DA 2027</span>
            </h1>
            <p class="text-xs text-slate-400">Personalized schedule • Weekdays (2.5-3h) • Weekends (5-6h)</p>
          </div>
        </div>

        <!-- Right: View Modes & Action Buttons -->
        <div class="flex items-center gap-3 flex-wrap">
          
          <!-- View Switcher -->
          <div class="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button (click)="switchView('MONTH')" [class.bg-cyan-500]="viewMode === 'MONTH'" [class.text-white]="viewMode === 'MONTH'" class="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition-all">
              📅 Month
            </button>
            <button (click)="switchView('WEEK')" [class.bg-cyan-500]="viewMode === 'WEEK'" [class.text-white]="viewMode === 'WEEK'" class="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition-all">
              📊 Week (Hours)
            </button>
            <button (click)="switchView('DAY')" [class.bg-cyan-500]="viewMode === 'DAY'" [class.text-white]="viewMode === 'DAY'" class="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition-all">
              ⏱️ Day Timeline
            </button>
          </div>

          <!-- AI Rebalance Button -->
          <button (click)="rebalanceSchedule()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2">
            <span>✨ AI Rebalance</span>
          </button>

          <!-- Add Session Button -->
          <button (click)="openCreateModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5">
            <span class="text-base">+</span>
            <span>New Session</span>
          </button>
        </div>

      </div>

      <!-- Subject Filter Legend Bar -->
      <div class="glass-card rounded-xl p-3 flex items-center justify-between text-xs overflow-x-auto gap-4">
        <span class="text-slate-400 font-semibold whitespace-nowrap">Filter Subject:</span>
        <div class="flex items-center gap-2 overflow-x-auto">
          <button (click)="selectedSubjectFilter = 'ALL'" [class.border-cyan-400]="selectedSubjectFilter === 'ALL'" class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold whitespace-nowrap">All Subjects</button>
          <button (click)="selectedSubjectFilter = 'Probability & Statistics'" [class.border-cyan-400]="selectedSubjectFilter === 'Probability & Statistics'" class="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold whitespace-nowrap">Probability & Stats</button>
          <button (click)="selectedSubjectFilter = 'Linear Algebra'" [class.border-purple-400]="selectedSubjectFilter === 'Linear Algebra'" class="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold whitespace-nowrap">Linear Algebra</button>
          <button (click)="selectedSubjectFilter = 'Machine Learning'" [class.border-emerald-400]="selectedSubjectFilter === 'Machine Learning'" class="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold whitespace-nowrap">Machine Learning</button>
          <button (click)="selectedSubjectFilter = 'Artificial Intelligence'" [class.border-indigo-400]="selectedSubjectFilter === 'Artificial Intelligence'" class="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold whitespace-nowrap">AI & Deep Learning</button>
        </div>
      </div>

      <!-- CALENDAR VIEW SWITCHER RENDERER -->
      <div [ngSwitch]="viewMode">
        
        <!-- 1. ACTUAL MONTHLY CALENDAR GRID -->
        <div *ngSwitchCase="'MONTH'" class="glass-card rounded-2xl p-4 md:p-6 space-y-3">
          
          <!-- Day of Week Headers -->
          <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
            <div class="text-indigo-400">Sat (5-6h)</div>
            <div class="text-indigo-400">Sun (5-6h)</div>
          </div>

          <!-- 7-Column Date Grid (Full Month Grid) -->
          <div class="grid grid-cols-7 gap-2">
            <div *ngFor="let cell of monthGridCells" 
                 (click)="onCellClick(cell.dateIso)"
                 class="min-h-[120px] p-2 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer"
                 [ngClass]="{
                   'bg-slate-900/60 border-slate-800/80 hover:border-slate-700': cell.isCurrentMonth,
                   'bg-slate-950/20 border-slate-900/40 text-slate-600': !cell.isCurrentMonth,
                   'border-cyan-500/60 bg-cyan-500/5 shadow-lg shadow-cyan-500/10': cell.isToday
                 }">
              
              <!-- Cell Date Header -->
              <div class="flex items-center justify-between">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      [ngClass]="{
                        'bg-cyan-500 text-white shadow-md shadow-cyan-500/40': cell.isToday,
                        'text-slate-200': cell.isCurrentMonth && !cell.isToday,
                        'text-slate-600': !cell.isCurrentMonth
                      }">
                  {{ cell.dateNum }}
                </span>
                <span *ngIf="cell.isWeekend && cell.isCurrentMonth" class="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  Weekend
                </span>
              </div>

              <!-- Events Container inside Cell -->
              <div class="space-y-1.5 my-1 flex-1 overflow-y-auto max-h-[85px]">
                <div *ngFor="let ev of getFilteredEvents(cell.dateIso)" 
                     (click)="selectEvent(ev, $event)"
                     class="p-1.5 rounded-lg border text-[11px] font-medium leading-tight truncate shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
                     [ngClass]="getEventChipStyle(ev)">
                  <div class="flex items-center justify-between gap-1">
                    <span class="truncate font-semibold">{{ ev.title }}</span>
                    <span class="text-[9px] opacity-90 font-bold uppercase">{{ ev.status === 'COMPLETED' ? '✓' : '' }}</span>
                  </div>
                  <div class="text-[9px] opacity-75 font-mono">⏰ {{ ev.startTime || '19:30' }} ({{ ev.durationMinutes }}m)</div>
                </div>
              </div>

              <!-- Quick Add Slot Prompt -->
              <div class="text-[9px] text-slate-500 group-hover:text-cyan-400 font-medium text-right pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                + Add Session
              </div>
            </div>
          </div>

        </div>

        <!-- 2. WEEKLY HOUR-GRID CALENDAR VIEW (Google Calendar Style) -->
        <div *ngSwitchCase="'WEEK'" class="glass-card rounded-2xl p-4 md:p-6 space-y-4">
          
          <!-- Week Header Row -->
          <div class="grid grid-cols-8 gap-2 border-b border-slate-800 pb-3 text-center">
            <div class="text-xs text-slate-500 font-bold pt-2">Time</div>
            <div *ngFor="let day of weekColumns" class="p-2 rounded-xl bg-slate-900/60 border border-slate-800" [class.border-cyan-500]="day.isToday">
              <p class="text-[10px] font-bold uppercase text-slate-400">{{ day.dayName }}</p>
              <p class="text-sm font-extrabold text-white" [class.text-cyan-400]="day.isToday">{{ day.dateStr }}</p>
              <span class="text-[9px] font-semibold" [class.text-indigo-400]="day.isWeekend" [class.text-slate-500]="!day.isWeekend">
                {{ day.isWeekend ? '5-6h Target' : '2.5-3h Target' }}
              </span>
            </div>
          </div>

          <!-- Hourly Rows Grid (07:00 to 23:00) -->
          <div class="divide-y divide-slate-800/60 max-h-[700px] overflow-y-auto pr-1">
            <div *ngFor="let hour of timeHours" class="grid grid-cols-8 gap-2 min-h-[60px] py-1">
              <!-- Hour Label -->
              <div class="text-[11px] font-mono font-semibold text-slate-400 text-right pr-2 self-start pt-1">
                {{ hour }}:00
              </div>

              <!-- Day Hour Cells -->
              <div *ngFor="let day of weekColumns" 
                   (click)="onHourSlotClick(day.dateIso, hour)"
                   class="bg-slate-900/20 rounded-lg border border-slate-900/60 hover:bg-slate-800/40 transition-colors p-1 relative cursor-pointer group">
                
                <!-- Matching Events in this Hour Slot -->
                <div *ngFor="let ev of getEventsForHour(day.dateIso, hour)" 
                     (click)="selectEvent(ev, $event)"
                     class="p-2 rounded-lg border text-xs font-semibold space-y-1 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                     [ngClass]="getEventChipStyle(ev)">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-bold tracking-wider opacity-90">{{ ev.subjectName }}</span>
                    <span class="text-[9px] font-mono opacity-80">{{ ev.durationMinutes }} mins</span>
                  </div>
                  <h4 class="font-bold text-white leading-snug">{{ ev.title }}</h4>
                  <p class="text-[10px] opacity-80 truncate">{{ ev.goal }}</p>
                </div>

                <span class="text-[9px] text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 right-1 font-mono">
                  + {{ hour }}:00
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- 3. DAILY TIMELINE VIEW -->
        <div *ngSwitchCase="'DAY'" class="glass-card rounded-2xl p-6 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 class="text-xl font-extrabold text-white">Daily Study Timeline</h2>
              <p class="text-xs text-slate-400">Detailed schedule for {{ currentPeriodTitle }}</p>
            </div>
            <button (click)="openCreateModal()" class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20">
              + Add Session Today
            </button>
          </div>

          <div class="space-y-4">
            <div *ngFor="let ev of getFilteredEvents(selectedDateIso)" class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row justify-between gap-4 hover:border-slate-700 transition-all">
              <div class="space-y-2 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {{ ev.subjectName || 'Probability & Statistics' }}
                  </span>
                  <span class="text-xs font-mono text-slate-300">⏰ {{ ev.startTime || '19:30' }} - {{ ev.endTime || '22:00' }} ({{ ev.durationMinutes }} mins)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getStatusBadgeClass(ev.status)">
                    {{ ev.status }}
                  </span>
                </div>
                
                <h3 class="text-lg font-bold text-white">{{ ev.title }}</h3>
                <p class="text-xs text-slate-300">{{ ev.goal }}</p>

                <div class="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>🎯 Daily Goal: {{ ev.questionTarget || 15 }} Solved Questions</span>
                  <span>📝 PYQs Target: {{ ev.pyqTarget || 10 }} GATE PYQs</span>
                </div>
              </div>

              <!-- Quick Status Selector -->
              <div class="flex md:flex-col items-center justify-between gap-3 self-start md:self-center">
                <select [ngModel]="ev.status" (ngModelChange)="updateStatus(ev, $event)" 
                        class="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500">
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">✓ Completed</option>
                  <option value="PARTIALLY_COMPLETED">Partially Completed</option>
                  <option value="MISSED">! Missed</option>
                </select>

                <button (click)="selectEvent(ev, $event)" class="text-xs text-cyan-400 font-semibold hover:underline">
                  Edit Details ✎
                </button>
              </div>
            </div>

            <div *ngIf="getFilteredEvents(selectedDateIso).length === 0" class="p-12 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <span class="text-4xl">📅</span>
              <p class="text-sm text-slate-300 font-semibold">No study sessions scheduled for this date.</p>
              <button (click)="openCreateModal()" class="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                + Create Study Session
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Add / Edit Study Session Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 border-cyan-500/30 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 class="text-xl font-bold text-white">{{ editingEvent.id ? 'Edit Study Session' : 'Create New Study Session' }}</h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white text-xl">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-medium mb-1">Session Title</label>
              <input type="text" [(ngModel)]="editingEvent.title" class="w-full p-3 rounded-xl glass-input text-xs font-semibold" placeholder="e.g. GATE DA — Probability: Bayes Theorem">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-medium mb-1">Subject</label>
                <select [(ngModel)]="editingEvent.subjectName" class="w-full p-3 rounded-xl glass-input text-xs font-semibold">
                  <option value="Probability & Statistics">Probability & Statistics</option>
                  <option value="Linear Algebra">Linear Algebra</option>
                  <option value="Calculus & Optimization">Calculus & Optimization</option>
                  <option value="Programming">Programming</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Data Warehousing">Data Warehousing</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="General Aptitude">General Aptitude</option>
                </select>
              </div>
              <div>
                <label class="block text-slate-300 font-medium mb-1">Topic Name</label>
                <input type="text" [(ngModel)]="editingEvent.topicName" class="w-full p-3 rounded-xl glass-input text-xs" placeholder="e.g. Bayes Theorem">
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-300 font-medium mb-1">Date</label>
                <input type="date" [(ngModel)]="editingEvent.eventDate" class="w-full p-3 rounded-xl glass-input text-xs">
              </div>
              <div>
                <label class="block text-slate-300 font-medium mb-1">Start Time</label>
                <input type="time" [(ngModel)]="editingEvent.startTime" class="w-full p-3 rounded-xl glass-input text-xs">
              </div>
              <div>
                <label class="block text-slate-300 font-medium mb-1">Duration (mins)</label>
                <input type="number" [(ngModel)]="editingEvent.durationMinutes" class="w-full p-3 rounded-xl glass-input text-xs">
              </div>
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-1">Daily Goal Description</label>
              <textarea [(ngModel)]="editingEvent.goal" rows="2" class="w-full p-3 rounded-xl glass-input text-xs" placeholder="Understand core proof and solve 15+ GATE PYQs"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-medium mb-1">Question Target</label>
                <input type="number" [(ngModel)]="editingEvent.questionTarget" class="w-full p-3 rounded-xl glass-input text-xs">
              </div>
              <div>
                <label class="block text-slate-300 font-medium mb-1">PYQ Target</label>
                <input type="number" [(ngModel)]="editingEvent.pyqTarget" class="w-full p-3 rounded-xl glass-input text-xs">
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <button *ngIf="editingEvent.id" (click)="deleteEvent()" class="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold text-xs border border-red-500/30">
              Delete Session
            </button>
            <div class="flex items-center gap-3 ml-auto">
              <button (click)="showModal = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
              <button (click)="saveEvent()" class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20">
                Save Session
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CalendarComponent implements OnInit {
  viewMode: 'MONTH' | 'WEEK' | 'DAY' = 'MONTH';
  selectedDateIso: string = new Date().toISOString().split('T')[0];
  selectedSubjectFilter: string = 'ALL';
  currentDate: Date = new Date();
  
  events: StudyEvent[] = [];
  monthGridCells: MonthCell[] = [];
  weekColumns: any[] = [];
  timeHours: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  
  showModal = false;
  editingEvent: StudyEvent = this.getEmptyEvent();

  constructor(private calendarService: CalendarService, private aiService: AiService) {}

  ngOnInit(): void {
    this.buildCalendarViews();
    this.loadEvents();
  }

  get currentPeriodTitle(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  switchView(mode: 'MONTH' | 'WEEK' | 'DAY'): void {
    this.viewMode = mode;
    this.buildCalendarViews();
  }

  navigatePeriod(direction: number): void {
    if (this.viewMode === 'MONTH') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + direction, 1);
    } else if (this.viewMode === 'WEEK') {
      this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + direction);
    }
    this.selectedDateIso = this.currentDate.toISOString().split('T')[0];
    this.buildCalendarViews();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.selectedDateIso = this.currentDate.toISOString().split('T')[0];
    this.buildCalendarViews();
  }

  loadEvents(): void {
    this.calendarService.getEvents().subscribe({
      next: (data) => {
        this.events = data || [];
      },
      error: () => {
        this.events = [];
      }
    });
  }

  getFilteredEvents(dateIso: string): StudyEvent[] {
    return this.events.filter(e => {
      const dateMatches = e.eventDate === dateIso;
      const subjectMatches = this.selectedSubjectFilter === 'ALL' || e.subjectName === this.selectedSubjectFilter;
      return dateMatches && subjectMatches;
    });
  }

  getEventsForHour(dateIso: string, hour: number): StudyEvent[] {
    return this.getFilteredEvents(dateIso).filter(e => {
      const startH = e.startTime ? parseInt(e.startTime.split(':')[0], 10) : 19;
      return startH === hour;
    });
  }

  getEventChipStyle(ev: StudyEvent): string {
    switch (ev.subjectName) {
      case 'Linear Algebra':
        return 'bg-purple-500/20 text-purple-200 border-purple-500/40 hover:bg-purple-500/30';
      case 'Machine Learning':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'Artificial Intelligence':
        return 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/30';
      case 'Calculus & Optimization':
        return 'bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 hover:bg-cyan-500/30';
    }
  }

  getStatusBadgeClass(status: EventStatus): string {
    switch (status) {
      case 'COMPLETED': return 'badge-completed';
      case 'IN_PROGRESS': return 'badge-in-progress';
      case 'MISSED': return 'badge-missed';
      default: return 'badge-pending';
    }
  }

  onCellClick(dateIso: string): void {
    this.selectedDateIso = dateIso;
    this.openCreateModal(dateIso);
  }

  onHourSlotClick(dateIso: string, hour: number): void {
    const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    this.editingEvent = this.getEmptyEvent(dateIso, formattedHour);
    this.showModal = true;
  }

  openCreateModal(dateIso?: string): void {
    this.editingEvent = this.getEmptyEvent(dateIso || this.selectedDateIso);
    this.showModal = true;
  }

  selectEvent(ev: StudyEvent, event: MouseEvent): void {
    event.stopPropagation();
    this.editingEvent = { ...ev };
    this.showModal = true;
  }

  saveEvent(): void {
    if (this.editingEvent.id) {
      this.calendarService.updateEvent(this.editingEvent.id, this.editingEvent).subscribe(() => this.loadEvents());
    } else {
      this.calendarService.createEvent(this.editingEvent).subscribe(() => this.loadEvents());
    }
    this.showModal = false;
  }

  deleteEvent(): void {
    if (this.editingEvent.id) {
      this.calendarService.deleteEvent(this.editingEvent.id).subscribe(() => this.loadEvents());
      this.showModal = false;
    }
  }

  updateStatus(ev: StudyEvent, status: EventStatus): void {
    ev.status = status;
    if (ev.id) {
      this.calendarService.updateStatus(ev.id, status).subscribe();
    }
  }

  rebalanceSchedule(): void {
    this.aiService.modifySchedule({ prompt: 'Create my study plan for the next 7 days' }).subscribe(res => {
      this.aiService.applyProposal(res.proposedEvents).subscribe(() => {
        alert(res.summary);
        this.loadEvents();
      });
    });
  }

  private buildCalendarViews(): void {
    this.buildMonthGrid();
    this.buildWeekColumns();
  }

  private buildMonthGrid(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const todayIso = new Date().toISOString().split('T')[0];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // 0 = Mon

    const cells: MonthCell[] = [];

    // Padded days from previous month
    for (let i = startDayOfWeek; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      const iso = d.toISOString().split('T')[0];
      cells.push({
        date: d,
        dateNum: d.getDate(),
        dateIso: iso,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }

    // Days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      const iso = d.toISOString().split('T')[0];
      cells.push({
        date: d,
        dateNum: i,
        dateIso: iso,
        isCurrentMonth: true,
        isToday: iso === todayIso,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }

    // Padded days from next month to complete 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const iso = d.toISOString().split('T')[0];
      cells.push({
        date: d,
        dateNum: i,
        dateIso: iso,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }

    this.monthGridCells = cells;
  }

  private buildWeekColumns(): void {
    const today = new Date();
    const curr = new Date(this.currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.weekColumns = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      this.weekColumns.push({
        dayName: names[i],
        dateStr: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
        dateIso: iso,
        isToday: iso === today.toISOString().split('T')[0],
        isWeekend: i >= 5
      });
    }
  }

  private getEmptyEvent(dateIso?: string, startTime?: string): StudyEvent {
    return {
      title: '',
      subjectName: 'Probability & Statistics',
      topicName: '',
      eventDate: dateIso || new Date().toISOString().split('T')[0],
      startTime: startTime || '19:30',
      durationMinutes: 150,
      eventType: 'CONCEPT_LEARNING',
      priority: 'MEDIUM',
      status: 'NOT_STARTED',
      goal: '',
      questionTarget: 15,
      pyqTarget: 10
    };
  }
}
