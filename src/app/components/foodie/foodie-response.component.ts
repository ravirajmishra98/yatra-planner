
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Import your AI service here

import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-foodie-response',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatIconModule],
  templateUrl: './foodie-response.component.html',
  styleUrls: ['./foodie-response.component.css']
})
export class FoodieResponseComponent implements OnInit {
  goBack() {
    this.router.navigate(['/foodie']);
  }
  responseText = '';
  aiResponse: any = null;
  suggestions: any[] = [];
  error: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['responseText']) {
      this.responseText = nav.extras.state['responseText'];
    } else if (window.history.state && window.history.state['responseText']) {
      this.responseText = window.history.state['responseText'];
    }
  }

  ngOnInit() {
    if (this.responseText) {
      let jsonText = this.responseText.trim();
      // Remove code block markers if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      // Try to extract the first JSON object or array
      let match = jsonText.match(/({[\s\S]*})|(\[[\s\S]*\])/);
      if (match) {
        jsonText = match[0];
      }
      try {
        this.aiResponse = JSON.parse(jsonText);
        if (Array.isArray(this.aiResponse)) {
          this.suggestions = this.aiResponse;
        } else if (this.aiResponse && Array.isArray(this.aiResponse.suggestions)) {
          this.suggestions = this.aiResponse.suggestions;
        } else if (Array.isArray(this.aiResponse.results)) {
          this.suggestions = this.aiResponse.results;
        } else {
          this.suggestions = [];
        }
      } catch {
        this.error = 'Sorry, could not parse food suggestions.';
        this.aiResponse = null;
        this.suggestions = [];
      }
    } else {
      this.error = 'No response received.';
      this.suggestions = [];
    }
  }
// Add this method to your component class
//
  getStaticMapUrl(s: any): string {
    const q = encodeURIComponent(((s.name || '') + ' ' + (s.location || '')));
    return `https://maps.googleapis.com/maps/api/staticmap?center=${q}&zoom=15&size=320x120&markers=color:red|${q}&key=AIzaSyAaR8-UW5uLNDOKCtqGGD_rKDri3iw0Y5k`;
  }

  getMapsLink(name: string, location: string): string {
    return 'https://www.google.com/maps/search/' + encodeURIComponent((name || '') + ' ' + (location || ''));
  }
  onMapImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
