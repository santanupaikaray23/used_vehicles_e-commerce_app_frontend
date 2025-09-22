import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Storage } from '../../services/storage';

@Component({
  selector: 'app-admin-layout-component',
  standalone: false,
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.css'
})
export class AdminLayoutComponent {
  isHandset$!: Observable<boolean>;
  userRole: string = '';
constructor(private breakpointObserver: BreakpointObserver,private storage: Storage) {}
ngOnInit(): void {
  this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );
 const userInfo = this.storage.getItem('userInfo');
    console.log('User Info:', userInfo);
}
}
