import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ContacteditComponent } from './components/admin/contactedit/contactedit.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PageeditComponent } from './components/admin/pageedit/pageedit.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent, data: {title: 'Dashboard'} },
      { path: 'page/:id', pathMatch: 'full', component: PageeditComponent, data: {title: 'Edit page'} },
      { path: 'contact', pathMatch: 'full', component: ContacteditComponent, data: {title: 'Contacts'} },
      { path: 'slides', pathMatch: 'full', component: PageeditComponent, data: {title: 'Slides'} }
    ]
  }
];

@NgModule({
    declarations: [
        AdminLayoutComponent,
        PageeditComponent
    ],
    imports: [
      BrowserModule,
      SharedModule,
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ]
})

export class AdminRoutingModule {
    constructor() {
        console.log('AdminRoutingModule');
    }
}
