import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { MainLayoutComponent } from './main-layout.component';
import { Authguard } from '../services/authguard';
import { Profile } from './profile/profile';
// import { Profile } from './profile/profile';


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
      {
       path: 'profile',
       component: Profile,
       canActivate: [Authguard]
      }
      ,
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
