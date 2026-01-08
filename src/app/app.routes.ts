

import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TripDataPageComponent } from './components/trip-data-page';
import { ExploreComponent } from './components/explore/explore.component';
import { ResponsePageComponent } from './components/response/response-page.component';
import { ProfilePageComponent } from './components/profile/profile-page.component';
import { FoodieComponent } from './components/foodie/foodie.component';
import { FoodieResponseComponent } from './components/foodie/foodie-response.component';
import { HiddenGemsComponent } from './components/hidden-gems/hidden-gems.component';
import { HiddenGemsResponseComponent } from './components/hidden-gems/hidden-gems-response.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'trip-data', component: TripDataPageComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'auth-callback', component: HomeComponent },
  { path: 'response', component: ResponsePageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'foodie', component: FoodieComponent },
  { path: 'foodie-response', component: FoodieResponseComponent },
  { path: 'hidden-gems', component: HiddenGemsComponent },
  { path: 'hidden-gems-response', component: HiddenGemsResponseComponent }
];
