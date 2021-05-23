import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application/application.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartsComponent } from './charts/charts.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ChartsComponent
  ],
  exports: [
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    DividerModule,
    CardModule,
    InputTextModule,
    FontAwesomeModule,
    NgxElectronModule,
    ToastModule,
    MenubarModule,
    TableModule,
    BadgeModule,
    ConfirmDialogModule,
    CheckboxModule
  ]
})
export class DashboardModule {}
