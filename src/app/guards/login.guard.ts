
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { ApiAuthService } from '../api/auth';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly authService: ApiAuthService
    ) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if(!this.authService.isAuthenticated()) {
            return true;
        }

        this.router.navigate(['']);
        return false;
    }
}
