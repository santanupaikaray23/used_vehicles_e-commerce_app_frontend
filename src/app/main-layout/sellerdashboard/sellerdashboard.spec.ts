import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sellerdashboard } from './sellerdashboard';

describe('Sellerdashboard', () => {
  let component: Sellerdashboard;
  let fixture: ComponentFixture<Sellerdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sellerdashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sellerdashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
