import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Observable,
  Subject,
  of,
  fromEvent,
  merge,
  from,
  Observer,
} from 'rxjs';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent  {
  constructor(public authService: AuthService) {  }

  signOut(): any {
    this.authService.signOut();
  }

}
