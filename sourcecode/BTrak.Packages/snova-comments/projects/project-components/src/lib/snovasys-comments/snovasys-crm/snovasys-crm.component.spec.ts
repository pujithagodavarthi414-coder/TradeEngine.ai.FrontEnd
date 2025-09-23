import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysCRMComponent } from './snovasys-crm.component';

describe('SnovasysCRMComponent', () => {
  let component: SnovasysCRMComponent;
  let fixture: ComponentFixture<SnovasysCRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysCRMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysCRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
