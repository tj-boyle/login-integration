import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { MockComponent } from 'ng2-mock-component';

import { AppComponent } from './app.component';
import { ApiAuthService, User, UserType } from './api/auth';

const googleUser = {
    name: 'Test Google name',
    token: 'testGoogleToken',
    imageUrl: 'testGoogleImageUrl',
    type: UserType.GOOGLE
};

class MockRouter {
    navigate = () => true;
}

class MockApiAuthService {
    user = new BehaviorSubject<User>(googleUser);
    user$ = this.user.asObservable();
    logout = () => Promise.resolve();

    setUser = (user): void => {
        this.user.next(undefined as any);
    }
}

describe('AppComponent', () => {
    let mockAuthService: ApiAuthService;
    let mockRouter: Router;
    let fixture: ComponentFixture<AppComponent>;
    let element: HTMLElement;
    let component: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                MockComponent({
                    selector: 'router-outlet'
                })
            ],
            providers: [
                {
                    provide: ApiAuthService,
                    useClass: MockApiAuthService
                },
                {
                    provide: Router,
                    useClass: MockRouter
                },
            ]
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        mockAuthService = TestBed.get(ApiAuthService);
        mockRouter = TestBed.get(Router);

        fixture.detectChanges();
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'login-integration'`, () => {
        expect(component.title).toEqual('login-integration');
    });

    it('should set user as user', () => {
        expect(component.user).toEqual(googleUser);
    });

    describe('logout', () => {
        it('should call auth service logout', async () => {
            spyOn(mockAuthService, 'logout').and.returnValue(Promise.resolve());

            await component.logout();

            expect(mockAuthService.logout).toHaveBeenCalled();
        });

        it('should call router navigate to login', async () => {
            spyOn(mockRouter, 'navigate').and.callThrough();

            await component.logout();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    it('should unsubscribe on destroy', () => {
        spyOn(component.userSubscription, 'unsubscribe').and.callThrough();

        component.ngOnDestroy();

        expect(component.userSubscription.unsubscribe).toHaveBeenCalled();
    });

    describe('show information', () => {
        it('shows logout button only when logged in', () => {
            const loginElement = element.querySelector('.login');
            const logoutElement = element.querySelector('.logout');

            expect(logoutElement).toBeTruthy();
            expect(loginElement).toBeFalsy();
        });

        it('shows login button only when logged out', () => {
            mockAuthService.setUser({} as any);

            fixture.detectChanges();

            const loginElement = element.querySelector('.login');
            const logoutElement = element.querySelector('.logout');
            expect(logoutElement).toBeFalsy();
            expect(loginElement).toBeTruthy();
        });
    });
});
