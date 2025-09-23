import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysSmsComponent } from './snovasys-sms.component';

describe('SnovasysSmsComponent', () => {
  let component: SnovasysSmsComponent;
  let fixture: ComponentFixture<SnovasysSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
