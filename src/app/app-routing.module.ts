import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

import { LandingComponent } from './landing';
import { AuthGuard } from './guards';
import { LoginComponent } from './login';

const routes: Routes = [
    {
        path: 'login/callback',
        component: OktaCallbackComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LandingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
