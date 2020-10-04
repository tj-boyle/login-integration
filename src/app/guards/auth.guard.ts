import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { ApiAuthService } from '../api/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly authService: ApiAuthService
    ) {}

    /**
     * Checks authenticated against service
     * If unauthenticated, regects and navigates to login
     * @param route
     * @param state
     */
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.authService.isAuthenticated()) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
