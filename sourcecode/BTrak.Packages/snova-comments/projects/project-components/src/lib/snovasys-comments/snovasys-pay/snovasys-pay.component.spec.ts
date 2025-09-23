import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysPayComponent } from './snovasys-pay.component';

describe('SnovasysPayComponent', () => {
  let component: SnovasysPayComponent;
  let fixture: ComponentFixture<SnovasysPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
