import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRegistrationModalComponent } from './device-registration-modal.component';

describe('DeviceRegistrationModalComponent', () => {
  let component: DeviceRegistrationModalComponent;
  let fixture: ComponentFixture<DeviceRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceRegistrationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
