import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { Moment } from "moment";

export const YEAR_MODE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
      },
      display: {
        dateInput: 'MMMM',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
};
@Component({
  selector: "app-month-picker",
  templateUrl: "month-picker.component.html",
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS }
  ],
})

export class AppMonthPickerComponent {
  @Input("month")
  set _month(date:any){
    this._inputCtrl.setValue(date, { emitEvent: false });
  }
  @Input() disabled:boolean;
    @Output() monthEmit = new EventEmitter<any>();
    _inputCtrl: FormControl = new FormControl();
    onTouched = () => { };
    _max: Moment;
    _min: Moment;
    constructor(private dialog: MatDialog, private dateAdapter: DateAdapter<any>) {
        this.dateAdapter.setLocale('fr');
    }

  ngOnInit() {
  }
_monthSelectedHandler(chosenMonthDate: Moment, datepicker: MatDatepicker<Moment>) {
  datepicker.close();


  if (this._max && chosenMonthDate.diff(this._max, 'month') > 0) {
    chosenMonthDate = this._max.clone();
  }

  if (this._min && this._min.diff(chosenMonthDate, 'month') > 0) {
    chosenMonthDate = this._min.clone();
  }

  chosenMonthDate.set({ date: 1 });

  this._inputCtrl.setValue(chosenMonthDate, { emitEvent: false });
  this.onChange(chosenMonthDate.toDate());
  this.onTouched();
  this.monthEmit.emit(chosenMonthDate);
}

addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this.monthEmit.emit(event.value);
}

onChange = (year: Date) => { };
_openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
  if (!datepicker.opened) {
    datepicker.open();
  }
}
}
