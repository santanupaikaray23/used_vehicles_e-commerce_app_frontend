import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutesGuard } from './guards/auth-routes-guard';
import { LoginPage} from './auth/login-page/login-page';
import { Signup } from './auth/signup/signup';

const routes: Routes = [
{path: 'login', component: LoginPage},
{path: 'signup', component: Signup},

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