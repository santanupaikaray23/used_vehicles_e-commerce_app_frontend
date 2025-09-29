import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buyerdashboardthree } from './buyerdashboardthree';

describe('Buyerdashboardthree', () => {
  let component: Buyerdashboardthree;
  let fixture: ComponentFixture<Buyerdashboardthree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Buyerdashboardthree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buyerdashboardthree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
