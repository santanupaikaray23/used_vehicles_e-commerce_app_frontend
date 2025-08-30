import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutModule } from './main-layout-module';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from '../signup/signup';

const routes: Routes = [
    {
    path: '',
    component: MainLayoutModule,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'signup',
        component: Signup
      }
  
],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
