import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalActivityComponent } from './goal-activity.component';

describe('GoalActivityComponent', () => {
  let component: GoalActivityComponent;
  let fixture: ComponentFixture<GoalActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
