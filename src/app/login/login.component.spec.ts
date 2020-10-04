import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { ApiAuthService, UserType, User } from '../api/auth';
import { LoginComponent } from './login.component';
import { Subscription } from 'rxjs';


class MockRouter {
    navigate = () => true;
}

class MockApiAuthService {
    user: User
    isAuthenticated = () => true;
    setUser = (user: User) =>  this.user = user;
    getUser = (): User => this.user;
    initGoogle = () => true;
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let element: HTMLElement;

    let mockAuthService: ApiAuthService;
    let mockRouter: Router;

    beforeEach(() => {
        (window as any).gapi = {
            auth2: {
                getAuthInstance: () => ({signOut: () => true}) as any,
                init: () => Promise.resolve({}),
            },
            load: (text, obj) => true
        } as any;


        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [
                {
                    provide: Router,
                    useClass: MockRouter
                },
                {
                    provide: ApiAuthService,
                    useClass: MockApiAuthService
                }
            ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        mockAuthService = TestBed.get(ApiAuthService);
        mockRouter = TestBed.get(Router);
    });

    it('exists', () => {
        expect(component).toBeTruthy();
    });

    describe('toggle okta authenticate', () => {
        it('displays buttons by default', () => {
            fixture.detectChanges();

            const buttonsElement = element.querySelector('.button-view');
            const oktaElement = element.querySelector('.okta-view');

            expect(buttonsElement).toBeTruthy();
            expect(oktaElement).toBeTruthy();

            expect(buttonsElement.hasAttribute('hidden')).toBeFalsy();
            expect(oktaElement.hasAttribute('hidden')).toBeTruthy();
        });

        it('displays okta authenticate form if okta button clicked true', () => {

            const buttonsElement = element.querySelector('.button-view');
            const oktaElement = element.querySelector('.okta-view');
            // const oktaButton = fixture.debugElement.nativeElement.querySelector('.okta-btn');

            expect(buttonsElement).toBeTruthy();
            expect(oktaElement).toBeTruthy();
            // expect(oktaButton).toBeTruthy();

            component.oktaWidget = {
                remove: () => true,
                renderEl: () => new Promise(() => {
                    status: 'SUCCESS'
                }),
                hide: () => true
            };

            component.toggleOktaAuthenticateForm(true);

            fixture.detectChanges();

            expect(buttonsElement.hasAttribute('hidden')).toBeTruthy();
            expect(oktaElement.hasAttribute('hidden')).toBeFalsy();
        });


        it('sets oktaOpen to passed in toggle value', () => {
            component.toggleOktaAuthenticateForm(true);

            expect(component.oktaOpen).toBeTruthy();

            component.toggleOktaAuthenticateForm(false);

            expect(component.oktaOpen).toBeFalsy();
        });
    });

    describe('onInit, onDestroy', () => {
        beforeEach(() => {
            spyOn(component, 'renderOktaWidget').and.callFake(() => undefined);
            spyOn(mockAuthService, 'initGoogle').and.callFake(() => undefined);
            component.googleSubscription = new Subscription();
        })

        it('should call inits on init', () => {
            component.oktaWidget = undefined;
            component.ngOnInit();

            expect(component.renderOktaWidget).toHaveBeenCalled();
            expect(mockAuthService.initGoogle).toHaveBeenCalled();
        });

        it('should destroy on destroy', () => {
            component.oktaWidget = {
                remove: () => true,
            };
            spyOn(component.oktaWidget, 'remove').and.callFake(() => undefined);
            spyOn(component.googleSubscription, 'unsubscribe').and.callThrough();

            component.ngOnDestroy();


            expect(component.oktaWidget.remove).toHaveBeenCalled();
            expect(component.googleSubscription.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('okta', () => {
        it('should set oktaWidget', () => {
            expect(component.oktaWidget).toBeTruthy();
        });

        describe('oktaResHandler', () => {
            it('should call auth service with user', () => {
                const res = {
                    status: 'SUCCESS',
                    user: {
                        profile: {
                            firstName: 'TestFirstName',
                            lastName: 'TestLastName'
                        }
                    },
                    session: {
                        token: 'TestToken'
                    }
                };

                spyOn(mockAuthService, 'setUser').and.callThrough();

                component.oktaResHandler(res);

                expect(mockAuthService.setUser).toHaveBeenCalledWith({
                    name: 'TestFirstName TestLastName',
                    imageUrl: undefined,
                    token: 'TestToken',
                    type: UserType.OKTA
                });
            });

            it('shouldnt do anything if res status isnt success', () => {
                spyOn(mockAuthService, 'setUser').and.callThrough();

                component.oktaResHandler({});

                expect(mockAuthService.setUser).not.toHaveBeenCalled();
            });

            it('should call widget hide', () => {
                const res = {
                    status: 'SUCCESS'
                };

                spyOn(component.oktaWidget, 'hide');

                component.oktaResHandler(res);

                expect(component.oktaWidget.hide).toHaveBeenCalled();
            });

            it('should navigate', () => {
                const res = {
                    status: 'SUCCESS'
                };

                spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

                component.oktaResHandler(res);

                expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
            });
        });
    });

    describe('google', () => {
        describe('googleResHandler', () => {
            it('should call auth service with user', () => {
                const user: any = {
                    getBasicProfile: () => {
                        return {
                            getName: () => 'TestFirstName TestLastName',
                            getImageUrl: () => 'TestImageUrl'
                        }
                    },
                    getAuthResponse: () => {
                        return {
                            id_token: 'TestToken'
                        }
                    }
                };

                spyOn(mockAuthService, 'setUser').and.callThrough();

                component.googleResHandler(user);

                expect(mockAuthService.setUser).toHaveBeenCalledWith({
                    name: 'TestFirstName TestLastName',
                    imageUrl: 'TestImageUrl',
                    token: 'TestToken',
                    type: UserType.GOOGLE
                });
            });

            it('shouldnt do anything if no user', () => {
                spyOn(mockAuthService, 'setUser').and.callThrough();

                component.googleResHandler(undefined);

                expect(mockAuthService.setUser).not.toHaveBeenCalled();
            });

            it('should navigate', () => {
                const user: any = {
                    getBasicProfile: () => {
                        return {
                            getName: () => 'TestFirstName TestLastName',
                            getImageUrl: () => 'TestImageUrl'
                        }
                    },
                    getAuthResponse: () => {
                        return {
                            id_token: 'TestToken'
                        }
                    }
                };

                spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

                component.googleResHandler(user);

                expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
            });
        });
    });

    afterEach(() => {
        component.oktaWidget = undefined;
        component.ngOnDestroy();
    });
});
