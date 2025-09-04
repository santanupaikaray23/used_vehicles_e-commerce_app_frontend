import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { MainLayoutComponent } from './main-layout.component';
import { Authguard } from '../services/authguard';

import { Profile } from './profile/profile';
// import { Admindashboard } from './admindashboard/admindashboard';
// import { Buyerdashboard } from './buyerdashboard/buyerdashboard';
// import { Userdashboard } from './userdashboard/userdashboard';
// import { Sellerdashboard } from './sellerdashboard/sellerdashboard';

const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path:'',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
       { path: 'admin', 
        component: Profile , 
        canActivate: [Authguard]
      },
        { path: 'buyer', 
        component: Profile, 
        canActivate: [Authguard]
      },
      {
        path: 'user',
        component: Profile,
        canActivate: [Authguard]
      },
      {
        path: 'seller',
        component: Profile,
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
       },
],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
