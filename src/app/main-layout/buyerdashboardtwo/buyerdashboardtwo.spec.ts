import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buyerdashboardtwo } from './buyerdashboardtwo';

describe('Buyerdashboardtwo', () => {
  let component: Buyerdashboardtwo;
  let fixture: ComponentFixture<Buyerdashboardtwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Buyerdashboardtwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buyerdashboardtwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
