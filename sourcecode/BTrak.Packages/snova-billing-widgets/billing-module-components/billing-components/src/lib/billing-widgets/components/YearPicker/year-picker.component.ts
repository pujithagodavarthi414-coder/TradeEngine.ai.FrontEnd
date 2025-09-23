import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { Moment } from "moment";

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: "app-year-picker",
  templateUrl: "year-picker.component.html",
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS }
  ],
})

export class AppYearPickerComponent {
  @Input("year")
  set _year(date:any){
    this._inputCtrl.setValue(date, { emitEvent: false });
  }
  @Input() disabled:boolean;
  @Output() yearEmit = new EventEmitter<any>();
    _inputCtrl: FormControl = new FormControl();
    onTouched = () => { };
    _max: Moment;
    _min: Moment;
    constructor(private dateAdapter: DateAdapter<any>) {
        this.dateAdapter.setLocale('fr');
    }

  ngOnInit() {
  }
_yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
  datepicker.close();

  if (!this._isYearEnabled(chosenDate.year())) {
    return;
  }

  chosenDate.set({ date: 1 });

  this._inputCtrl.setValue(chosenDate, { emitEvent: false });
  this.onChange(chosenDate.toDate());
  this.onTouched();
  this.yearEmit.emit(chosenDate);
}
private _isYearEnabled(year: number) {
  // disable if the year is greater than maxDate lower than minDate
  if (
    year === undefined ||
    year === null ||
    (this._max && year > this._max.year()) ||
    (this._min && year < this._min.year())
  ) {
    return false;
  }

  return true;
}

onChange = (year: Date) => { };
_openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
  if (!datepicker.opened) {
    datepicker.open();
  }
}
}
