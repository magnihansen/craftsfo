import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ContacteditComponent } from './components/admin/contactedit/contactedit.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PageeditComponent } from './components/admin/pageedit/pageedit.component';
import { SlideeditComponent } from './components/admin/slideedit/slideedit.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RouterpagecontentComponent } from './components/routerpagecontent/routerpagecontent.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthService } from './services/auth.service';
import { LoginActivate } from './services/login-activate.service';
import { PageService } from './services/page.service';
import { SharedService } from './services/shared.service';

const appRoutes: Routes = [
  { path: 'forside', component: MainLayoutComponent, children: [
    { path: '', component: RouterpagecontentComponent, pathMatch: 'full', data: {title: 'Crafts.fo'} }
  ]},
  { path: 'om-os', component: RouterpagecontentComponent, pathMatch: 'full', data: {title: 'Om os'} },
  { path: 'projekter', component: RouterpagecontentComponent, pathMatch: 'full', data: {title: 'Projekter'} },
  { path: 'kontakt', component: ContactComponent, pathMatch: 'full', data: {title: 'Kontakt'} },
  { path: 'loginpage', component: LoginComponent, pathMatch: 'full', data: {title: 'Login'} },
  { path: '404', component: NotfoundComponent, pathMatch: 'full', data: {title: 'Login'} },
  { path: 'admin/dashboard', component: DashboardComponent, pathMatch: 'full', data: {title: 'Dashboard'} },
  { path: 'admin/page/:id', component: PageeditComponent, pathMatch: 'full', data: {title: 'Edit page'} },
  { path: 'admin/contact', component: ContacteditComponent, pathMatch: 'full', data: {title: 'Contacts'} },
  { path: 'admin/slides', component: SlideeditComponent, pathMatch: 'full', data: {title: 'Slides'} },
  { path: '', redirectTo: '/forside', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent, data: {title: '404 Not Found'}  }
];
enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    FooterComponent,
    NotfoundComponent,
    RouterpagecontentComponent,
    LoginComponent,
    NavigationComponent,
    MainLayoutComponent,
    EmptyLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  exports: [
    FormsModule
  ],
  providers: [
    LoginActivate,
    AngularFireDatabase,
    AuthService,
    PageService,
    SharedService,
    Title
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
