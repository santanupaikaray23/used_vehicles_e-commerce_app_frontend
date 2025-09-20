import { Component, signal } from '@angular/core';
import { AutoLogoutService } from './services/auto-logout-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  constructor(private autoLogoutService: AutoLogoutService) {}
  protected readonly title = signal('used_vehicles_e-commerce_app');
    isInitializing = true;
}
