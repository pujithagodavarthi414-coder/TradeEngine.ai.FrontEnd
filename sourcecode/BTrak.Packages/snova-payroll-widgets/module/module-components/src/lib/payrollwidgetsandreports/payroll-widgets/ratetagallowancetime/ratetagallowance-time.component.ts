import { ChangeDetectorRef, Component, OnInit, ViewChildren, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SearchHourlyTds } from "../../models/search-hourly-tdsmodel";
import { PayRollService } from "../../services/PayRollService";
import { RateTagAllowanceTime } from "../../models/ratetagallowancetimemodel";
import { RateTagForModel } from "../../models/ratetag-for-model";
import { Branch } from '../../models/branch';
import { LoadBranchTriggered } from '../../store/actions/branch.actions';
import { PayRollManagementState } from '../../store/reducers/index';
import * as branchReducer from '../../store/reducers/index';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
    selector: 'app-ratetag-allowance-time',
    templateUrl: `ratetagallowance-time.component.html`,
    styles: [`
    .ratetagfor-margin{
        margin-top: -6px;
       }
    `]
})

export class RateTagAllowanceTimeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("rateTagAllowanceTimePopUp") rateTagAllowanceTimePopover;
    @ViewChildren("deleteRateTagAllowanceTimePopUp") deleteRateTagAllowanceTimePopover;
    @ViewChild('tagInput') tagInput: ElementRef;

    branchList$: Observable<Branch[]>;
    searchText: string;
    isArchivedTypes: boolean;
    rateTagAllowanceTimeData: any;
    deleteallowance: any;
    rateTag: any;
    rateTagAllowanceForm: FormGroup;
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
    selectedTagItems: any = [];
    ratetagforlist: RateTagForModel[];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tag: string;
    tags: RateTagForModel[] = [];
    count: number;
    rateTagsInput: any;
    rateInputTags: RateTagForModel[] = [];
    removable: boolean = true;
    selectable: boolean = true;
    rateTagsList: RateTagForModel[];
    isAdd: boolean;
    rateTagForNames: RateTagForModel[];
    ngOnInit() {
        super.ngOnInit();
        this.rateTagAllowanceTimeData = [];
        this.clearForm();
        this.getAllBranches();
        this.getAllRateTagForNames();
        this.getRateTagAllowanceTime();

    }
    // tslint:disable-next-line: max-line-length
    constructor(private store: Store<PayRollManagementState>, private cdRef: ChangeDetectorRef, private payRoll: PayRollService, private toastr: ToastrService) { super() }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.isMinError = false;
        this.minRequired = true;
        this.maxRequired = true;
        this.selectedTagItems = [];
        this.rateTagAllowanceForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            allowanceRateTagForId: new FormControl(null,
            ),
            allowanceRateTagForIds: new FormControl([],
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
            isBankHoliday: new FormControl(null
            )
        })
    }

    search(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter(data =>
            (data.branchName == null ? null : data.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.rateTagForName == null ? null : data.rateTagForName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.maxTime == null ? null : data.maxTime.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.minTime == null ? null : data.minTime.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.activeFrom == null ? null : moment(data.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.activeTo == null ? null : moment(data.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? data.isBankHoliday == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? data.isBankHoliday == false : null))
        this.rateTagAllowanceTimeData = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.search(null);
    }

    changeValidatorsMin() {
        if (this.maxRequired) {
            if ((this.rateTagAllowanceForm.value.maxTime != null && this.rateTagAllowanceForm.value.maxTime != "") && this.minRequired) {
                this.minRequired = false;
                this.maxRequired = true;
                this.rateTagAllowanceForm.controls["minTime"].clearValidators();
                var val = this.rateTagAllowanceForm.value.maxTime;
                this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
            } else {
                if (this.rateTagAllowanceForm.value.minTime != null && this.rateTagAllowanceForm.value.minTime != "") {
                    this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.rateTagAllowanceForm.controls["maxTime"].clearValidators();
                    this.minRequired = true;
                    this.maxRequired = false;
                } else if (this.rateTagAllowanceForm.value.maxTime != null && this.rateTagAllowanceForm.value.maxTime != "") {
                    this.minRequired = false;
                    this.maxRequired = true;
                    this.rateTagAllowanceForm.controls["minTime"].clearValidators();
                    var val = this.rateTagAllowanceForm.value.maxTime;
                    this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
                } else {
                    this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.rateTagAllowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.minRequired = true;
                    this.maxRequired = true;
                }
            }
            this.rateTagAllowanceForm.controls["minTime"].updateValueAndValidity();
            this.rateTagAllowanceForm.controls["maxTime"].updateValueAndValidity();
        }
    }

    changeValidatorsMax() {
        if (this.minRequired) {
            if ((this.rateTagAllowanceForm.value.minTime != null && this.rateTagAllowanceForm.value.minTime != "") && this.maxRequired) {
                this.maxRequired = false;
                this.minRequired = true;
                this.rateTagAllowanceForm.controls["maxTime"].clearValidators();
            } else {
                if (this.rateTagAllowanceForm.value.maxTime != null && this.rateTagAllowanceForm.value.maxTime != "") {
                    this.rateTagAllowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.rateTagAllowanceForm.controls["minTime"].clearValidators();
                    var val = this.rateTagAllowanceForm.value.maxTime;
                    this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
                    this.maxRequired = true;
                    this.minRequired = false;
                } else if (this.rateTagAllowanceForm.value.minTime != null && this.rateTagAllowanceForm.value.minTime != "") {
                    this.maxRequired = false;
                    this.minRequired = true;
                    this.rateTagAllowanceForm.controls["maxTime"].clearValidators();
                } else {
                    this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.required]);
                    this.rateTagAllowanceForm.controls["maxTime"].setValidators([Validators.required]);
                    this.minRequired = true;
                    this.maxRequired = true;
                }
            }
            this.rateTagAllowanceForm.controls["maxTime"].updateValueAndValidity();
            this.rateTagAllowanceForm.controls["minTime"].updateValueAndValidity();
        }
    }

    minCheck() {
        if ((this.rateTagAllowanceForm.value.maxTime == null || this.rateTagAllowanceForm.value.maxTime == "") && this.rateTagAllowanceForm.value.maxTime != 0) {
            this.isMinError = false;
            this.cdRef.detectChanges();
        } else if (this.rateTagAllowanceForm.value.maxTime >= this.rateTagAllowanceForm.value.minTime) {
            this.isMinError = false;
            this.cdRef.detectChanges();
        } else {
            this.isMinError = true;
            this.cdRef.detectChanges();
        }
        this.cdRef.detectChanges();
    }

    createRateTagAllowanceTimePopupOpen(rateTagAllowanceTimePopUp) {
        this.isAdd = true;
        this.rateInputTags = [];

        this.rateTagAllowanceForm.controls["allowanceRateTagForIds"].setValidators([Validators.required]);
        this.rateTagAllowanceForm.controls["allowanceRateTagForIds"].updateValueAndValidity();
        this.rateTagAllowanceForm.controls["allowanceRateTagForId"].clearValidators();
        this.rateTagAllowanceForm.controls["allowanceRateTagForId"].updateValueAndValidity();

        this.popOverHeading = 'RATETAGALLOWANCETIME.CREATERATETAGALLOWANCETIME';
        rateTagAllowanceTimePopUp.openPopover();
    }

    editupsertRateTagAllowanceTimePopupOpen(row, rateTagAllowanceTimePopUp) {
        this.isAdd = false;
        this.popOverHeading = 'RATETAGALLOWANCETIME.EDITRATETAGALLOWANCETIME';
        this.rateTagAllowanceForm.patchValue(row);
        if (this.rateTagAllowanceForm.value.activeTo == "0001-01-01T00:00:00") {
            this.rateTagAllowanceForm.get('activeTo').patchValue(null);
        }
        if (this.rateTagAllowanceForm.value.maxTime != null) {
            var val = this.rateTagAllowanceForm.value.maxTime;
            this.rateTagAllowanceForm.controls["minTime"].setValidators([Validators.max(val)]);
            this.minRequired = false;
        } else {
            this.maxRequired = false;
            this.rateTagAllowanceForm.controls["maxTime"].clearValidators();
        }
        this.rateTagAllowanceForm.controls["maxTime"].updateValueAndValidity();
        this.rateTagAllowanceForm.controls["minTime"].updateValueAndValidity();

        this.rateTagAllowanceForm.controls["allowanceRateTagForId"].setValidators([Validators.required]);
        this.rateTagAllowanceForm.controls["allowanceRateTagForId"].updateValueAndValidity();
        this.rateTagAllowanceForm.controls["allowanceRateTagForIds"].clearValidators();
        this.rateTagAllowanceForm.controls["allowanceRateTagForIds"].updateValueAndValidity();

        this.timeStamp = row.timeStamp;
        rateTagAllowanceTimePopUp.openPopover();
    }

    deleteRateTagAllowanceTimePopUpOpen(row, deleteRateTagAllowanceTimePopUp) {
        this.deleteallowance = [];
        this.deleteallowance = row;
        this.timeStamp = this.deleteallowance.timeStamp;
        deleteRateTagAllowanceTimePopUp.openPopover();
    }

    closedeleteRateTagAllowanceTimeDialog() {
        this.deleteallowance = [];
        this.deleteRateTagAllowanceTimePopover.forEach((p) => p.closePopover());
    }

    closeUpsertRateTagAllowanceTimePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.rateTagAllowanceTimePopover.forEach((p) => p.closePopover());
    }

    deleteAllowance() {
        this.isAnyOperationIsInprogress = true;
        var rateTagAllowanceTime = new RateTagAllowanceTime();
        rateTagAllowanceTime.id = this.deleteallowance.id;
        rateTagAllowanceTime.branchId = this.deleteallowance.branchId;
        rateTagAllowanceTime.allowanceRateTagForId = this.deleteallowance.allowanceRateTagForId;
        rateTagAllowanceTime.maxTime = this.deleteallowance.maxTime;
        rateTagAllowanceTime.minTime = this.deleteallowance.minTime;
        rateTagAllowanceTime.activeFrom = this.deleteallowance.activeFrom;
        rateTagAllowanceTime.activeTo = this.deleteallowance.activeTo;
        rateTagAllowanceTime.isBankHoliday = this.deleteallowance.isBankHoliday;

        if (this.deleteallowance.activeTo == "0001-01-01T00:00:00") {
            rateTagAllowanceTime.activeTo = null;
        }
        rateTagAllowanceTime.timeStamp = this.timeStamp;
        if (this.isArchivedTypes) {
            rateTagAllowanceTime.isArchived = false;
        } else {
            rateTagAllowanceTime.isArchived = true;
        }

        this.payRoll.upsertRateTagAllowanceTime(rateTagAllowanceTime).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                this.getRateTagAllowanceTime();
                this.closedeleteRateTagAllowanceTimeDialog();
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

    getAllRateTagForNames() {
        this.rateTag = [];
        var rateTagForModel = new RateTagForModel();
        rateTagForModel.isAllowance = true;
        this.payRoll.getAllRateTagForNames(rateTagForModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTagForNames = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    getRateTagAllowanceTime() {
        this.isAnyOperationIsInprogress = true;
        var searchHourlyTds = new SearchHourlyTds();
        if (this.isArchivedTypes) {
            searchHourlyTds.isArchived = true;
        } else {
            searchHourlyTds.isArchived = false;
        }
        searchHourlyTds.searchText = this.searchText;
        this.payRoll.getRateTagAllowanceTime(searchHourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTagAllowanceTimeData = [];
                this.rateTagAllowanceTimeData = response.data;
                this.temp = this.rateTagAllowanceTimeData;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    upsertRateTagAllowanceTime(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var rateTagAllowanceTime = new RateTagAllowanceTime();
        rateTagAllowanceTime.id = this.rateTagAllowanceForm.value.id;
        rateTagAllowanceTime.branchId = this.rateTagAllowanceForm.value.branchId;
        rateTagAllowanceTime.allowanceRateTagForId = this.rateTagAllowanceForm.value.allowanceRateTagForId;
        rateTagAllowanceTime.maxTime = this.rateTagAllowanceForm.value.maxTime;
        rateTagAllowanceTime.minTime = this.rateTagAllowanceForm.value.minTime;
        rateTagAllowanceTime.activeFrom = this.rateTagAllowanceForm.value.activeFrom;
        rateTagAllowanceTime.activeTo = this.rateTagAllowanceForm.value.activeTo;
        rateTagAllowanceTime.isBankHoliday = this.rateTagAllowanceForm.value.isBankHoliday;
        if (this.rateTagAllowanceForm.value.activeTo == "0001-01-01T00:00:00") {
            rateTagAllowanceTime.activeTo = null;
        }
        rateTagAllowanceTime.timeStamp = this.timeStamp;


        if (this.rateInputTags != null && this.rateInputTags.length > 0) {
            this.rateInputTags.forEach(x => {
                rateTagAllowanceTime.allowanceRateTagForIds.push(x)
            });
        }

        this.payRoll.upsertRateTagAllowanceTime(rateTagAllowanceTime).subscribe((response: any) => {
            if (response.success == true) {
                formDirective.resetForm();
                this.clearForm();
                this.getRateTagAllowanceTime();
                this.isAnyOperationIsInprogress = false;
                this.rateTagAllowanceTimePopover.forEach((p) => p.closePopover());
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

    selectedTagValue(event) {
        var alreadyExistedRateTag = null;
        if (this.rateInputTags.length > 0) {
            alreadyExistedRateTag = this.rateInputTags.find(x => x.rateTagForId == event.option.value.rateTagForId);
        }

        if (alreadyExistedRateTag) {
            this.toastr.error("This tag is already selected");
        }
        else {
            this.rateInputTags.push(event.option.value);
            this.tagInput.nativeElement.value = '';
        }
    }

    removeTags(tags) {
        const index = this.rateInputTags.indexOf(tags);
        if (index >= 0) {
            this.rateInputTags.splice(index, 1);
        }
    }
}
