import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutRoutingModule } from './main-layout-routing-module';
import { MainLayoutComponent } from './main-layout.component';
import { UserHeader } from './shareable/user-header/user-header';
import { Signup } from '../auth/signup/signup';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import {MatSidenav} from '@angular/material/sidenav'
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { LoginPage } from '../auth/login-page/login-page';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Admindashboard } from './admindashboard/admindashboard';
import { Buyerdashboard } from './buyerdashboard/buyerdashboard';
import { Sellerdashboard } from './sellerdashboard/sellerdashboard';
import { Userdashboard } from './userdashboard/userdashboard';
import { MatSelectModule } from '@angular/material/select';
import { BuyerLayoutComponent } from './buyer-layout-component/buyer-layout-component';
import { SellerLayoutComponent } from './seller-layout-component/seller-layout-component';
import { AdminLayoutComponent } from './admin-layout-component/admin-layout-component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';



@NgModule({
  declarations: [
    UserHeader,
    Signup,
    MainLayoutComponent,
    LoginPage,
    About,
    Contact,
    Admindashboard,
    Buyerdashboard,
    Sellerdashboard,
    Userdashboard,
    BuyerLayoutComponent,
    SellerLayoutComponent,
    AdminLayoutComponent
    
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    MainLayoutRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCard,
    MatToolbar,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContainer,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    LayoutModule,
    MatSelectModule,
    MatCardHeader,
    MatCardTitle,
   MatCardContent,
   MatCardSubtitle,
   MatTableModule,
   MatPaginatorModule,
MatSortModule,
MatChipsModule

],

})
export class MainLayoutModule { }
