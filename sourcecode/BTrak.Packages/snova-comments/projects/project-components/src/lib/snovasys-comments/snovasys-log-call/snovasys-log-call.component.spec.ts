import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysLogCallsComponent } from './snovasys-log-call.component';

describe('SnovasysLogCallsComponent', () => {
  let component: SnovasysLogCallsComponent;
  let fixture: ComponentFixture<SnovasysLogCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysLogCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysLogCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
