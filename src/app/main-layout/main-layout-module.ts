import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutRoutingModule } from './main-layout-routing-module';
import { UserHeader } from './user-header/user-header';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from '../signup/signup';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatCard } from '@angular/material/card';

@NgModule({
  declarations: [
    UserHeader,
    Dashboard,
    Signup,
   

    
  ],
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
     MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCard
  ]
})
export class MainLayoutModule { }
