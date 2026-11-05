import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employeur } from './employeur';

describe('Employeur', () => {
  let component: Employeur;
  let fixture: ComponentFixture<Employeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employeur],
    }).compileComponents();

    fixture = TestBed.createComponent(Employeur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
