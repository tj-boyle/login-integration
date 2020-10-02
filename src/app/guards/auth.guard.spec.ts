import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AuthGuard } from '.';
import { ApiAuthService } from '../api/auth';

class MockActivatedRouteSnapshot {
    queryParams;
}

class MockRouterStateSnapshot {
    url;
}

class MockRouter {
    navigate = () => true;
}

class MockApiAuthService {
    isAuthenticated = () => true;
}

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let mockRouterStateSnapshot: RouterStateSnapshot;
    let mockAuthService: ApiAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: ActivatedRouteSnapshot,
                    useClass: MockActivatedRouteSnapshot
                },
                {
                    provide: RouterStateSnapshot,
                    useClass: MockRouterStateSnapshot
                },
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

        guard = TestBed.get(AuthGuard);
        mockAuthService = TestBed.get(ApiAuthService);
        mockRouter = TestBed.get(Router);
        mockActivatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);
        mockRouterStateSnapshot = TestBed.get(RouterStateSnapshot);
        mockActivatedRouteSnapshot.queryParams = { something: 'ok' };
        mockRouterStateSnapshot.url = 'hey/wow/awesome';
    });

    it('exists', () => {
        expect(guard).toBeTruthy();
    });

    it('should canActivate', async () => {
        spyOn(mockAuthService, 'isAuthenticated').and.returnValue(true);

        const result = await guard.canActivate(
            mockActivatedRouteSnapshot,
            mockRouterStateSnapshot
        );

        expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
        expect(result).toBeTruthy();
    });

    it('shouldnt canActivate', async () => {
        spyOn(mockAuthService, 'isAuthenticated').and.returnValue(false);
        spyOn(mockRouter, 'navigate').and.returnValue(undefined);
        const result = await guard.canActivate(
            mockActivatedRouteSnapshot,
            mockRouterStateSnapshot
        );

        expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
        expect(result).toBeFalsy();
    });
});
