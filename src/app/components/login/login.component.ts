import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  accountCreated = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    // Check for accountCreated query param
    const url = new URL(window.location.href);
    if (url.searchParams.get('accountCreated')) {
      this.accountCreated = true;
    }
  }

  async login() {
    if (!this.username || !this.password) {
      this.error = 'All fields are required.';
      return;
    }
    const success = await this.auth.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/explore']);
    } else {
      this.error = 'Invalid credentials.';
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
