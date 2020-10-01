import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { OktaAuthService, OKTA_CONFIG, OktaCallbackComponent } from '@okta/okta-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from './api';
import { LandingComponent } from './landing';
import { LoginComponent } from './login';
import { AuthGuard } from './guards';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config = {
    issuer: 'https://dev-570546.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    clientId: '0oa12ljvekBSBhfHI4x7',
    pkce: true
}

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LoginComponent,
        OktaCallbackComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ApiModule,
        ClarityModule,
        BrowserAnimationsModule
    ],
    providers: [
        AuthGuard,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: config }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
