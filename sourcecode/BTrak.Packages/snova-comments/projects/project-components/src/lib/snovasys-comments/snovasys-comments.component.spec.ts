import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnovasysCommentsComponent } from './snovasys-comments.component';

describe('SnovasysCommentsComponent', () => {
  let component: SnovasysCommentsComponent;
  let fixture: ComponentFixture<SnovasysCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnovasysCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnovasysCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
