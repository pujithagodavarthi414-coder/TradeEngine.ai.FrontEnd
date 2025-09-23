import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { CookieService } from "ngx-cookie-service";
import { RateTagModel } from "../../models/ratetag-model";
import { PayRollService } from "../../services/PayRollService";
import { RateTagForModel } from "../../models/ratetag-for-model";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CustomTagModel } from '../../models/customTagsModel';
import { ToastrService } from 'ngx-toastr';
import { AddRateTagComponent } from './add-ratetag.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: "app-ratetag",
    templateUrl: `ratetag.component.html`,
    styles: [`
    .ratetagfor-margin{
        margin-top: -6px;
       }
    `]
})

export class RateTagComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteRateTagPopUp") deleteRateTagPopUp;
    @ViewChildren("addRateTagPopUp") addRateTagPopUp;

    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    rateTags: any;
    rateTagForNamesList: any;
    validationMessage: string;
    searchText: string;
    rateTagModel: RateTagModel;
    rateTagForm: FormGroup;
    rateTagHeaderName: any;
    timeStamp: any;
    rateTagForId: RateTagForModel[];
    rateTagId: any;
    isIndividual: boolean;
    rateTagsFiltered: any;
    selectedTagItems = [];
    temp: any;
    ratetagforlist: RateTagForModel[];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tag: string;
    tags: RateTagForModel[] = [];
    count: number;
    rateTagsInput: any;
    tagIds: any;
    rateInputTags: RateTagForModel[] = [];
    removable: boolean = true;
    selectable: boolean = true;
    rateTagsList: RateTagForModel[];
    isMaxRequired: boolean;
    isMinRequired: boolean;
    employeeId: string;
    roleId: string;
    branchId: string;
    editRateTagDetailsData: RateTagModel;

    constructor(public payRollService: PayRollService, private cookieService: CookieService, private toastr: ToastrService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef,public dialog: MatDialog, ) {
        super()
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllRateTagForNames();
        this.getAllRateTags();
    }

    getAllRateTagForNames() {
        this.isAnyOperationIsInprogress = true;
        const rateTagForModel = new RateTagForModel();
        this.payRollService.getAllRateTagForNames(rateTagForModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTagForNamesList = response.data;
                this.rateTagsList = this.rateTagForNamesList
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getAllRateTags() {
        this.isAnyOperationIsInprogress = true;
        const rateTagModel = new RateTagModel();
        rateTagModel.isArchived = this.isArchived;
        this.payRollService.getAllRateTags(rateTagModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTags = response.data;
                this.temp = this.rateTags;
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    getArchiveAndUnarchived() {
        this.getAllRateTags();
    }

    deleteRateTagPopUpOpen(row, deleteRateTagPopUp) {
        this.rateTagModel = new RateTagModel();
        this.rateTagModel = this.mapProperties(this.rateTagModel, row);
        deleteRateTagPopUp.openPopover();
    }

    closeDeleteRateTagDialog() {
        this.deleteRateTagPopUp.forEach((p) => p.closePopover());
    }

    deleteRateTag() {
        this.isAnyOperationIsInprogress = true;
        this.rateTagModel.isArchived = !this.isArchived;

        this.payRollService.upsertRateTag(this.rateTagModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteRateTagPopUp.forEach((p) => p.closePopover());
                this.getAllRateTags();
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    mapProperties(targetObject, sourceObject) {
        return Object.assign(targetObject, sourceObject)
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const tempValues = this.temp.filter(tax => tax.isArchived == this.isArchived);
        const temp = tempValues.filter((ratetag => (((ratetag.rateTagName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.rateTagForNames == null ? null : ratetag.rateTagForNames.toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHour == null ? null : ratetag.ratePerHour.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourMon == null ? null : ratetag.ratePerHourMon.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourTue == null ? null : ratetag.ratePerHourTue.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourWed == null ? null : ratetag.ratePerHourWed.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourThu == null ? null : ratetag.ratePerHourThu.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourFri == null ? null : ratetag.ratePerHourFri.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun == null ? null : ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun == null ? null : ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.minTime == null ? null : ratetag.minTime.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.maxTime == null ? null : ratetag.maxTime.toString().toLowerCase().indexOf(this.searchText) > -1))
        )));
        this.rateTags = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.getAllRateTags();
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46);
    }

    searchRateTagForTags(event) {
        if (event != null) {
            var text = event.target.value.toLowerCase();
            this.rateTagForNamesList = this.rateTagsList.filter(ratetag => ((ratetag.rateTagForName.toString().toLowerCase().indexOf(text) > -1)))
        }
        else {
            this.rateTagForNamesList = this.rateTagsList;
        }
    }

    addRateTagDetailDetails(editBankDetailsPopover) {
        this.editRateTagDetailsData = null;
        editBankDetailsPopover.openPopover();
    }


    editRateTagDetailDetails(row, editBankDetailsPopover) {
        this.editRateTagDetailsData = row;
        editBankDetailsPopover.openPopover();
    }

    closeUpsertRateTagDetailsPopover() {
        this.addRateTagPopUp.forEach((p) => p.closePopover());
    }
}
