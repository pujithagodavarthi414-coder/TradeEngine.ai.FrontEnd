import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-unique-id',
  templateUrl: './unique-id.component.html',
  styleUrls: ['./unique-id.component.css']
})
export class UniqueIdComponent implements OnInit {

@Input() value;
  keyValue: any;
  concateFormFieldss: any;
  disableds: boolean;
@Input() set key(data: any) {
  if (data) {
      this.keyValue = data;
  }
}
@Input() set context(data: any) {
  var a = data; 
 }
 @Input() set concateFormFields(data: any) {
 this.concateFormFieldss = data; 
}
@Input() set disabled(data: any) {
    if (data != undefined && data != false && data != null) {
        this.disableds = (data == 'disabled' || data == true ? true : false);
    } else if (data != false) {
        this.disableds = true;
    }
}
  isLookupValuesGetInprogress: any;
  @Output() valueChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

}
