import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmptyLayoutComponent } from 'src/app/layouts/empty-layout/empty-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from '../../components/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: EmptyLayoutComponent,
        children: [
            {
                path: '',
                component: LoginComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        EmptyLayoutComponent,
        LoginComponent
    ],
    imports: [
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class LoginRoutingModule {
    constructor() { }
}
