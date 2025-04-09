import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSmartHomeDashboardComponent } from './app-smart-home-dashboard.component';

describe('AppSmartHomeDashboardComponent', () => {
  let component: AppSmartHomeDashboardComponent;
  let fixture: ComponentFixture<AppSmartHomeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSmartHomeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSmartHomeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
