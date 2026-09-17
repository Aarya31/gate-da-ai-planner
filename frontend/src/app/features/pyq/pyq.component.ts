import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PyqService, PYQRecord } from '../../core/services/pyq.service';

@Component({
  selector: 'app-pyq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      <!-- PYQ Header -->
      <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">GATE DA PYQ Tracker</h1>
          <p class="text-xs text-slate-400">Record practice statistics and monitor accuracy percentages.</p>
        </div>

        <button (click)="showModal = true" class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20">
          + Log PYQ Session
        </button>
      </div>

      <!-- PYQ Records Table -->
      <div class="glass-card rounded-2xl overflow-hidden border-slate-800">
        <div class="p-4 border-b border-slate-800 bg-slate-900/60 font-bold text-sm text-white">
          Practiced Topics & Accuracy Breakdown
        </div>
        
        <div *ngIf="records.length > 0; else emptyState" class="divide-y divide-slate-800/80">
          <div *ngFor="let record of records" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
            <div class="space-y-1">
              <h3 class="font-semibold text-white text-sm">{{ record.topic.name }}</h3>
              <p class="text-xs text-slate-400">Recorded on {{ record.recordedAt | date:'mediumDate' }}</p>
            </div>

            <div class="flex items-center gap-6 text-xs">
              <div class="text-center">
                <span class="block font-bold text-white text-base">{{ record.attempted }}</span>
                <span class="text-slate-400">Attempted</span>
              </div>
              <div class="text-center">
                <span class="block font-bold text-emerald-400 text-base">{{ record.correct }}</span>
                <span class="text-slate-400">Correct</span>
              </div>
              <div class="text-center">
                <span class="block font-bold text-red-400 text-base">{{ record.incorrect }}</span>
                <span class="text-slate-400">Incorrect</span>
              </div>
              <div class="text-center pl-4 border-l border-slate-800">
                <span class="block font-extrabold text-cyan-400 text-base">{{ record.accuracyPercentage | number:'1.1-1' }}%</span>
                <span class="text-slate-400">Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="p-12 text-center space-y-3 bg-slate-900/40">
            <span class="text-3xl">📝</span>
            <p class="text-sm font-semibold text-slate-300">No PYQ practice sessions logged yet.</p>
            <p class="text-xs text-slate-400">Solve GATE DA past questions and click "+ Log PYQ Session" to track accuracy!</p>
          </div>
        </ng-template>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card rounded-2xl p-6 max-w-md w-full space-y-4 border-cyan-500/30">
          <h3 class="text-lg font-bold text-white">Log PYQ Practice Session</h3>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-300 mb-1">Attempted Questions</label>
              <input type="number" [(ngModel)]="newRecord.attempted" class="w-full p-2.5 rounded-xl glass-input">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 mb-1">Correct</label>
                <input type="number" [(ngModel)]="newRecord.correct" class="w-full p-2.5 rounded-xl glass-input">
              </div>
              <div>
                <label class="block text-slate-300 mb-1">Incorrect</label>
                <input type="number" [(ngModel)]="newRecord.incorrect" class="w-full p-2.5 rounded-xl glass-input">
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button (click)="showModal = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Cancel</button>
            <button (click)="saveRecord()" class="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-semibold">Save Record</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class PyqComponent implements OnInit {
  records: PYQRecord[] = [];
  showModal = false;

  newRecord = { attempted: 20, correct: 16, incorrect: 4 };

  constructor(private pyqService: PyqService) {}

  ngOnInit(): void {
    this.pyqService.getPyqRecords().subscribe(data => {
      this.records = data || [];
    });
  }

  saveRecord(): void {
    this.records.unshift({
      id: Date.now().toString(),
      topic: { id: 't1', name: 'Probability & Statistics' },
      attempted: this.newRecord.attempted,
      correct: this.newRecord.correct,
      incorrect: this.newRecord.incorrect,
      accuracyPercentage: (this.newRecord.correct / this.newRecord.attempted) * 100,
      recordedAt: new Date().toISOString()
    });
    this.showModal = false;
  }
}
