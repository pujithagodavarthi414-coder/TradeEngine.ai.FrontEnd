import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysCallsComponent } from './snovasys-make-call.component';

describe('SnovasysCallsComponent', () => {
  let component: SnovasysCallsComponent;
  let fixture: ComponentFixture<SnovasysCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
