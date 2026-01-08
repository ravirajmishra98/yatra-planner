import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { CITY_OPTIONS } from '../city-options';

@Component({
  selector: 'app-foodie',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './foodie.component.html',
  styleUrls: ['./foodie.component.css']
})
export class FoodieComponent {
  foodieForm: FormGroup;
  foodTypes = ['Street Food', 'Fine Dining', 'Cafes', 'Local Cuisine', 'Desserts', 'Snacks'];
  vegOptions = ['Veg', 'Non-Veg', 'Both'];
  cities = CITY_OPTIONS;
  loadingAI = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.foodieForm = this.fb.group({
      city: ['', Validators.required],
      foodType: ['', Validators.required],
      veg: ['', Validators.required]
    });
  }

  async submit() {
    if (this.foodieForm.valid) {
      this.loadingAI = true;
      const { city, foodType, veg } = this.foodieForm.value;
      const prompt = `Suggest the best food places and dishes in ${city} for ${foodType} (${veg}). Return a JSON array of suggestions with name, type, dish, description, and location (address or area, if available).`;
      try {
        const response = await this.callGemini(prompt);
        this.loadingAI = false;
        this.router.navigate(['/foodie-response'], { state: { responseText: response } });
      } catch (e) {
        this.loadingAI = false;
        this.router.navigate(['/foodie-response'], { state: { responseText: 'Sorry, there was an error fetching food suggestions.' } });
      }
    }
  }

  async callGemini(prompt: string): Promise<string> {
    const apiKey = 'AIzaSyBig10GV-ffFkNjBdKqAUi5lvPGa8k58c8';
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text || 'No response.';
    if (typeof text === 'function') text = text();
    return typeof text === 'string' ? text : 'No response.';
  }
}
