import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { ApiAuthService } from './auth';


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
