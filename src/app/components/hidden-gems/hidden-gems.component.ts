import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CITY_OPTIONS } from '../city-options';

import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-hidden-gems',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './hidden-gems.component.html',
  styleUrls: ['./hidden-gems.component.css']
})
export class HiddenGemsComponent {
  gemsForm: FormGroup;
  cities = CITY_OPTIONS;
  loadingAI = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.gemsForm = this.fb.group({
      city: ['', Validators.required]
    });
  }

  async submit() {
    if (this.gemsForm.valid) {
      this.loadingAI = true;
      const { city } = this.gemsForm.value;
      const prompt = `List some hidden gems and offbeat places to visit in ${city}. Return a JSON array of suggestions with name, description, and location (address or area, if available).`;
      try {
        const response = await this.callGemini(prompt);
        this.loadingAI = false;
        this.router.navigate(['/hidden-gems-response'], { state: { responseText: response, city } });
      } catch (e) {
        this.loadingAI = false;
        this.router.navigate(['/hidden-gems-response'], { state: { responseText: 'Sorry, there was an error fetching hidden gems.' } });
      }
    }
  }

  async callGemini(prompt: string): Promise<string> {
    const apiKey = 'AIzaSyBig10GV-ffFkNjBdKqAUi5lvPGa8k58c8';
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text || 'No response.';
    if (typeof text === 'function') text = text();
    return typeof text === 'string' ? text : 'No response.';
  }
}
