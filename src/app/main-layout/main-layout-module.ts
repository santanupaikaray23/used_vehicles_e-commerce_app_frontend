import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing-module';
import { UserHeader } from './user-header/user-header';
import { Dashboard } from './dashboard/dashboard';
import { Components } from './components/components';


@NgModule({
  declarations: [
    UserHeader,
    Dashboard,
    Components
  ],
  imports: [
    CommonModule,
    MainLayoutRoutingModule
  ]
})
export class MainLayoutModule { }
