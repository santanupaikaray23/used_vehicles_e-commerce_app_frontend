import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css'
})
export class SideNav {
 isHandset$!: Observable<boolean>;
 userRole: string = '';
constructor(private breakpointObserver: BreakpointObserver) {}
ngOnInit(): void {
  this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.userRole = user.role?.toLowerCase() || 'user'; 
}
}
