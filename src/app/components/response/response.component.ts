import { Component, Input } from '@angular/core';
import { responseMaterialModules } from './response.material';

@Component({
  selector: 'app-response',
  standalone: true,
  imports: [...responseMaterialModules],
  template: `
    <div class="response-overlay" *ngIf="loading">
      <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
      <span>Generating your itinerary...</span>
    </div>
    <mat-card class="response-card">
      <div *ngIf="response && !loading">
        <pre style="white-space: pre-wrap;">{{ response }}</pre>
      </div>
    </mat-card>
  `,
  styles: [`
    .response-card {  }
    pre { font-size: 1.08rem; color: #333; }
    .response-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.7);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: #283593;
    }
    mat-progress-spinner { margin-bottom: 1.2rem; }
  `]
})
export class ResponseComponent {
  @Input() response: string | null = null;
  @Input() loading: boolean = false;
 

}
