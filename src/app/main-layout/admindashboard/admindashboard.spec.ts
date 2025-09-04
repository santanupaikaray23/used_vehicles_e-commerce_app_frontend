import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admindashboard } from './admindashboard';

describe('Admindashboard', () => {
  let component: Admindashboard;
  let fixture: ComponentFixture<Admindashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Admindashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admindashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
