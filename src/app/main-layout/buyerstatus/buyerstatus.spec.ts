import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buyerstatus } from './buyerstatus';

describe('Buyerstatus', () => {
  let component: Buyerstatus;
  let fixture: ComponentFixture<Buyerstatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Buyerstatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buyerstatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
