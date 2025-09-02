import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MainLayoutModule } from './main-layout-module';
import { Dashboard } from './dashboard/dashboard';
import { About } from './about/about';
import { Contact } from './contact/contact';
// import { SideNav } from './shareable/side-nav/side-nav';
import { MainLayoutComponent } from './main-layout.component';
import { Authguard } from '../services/authguard';


const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path:'',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [Authguard]
      },
      {
       path: 'about',
       component: About,
       canActivate: [Authguard]
      },
    {
       path: 'contact',
       component: Contact,
       canActivate: [Authguard]
       }
],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
