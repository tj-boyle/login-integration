import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import * as OktaSignIn from '@okta/okta-signin-widget';
import { from, Subscription } from 'rxjs';

import { ApiAuthService, UserType } from '../api/auth';
import { environment } from './../../environments/environment';

@Component({
    selector: 'li-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    googleAuthInstance;
    googleSubscription: Subscription;

    oktaWidget: OktaSignIn = new OktaSignIn({
        baseUrl: environment.oktaUrl,
        authParams: {
            pkce: true
        }
    });
    oktaOpen: boolean = false;


    constructor(
        private readonly authService: ApiAuthService,
        private readonly router: Router,
        private readonly ngZone: NgZone
    ) {}

    /**
     * Inits okta and google
     */
    async ngOnInit() {
        this.renderOktaWidget();
        this.googleAuthInstance = await this.authService.initGoogle();
    }

    /**
     * Renders okta widget (hidden by default) and sets up call to response handler and error handler
     */
    renderOktaWidget() {
        this.oktaWidget.renderEl(
            {el: '#okta-signin-container'},
            (res) => {
                this.oktaResHandler(res);
            },
            (err) => {
                console.log('in err');
                throw err;
            }
        );
    }

    /**
     * If okta response successful, calls auth service to set user,
     * hides widget, and redirects to landing page
     * @param res response from okta login widget
     */
    oktaResHandler(res: any) {
        if (res && res.status === 'SUCCESS') {
            this.authService.setUser({
                name: res.user && res.user.profile ? `${res.user.profile.firstName} ${res.user.profile.lastName}` : undefined,
                imageUrl: undefined,
                token: res.session ? res.session.token : undefined,
                type: UserType.OKTA
            })
            this.oktaWidget.hide();
            this.ngZone.run(() => {
                this.router.navigate(['']);
            });
        }
    }

    /**
     * Initializes google login. Once first promise resolves we can go ahead and initialize google auth
     */
    // async initGoogle(): Promise<any> {
    //     const pload = new Promise((resolve) => {
    //         gapi.load('auth2', resolve);
    //     });

    //     return pload.then(async () => {
    //         await gapi.auth2
    //             .init({ client_id: environment.googleClientId })
    //             .then(auth => this.googleAuthInstance = auth);
    //     });
    // }

    /**
     * Called when Google login button clicked, opens up modal and sets up response handler
     */
    openGoogleAuthenticate(): Promise<gapi.auth2.GoogleUser> {
        return new Promise(async () => {
            this.googleSubscription = from(this.googleAuthInstance.signIn()).subscribe((user: gapi.auth2.GoogleUser) => {
                this.googleResHandler(user);
            });
        });
    }

    /**
     * If google response successful, calls auth service to set user
     * and redirects to landing page
     * @param user gapi.auth2.GoogleUser
     */
    googleResHandler(user: gapi.auth2.GoogleUser) {
        if (user) {
            this.authService.setUser({
                name: user.getBasicProfile().getName(),
                imageUrl: user.getBasicProfile().getImageUrl(),
                token: user.getAuthResponse().id_token,
                type: UserType.GOOGLE
            });
            this.ngZone.run(() => {
                this.router.navigate(['']);
            });
        }
    }

    /**
     * Toggles hide show the okta widget
     * @param open
     */
    toggleOktaAuthenticateForm(open: boolean) {
        this.oktaOpen = open;
    }

    ngOnDestroy() {
        if (this.oktaWidget){
            this.oktaWidget.remove();
        }

        if (this.googleSubscription) {
           this.googleSubscription.unsubscribe();
        }
    }
}
