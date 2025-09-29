import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBookingtwo } from './place-bookingtwo';

describe('PlaceBookingtwo', () => {
  let component: PlaceBookingtwo;
  let fixture: ComponentFixture<PlaceBookingtwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceBookingtwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceBookingtwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
