import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterpagecontentComponent } from 'src/app/components/routerpagecontent/routerpagecontent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainLayoutComponent } from './main-layout.component';

const routes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        {
          path: 'start',
          component: RouterpagecontentComponent
        },
        {
          path: ':link',
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
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ]
})

export class MainLayoutRoutingModule {
  constructor() { }
}
