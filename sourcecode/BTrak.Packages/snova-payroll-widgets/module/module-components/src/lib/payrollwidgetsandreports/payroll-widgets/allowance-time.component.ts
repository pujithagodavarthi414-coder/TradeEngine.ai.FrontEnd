import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SearchHourlyTds } from "../models/search-hourly-tdsmodel";
import { PayRollService } from "../services/PayRollService";
import { AllowanceTime } from "../models/allowance-timemodel";
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import { RateSheetForModel } from '../models/ratesheet-for-model';

@Component({
    selector: 'app-allowance-time',
    templateUrl: `allowance-time.component.html`
})

export class AllowanceTimeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("allowanceTimePopUp") allowanceTimePopover;
    @ViewChildren("deleteallowanceTimePopUp") deleteallowanceTimePopover;

    branchList$: Observable<Branch[]>;
    searchText: string;
    isArchivedTypes: boolean;
    allowanceTimeData: any;
    deleteallowance: any;
    rateSheet: any;
    allowanceForm: FormGroup;
    validationMessage: string;
    intimepicker: any;
    fromTimePicker: any;
    isAnyOperationIsInprogress: boolean;
    timeStamp: any;
    popOverHeading: string;
    minRequired: boolean = true;
    maxRequired: boolean = true;
    minDate: Date;
    isMinError: boolean;
    temp: any;

    ngOnInit() {
        super.ngOnInit();
        this.allowanceTimeData = [];
        this.clearForm();
        this.getAllBranches();
        this.getAllRateSheetForNames();
        this.getAllowanceTime();
        
    }
    // tslint:disable-next-line: max-line-length
    constructor(private store: Store<PayRollManagementState>, private cdRef: ChangeDetectorRef, private payRoll: PayRollService, private toastr: ToastrService) { super()}

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.isMinError = false;
        this.minRequired = true;
        this.maxRequired = true;
        this.allowanceForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            allowanceRateSheetForId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            maxTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            minTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null
            ),
            id: new FormControl(null
            ),
        })

    }

    search(event) {
        // if (this.searchText.length > 0) {
        //     this.searchText = this.searchText.trim();
        //     if (this.searchText.length <= 0) return;
        // }
        //this.getAllowanceTime();
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter(data => 
            (data.branchName == null ? null : data.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.rateSheetForName == null ? null : data.rateSheetForName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.maxTime == null ? null : data.maxTime.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.minTime == null ? null : data.minTime.toString().toLowerCase().indexOf(this.searchText) > -1))
        this.allowanceTimeData = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.search(null);
    }

    changeValidatorsMin() {
        if (this.maxRequired) {
            if ((this.allowanceForm.value.maxTime != null && this.allowanceForm.value.maxTime != "") && this.minRequired) {
                this.minRequired = false;
                this.maxRequired = true;
                this.allowanceForm.controls["minTime"].clearValidators();
                var val = this.allowanceForm.value.maxTime;
                this.allowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
            } else {
                if (this.allowanceForm.value.minTime != null && this.allowanceForm.value.minTime != "") {
                    this.allowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.allowanceForm.controls["maxTime"].clearValidators();
                    this.minRequired = true;
                    this.maxRequired = false;
                } else if ( this.allowanceForm.value.maxTime != null && this.allowanceForm.value.maxTime != "") {
                    this.minRequired = false;
                    this.maxRequired = true;
                    this.allowanceForm.controls["minTime"].clearValidators();
                    var val = this.allowanceForm.value.maxTime;
                    this.allowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
                } else {
                    this.allowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.allowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.minRequired = true;
                    this.maxRequired = true;
                }
            }
            this.allowanceForm.controls["minTime"].updateValueAndValidity();
            this.allowanceForm.controls["maxTime"].updateValueAndValidity();
            // if (this.maxRequired && !this.minRequired) {
            //     var val = this.allowanceForm.value.maxTime;
            //     this.allowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
            // }
            // this.allowanceForm.controls["minTime"].updateValueAndValidity();
        }
    }

    changeValidatorsMax() {
        if (this.minRequired) {
            if ((this.allowanceForm.value.minTime != null && this.allowanceForm.value.minTime != "") && this.maxRequired) {
                this.maxRequired = false;
                this.minRequired = true;
                this.allowanceForm.controls["maxTime"].clearValidators();
            } else {
                if (this.allowanceForm.value.maxTime != null && this.allowanceForm.value.maxTime != "") {
                    this.allowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.allowanceForm.controls["minTime"].clearValidators();
                    var val = this.allowanceForm.value.maxTime;
                    this.allowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
                    this.maxRequired = true;
                    this.minRequired = false;
                } else if ( this.allowanceForm.value.minTime != null && this.allowanceForm.value.minTime != "" ) {
                    this.maxRequired = false;
                    this.minRequired = true;
                    this.allowanceForm.controls["maxTime"].clearValidators();
                } else {
                    this.allowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.allowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.minRequired = true;
                    this.maxRequired = true;
                }
            }
            this.allowanceForm.controls["maxTime"].updateValueAndValidity();
            this.allowanceForm.controls["minTime"].updateValueAndValidity();
        }
    }

    minCheck() {
        if ((this.allowanceForm.value.maxTime == null || this.allowanceForm.value.maxTime == "") && this.allowanceForm.value.maxTime!=0) {
            this.isMinError = false;
            this.cdRef.detectChanges();
        } else if ( this.allowanceForm.value.maxTime >= this.allowanceForm.value.minTime) {
            this.isMinError = false;
            this.cdRef.detectChanges();
        } else {
            this.isMinError = true;
            this.cdRef.detectChanges();
        }
        this.cdRef.detectChanges();
    }

    createAllowanceTimePopupOpen(allowanceTimePopUp) {
        this.popOverHeading = 'TAXRANGE.CREATEALLOWANCETIME';
        allowanceTimePopUp.openPopover();
    }

    editupsertAllowanceTimePopupOpen(row, allowanceTimePopUp) {
        this.popOverHeading = 'PAYROLLBRANCHCONFIGURATION.EDITALLOWANCETIME';
        this.allowanceForm.patchValue(row);
        if (this.allowanceForm.value.activeTo == "0001-01-01T00:00:00") {
            this.allowanceForm.get('activeTo').patchValue(null);
        }
        if (this.allowanceForm.value.maxTime != null) {
            var val = this.allowanceForm.value.maxTime;
            this.allowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
            // this.allowanceForm.controls["minTime"].clearValidators();
            this.minRequired = false;
        } else {
            this.maxRequired = false;
            this.allowanceForm.controls["maxTime"].clearValidators();
        }
        this.allowanceForm.controls["maxTime"].updateValueAndValidity();
        this.allowanceForm.controls["minTime"].updateValueAndValidity();
        this.timeStamp = row.timeStamp;
        allowanceTimePopUp.openPopover();
    }

    deleteallowanceTimePopUpOpen(row, deleteallowanceTimePopUp) {
        this.deleteallowance = [];
        this.deleteallowance = row;
        this.timeStamp = this.deleteallowance.timeStamp;
        deleteallowanceTimePopUp.openPopover();
    }

    closeDeleteAllowanceTimeDialog() {
        this.deleteallowance = [];
        this.deleteallowanceTimePopover.forEach((p) => p.closePopover());
    }

    closeUpsertAllowanceTimePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.allowanceTimePopover.forEach((p) => p.closePopover());
    }

    deleteAllowance() {
        this.isAnyOperationIsInprogress = true;
        var allowanceTime = new AllowanceTime();
        allowanceTime.id = this.deleteallowance.id;
        allowanceTime.branchId = this.deleteallowance.branchId;
        allowanceTime.allowanceRateSheetForId = this.deleteallowance.allowanceRateSheetForId;
        allowanceTime.maxTime = this.deleteallowance.maxTime;
        allowanceTime.minTime = this.deleteallowance.minTime;
        allowanceTime.activeFrom = this.deleteallowance.activeFrom;
        allowanceTime.activeTo = this.deleteallowance.activeTo;
        if (this.deleteallowance.activeTo == "0001-01-01T00:00:00") {
            allowanceTime.activeTo = null;
        }
        allowanceTime.timeStamp = this.timeStamp;
        if (this.isArchivedTypes) {
            allowanceTime.isArchived = false;
        } else {
            allowanceTime.isArchived = true;
        }

        this.payRoll.upsertAllowanceTime(allowanceTime).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                this.getAllowanceTime();
                this.closeDeleteAllowanceTimeDialog();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
        this.cdRef.detectChanges();
    }

    getAllRateSheetForNames() {
        this.rateSheet = [];
        var rateSheetForModel = new RateSheetForModel();
        this.payRoll.getAllRateSheetForNames(rateSheetForModel).subscribe((response: any) => {
            if (response.success == true) {
                var data = response.data;
                data.forEach(x => {
                    if (x.isAllowance) {
                        this.rateSheet.push(x);
                    }
                });
                //this.rateSheet = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    getAllowanceTime() {
        this.isAnyOperationIsInprogress = true;
        var searchHourlyTds = new SearchHourlyTds();
        if (this.isArchivedTypes) {
            searchHourlyTds.isArchived = true;
        } else {
            searchHourlyTds.isArchived = false;
        }
        searchHourlyTds.searchText = this.searchText;
        this.payRoll.getAllowanceTime(searchHourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.allowanceTimeData = [];
                this.allowanceTimeData = response.data;
                this.temp = this.allowanceTimeData;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    upsertAllowanceTime(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var allowanceTime = new AllowanceTime();
        allowanceTime.id = this.allowanceForm.value.id;
        allowanceTime.branchId = this.allowanceForm.value.branchId;
        allowanceTime.allowanceRateSheetForId = this.allowanceForm.value.allowanceRateSheetForId;
        allowanceTime.maxTime = this.allowanceForm.value.maxTime;
        allowanceTime.minTime = this.allowanceForm.value.minTime;
        allowanceTime.activeFrom = this.allowanceForm.value.activeFrom;
        allowanceTime.activeTo = this.allowanceForm.value.activeTo;
        if (this.allowanceForm.value.activeTo == "0001-01-01T00:00:00") {
            allowanceTime.activeTo = null;
        }
        allowanceTime.timeStamp = this.timeStamp;

        this.payRoll.upsertAllowanceTime(allowanceTime).subscribe((response: any) => {
            if (response.success == true) {
                formDirective.resetForm();
                this.clearForm();
                this.getAllowanceTime();
                this.isAnyOperationIsInprogress = false;
                this.allowanceTimePopover.forEach((p) => p.closePopover());
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
      }
    
}
