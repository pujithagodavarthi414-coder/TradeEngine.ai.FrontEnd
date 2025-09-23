import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import '../../../globaldependencies/helpers/fontawesome-icons';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-year-date-picker',
  templateUrl: './year-date-picker.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class YearDatePickerComponent implements OnInit {

  year: any = new Date().getFullYear();
  @Output() yearEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

  chosenYearHandler(normalizedYear: any, datepicker: MatDatepicker<any>) {
    this.year = normalizedYear.toDate();
    this.yearEvent.emit(this.year);
    datepicker.close();
  }

}
