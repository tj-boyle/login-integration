import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

@Component({
    selector: 'li-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    gapiSetup;
    googleAuthInstance;

    oktaSignIn;
    oktaWidget = new OktaSignIn({
        baseUrl: 'https://dev-570546.okta.com/',
        authParams: {
            pkce: true
        }
    });

    constructor(oktaAuth: OktaAuthService) {
        this.oktaSignIn = oktaAuth;
    }

    ngOnInit() {
        // init okta
        this.initOkta();

        // init google
        this.initGoogle();
    }

    initOkta() {
        this.oktaWidget.renderEl(
            {el: '#okta-signin-container'},
            (res) => {
                if (res.status === 'SUCCESS') {
                    this.oktaSignIn.loginRedirect('/', { sessionToken: res.session.token });
                    // Hide the oktaWidget
                    this.oktaWidget.hide();
                }
            },
            (err) => {
                throw err;
            }
        );
    }

    async initGoogle(): Promise<void> {
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi
        // loaded and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: '395482602866-98pislb40f2bunm6mkdp2tgho8e566t5.apps.googleusercontent.com' })
                .then(auth => {
                    this.gapiSetup = true;
                    this.googleAuthInstance = auth;
                });
        });
    }


    async googleAuthenticate(): Promise<gapi.auth2.GoogleUser> {
        if (!this.gapiSetup) {
            await this.initGoogle();
        }

        return new Promise(async () => {
            await this.googleAuthInstance.signIn()
        });
    }
}
