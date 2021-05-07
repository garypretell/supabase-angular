import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';

import { tap, map, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canLoad(): Observable<boolean> {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
      return of(true);
    }else{
      this.router.navigate(['/']);
      return of(false);
    }
  }
}
