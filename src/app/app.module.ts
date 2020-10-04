import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OktaAuthService, OKTA_CONFIG, OktaCallbackComponent } from '@okta/okta-angular';
import { ClarityModule } from '@clr/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from './api';
import { LandingComponent } from './landing';
import { LoginComponent } from './login';
import { AuthGuard, LoginGuard } from './guards';
import { environment } from './../environments/environment';

const config = {
    issuer: `${environment.oktaUrl}/oauth2/default`,
    redirectUri: environment.oktaRedirectUri,
    clientId: environment.oktaClientId,
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
        LoginGuard,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: config }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


/**
 * TODO:
 * - Tests
 * - Website
 * - Better landing page
 * - Better login page
 * - Refactor auth code to use observables instead of promises
 */
