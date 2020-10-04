import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ApiAuthService, User } from './api/auth';
import { Subscription } from 'rxjs';

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

    /**
     * Calls auth service logout and navigates to login when logout button clicked
     */
    async logout() {
        try {
            await this.authService.logout();
            this.router.navigate(['/login']);
        } catch (e) {
            console.log('error logging out');
        }
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}

/**
 * TODO:
 * - Comments
 * - Website
 * - Cleanup
 */
