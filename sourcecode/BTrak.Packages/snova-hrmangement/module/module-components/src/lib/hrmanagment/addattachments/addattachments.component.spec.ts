import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddattachmentsComponent } from './addattachments.component';

describe('AddattachmentsComponent', () => {
  let component: AddattachmentsComponent;
  let fixture: ComponentFixture<AddattachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddattachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddattachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
