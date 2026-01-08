import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private SESSION_KEY = 'session';
  private USER_KEY = 'user';

  constructor(private router: Router) {}

  async signup(name: string, username: string, password: string): Promise<boolean> {
    const user = { name, username, password };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, 'true');
    return true;
  }

  async login(username: string, password: string): Promise<boolean> {
    const value = localStorage.getItem(this.USER_KEY);
    if (!value) return false;
    const user = JSON.parse(value);
    if (user.username === username && user.password === password) {
      localStorage.setItem(this.SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  async logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const value = localStorage.getItem(this.SESSION_KEY);
    return value === 'true';
  }
}
