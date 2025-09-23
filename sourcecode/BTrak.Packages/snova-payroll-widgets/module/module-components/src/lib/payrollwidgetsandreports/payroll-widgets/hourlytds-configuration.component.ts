import { Component, OnInit, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { FormGroupDirective, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Store, select } from '@ngrx/store';
import { PayRollService } from "../services/PayRollService";
import { SearchHourlyTds } from "../models/search-hourly-tdsmodel";
import { ToastrService } from "ngx-toastr";
import { HourlyTds } from "../models/hourly-tdsmodel";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';

@Component({
    selector: 'app-hourlytds-configuration',
    templateUrl: `hourlytds-configuration.component.html`
})

export class HourlyTdsConfigurationComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertHourlyTdsConfigurationPopUp") upsertHourlyTdsConfigurationPopover;
    @ViewChildren("deleteHourlyTdsPopUp") deleteHourlyTdsPopover;

    hourlyTdsForm: FormGroup;
    isAnyOperationIsInprogress: boolean = false;
    hourlyTdsData: any;
    isArchived: boolean = false;
    timeStamp: any;
    branchList$: Observable<Branch[]>;
    validationMessage: string;
    deleteHourls: any;
    isArchivedTypes: boolean = false;
    popOverHeading: string;
    searchText: string;
    minDate: Date;
    temp: any;

    ngOnInit() {
        super.ngOnInit();
        this.hourlyTdsData = [];
        this.isAnyOperationIsInprogress = true;
        this.clearForm();
        this.getAllBranches();
        this.getHourlyTdsConfiguration();
        
    }
    constructor(private store: Store<PayRollManagementState>,
        private cdRef: ChangeDetectorRef, private payRoll: PayRollService, private toastr: ToastrService){super()}

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.hourlyTdsForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            maxLimit: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            taxPercentage: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.max(100)
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
        //   this.searchText = this.searchText.trim();
        //   if (this.searchText.length <= 0) return;
        // }
        // this.getHourlyTdsConfiguration();
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        
        const temp = this.temp.filter(data => 
            (data.branchName == null ? null : data.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.maxLimit == null ? null : data.maxLimit.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.taxPercentage == null ? null : data.taxPercentage.toString().toLowerCase().indexOf(this.searchText) > -1))

        this.hourlyTdsData = temp;
      }

    closeSearch() {
        this.searchText = '';
        this.search(null);
    }

    createHourlyTdsPopupOpen(upsertHourlyTdsConfigurationPopUp) {
        this.clearForm();
        this.popOverHeading = 'PAYROLLBRANCHCONFIGURATION.CREATEHOURLYTDS';
        upsertHourlyTdsConfigurationPopUp.openPopover();
    }
    editupsertHourlyTdsPopupOpen(row, upsertHourlyTdsConfigurationPopUp) {
        this.popOverHeading = 'PAYROLLBRANCHCONFIGURATION.EDITHOURLYTDS';
        this.hourlyTdsForm.patchValue(row);
        this.timeStamp = row.timeStamp;
        upsertHourlyTdsConfigurationPopUp.openPopover();
    }

    deleteHourlyTdsPopUpOpen(row, deleteHourlyTdsPopover) {
        this.deleteHourls = row;
        deleteHourlyTdsPopover.openPopover();
    }

    closeDeleteHourlyTdsDialog() {
        this.deleteHourls = [];
        this.deleteHourlyTdsPopover.forEach((p) => p.closePopover());
    }

    deleteHourlyTds() {
        this.isAnyOperationIsInprogress = true;
        var hourlyTds = new HourlyTds();
        hourlyTds.id = this.deleteHourls.id;
        hourlyTds.branchId = this.deleteHourls.branchId;
        hourlyTds.maxLimit = this.deleteHourls.maxLimit;
        hourlyTds.taxPercentage = this.deleteHourls.taxPercentage;
        hourlyTds.activeFrom = this.deleteHourls.activeFrom;
        hourlyTds.activeTo = this.deleteHourls.activeTo;
        if(this.isArchivedTypes) {
            hourlyTds.isArchived = false;
        } else {
            hourlyTds.isArchived = true;
        }
        hourlyTds.timeStamp = this.deleteHourls.timeStamp;

        this.payRoll.upsertHourlyTdsConfiguration(hourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                this.getHourlyTdsConfiguration();
                this.isAnyOperationIsInprogress = false;
                this.closeDeleteHourlyTdsDialog();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }

    upsertHourlyTds(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        var hourlyTds = new HourlyTds();
        hourlyTds.id = this.hourlyTdsForm.value.id;
        hourlyTds.branchId = this.hourlyTdsForm.value.branchId;
        hourlyTds.maxLimit = this.hourlyTdsForm.value.maxLimit;
        hourlyTds.taxPercentage = this.hourlyTdsForm.value.taxPercentage;
        hourlyTds.activeFrom = this.hourlyTdsForm.value.activeFrom;
        hourlyTds.activeTo = this.hourlyTdsForm.value.activeTo;
        hourlyTds.timeStamp = this.timeStamp;

        this.payRoll.upsertHourlyTdsConfiguration(hourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                formDirective.resetForm();
                this.clearForm();
                this.getHourlyTdsConfiguration();
                this.isAnyOperationIsInprogress = false;
                this.upsertHourlyTdsConfigurationPopover.forEach((p) => p.closePopover());
            } else {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }

    closeUpsertHourlyTdsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertHourlyTdsConfigurationPopover.forEach((p) => p.closePopover());
    }

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
        this.cdRef.detectChanges();
    }

    getHourlyTdsConfiguration() {
        this.isAnyOperationIsInprogress = true;
        var searchHourlyTds = new SearchHourlyTds();
        if(this.isArchivedTypes) {
            searchHourlyTds.isArchived = true;
        } else {
            searchHourlyTds.isArchived = false;
        }
        this.payRoll.getHourlyTdsConfiguration(searchHourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.hourlyTdsData = [];
                this.hourlyTdsData = response.data;
                this.temp = this.hourlyTdsData;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46);
    }
}