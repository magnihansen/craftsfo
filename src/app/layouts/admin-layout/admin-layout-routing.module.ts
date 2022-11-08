import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { ContacteditComponent } from '../../components/admin/contactedit/contactedit.component';
import { DashboardComponent } from '../../components/admin/dashboard/dashboard.component';
import { PageeditComponent } from '../../components/admin/pageedit/pageedit.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalLocalizationModule } from '../../localization/local-localization.module';
import { I18nPipe } from '../../localization/i18n.pipe';
import { UsersComponent } from 'src/app/components/admin/users/users.component';
import { ImageGalleryComponent } from 'src/app/components/modules/image-gallery/image-gallery.component';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, data: {title: 'Dashboard'} },
      { path: 'editpage/:id', component: PageeditComponent, data: {title: 'Edit page'} },
      { path: 'contact', pathMatch: 'full', component: ContacteditComponent, data: {title: 'Contacts'} },
      { path: 'users', pathMatch: 'full', component: UsersComponent, data: {title: 'Users'} }
    ]
  }
];

@NgModule({
    declarations: [
      AdminLayoutComponent,
      ContacteditComponent,
      UsersComponent
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      CommonModule,
      RouterModule.forChild(routes),
      LocalLocalizationModule,
      ImageGalleryComponent,
      NavigationComponent
    ],
    exports: [
      RouterModule
    ],
    providers: [
      I18nPipe
    ]
})

export class AdminLayoutRoutingModule {
    constructor() { }
}
