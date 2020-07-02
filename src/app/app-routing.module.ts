import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ChartsComponent } from './charts/charts.component';
import { StocksComponent } from './stocks/stocks.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'charts', component: ChartsComponent},
  {path: 'stocks', component: StocksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent];
