import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {
  categories = [
    {
      name: 'Special Trips',
      color: '#1976d2',
      trips: [
        {
          title: 'Golden Triangle (Delhi, Agra, Jaipur)',
          from: 'Delhi',
          to: 'Jaipur',
          dateRangeStart: '2025-08-01',
          dateRangeEnd: '2025-08-05',
          tripType: 'Group',
          interests: ['Famous Attractions', 'Food', 'Shopping'],
          budget: 25000,
          accommodation: 'Hotel',
          icon: 'account_balance',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Taj_Mahal_in_March_2004.jpg'
        },
        {
          title: 'Kerala Backwaters',
          from: 'Bangalore',
          to: 'Kochi',
          dateRangeStart: '2025-11-01',
          dateRangeEnd: '2025-11-07',
          tripType: 'Family',
          interests: ['Nature', 'Food', 'Famous Attractions'],
          budget: 35000,
          accommodation: 'Homestay',
          icon: 'waves',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Kerala_backwaters%2C_Canal%2C_Palm_trees%2C_India.jpg'
        }
      ]
    },
    {
      name: 'Solo Trips',
      color: '#ff4081',
      trips: [
        {
          title: 'Himalayan Adventure',
          from: 'Delhi',
          to: 'Manali',
          dateRangeStart: '2025-10-05',
          dateRangeEnd: '2025-10-12',
          tripType: 'Solo',
          interests: ['Adventure', 'Nature'],
          budget: 20000,
          accommodation: 'Hostel',
          icon: 'terrain',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Himalayan_Adventure_Intl_Treks.jpg'
        },
        {
          title: 'Spiritual Varanasi',
          from: 'Delhi',
          to: 'Varanasi',
          dateRangeStart: '2025-09-15',
          dateRangeEnd: '2025-09-18',
          tripType: 'Solo',
          interests: ['Religious', 'Famous Attractions'],
          budget: 12000,
          accommodation: 'Hotel',
          icon: 'self_improvement',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Varanasi_Munshi_Ghat3.jpg'
        }
      ]
    },
    {
      name: 'Adventure',
      color: '#43a047',
      trips: [
        {
          title: 'Rishikesh Rafting',
          from: 'Delhi',
          to: 'Rishikesh',
          dateRangeStart: '2025-08-20',
          dateRangeEnd: '2025-08-23',
          tripType: 'Group',
          interests: ['Adventure', 'Nature'],
          budget: 15000,
          accommodation: 'Camping',
          icon: 'kayaking',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Rafting_in_rishikesh.jpg'
        },
        {
          title: 'Leh-Ladakh Road Trip',
          from: 'Delhi',
          to: 'Leh',
          dateRangeStart: '2025-09-01',
          dateRangeEnd: '2025-09-10',
          tripType: 'Group',
          interests: ['Adventure', 'Nature'],
          budget: 40000,
          accommodation: 'Hostel',
          icon: 'directions_car',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Leh-Manali_Highway%2C_Ladakh%2C_India.jpg'
        }
      ]
    },
    {
      name: 'Religious',
      color: '#ffb300',
      trips: [
        {
          title: 'Char Dham Yatra',
          from: 'Delhi',
          to: 'Yamunotri',
          dateRangeStart: '2025-05-10',
          dateRangeEnd: '2025-05-20',
          tripType: 'Group',
          interests: ['Religious', 'Nature'],
          budget: 35000,
          accommodation: 'Hotel',
          icon: 'temple_hindu',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/..._Sri_Badrinath_%287756770132%29.jpg'
        },
        {
          title: 'Vaishno Devi',
          from: 'Delhi',
          to: 'Katra',
          dateRangeStart: '2025-08-12',
          dateRangeEnd: '2025-08-15',
          tripType: 'Family',
          interests: ['Religious', 'Nature'],
          budget: 18000,
          accommodation: 'Hotel',
          icon: 'hiking',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Vaishno_Devi_Bhavan.jpg'
        }
      ]
    },
    {
      name: 'Honeymoon',
      color: '#e040fb',
      trips: [
        {
          title: 'Goa Beach Getaway',
          from: 'Mumbai',
          to: 'Goa',
          dateRangeStart: '2025-09-10',
          dateRangeEnd: '2025-09-15',
          tripType: 'Couple',
          interests: ['Nature', 'Nightlife', 'Food'],
          budget: 30000,
          accommodation: 'Resort',
          icon: 'beach_access',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Vagator_Beach%2C_Goa%2C_India.jpg'
        },
        {
          title: 'Shimla-Manali Romance',
          from: 'Delhi',
          to: 'Shimla',
          dateRangeStart: '2025-12-01',
          dateRangeEnd: '2025-12-07',
          tripType: 'Couple',
          interests: ['Nature', 'Famous Attractions'],
          budget: 32000,
          accommodation: 'Hotel',
          icon: 'favorite',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Shimla_by_MyAsus.jpg'
        }
      ]
    }
  ];
  loadingCategoryIdx: number | null = null;
  loadingTripIdx: number | null = null;

  allTrips: any[] = [];

  constructor(private router: Router) {
    // Flatten all trips from all categories into one array
    this.allTrips = this.categories.flatMap(cat => cat.trips.map(trip => ({ ...trip, category: cat.name, color: cat.color })));
  }

  getDays(start: string, end: string): number {
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }

  async exploreTrip(dest: any, catIdx: number, tripIdx: number) {
    this.loadingCategoryIdx = catIdx;
    this.loadingTripIdx = tripIdx;
    const prompt = this.buildPrompt(dest);
    try {
      const response = await this.callGemini(prompt);
      this.loadingCategoryIdx = null;
      this.loadingTripIdx = null;
      this.router.navigate(['/response'], { state: { responseText: response } });
    } catch (e) {
      this.loadingCategoryIdx = null;
      this.loadingTripIdx = null;
      this.router.navigate(['/response'], { state: { responseText: 'Sorry, there was an error generating your itinerary.' } });
    }
  }

  buildPrompt(form: any): string {
    return `You are a professional travel planner. Generate a complete, detailed, day-wise travel itinerary for a trip with the following details:\n\n` +
      `From: ${form.from}\n` +
      `To: ${form.to}\n` +
      `Dates: ${form.dateRangeStart} to ${form.dateRangeEnd}\n` +
      `Budget: ${form.budget} INR\n` +
      `Trip Type: ${form.tripType}\n` +
      `Accommodation: ${form.accommodation}\n` +
      `Interests: ${(form.interests || []).join(', ')}\n` +
      `\nPlease return the itinerary as a JSON object with this structure:\n` +
      `{"days": [{"title": string, "date": string, "activities": [{"time": string, "title": string, "description": string, "image": string}] }], "budget": [string], "tips": [string]}\n` +
      `Each activity should have a relevant open-source image URL (Unsplash or similar). Do not include any text outside the JSON.`;
  }

  async callGemini(prompt: string): Promise<string> {
    const apiKey = 'AIzaSyBig10GV-ffFkNjBdKqAUi5lvPGa8k58c8';
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text || 'No response.';
    if (typeof text === 'function') {
      text = text();
    }
    return typeof text === 'string' ? text : 'No response.';
  }

}
