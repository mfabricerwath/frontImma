import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Travailleur } from './travailleur';

describe('Travailleur', () => {
  let component: Travailleur;
  let fixture: ComponentFixture<Travailleur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Travailleur],
    }).compileComponents();

    fixture = TestBed.createComponent(Travailleur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
