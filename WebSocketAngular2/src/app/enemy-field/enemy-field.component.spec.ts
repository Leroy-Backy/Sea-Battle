import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyFieldComponent } from './enemy-field.component';

describe('EnemyFieldComponent', () => {
  let component: EnemyFieldComponent;
  let fixture: ComponentFixture<EnemyFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnemyFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
