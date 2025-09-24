import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBooking } from './place-booking';

describe('PlaceBooking', () => {
  let component: PlaceBooking;
  let fixture: ComponentFixture<PlaceBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
