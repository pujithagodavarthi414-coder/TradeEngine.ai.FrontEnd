import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormioCustomComponent } from 'angular-formio';

@Component({
  selector: 'app-well',
  templateUrl: './well.component.html',
  styleUrls: ['./well.component.css']
})
export class WellComponent implements FormioCustomComponent<any> {
  @Input()
  value: any;

  @Output()
  valueChange = new EventEmitter<any>();

  @Input()
  disabled: any;

}
