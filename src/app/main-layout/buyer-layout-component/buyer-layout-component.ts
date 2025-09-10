import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-buyer-layout-component',
  standalone: false,
  templateUrl: './buyer-layout-component.html',
  styleUrl: './buyer-layout-component.css'
})
export class BuyerLayoutComponent {
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
