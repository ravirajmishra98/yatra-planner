import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  username = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  async signup() {
    if (!this.name || !this.username || !this.password) {
      this.error = 'All fields are required.';
      return;
    }
    await this.auth.signup(this.name, this.username, this.password);
    this.router.navigate(['/login'], { queryParams: { accountCreated: '1' } });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
