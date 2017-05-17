import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

import { LoginComponent } from './components/login.component';
import { routing } from './login.routing';


@NgModule({
  imports: [
    routing,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxErrorsModule,
  ],
  declarations: [ LoginComponent ]
})
export class LoginModule { }
