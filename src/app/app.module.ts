import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    DepartmentsComponent
  ],
  imports: [BrowserModule, RouterModule, AppRoutingModule, HttpClientModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatDialogModule, MatButtonModule, MatCheckboxModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
