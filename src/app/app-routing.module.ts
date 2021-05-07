import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards';
import { RequireUnauthGuard } from './auth/guards/require-unauth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule),
    canActivate: [RequireUnauthGuard]
  },
  {
    path: 'list',
    loadChildren:  () => import('./detail/detail.module').then( m => m.DetailModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
