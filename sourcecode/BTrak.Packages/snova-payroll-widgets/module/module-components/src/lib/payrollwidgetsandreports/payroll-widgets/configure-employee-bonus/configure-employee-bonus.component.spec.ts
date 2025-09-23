import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureEmployeeBonusComponent } from './configure-employee-bonus.component';

describe('ConfigureEmployeeBonusComponent', () => {
  let component: ConfigureEmployeeBonusComponent;
  let fixture: ComponentFixture<ConfigureEmployeeBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureEmployeeBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureEmployeeBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
