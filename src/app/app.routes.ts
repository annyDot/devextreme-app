import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { UsersComponent } from './features/users/users.component';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'users',
    component: UsersComponent,
    // uncomment when 401 login error is resolved and user can be successfully authenticated
    // canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' },
];
