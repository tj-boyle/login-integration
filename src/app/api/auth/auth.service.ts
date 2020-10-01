import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';

export enum UserType {
    GOOGLE,
    OKTA
};

export interface User {
    name: string;
    token: string;
    imageUrl: string;
    type: UserType
};

@Injectable()
export class ApiAuthService {
    authenticated = false;
    user: BehaviorSubject<User>;
    user$: Observable<User>;

    constructor(
        private readonly oktaAuth: OktaAuthService
    ) {
        this.user = new BehaviorSubject<User>(undefined);
        this.user$ = this.user.asObservable();
    }

    setAuthenticated(authenticated: boolean): void {
        this.authenticated = authenticated;

        if (!authenticated) {
            this.setUser(undefined);
        }
    }

    setUser(user: User): void {
        this.user.next(user);

        if(user && user.token) {
            this.setAuthenticated(true);
        }
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    getUser(): User {
        return this.user.value;
    }

    async logout(): Promise<void> {
        try {
            if (this.user.value && this.user.value.type === UserType.GOOGLE) {
                await gapi.auth2.getAuthInstance().signOut();
            } else if (this.user.value && this.user.value.type === UserType.OKTA) {
                await this.oktaAuth.logout();
            }

            this.setAuthenticated(false);
            return;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
