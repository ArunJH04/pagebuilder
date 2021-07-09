import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ConfigurationModule } from './configuration/configuration.module';
import { EditAppComponent } from './edit-app/edit-app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationLayoutComponent } from './layouts/configuration-layout/configuration-layout.component';
import { PlanningLayoutComponent } from './layouts/planning-layout/planning-layout.component';
import { LoginComponent } from './login/login.component';
import { PlanningModule } from './planning/planning.module';
import { ShowPageComponent } from './show-page/show-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'planning',
    component: PlanningLayoutComponent,
    loadChildren: () => PlanningModule,
    data: { moduleName: 'Planning' },
  },
  {
    path: 'configuration',
    component: ConfigurationLayoutComponent,
    loadChildren: () => ConfigurationModule,
    data: { moduleName: 'Configuration' },
  },

  // { path: '', redirectTo: 'createPage', pathMatch: 'full' },
  // { path: 'createPage', component: EditAppComponent },
  // { path: 'showPage', component: ShowPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
