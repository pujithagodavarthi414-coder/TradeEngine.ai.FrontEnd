import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormioCustomComponent } from 'angular-formio';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements FormioCustomComponent<any> {
  @Input()
  value: any;

  @Output()
  valueChange = new EventEmitter<any>();

  @Input()
  disabled: any;

}
