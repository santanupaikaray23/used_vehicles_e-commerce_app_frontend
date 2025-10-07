import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutesGuard } from './guards/auth-routes-guard';
import { LoginPage} from './auth/login-page/login-page';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { Resetpassword } from './auth/resetpassword/resetpassword';

const routes: Routes = [
{path: 'login', component: LoginPage},
{path: 'signup', component: Signup},
{path: 'forgot-password', component: ForgotPassword},
 { path: 'resetpassword', component: Resetpassword },

  {
path: '',
    canActivate: [authRoutesGuard], 
    loadChildren: () =>
      import('./main-layout/main-layout-module').then((m) => m.MainLayoutModule), 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}