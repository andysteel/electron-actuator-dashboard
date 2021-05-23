import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application/application.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  { path: '', component: ApplicationComponent },
  { path: 'charts/:context', component: ChartsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
