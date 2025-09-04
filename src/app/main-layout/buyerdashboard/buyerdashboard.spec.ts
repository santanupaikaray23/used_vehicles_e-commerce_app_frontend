import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buyerdashboard } from './buyerdashboard';

describe('Buyerdashboard', () => {
  let component: Buyerdashboard;
  let fixture: ComponentFixture<Buyerdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Buyerdashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buyerdashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
