import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockTestService, MockTest } from '../../core/services/mock.service';

@Component({
  selector: 'app-mock-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">GATE DA Mock Test Analytics</h1>
          <p class="text-xs text-slate-400">Log test scores, track accuracy over time, and receive AI diagnostics.</p>
        </div>

        <button (click)="showModal = true" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20">
          + Log Mock Test
        </button>
      </div>

      <!-- Mock Test Cards Grid -->
      <div *ngIf="mockTests.length > 0; else emptyState" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let mock of mockTests" class="glass-card rounded-2xl p-6 space-y-4 border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-white text-lg">{{ mock.title }}</h3>
              <p class="text-xs text-slate-400">{{ mock.testDate || '2026-09-15' }}</p>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black text-cyan-400">{{ mock.score }}</span>
              <span class="text-xs text-slate-400"> / {{ mock.maxScore }}</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center text-xs">
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="block text-slate-400 text-[10px]">Attempted</span>
              <span class="font-bold text-white text-sm">{{ mock.attemptedQuestions }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="block text-slate-400 text-[10px]">Accuracy</span>
              <span class="font-bold text-emerald-400 text-sm">{{ mock.accuracyPercentage || 0 | number:'1.1-1' }}%</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="block text-slate-400 text-[10px]">Time Taken</span>
              <span class="font-bold text-indigo-300 text-sm">{{ mock.timeTakenMinutes }}m</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="glass-card rounded-2xl p-12 text-center space-y-3">
          <span class="text-3xl">🧪</span>
          <p class="text-sm font-semibold text-slate-300">No Mock Tests Logged Yet.</p>
          <p class="text-xs text-slate-400">Log your subject-wise or full-length GATE DA mock test results to unlock AI performance analytics!</p>
        </div>
      </ng-template>

      <!-- Add Mock Test Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card rounded-2xl p-6 max-w-md w-full space-y-4 border-indigo-500/30">
          <h3 class="text-lg font-bold text-white">Log Mock Test Result</h3>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-300 mb-1">Test Title</label>
              <input type="text" [(ngModel)]="newMock.title" class="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. GATE DA Full Mock #1">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 mb-1">Score Obtained</label>
                <input type="number" [(ngModel)]="newMock.score" class="w-full p-2.5 rounded-xl glass-input">
              </div>
              <div>
                <label class="block text-slate-300 mb-1">Max Score</label>
                <input type="number" [(ngModel)]="newMock.maxScore" class="w-full p-2.5 rounded-xl glass-input">
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-300 mb-1">Attempted</label>
                <input type="number" [(ngModel)]="newMock.attemptedQuestions" class="w-full p-2.5 rounded-xl glass-input">
              </div>
              <div>
                <label class="block text-slate-300 mb-1">Correct</label>
                <input type="number" [(ngModel)]="newMock.correctQuestions" class="w-full p-2.5 rounded-xl glass-input">
              </div>
              <div>
                <label class="block text-slate-300 mb-1">Time (mins)</label>
                <input type="number" [(ngModel)]="newMock.timeTakenMinutes" class="w-full p-2.5 rounded-xl glass-input">
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showModal = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Cancel</button>
            <button (click)="saveMock()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">Save Test</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class MockTestComponent implements OnInit {
  mockTests: MockTest[] = [];
  showModal = false;

  newMock: MockTest = {
    title: 'GATE DA Full Length Mock #1',
    score: 60,
    maxScore: 100,
    attemptedQuestions: 50,
    correctQuestions: 38,
    incorrectQuestions: 12,
    timeTakenMinutes: 175
  };

  constructor(private mockService: MockTestService) {}

  ngOnInit(): void {
    this.mockService.getMockTests().subscribe(data => {
      this.mockTests = data || [];
    });
  }

  saveMock(): void {
    this.mockTests.unshift({ ...this.newMock, accuracyPercentage: (this.newMock.correctQuestions / this.newMock.attemptedQuestions) * 100 });
    this.showModal = false;
  }
}
