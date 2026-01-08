

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSlideToggleModule, FormsModule, NavbarComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  name: string = '';
  username: string = '';
  password: string = '';
  newPassword: string = '';
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  passwordChangeSuccess: boolean = false;
  passwordChangeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    const user = await this.getUser();
    if (user) {
      this.name = user.name;
      this.username = user.username;
      this.password = user.password;
    }
  }

  async getUser() {
    const value = localStorage.getItem('user');
    return value ? JSON.parse(value) : null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  async changePassword() {
    if (!this.newPassword || this.newPassword.length < 4) {
      this.passwordChangeError = 'Password must be at least 4 characters.';
      this.passwordChangeSuccess = false;
      return;
    }
    const user = await this.getUser();
    if (user) {
      user.password = this.newPassword;
      localStorage.setItem('user', JSON.stringify(user));
      this.password = this.newPassword;
      this.newPassword = '';
      this.passwordChangeSuccess = true;
      this.passwordChangeError = '';
    } else {
      this.passwordChangeError = 'User not found.';
      this.passwordChangeSuccess = false;
    }
  }

  async logout() {
    await this.authService.logout();
  }
}
