import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { ApiAuthService } from './auth';
import { OktaAuthService } from '@okta/okta-angular';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        ApiAuthService
    ]
})
export class ApiModule {
    constructor() {}
}
