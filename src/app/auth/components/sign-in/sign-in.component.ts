import { AuthService } from '../../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  styleUrls: ['./sign-in.component.css'],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): any {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login(): Promise<any> {
    this.authService.signIn(this.credentials.value).then(
      async (data) => {
        this.router.navigateByUrl('/list', { replaceUrl: true });
      },
      async (err) => {
        console.log(err);
      }
    );
  }

  async signUp(): Promise<any> {
    this.authService.signUp(this.credentials.value).then(async (data) => {
      console.log('Signup success', 'Please confirm your email now!');
    },
    async (err) => {
      console.log(err);
    });
  }
}
