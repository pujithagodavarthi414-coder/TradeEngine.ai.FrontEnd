import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { UserStoryLogTimeActionTypes } from "../../store/actions/userStory-logTime.action";

@Component({
  selector: "app-common-userstorySpentTime",
  templateUrl: "./spentTime.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpentTimeComponent implements OnInit {

  spentTime;
  @Input("spentTime")
  set _spentTime(data: string) {
    if(data){
      this.spentTime = null;
    }
  }
  
  
  @Output() totalEstimatedTimeInHours = new EventEmitter<any>();
  
  regexPattern: string = "^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[w][+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[d][+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[h]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[d][+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[h]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[w][+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[d]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[w]{1,3}[h]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[d]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[w]{1,3}[h]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[w]|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[d]$|[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+){1,3}[h]$";
  totalHours: any;
  estimatedTimeInHours: any;
  noOfHoursInADay:number =8;
  noOfHoursInAWeek:number=40;
  isValidationShow:boolean;
  ismaxHoursValdation: boolean;
  isminHoursValdation: boolean;
  public ngDestroyed$ = new Subject();
  spentTimeFormControl = new FormControl("", {
    validators: [Validators.required, Validators.pattern(this.regexPattern)], updateOn: 'blur'
  })
 
  constructor(private toastr: ToastrService,
    private store: Store<State>,
    private actionUpdates$: Actions,
    private cdRef:ChangeDetectorRef ) {
    this.actionUpdates$
    .pipe(
      takeUntil(this.ngDestroyed$),
      ofType(UserStoryLogTimeActionTypes.InsertLogTimeCompleted),
      tap(() => {
        this.spentTime = null;
        this.spentTimeFormControl.reset();
      })
    )
    .subscribe();

  }
  ngOnInit() {
  }


  saveEstimatedTime()
  {
    if(this.spentTimeFormControl.valid)
    {
      const lastCharacterOfString = this.spentTime.slice(this.spentTime.length - 1);
      if (this.spentTime.includes('w') && this.spentTime.includes('d') && this.spentTime.includes('h') && lastCharacterOfString === 'h') {
        this.estimatedTimeInHours = this.getTimeInWeekDayToHours(this.spentTime);
      }
      else if(this.spentTime.includes('w') && this.spentTime.includes('d') && lastCharacterOfString === 'd'){
        this.estimatedTimeInHours = this.getTimeInWeekAndDayToHours(this.spentTime);
      }
      else if(this.spentTime.includes('w') && this.spentTime.includes('h') && lastCharacterOfString === 'h'){
        this.estimatedTimeInHours = this.getTimeInWeekAndHourToHours(this.spentTime);
      }
      else if(this.spentTime.includes('d') && this.spentTime.includes('h') && lastCharacterOfString === 'h'){
        this.estimatedTimeInHours = this.getTimeInDayAndHourToHours(this.spentTime);
      }
      else if(this.spentTime.includes('w') && lastCharacterOfString === 'w'){
        this.estimatedTimeInHours = this.getTimeInWeekToHours(this.spentTime);
      }
      else if(this.spentTime.includes('d') && lastCharacterOfString === 'd'){
        this.estimatedTimeInHours = this.getTimeInDayToHours(this.spentTime);
      }
      else if(this.spentTime.includes('h') && lastCharacterOfString === 'h'){
        this.estimatedTimeInHours = this.getTimeInHours(this.spentTime);
      }
      else{

      }
      if (this.estimatedTimeInHours > 160) {
        this.ismaxHoursValdation = true;
        this.isminHoursValdation = false;
        this.cdRef.detectChanges();
        this.totalEstimatedTimeInHours.emit(null);
      }
      else if (this.estimatedTimeInHours > 0) {
        this.totalEstimatedTimeInHours.emit(this.estimatedTimeInHours);
        this.isValidationShow = false;
         this.ismaxHoursValdation = false;
         this.isminHoursValdation = false;
         this.estimatedTimeInHours = null;
        this.cdRef.detectChanges();
      } else if (this.estimatedTimeInHours === '0'){
        this.totalEstimatedTimeInHours.emit(null);
        this.isValidationShow = false;
        this.ismaxHoursValdation = false;
        this.isminHoursValdation = true;
        this.estimatedTimeInHours = null;
        this.cdRef.detectChanges();
      } else {
        this.estimatedTimeInHours = null;
        this.isValidationShow = true;
        this.ismaxHoursValdation = false;
        this.isminHoursValdation = false;
        this.cdRef.detectChanges();
        this.totalEstimatedTimeInHours.emit(null);
      }
    }
    else {
      this.ismaxHoursValdation = false;
      this.isminHoursValdation = false;
      this.totalEstimatedTimeInHours.emit(null);
    }
  }

 
  
  getTimeInWeekDayToHours(estimatedTime) {
    let week = estimatedTime.substring(0,estimatedTime.indexOf("w"));
    let day = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1,estimatedTime.lastIndexOf("d"))
    let hour = estimatedTime.substring(estimatedTime.lastIndexOf("d") + 1,estimatedTime.lastIndexOf("h"))
    this.totalHours = ((hour * 1) + (week * this.noOfHoursInAWeek) + (day * this.noOfHoursInADay));
    return this.totalHours;
  }

  getTimeInWeekAndDayToHours(estimatedTime) {
    let week = estimatedTime.substring(0,estimatedTime.indexOf("w"));
    let day = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1,estimatedTime.lastIndexOf("d"))
    this.totalHours = ((week * 40) + (day * this.noOfHoursInADay));
    return this.totalHours;
  }

  getTimeInWeekAndHourToHours(estimatedTime) {
    let week = estimatedTime.substring(0,estimatedTime.indexOf("w"));
    let hour = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1,estimatedTime.lastIndexOf("h"))
    this.totalHours = ((week * this.noOfHoursInAWeek) + (hour * 1));
    return this.totalHours;
  }

  getTimeInDayAndHourToHours(estimatedTime) {
    let day = estimatedTime.substring(0,estimatedTime.indexOf("d"));
    let hour = estimatedTime.substring(estimatedTime.lastIndexOf("d") + 1,estimatedTime.lastIndexOf("h"))
    this.totalHours = ((day * this.noOfHoursInADay) + (hour * 1));
    return this.totalHours;
  }

  getTimeInWeekToHours(estimatedTime) {
    let week = estimatedTime.substring(0,estimatedTime.indexOf("w"));
    this.totalHours = ((week * this.noOfHoursInAWeek));
    return this.totalHours;
  }

  getTimeInDayToHours(estimatedTime) {
    let day = estimatedTime.substring(0,estimatedTime.indexOf("d"));
    this.totalHours = ((day * this.noOfHoursInADay));
    return this.totalHours;
  }

  getTimeInHours(estimatedTime){
    this.totalHours = estimatedTime.substring(0,estimatedTime.indexOf("h"));
    return this.totalHours;
  }
  
  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

}