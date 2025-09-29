import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Receipttwo } from './receipttwo';

describe('Receipttwo', () => {
  let component: Receipttwo;
  let fixture: ComponentFixture<Receipttwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Receipttwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Receipttwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
