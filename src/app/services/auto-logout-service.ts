import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private timeoutId: any;
  private readonly TIMEOUT = 30 * 60 * 1000; // 5 minutes
  private isBrowser: boolean;

  constructor(
    private authService: Auth,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.setupActivityListeners();
    }
  }

  private setupActivityListeners() {
    if (!this.isBrowser) return;

    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart']
      .forEach(event =>
        window.addEventListener(event, () => this.resetTimer())
      );

    this.resetTimer();
  }

  private resetTimer() {
    if (!this.isBrowser) return;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => this.authService.logout());
      }, this.TIMEOUT);
    });
  }
}
  

