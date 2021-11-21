import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterpagecontentComponent } from './components/routerpagecontent/routerpagecontent.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: 'page',
    component: MainLayoutComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'start',
        pathMatch: 'full',
        component: RouterpagecontentComponent
      },
      {
        path: ':link',
        pathMatch: 'full',
        component: RouterpagecontentComponent
      }
    ]
  }
];

@NgModule({
    declarations: [
      MainLayoutComponent,
      RouterpagecontentComponent
    ],
    imports: [
      SharedModule,
      CommonModule,
      RouterModule.forChild(routes)
    ],
    providers: []
})

export class AppRoutingModule {
  constructor() {
    console.log('AppRoutingModule');
  }
}
