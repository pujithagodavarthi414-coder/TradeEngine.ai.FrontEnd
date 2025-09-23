import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoloperGoalUserstoriesComponent } from './devoloper-goal-userstories.component';

describe('DevoloperGoalUserstoriesComponent', () => {
  let component: DevoloperGoalUserstoriesComponent;
  let fixture: ComponentFixture<DevoloperGoalUserstoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevoloperGoalUserstoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoloperGoalUserstoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
