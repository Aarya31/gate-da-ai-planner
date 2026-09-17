import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AiService } from '../../core/services/ai.service';
import { AiPlanResponse, TopicExplainResponse } from '../../core/models/ai.model';
import { StudyEvent } from '../../core/models/event.model';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      <!-- AI Header -->
      <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-cyan-500/30">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-2xl">✨</span>
            <h1 class="text-2xl font-bold text-white tracking-tight">GATE AI Study Planner & Assistant</h1>
            <span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase border border-cyan-500/40">Adaptive AI</span>
          </div>
          <p class="text-xs text-slate-400">Ask natural-language instructions to adjust your schedule, reschedule missed sessions, or explain GATE topics.</p>
        </div>

        <!-- Mode Switcher -->
        <div class="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          <button (click)="activeTab = 'PLANNER'" [class.bg-cyan-500]="activeTab === 'PLANNER'" [class.text-white]="activeTab === 'PLANNER'" class="px-4 py-2 rounded-lg font-semibold text-slate-400 transition-all">
            🗓️ Schedule Planner
          </button>
          <button (click)="activeTab = 'EXPLAINER'" [class.bg-cyan-500]="activeTab === 'EXPLAINER'" [class.text-white]="activeTab === 'EXPLAINER'" class="px-4 py-2 rounded-lg font-semibold text-slate-400 transition-all">
            🧠 Topic Explainer
          </button>
        </div>
      </div>

      <!-- TAB 1: SCHEDULE PLANNER -->
      <div *ngIf="activeTab === 'PLANNER'" class="space-y-6">
        
        <!-- Prompt Box -->
        <div class="glass-card rounded-2xl p-6 space-y-4">
          <label class="block text-sm font-semibold text-white">Ask GATE AI Planner to generate or adjust your schedule:</label>
          <div class="relative">
            <textarea [(ngModel)]="userPrompt" rows="3" 
                      class="w-full p-4 rounded-xl glass-input text-sm resize-none pr-32" 
                      placeholder="e.g. 'I missed today\'s Probability session. Move it to Tuesday and Saturday without overloading my working hours.'"></textarea>
            <button (click)="submitPrompt()" [disabled]="isLoading || !userPrompt.trim()" 
                    class="absolute right-3 bottom-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
              <span *ngIf="isLoading" class="animate-spin">⏳</span>
              <span>{{ isLoading ? 'Generating...' : '✨ Generate Plan' }}</span>
            </button>
          </div>

          <!-- Suggested Preset Chips -->
          <div class="space-y-2 pt-2">
            <span class="text-xs text-slate-400 font-medium">Suggested Prompts:</span>
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let preset of samplePrompts" (click)="userPrompt = preset" 
                      class="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-all">
                {{ preset }}
              </button>
            </div>
          </div>
        </div>

        <!-- Proposal Preview Card -->
        <div *ngIf="proposedPlan" class="glass-card rounded-2xl p-6 space-y-6 border-cyan-500/40">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase border border-cyan-500/40">AI Proposed Schedule Diff</span>
              <h2 class="text-lg font-bold text-white mt-1">{{ proposedPlan.summary }}</h2>
            </div>
            <div class="flex items-center gap-3">
              <button (click)="proposedPlan = null" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Reject</button>
              <button (click)="applyProposedPlan()" class="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20">Apply to Calendar ✓</button>
            </div>
          </div>

          <p class="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            💡 <strong class="text-cyan-400">AI Reasoning:</strong> {{ proposedPlan.rationale }}
          </p>

          <!-- Proposed Events List -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Proposed Sessions to Schedule:</h3>
            <div *ngFor="let ev of proposedPlan.proposedEvents" class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold uppercase">{{ ev.subjectName }}</span>
                  <span class="text-slate-400">📅 {{ ev.eventDate }} • ⏰ {{ ev.startTime }} ({{ ev.durationMinutes }}m)</span>
                </div>
                <h4 class="font-bold text-white text-sm">{{ ev.title }}</h4>
                <p class="text-slate-400">{{ ev.goal }}</p>
              </div>
              <div class="self-start sm:self-center">
                <span class="px-2.5 py-1 rounded-lg badge-in-progress text-xs font-semibold">+ Proposed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB 2: TOPIC EXPLAINER -->
      <div *ngIf="activeTab === 'EXPLAINER'" class="space-y-6">
        
        <div class="glass-card rounded-2xl p-6 space-y-4">
          <label class="block text-sm font-semibold text-white">Ask AI to explain any GATE DA topic:</label>
          <div class="flex gap-3">
            <input type="text" [(ngModel)]="topicQuery" class="flex-1 p-3 rounded-xl glass-input text-sm" placeholder="e.g. Explain Bayes theorem simply with shortcuts">
            <button (click)="explainTopic()" class="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-all">
              Explain Topic
            </button>
          </div>
        </div>

        <div *ngIf="explanationResult" class="glass-card rounded-2xl p-6 space-y-6 border-indigo-500/30">
          <div class="border-b border-slate-800 pb-3">
            <h2 class="text-xl font-bold text-white">{{ explanationResult.topicName }}</h2>
          </div>

          <!-- Markdown Content -->
          <div class="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-wrap text-slate-200">
            {{ explanationResult.explanationMarkdown }}
          </div>

          <!-- Key Takeaways -->
          <div class="space-y-2">
            <h4 class="font-bold text-cyan-400 text-xs uppercase tracking-wider">Key GATE Exam Takeaways:</h4>
            <ul class="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li *ngFor="let point of explanationResult.keyTakeaways">{{ point }}</li>
            </ul>
          </div>

          <!-- Sample GATE Questions -->
          <div class="space-y-2">
            <h4 class="font-bold text-indigo-400 text-xs uppercase tracking-wider">Sample Practice Questions:</h4>
            <div class="space-y-2">
              <div *ngFor="let q of explanationResult.sampleQuestions" class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                {{ q }}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AiAssistantComponent implements OnInit {
  activeTab: 'PLANNER' | 'EXPLAINER' = 'PLANNER';
  userPrompt = '';
  topicQuery = '';
  isLoading = false;

  proposedPlan: AiPlanResponse | null = null;
  explanationResult: TopicExplainResponse | null = null;

  samplePrompts = [
    'Create my study plan for the next 7 days.',
    'I can study only 1 hour today.',
    'I missed today\'s Probability session. Reschedule it.',
    'I am weak in Linear Algebra. Give it more time.',
    'Create a revision plan for everything I studied this month.'
  ];

  constructor(private aiService: AiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['topic']) {
        this.activeTab = 'EXPLAINER';
        this.topicQuery = params['topic'];
        this.explainTopic();
      }
    });
  }

  submitPrompt(): void {
    if (!this.userPrompt.trim()) return;
    this.isLoading = true;

    this.aiService.modifySchedule({ prompt: this.userPrompt }).subscribe({
      next: (res) => {
        this.proposedPlan = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyProposedPlan(): void {
    if (!this.proposedPlan) return;
    this.aiService.applyProposal(this.proposedPlan.proposedEvents).subscribe(() => {
      alert('Proposed study schedule successfully applied to your calendar!');
      this.proposedPlan = null;
    });
  }

  explainTopic(): void {
    this.aiService.explainTopic({ question: this.topicQuery || 'Bayes Theorem' }).subscribe(res => {
      this.explanationResult = res;
    });
  }
}
