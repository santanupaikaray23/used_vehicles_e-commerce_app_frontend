import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutesGuard } from './guards/auth-routes-guard';
import { LoginPage} from './login-page/login-page';
import { Signup } from './signup/signup';
import { ForgotPassword } from './forgot-password/forgot-password';


const routes: Routes = [
{path: 'login', component: LoginPage},
{path: 'singup', component: Signup},
{path: 'forgotpassword', component: ForgotPassword},

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