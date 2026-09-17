import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SyllabusService } from '../../core/services/syllabus.service';
import { Subject, Topic, MasteryLevel } from '../../core/models/syllabus.model';

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      <!-- Syllabus Header -->
      <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">GATE DA 2027 Syllabus & Progress Tracker</h1>
          <p class="text-xs text-slate-400">Track concept mastery across all 10 core subject modules.</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-400">Overall Progress:</span>
          <span class="text-lg font-bold text-cyan-400">0.0%</span>
        </div>
      </div>

      <!-- Subject Accordion List -->
      <div class="space-y-4">
        <div *ngFor="let subject of subjects" class="glass-card rounded-2xl overflow-hidden border-slate-800">
          
          <!-- Subject Title Bar -->
          <div (click)="toggleSubject(subject.id)" class="p-5 bg-slate-900/60 hover:bg-slate-900/80 cursor-pointer flex items-center justify-between transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-xl">📚</span>
              <div>
                <h3 class="font-bold text-white text-base">{{ subject.name }}</h3>
                <p class="text-xs text-slate-400">{{ subject.topics.length }} Key Topics</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-slate-400 text-xs font-semibold">{{ openSubjectId === subject.id ? '▼' : '▶' }}</span>
            </div>
          </div>

          <!-- Topics List -->
          <div *ngIf="openSubjectId === subject.id" class="p-5 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
            <div *ngFor="let topic of subject.topics" class="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-white text-sm">{{ topic.name }}</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">Weightage: {{ topic.weightageRating }}/5 ⭐</span>
                  </div>
                  <!-- Subtopic pills -->
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span *ngFor="let sub of topic.subtopics" class="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                      {{ sub.name }}
                    </span>
                  </div>
                </div>

                <!-- Topic Actions & Mastery Status -->
                <div class="flex items-center gap-3 self-start sm:self-center">
                  <select [ngModel]="getTopicLevel(topic.id)" (ngModelChange)="updateTopicLevel(topic.id, $event)" 
                          class="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white">
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="LEARNING">Learning</option>
                    <option value="PRACTICED">Practiced</option>
                    <option value="REVISED">Revised</option>
                    <option value="STRONG">Strong Mastery</option>
                  </select>

                  <button (click)="askAiAboutTopic(topic)" class="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-all">
                    <span>✨ Ask AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class SyllabusComponent implements OnInit {
  subjects: Subject[] = [];
  openSubjectId: string | null = null;
  progressMap: { [topicId: string]: MasteryLevel } = {};

  constructor(private syllabusService: SyllabusService, private router: Router) {}

  ngOnInit(): void {
    this.syllabusService.getSyllabus().subscribe(data => {
      this.subjects = data;
      if (this.subjects.length > 0) {
        this.openSubjectId = this.subjects[0].id;
      }
    });
  }

  toggleSubject(id: string): void {
    this.openSubjectId = this.openSubjectId === id ? null : id;
  }

  getTopicLevel(topicId: string): MasteryLevel {
    return this.progressMap[topicId] || 'NOT_STARTED';
  }

  updateTopicLevel(topicId: string, level: MasteryLevel): void {
    this.progressMap[topicId] = level;
    this.syllabusService.updateProgress(topicId, level, level === 'STRONG' ? 100 : 50).subscribe();
  }

  askAiAboutTopic(topic: Topic): void {
    this.router.navigate(['/ai-assistant'], { queryParams: { topic: topic.name } });
  }
}
