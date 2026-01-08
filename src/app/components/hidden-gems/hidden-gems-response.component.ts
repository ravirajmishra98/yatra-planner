
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { UnsplashService } from '../../services/unsplash.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hidden-gems-response',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatIconModule, HttpClientModule],
  templateUrl: './hidden-gems-response.component.html',
  styleUrls: ['./hidden-gems-response.component.css']
})
export class HiddenGemsResponseComponent implements OnInit {
  getStaticMapUrl(g: any): string {
    const q = encodeURIComponent(((g.name || '') + ' ' + (g.location || this.city || '')));
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
  responseText = '';
  city = '';
  aiResponse: any = null;
  suggestions: any[] = [];
  gemImages: { [key: number]: string } = {};
  error: string | null = null;

  constructor(private router: Router, private unsplash: UnsplashService) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['responseText']) {
      this.responseText = nav.extras.state['responseText'];
      this.city = nav.extras.state['city'] || '';
    } else if (window.history.state && window.history.state['responseText']) {
      this.responseText = window.history.state['responseText'];
      this.city = window.history.state['city'] || '';
    }
  }

  ngOnInit() {
    if (this.responseText) {
      let jsonText = this.responseText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
      }
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
        } else if (Array.isArray(this.aiResponse.gems)) {
          this.suggestions = this.aiResponse.gems;
        } else {
          this.suggestions = [];
        }
        // Fetch Unsplash images for each gem
        this.suggestions.forEach((g, i) => {
          const query = `${g.name} ${this.city} travel`;
          this.unsplash.searchImages(query, 1).subscribe({
            next: (res) => {
              const img = res?.results?.[0]?.urls?.regular || res?.results?.[0]?.urls?.small;
              if (img) this.gemImages[i] = img;
            },
            error: () => {}
          });
        });
      } catch {
        this.error = 'Sorry, could not parse hidden gems.';
        this.aiResponse = null;
        this.suggestions = [];
      }
    } else {
      this.error = 'No response received.';
      this.suggestions = [];
    }
  }

  goBack() {
    this.router.navigate(['/hidden-gems']);
  }
}
