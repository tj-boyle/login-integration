import { TestBed, ComponentFixture } from '@angular/core/testing';

import { OktaAuthService } from '@okta/okta-angular';
import { of } from 'rxjs';
import { ApiAuthService, UserType, User } from './auth.service';

class MockOkta {
    $authenticationState = of({ okay: 1 });

    oktaAuth;
    constructor() {
        this.oktaAuth = {
            tokenManager: {
                renew: (idToken: string) => {
                    return;
                }
            }
        };
    }

    loginRedirect = () => {};

    logout = () => {
        return Promise.resolve();
    };

    getIdToken = () => {};

    isAuthenticated = () => {};

    getUser = () => {};

    setFromUri = (uri: string) => {};
}


describe('ApiAuthService', () => {
    let auth: ApiAuthService;
    let mockOkta: OktaAuthService;

    let googleUser: User = {
        name: 'Test Google name',
        token: 'testGoogleToken',
        imageUrl: 'testGoogleImageUrl',
        type: UserType.GOOGLE
    };

    let oktaUser: User = {
        name: 'Test Okta name',
        token: 'testOktaToken',
        imageUrl: 'testOktaImageUrl',
        type: UserType.OKTA
    };

    beforeEach(() => {
        (window as any).gapi = {
            auth2: {
                getAuthInstance: () => ({signOut: () => true}) as any
            }
        } as any;


        TestBed.configureTestingModule({
            providers: [
                ApiAuthService,
                { provide: OktaAuthService, useClass: MockOkta }
            ]
        });


        auth = TestBed.get(ApiAuthService);
        mockOkta = TestBed.get(OktaAuthService);
    });

    describe('set authenticated', () => {
        it('should set authenticated to passed in value', () => {
            auth.setAuthenticated(true);
            expect(auth.authenticated).toBeTruthy();

            auth.setAuthenticated(false);
            expect(auth.authenticated).toBeFalsy();
        });

        it('should call to reset user to undefined if unauthenticated', () => {
            spyOn(auth, 'setUser').and.callThrough();

            auth.setAuthenticated(false);

            expect(auth.setUser).toHaveBeenCalledWith(undefined);
        });
    });

    describe('set user', () => {
        it('should set user to passed in value', () => {
            spyOn(auth.user, 'next').and.callThrough()

            auth.setUser(googleUser);

            expect(auth.user.next).toHaveBeenCalledWith(googleUser);
        });

        it('should call to set user to authenticated if token available', () => {
            spyOn(auth, 'setAuthenticated').and.callThrough();

            auth.setUser(googleUser);

            expect(auth.setAuthenticated).toHaveBeenCalledWith(true);
        });
    })

    it('should return if user is authenticated', () => {
        auth.setAuthenticated(true);

        expect(auth.isAuthenticated()).toBeTruthy();
    });

    it('should return value of user', () => {
        auth.setUser(googleUser);

        expect(auth.getUser()).toEqual(googleUser);
    });

    describe('logout', () => {
        it('should call set authenticated with false', async () => {
            spyOn(auth, 'setAuthenticated').and.callThrough();

            auth.setUser(googleUser);

            await auth.logout();

            expect(auth.setAuthenticated).toHaveBeenCalledWith(false);
        });

        it('should call google logout if google user', async () => {
            spyOn(gapi.auth2, 'getAuthInstance').and.callThrough();
            auth.setUser(googleUser);

            await auth.logout();

            expect(gapi.auth2.getAuthInstance).toHaveBeenCalled();
        });
    })
});
