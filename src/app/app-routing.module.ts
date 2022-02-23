import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./layouts/empty-layout/login-routing.module').then(m => m.LoginRoutingModule)
  },
  {
    path: 'page',
    loadChildren: () => import('./layouts/main-layout/main-layout-routing.module').then(m => m.MainLayoutRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./layouts/admin-layout/admin-layout-routing.module').then(m => m.AdminLayoutRoutingModule)
  },
  { path: '', redirectTo: '/page/start' },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  // anchorScrolling: 'enabled',
  // scrollOffset: [0, 64],
  enableTracing: false
};

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forRoot(routes, routerOptions)
    ],
    exports: [
      RouterModule
    ]
})

export class AppRoutingModule {
  constructor() {
    console.log('AppRoutingModule');
  }
}
