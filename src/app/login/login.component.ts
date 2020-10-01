import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { from, Subscription } from 'rxjs';

import { ApiAuthService, UserType } from '../api/auth';

@Component({
    selector: 'li-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    googleAuthInstance;
    googleSubscription: Subscription;

    oktaWidget: OktaSignIn;
    oktaOpen: boolean = false;


    constructor(
        private readonly authService: ApiAuthService,
        private readonly router: Router,
        private readonly ngZone: NgZone
    ) {}

    ngOnInit() {
        // init okta
        this.initOkta();

        // init google
        this.initGoogle();
    }

    initOkta() {
        this.oktaWidget = new OktaSignIn({
            baseUrl: 'https://dev-570546.okta.com/',
            authParams: {
                pkce: true
            }
        });

        this.oktaWidget.renderEl(
            {el: '#okta-signin-container'},
            (res) => {
                if (res.status === 'SUCCESS') {
                    this.authService.setUser({
                        name: res.user && res.user.profile ? `${res.user.profile.firstName} ${res.user.profile.lastName}` : undefined,
                        imageUrl: undefined,
                        token: res.session ? res.session.token : undefined,
                        type: UserType.OKTA
                    })
                    this.oktaWidget.hide();
                    this.ngZone.run(() => {
                        this.router.navigateByUrl('');
                    });
                }
            },
            (err) => {
                throw err;
            }
        );
    }

    async initGoogle(): Promise<any> {
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi
        // loaded and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: '395482602866-98pislb40f2bunm6mkdp2tgho8e566t5.apps.googleusercontent.com' })
                .then(auth => this.googleAuthInstance = auth);
        });
    }

    openGoogleAuthenticate(): Promise<gapi.auth2.GoogleUser> {
        return new Promise(async () => {
            this.googleSubscription = from(this.googleAuthInstance.signIn()).subscribe((user: gapi.auth2.GoogleUser) => {
                this.authService.setUser({
                    name: user.getBasicProfile().getName(),
                    imageUrl: user.getBasicProfile().getImageUrl(),
                    token: user.getAuthResponse().id_token,
                    type: UserType.GOOGLE
                });
                this.ngZone.run(() => {
                    this.router.navigateByUrl('');
                });
            });
        });
    }

    openOktaAuthenticateForm() {
        this.oktaOpen = true;
    }

    closeOktaAuthenticateForm() {
        this.oktaOpen = false;
    }

    ngOnDestroy() {
        console.log('DESTROYED');
        if(this.oktaWidget){
            this.oktaWidget.remove();
        }

        if (this.googleSubscription) {
           this.googleSubscription.unsubscribe();
        }
    }
}
