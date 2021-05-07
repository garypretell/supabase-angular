import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        autoRefreshToken: true,
        persistSession: true,
      }
    );
    this.loadUser();

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this._currentUser.next(session.user);
      } else {
        this._currentUser.next(false);
      }
    });
  }

  async loadUser(): Promise<any> {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
      this._currentUser.next(user);
    } else {
      this._currentUser.next(false);
    }
  }

  get currentUser(): Observable<User> {
    return this._currentUser.asObservable();
  }


  async signUp(credentials: { email; password }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp(credentials);
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  signIn(credentials: { email; password }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signIn(credentials);
      if (error) {
        reject(error);
      } else {
        resolve(data);
        this._currentUser.next(data.user);
        localStorage.setItem('user', JSON.stringify(data));
      }
    });
  }

  signOut(): any {
    this.supabase.auth.signOut().then((_) => {
      // Clear up and end all active subscriptions!
      this.supabase.getSubscriptions().map((sub) => {
        this.supabase.removeSubscription(sub);
      });
      localStorage.clear();
      this.router.navigateByUrl('/');
    });
  }

}
