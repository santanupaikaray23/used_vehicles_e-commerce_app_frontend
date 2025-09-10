import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { MainLayoutComponent } from './main-layout.component';
// import { Authguard } from '../services/authguard';
// import { BuyerLayoutComponent } from './buyer-layout-component/buyer-layout-component';
import { Profile } from './profile/profile';
// import { Admindashboard } from './admindashboard/admindashboard';
// import { Buyerdashboard } from './buyerdashboard/buyerdashboard';
// import { Userdashboard } from './userdashboard/userdashboard';
import { Sellerdashboard } from './sellerdashboard/sellerdashboard';
import { SellerLayoutComponent } from './seller-layout-component/seller-layout-component';
import { BuyerLayoutComponent } from './buyer-layout-component/buyer-layout-component';
import { Buyerdashboard } from './buyerdashboard/buyerdashboard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'seller',
        component: SellerLayoutComponent,
        children: [
          { path: 'dashboard', component: Sellerdashboard },
                  { path: 'profile', component: Profile },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
        ]
      },
      {
        path: 'buyer',
        component: BuyerLayoutComponent,
        children: [
          { path: 'dashboard', component: Buyerdashboard },
           { path: 'profile', component: Profile },
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