import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerComponent } from '../pager/pager.component';

@NgModule({
  declarations: [DetailComponent, PagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DetailRoutingModule
  ],
})
export class DetailModule {}
