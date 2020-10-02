import { TestBed, ComponentFixture } from '@angular/core/testing';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LandingComponent]
        });

        fixture = TestBed.createComponent(LandingComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('exists', () => {
        expect(component).toBeTruthy();
    });
});
