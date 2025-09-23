import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormioCustomComponent } from 'angular-formio';

@Component({
  selector: 'app-currentdate',
  template: ''
})
export class DateTimeComponent implements FormioCustomComponent<any> {
  @Input()
  value: any;

  @Output()
  valueChange = new EventEmitter<any>();

  @Input()
  disabled: any;

}
