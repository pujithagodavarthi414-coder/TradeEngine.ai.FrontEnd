import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysCallLogsComponent } from './snovasys-call-log.component';

describe('SnovasysCallLogsComponent', () => {
  let component: SnovasysCallLogsComponent;
  let fixture: ComponentFixture<SnovasysCallLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysCallLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysCallLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
