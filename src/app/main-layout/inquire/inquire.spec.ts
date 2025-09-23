import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inquire } from './inquire';

describe('Inquire', () => {
  let component: Inquire;
  let fixture: ComponentFixture<Inquire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Inquire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inquire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
