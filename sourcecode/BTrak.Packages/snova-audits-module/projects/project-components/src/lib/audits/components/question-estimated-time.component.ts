import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';

@Component({
    selector: "app-question-estimated-time",
    templateUrl: "./question-estimated-time.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionEstimatedTimeComponent implements OnInit {
    estimatedTime;
    @Input("estimatedTime")
    set _estimatedTime(data: string) {
        this.estimatedTime = data;
        if (this.estimatedTime != null || this.estimatedTime != undefined || this.estimatedTime != '') {
            this.estimatedTime = this.convertHoursIntoWeek(this.estimatedTime);
            this.cdRef.detectChanges();
            this.estimatedTimeFormControl.patchValue(this.estimatedTime);
        }
        this.getSoftLabelConfigurations();
    }

    @Input("estimationTimeReset")
    set _estimationTimeReset(data: string) {
        if (data == 'reset')
            this.resetEstimatedTime();
    }

    @Input("isDetailsPage")
    set _isDetailsPage(data: boolean) {
        this.isDetailsPage = data;
    }

    @Input() isDisabled: boolean;
    @Output() totalEstimatedTimeInHours = new EventEmitter<any>();
    softLabels: SoftLabelConfigurationModel[];
    regexPattern: string = "^[0-9]{1,3}[w][0-9]{1,3}[d][0-9]{1,3}[h]$|[0-9]{1,3}[d][0-9]{1,3}[h]$|[0-9]{1,3}[w][0-9]{1,3}[d]$|[0-9]{1,3}[w][0-9]{1,3}[h]$|[0-9]{1,3}[d]$|[0-9]{1,3}[w]$|[0-9]{1,3}[h]$";
    totalHours: any;
    estimatedTimeInHours: any;
    noOfHoursInADay: number = 8;
    noOfHoursInAWeek: number = 40;
    isValidationShow: boolean;
    isMaxValidation: boolean;
    isMinValidation: boolean;
    isRequired: boolean;
    isDetailsPage: boolean;
    estimatedTimeFormControl = new FormControl("", {
        validators: [Validators.pattern(this.regexPattern)], updateOn: 'blur'
    })
    public ngDestroyed$ = new Subject();

    constructor(private toastr: ToastrService, private cdRef: ChangeDetectorRef, private router: Router) { }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        if (this.router.url.toString().includes("myWork/adhoc-work")) {
            this.isRequired = true;
            this.estimatedTimeFormControl.setValidators([Validators.pattern(this.regexPattern)]);
            this.cdRef.detectChanges();
        }
        else
            this.isRequired = false;
    }

    convertHoursIntoWeek(estimatedTime) {
        let hoursInWeek = 40;
        let hoursInDay = 8;
        let weeks = Math.floor(estimatedTime / hoursInWeek);
        estimatedTime = estimatedTime - weeks * hoursInWeek;
        let days = Math.floor(estimatedTime / hoursInDay);
        estimatedTime = estimatedTime - days * hoursInDay;

        var estimatedFinalConstructedString = '';

        if (weeks > 0) {
            estimatedFinalConstructedString = weeks + 'w';
        }

        if (days > 0) {
            if (estimatedFinalConstructedString != '') {
                estimatedFinalConstructedString += ' ';
            }
            estimatedFinalConstructedString += days + 'd';
        }

        if (estimatedTime > 0) {
            if (estimatedFinalConstructedString != '') {
                estimatedFinalConstructedString += ' ';
            }
            estimatedFinalConstructedString += estimatedTime + 'h';
        }

        return estimatedFinalConstructedString;

    }

    saveEstimatedTime() {
        if (this.estimatedTimeFormControl.valid) {
            this.estimatedTime = this.estimatedTimeFormControl.value;
            const lastCharacterOfString = this.estimatedTime.slice(this.estimatedTime.length - 1);
            if (this.estimatedTime.includes('w') && this.estimatedTime.includes('d') && this.estimatedTime.includes('h') && lastCharacterOfString === 'h') {
                this.estimatedTimeInHours = this.getTimeInWeekDayToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('w') && this.estimatedTime.includes('d') && lastCharacterOfString === 'd') {
                this.estimatedTimeInHours = this.getTimeInWeekAndDayToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('w') && this.estimatedTime.includes('h') && lastCharacterOfString === 'h') {
                this.estimatedTimeInHours = this.getTimeInWeekAndHourToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('d') && this.estimatedTime.includes('h') && lastCharacterOfString === 'h') {
                this.estimatedTimeInHours = this.getTimeInDayAndHourToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('w') && lastCharacterOfString === 'w') {
                this.estimatedTimeInHours = this.getTimeInWeekToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('d') && lastCharacterOfString === 'd') {
                this.estimatedTimeInHours = this.getTimeInDayToHours(this.estimatedTime);
            }
            else if (this.estimatedTime.includes('h') && lastCharacterOfString === 'h') {
                this.estimatedTimeInHours = this.getTimeInHours(this.estimatedTime);
            }
            else {

            }
            if (this.estimatedTimeInHours > 99) {
                this.totalEstimatedTimeInHours.emit(null);
                this.isMaxValidation = true;
                this.isMinValidation = false;
                this.cdRef.detectChanges();
            }
            else if (this.estimatedTimeInHours > 0) {
                this.totalEstimatedTimeInHours.emit(this.estimatedTimeInHours);
                this.isValidationShow = false;
                this.isMaxValidation = false;
                this.isMinValidation = false;
                this.estimatedTimeInHours = null;
                this.cdRef.detectChanges();
            } else if (this.estimatedTimeInHours === '0') {
                this.totalEstimatedTimeInHours.emit(null);
                this.estimatedTimeInHours = null;
                this.isValidationShow = false;
                this.isMaxValidation = false;
                this.isMinValidation = true;
                this.cdRef.detectChanges();
            }
            else {
                this.totalEstimatedTimeInHours.emit(null);
                this.estimatedTimeInHours = null;
                this.isValidationShow = true;
                this.isMaxValidation = false;
                this.isMinValidation = false;
                this.cdRef.detectChanges();
            }
        }

        else {
            this.isValidationShow = false;
            this.totalEstimatedTimeInHours.emit('null');
        }
    }

    getTimeInWeekDayToHours(estimatedTime) {
        let week = estimatedTime.substring(0, estimatedTime.indexOf("w"));
        let day = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1, estimatedTime.lastIndexOf("d"))
        let hour = estimatedTime.substring(estimatedTime.lastIndexOf("d") + 1, estimatedTime.lastIndexOf("h"))
        this.totalHours = ((hour * 1) + (week * this.noOfHoursInAWeek) + (day * this.noOfHoursInADay)).toString();
        return this.totalHours;
    }

    getTimeInWeekAndDayToHours(estimatedTime) {
        let week = estimatedTime.substring(0, estimatedTime.indexOf("w"));
        let day = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1, estimatedTime.lastIndexOf("d"))
        this.totalHours = ((week * 40) + (day * this.noOfHoursInADay)).toString();
        return this.totalHours;
    }

    getTimeInWeekAndHourToHours(estimatedTime) {
        let week = estimatedTime.substring(0, estimatedTime.indexOf("w"));
        let hour = estimatedTime.substring(estimatedTime.lastIndexOf("w") + 1, estimatedTime.lastIndexOf("h"))
        this.totalHours = ((week * this.noOfHoursInAWeek) + (hour * 1)).toString();
        return this.totalHours;
    }

    getTimeInDayAndHourToHours(estimatedTime) {
        let day = estimatedTime.substring(0, estimatedTime.indexOf("d"));
        let hour = estimatedTime.substring(estimatedTime.lastIndexOf("d") + 1, estimatedTime.lastIndexOf("h"))
        this.totalHours = ((day * this.noOfHoursInADay) + (hour * 1)).toString();

        return this.totalHours;
    }

    getTimeInWeekToHours(estimatedTime) {
        let week = estimatedTime.substring(0, estimatedTime.indexOf("w"));
        this.totalHours = ((week * this.noOfHoursInAWeek)).toString();

        return this.totalHours;
    }

    getTimeInDayToHours(estimatedTime) {
        let day = estimatedTime.substring(0, estimatedTime.indexOf("d"));
        this.totalHours = ((day * this.noOfHoursInADay)).toString();
        return this.totalHours;
    }

    getTimeInHours(estimatedTime) {

        this.totalHours = estimatedTime.substring(0, estimatedTime.indexOf("h"));
        return this.totalHours;
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    resetEstimatedTime() {
        this.estimatedTimeFormControl = new FormControl("", {
            validators: [Validators.pattern(this.regexPattern)], updateOn: 'blur'
        })
    }

    addApplicableClass() {
        if (this.isDetailsPage) {
            return "search_goalinput ml-02 input-padding"
        } else {
            return "full-width"
        }
    }

    applicableClassforEstimatedTime() {
        if (this.isDetailsPage) {
            return "search_goalinput chip-box-margin ml-02 input-padding"
        } else {
            return "full-width"
        }
    }
}