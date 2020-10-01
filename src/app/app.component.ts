import { Component, OnDestroy } from '@angular/core';

import { ApiAuthService, User } from './api/auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    title = 'login-integration';
    user: User;
    userSubscription: Subscription;

    constructor(
        private readonly authService: ApiAuthService,
        private readonly router: Router
    ) {
        this.userSubscription = this.authService.user$.subscribe((user: User) => {
            this.user = user;
        });
    }

    async logout() {
        try {
            await this.authService.logout();
            this.router.navigateByUrl('/login');
        } catch (e) {
            console.log('error logging out');
        }
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}
