import { Component, OnInit } from '@angular/core';
import { UnsplashService } from '../../services/unsplash.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResponseComponent } from './response.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-response-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent,
    HttpClientModule,
    MatExpansionModule
    // Add MatExpansionModule for accordions
  ],
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponsePageComponent implements OnInit {
  responseText: string | null = null;
  parsedItinerary: any = null;
  dayImages: string[] = [];
 getActivityIcon(type: string): string {
  switch (type) {
    case 'food': return 'restaurant';
    case 'sightseeing': return 'visibility';
    case 'shopping': return 'shopping_bag';
    case 'travel': return 'directions_bus';
    case 'adventure': return 'terrain';
    default: return 'place';
  }
}
  goBack() {
    this.router.navigate(['/trip-data']);
  }

  constructor(private router: Router, private unsplash: UnsplashService) {}

  ngOnInit() {
    // Read response from router state (works on navigation)
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['responseText']) {
      this.responseText = nav.extras.state['responseText'];
    } else if (window.history.state && window.history.state['responseText']) {
      // Fallback for page reloads or direct access
      this.responseText = window.history.state['responseText'];
    } else {
      this.responseText = null;
    }
    if (this.responseText) {
      let jsonText = this.responseText.trim();
      // Remove code block markers if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      try {
        this.parsedItinerary = JSON.parse(jsonText);
        this.loadDayImages();
      } catch {
        this.parsedItinerary = null;
      }
    }
  }

  loadDayImages() {
    if (!this.parsedItinerary?.days) return;
    this.dayImages = new Array(this.parsedItinerary.days.length).fill('');
    this.parsedItinerary.days.forEach((day: any, idx: number) => {
      const query = day.title || 'travel';
      this.unsplash.searchImages(query, 1).subscribe((res: any) => {
        if (res.results && res.results.length > 0) {
          this.dayImages[idx] = res.results[0].urls.regular;
        } else {
          this.dayImages[idx] = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
        }
      }, _err => {
        this.dayImages[idx] = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
      });
    });
  }

  // Parse the AI response into structured data for beautiful rendering
  parseItinerary(text: string) {
    // This is a simple parser for the AI's markdown-like response
    // In production, use a robust markdown parser or custom logic
    const days: any[] = [];
    const budget: string[] = [];
    const tips: string[] = [];
    let currentDay: any = null;
    let section: 'days' | 'budget' | 'tips' | null = null;
    const lines = text.split(/\r?\n/);
    for (let line of lines) {
      line = line.trim();
      if (/^\*\*Day/.test(line) || /^##? /.test(line)) {
        if (currentDay) days.push(currentDay);
        currentDay = { title: line.replace(/^\*\*|\*\*$/g, '').replace(/^#+ /, ''), items: [], image: this.getImageForDay(line), date: '' };
        section = 'days';
        // Try to extract date
        const dateMatch = line.match(/\(([^)]+)\)/);
        if (dateMatch) currentDay.date = dateMatch[1];
      } else if (/^\* /.test(line) && section === 'days' && currentDay) {
        // List item for day
        const timeMatch = line.match(/\*\*([\w\s:()]+)\*\*:/);
        let time = '';
        let textItem = line.replace(/^\* /, '');
        if (timeMatch) {
          time = timeMatch[1];
          textItem = textItem.replace(/\*\*[\w\s:()]+\*\*:/, '').trim();
        }
        currentDay.items.push({ time, text: textItem });
      } else if (/^\* /.test(line) && section === 'budget') {
        budget.push(line.replace(/^\* /, ''));
      } else if (/^\* /.test(line) && section === 'tips') {
        tips.push(line.replace(/^\* /, ''));
      } else if (/^\*\*Budget Breakdown/.test(line)) {
        if (currentDay) days.push(currentDay);
        section = 'budget';
      } else if (/^\*\*Tips for/.test(line)) {
        section = 'tips';
      }
    }
    if (currentDay) days.push(currentDay);
    return { days, budget, tips };
  }

  // Get a relevant open-source image for each day (Unsplash)
  getImageForDay(title: string): string {
    const keywords = [
      'Delhi', 'Old Delhi', 'Red Fort', 'Lutyens', 'Akshardham', 'Connaught', 'Dilli Haat', 'Lajpat Nagar', 'Karol Bagh', 'India Gate', 'Humayun', 'Temple', 'Market', 'Park', 'Airport', 'Travel', 'Solo Trip', 'Culture', 'Shopping', 'Food', 'Arrival', 'Departure'
    ];
    for (const k of keywords) {
      if (title.toLowerCase().includes(k.toLowerCase())) {
        return `https://source.unsplash.com/600x300/?${encodeURIComponent(k + ',Delhi,India,travel')}`;
      }
    }
    return 'https://source.unsplash.com/600x300/?Delhi,India,travel';
  }
}
