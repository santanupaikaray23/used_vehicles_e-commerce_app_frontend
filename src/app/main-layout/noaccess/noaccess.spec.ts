import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noaccess } from './noaccess';

describe('Noaccess', () => {
  let component: Noaccess;
  let fixture: ComponentFixture<Noaccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Noaccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Noaccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
