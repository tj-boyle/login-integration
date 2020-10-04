import { Injectable } from '@angular/core';

import { OktaAuthService } from '@okta/okta-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

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
        this.getFromLocalStorage();
    }

    /**
     * Gets user from local storage if available, and initializes google once parsed
     */
    async getFromLocalStorage() {
        const localStorageUser = localStorage.getItem('user');
        if (localStorageUser && JSON.parse(localStorageUser)) {
            this.setUser(JSON.parse(localStorageUser));
            await this.initGoogle();
        }
    }

    /**
     * Sets authenticated from param, if false unsets user
     * @param authenticated boolean for authentication value
     */
    setAuthenticated(authenticated: boolean): void {
        this.authenticated = authenticated;

        if (!authenticated) {
            this.setUser(undefined);
        }
    }

    /**
     * Sets user from param, emits new value
     * If valid and with token will call authenticated with true
     * @param user User to save
     */
    setUser(user: User): void {
        this.user.next(user);

        if(user && user.token) {
            localStorage.setItem('user', JSON.stringify(user));
            this.setAuthenticated(true);
        }
    }

    /**
     * Helper method to check authenticated
     */
    isAuthenticated(): boolean {
        return this.authenticated;
    }

    /**
     * Helper method to get current user value
     */
    getUser(): User {
        return this.user.value;
    }

    /**
     * Initializes google login. Once first promise resolves we can go ahead and initialize google auth
     */
    async initGoogle(): Promise<any> {
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        return pload.then(async () => {
            return await gapi.auth2
                .init({ client_id: environment.googleClientId })
                .then(auth => auth)
                .catch((e: any) => console.log(`Error initializing google auth: ${e}`));
        });
    }

    /**
     * Checks user type and calls appropriate logout logic
     * In either case it sets authenticated to false
     */
    async logout(): Promise<void> {
        try {
            if (this.user.value && this.user.value.type === UserType.GOOGLE) {
                await gapi.auth2.getAuthInstance().signOut();
            } else if (this.user.value && this.user.value.type === UserType.OKTA) {
                await this.oktaAuth.logout();
            }

            localStorage.removeItem('user');
            this.setAuthenticated(false);
            return;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
