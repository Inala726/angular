import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePreviewComponent } from './phone-preview.component';

describe('PhonePreviewComponent', () => {
  let component: PhonePreviewComponent;
  let fixture: ComponentFixture<PhonePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhonePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhonePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
