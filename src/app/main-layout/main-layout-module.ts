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
import { MatCard } from '@angular/material/card';
import { SideNav } from './shareable/side-nav/side-nav';
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
import { Profile } from './profile/profile';


@NgModule({
  declarations: [
    UserHeader,
    Signup,
   SideNav,
    MainLayoutComponent,
    LoginPage,
    About,
    Contact,
    Profile,
   
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
      LayoutModule    
],

})
export class MainLayoutModule { }
