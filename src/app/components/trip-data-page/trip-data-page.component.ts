
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NavbarComponent } from '../navbar';
import { CITY_OPTIONS } from '../city-options';
import { materialModules } from './trip-data-page.material';
import { ResponseComponent } from '../response';

@Component({
  selector: 'app-trip-data-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ...materialModules, ResponseComponent],
  templateUrl: './trip-data-page.component.html',
  styleUrls: ['./trip-data-page.component.css']
})
export class TripDataPageComponent implements OnInit {
  tripForm: FormGroup;
  cityOptions: string[] = CITY_OPTIONS;
  filteredCitiesFrom: string[] = [];
  filteredCitiesTo: string[] = [];
  interests: string[] = ['Famous Attractions', 'Shopping', 'Religious', 'Nature', 'Adventure', 'Food', 'Nightlife'];
  selectedInterests: string[] = [];
  tripTypes: string[] = ['Solo', 'Group', 'Family', 'Couple', 'Business'];
  accommodationStyles: string[] = ['Hotel', 'Hostel', 'Resort', 'Homestay', 'Camping', 'Apartment'];
  selectedCitiesFrom: string[] = [];
  selectedCitiesTo: string[] = [];
  aiResponse: string | null = null;
  loadingAI = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.tripForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      dateRangeStart: ['', Validators.required],
      dateRangeEnd: ['', Validators.required],
      tripType: ['', Validators.required],
      interests: [[]],
      budget: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      accommodation: ['', Validators.required]
    });
    // Demo: major Indian and global cities. Replace with API for production.
    this.cityOptions = [
      // Major Indian cities
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
      'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
      'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi',
      'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
      'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli–Dharwad',
      'Bareilly', 'Mysore', 'Moradabad', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar',
      'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai',
      'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
      'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
      'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Kurnool', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
      'Jalgaon', 'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Bokaro', 'South Dumdum',
      // Major world cities
      'London', 'Paris', 'New York', 'Tokyo', 'Sydney', 'Dubai', 'Singapore', 'Bangkok', 'Hong Kong', 'Toronto',
      'Los Angeles', 'Chicago', 'San Francisco', 'Berlin', 'Rome', 'Barcelona', 'Istanbul', 'Moscow', 'Beijing', 'Shanghai',
      'Seoul', 'Kuala Lumpur', 'Mexico City', 'Sao Paulo', 'Buenos Aires', 'Cape Town', 'Johannesburg', 'Cairo', 'Riyadh', 'Jeddah',
      'Abu Dhabi', 'Doha', 'Jakarta', 'Manila', 'Melbourne', 'Auckland', 'Wellington', 'Zurich', 'Geneva', 'Amsterdam',
      'Brussels', 'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Lisbon', 'Dublin', 'Edinburgh', 'Venice', 'Florence',
      'Munich', 'Frankfurt', 'Hamburg', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Athens', 'Tel Aviv', 'Jerusalem',
      'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Perth', 'Brisbane', 'Adelaide', 'Doha', 'Riyadh', 'Kuwait City',
      'Tehran', 'Baghdad', 'Karachi', 'Lahore', 'Islamabad', 'Colombo', 'Kathmandu', 'Dhaka', 'Yangon', 'Hanoi', 'Ho Chi Minh City',
      'Phnom Penh', 'Bangkok', 'Kuala Lumpur', 'Singapore', 'Jakarta', 'Manila', 'Hanoi', 'Taipei', 'Tokyo', 'Osaka',
      'Kyoto', 'Nagoya', 'Sapporo', 'Fukuoka', 'Sendai', 'Yokohama', 'Kobe', 'Shenzhen', 'Guangzhou', 'Chengdu',
      'Wuhan', 'Chongqing', 'Nanjing', 'Tianjin', 'Shenyang', 'Harbin', 'Xi’an', 'Suzhou', 'Hangzhou', 'Qingdao'
    ];
    this.filteredCitiesFrom = this.cityOptions;
    this.filteredCitiesTo = this.cityOptions;
  }

  ngOnInit() {
    this.tripForm.get('from')?.valueChanges.subscribe((value: string) => {
      this.filteredCitiesFrom = this.cityOptions.filter(city => city.toLowerCase().includes((value || '').toLowerCase()));
    });
    this.tripForm.get('to')?.valueChanges.subscribe((value: string) => {
      this.filteredCitiesTo = this.cityOptions.filter(city => city.toLowerCase().includes((value || '').toLowerCase()));
    });
  }


  addCityFrom(city: string) {
    this.tripForm.patchValue({ from: city });
  }

  addCityTo(city: string) {
    this.tripForm.patchValue({ to: city });
  }

  // Deprecated city chips logic removed for new From/To UX

  addInterest(interest: string) {
    if (!this.selectedInterests.includes(interest)) {
      this.selectedInterests.push(interest);
      this.tripForm.patchValue({ interests: this.selectedInterests });
    }
  }

  removeInterest(interest: string) {
    this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
    this.tripForm.patchValue({ interests: this.selectedInterests });
  }

  async generateItinerary() {
    const from = this.tripForm.get('from')?.value?.trim();
    const to = this.tripForm.get('to')?.value?.trim();
    if (from && to && from.toLowerCase() === to.toLowerCase()) {
      this.tripForm.get('to')?.setErrors({ sameCity: true });
      this.tripForm.get('from')?.setErrors({ sameCity: true });
      return;
    } else {
      this.tripForm.get('to')?.setErrors(null);
      this.tripForm.get('from')?.setErrors(null);
    }
    if (this.tripForm.valid) {
      this.loadingAI = true;
      this.aiResponse = null;
      const form = this.tripForm.value;
      const prompt = this.buildPrompt(form);
      try {
        const response = await this.callGemini(prompt);
        this.loadingAI = false;
        // Navigate to response page with state
        this.router.navigate(['/response'], { state: { responseText: response } });
      } catch (e) {
        this.loadingAI = false;
        this.router.navigate(['/response'], { state: { responseText: 'Sorry, there was an error generating your itinerary.' } });
      }
    } else {
      this.tripForm.markAllAsTouched();
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

  // Gemini (PaLM/Generative Language API) call
  async callGemini(prompt: string): Promise<string> {
    // Use GoogleGenerativeAI SDK for Gemini with dynamic import for ESM compatibility
    const apiKey = 'AIzaSyBig10GV-ffFkNjBdKqAUi5lvPGa8k58c8';
    // Dynamically import the SDK to avoid Angular/TypeScript ESM issues
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    // SDK returns response in a different structure
    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text || 'No response.';
    if (typeof text === 'function') {
      text = text();
    }
    return typeof text === 'string' ? text : 'No response.';
  }
}
