import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { MainLayoutComponent } from './main-layout.component';
// import { Authguard } from '../services/authguard';
// import { BuyerLayoutComponent } from './buyer-layout-component/buyer-layout-component';
// import { Profile } from './profile/profile';
import { Buyerdashboard } from './buyerdashboard/buyerdashboard';
// import { Userdashboard } from './userdashboard/userdashboard';
import { Sellerdashboard } from './sellerdashboard/sellerdashboard';
import { SellerLayoutComponent } from './seller-layout-component/seller-layout-component';
import { BuyerLayoutComponent } from './buyer-layout-component/buyer-layout-component';
import { AdminLayoutComponent } from './admin-layout-component/admin-layout-component';
import { Admindashboard } from './admindashboard/admindashboard';
import { AuthGuard } from '../services/authguard'; 
import {Inquire} from './inquire/inquire';
import { PlaceBooking } from './place-booking/place-booking';
import { Receipt } from './receipt/receipt';
import { Noaccess } from './noaccess/noaccess';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'sellerdashboard',
        component: SellerLayoutComponent,
        canActivate: [AuthGuard],   
        children: [
          { path: '', component: Sellerdashboard },
          { path: 'buyerdashboard', component: Buyerdashboard },
          { path: 'about', component: About },
          { path: 'contact', component: Contact },
        ]
      },
     {
  path: 'buyerdashboard',
  component: BuyerLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    { path: '', component: Buyerdashboard },
    { path: 'inquire/:id', component: Inquire }, 
    { path: 'place-booking/:id', component: PlaceBooking },
    {path:'receipt/:id', component: Receipt},
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
  ]
},
      {
        path: 'admindashboard',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: Admindashboard },
          { path: 'buyerdashboard', component: Buyerdashboard},
          { path: 'about', component: About },
          { path: 'contact', component: Contact },
        ]
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}