import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";

import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { SolarLogModel } from "../../models/solar-log.model";
import { AppBaseComponent } from "../componentbase";
import { SiteService } from "../../services/site.service";
import { SiteModel } from "../../models/site-model";
import { ConstantVariables } from "../../constants/constant-variables";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from "moment";
import * as moment_ from 'moment';
const moment = moment_;

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: "app-manage-solar-log",
    templateUrl: "solar-log.component.html",
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class SolarLogComponent extends AppBaseComponent implements OnInit {
    solarsModel: SolarLogModel[] = [];
    sitesModel: SiteModel[] = [];
    archiveSolarModel: SolarLogModel;
    solarModel: GridDataResult;
    isLoading: boolean;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    solarForm: FormGroup;
    timestamp: any;
    solarId: string;
    state: State = {
        skip: 0,
        take: 10
    };
    confirmValues: any = [
        { name: 'Yes', value: true },
        { name: 'No', value: false }
    ];
    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.SalaryLogReferenceTypeId;
    solarUploadId: string;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isToUploadFiles: boolean = false;
    isFileExist: boolean;
    openForm: boolean = false;
    @ViewChild(MatDatepicker) picker1;


    @ViewChildren("addSolarPopUp") solarPopups;
    @ViewChildren("archiveSolarPopUp") archiveSolarPopups;
    solarVal: string;
    constructor(private solarService: SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
        this.clearForm();

    }
    ngOnInit() {
        this.getAllSolars();
        this.getAllSites();
        super.ngOnInit();
    }

    getAllSolars() {
        this.state.take = 10;
        this.state.skip = 0;
        this.isLoading = true;
        var solarmodel = new SolarLogModel();
        solarmodel.isArchived = false;
        this.solarService.searchSolarLog(solarmodel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.solarsModel = response.data;
                if (this.solarsModel.length > 0) {
                    this.solarModel = {
                        data: this.solarsModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.solarsModel.length
                    }
                } else {
                    this.solarModel = {
                        data: [],
                        total: 0
                    }
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.solarId = null;
        this.timestamp = null;
        this.solarForm = new FormGroup({
            siteId: new FormControl("", [
                Validators.required
            ]),
            date: new FormControl("", [
                Validators.required
            ]),
            solarLogValue: new FormControl("", [Validators.required]),
            solarLogValueTen: new FormControl({ value: '', disabled: true }, [Validators.required]),
            confirm: new FormControl("", [Validators.required])
        })
    }

    getAllSites() {
        var sitemodel = new SiteModel();
        sitemodel.isArchived = false;
        this.solarService.searchSite(sitemodel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.sitesModel = response.data;
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    upsertSolar(formDirective: FormGroupDirective) {
        this.isAddIsInProgress = true;
        this.isToUploadFiles = false;
        var upsertSolarmodel = new SolarLogModel();
        upsertSolarmodel = this.solarForm.value;
        var val1 = upsertSolarmodel["solarLogValue"];
        upsertSolarmodel.solorLogValue = val1;
        upsertSolarmodel.solarId = this.solarId;
        upsertSolarmodel.timeStamp = this.timestamp;
        this.solarService.upsertSolarLog(upsertSolarmodel).subscribe((response: any) => {
            this.isAddIsInProgress = false;
            if (response.success) {
                this.solarUploadId = response.data;
                this.isToUploadFiles = true;
                this.cdRef.detectChanges();
                formDirective.resetForm();
                this.clearForm();
                this.solarPopups.forEach((p) => { p.closePopover(); });
                this.openForm = false;
                this.cdRef.detectChanges();
                this.getAllSolars();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.openForm = false;
        this.solarUploadId = null;
        this.cdRef.detectChanges();
        this.solarPopups.forEach((p) => { p.closePopover(); });
    }

    archiveSolar() {
        this.isArchiveInProgress = true;
        var upsertSolarmodel = new SolarLogModel();
        upsertSolarmodel = this.archiveSolarModel;
        upsertSolarmodel.solarId = this.archiveSolarModel.solarId;
        upsertSolarmodel.isArchived = true;
        this.solarService.upsertSolarLog(upsertSolarmodel).subscribe((response: any) => {
            this.isArchiveInProgress = false;
            if (response.success) {
                this.archiveSolarPopups.forEach((p) => { p.closePopover(); });
                this.openForm = false;
                this.solarUploadId = null;
                this.getAllSolars();
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editSolarPopUp(dataItem, solarPopUp) {
        this.openForm = true;
        this.cdRef.detectChanges();
        this.solarId = dataItem.solarId;
        this.solarUploadId = dataItem.solarId;
        this.timestamp = dataItem.timeStamp;
        this.solarForm.patchValue(dataItem);
        this.solarForm.controls['solarLogValueTen'].setValue(parseFloat(this.solarForm.controls['solarLogValue'].value) * 1000);
        solarPopUp.openPopover();
    }

    openSolarPopUp(solarPopUp) {
        this.solarUploadId = null;
        this.openForm = true;
        this.cdRef.detectChanges();
        this.clearForm();
        solarPopUp.openPopover();
    }

    deleteSolarPopUp(dataItem, solarPopUp) {
        this.archiveSolarModel = dataItem;
        solarPopUp.openPopover();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.solarsModel = orderBy(this.solarsModel, this.state.sort);
        }
        this.solarModel = {
            data: this.solarsModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.solarsModel.length
        }
    }

    closeDeletePopup() {
        this.archiveSolarPopups.forEach((p) => { p.closePopover(); });
    }

    downloadPdf() {
        this.solarService.downloadPdf().subscribe((response: any) => {
            if (response.success) {
                console.log(response.data);
            }
        })
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    onKey(event) {
        this.solarForm.controls['solarLogValueTen'].setValue(parseFloat(this.solarForm.controls['solarLogValue'].value) * 1000);
    }


    monthSelected(normalizedYear: Moment) {
        let fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        let date = fromDate.toString() + '-01';
        this.solarForm.controls['date'].setValue(date);
        this.picker1.close();
    }

    numberOnly(event) {
        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    numberOnlyWithVal(event, value) {
        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (charCode == 46 && value.toString().includes(".") == false) {
                return true;
            }
            return false;
        }
        return true;
    }

    getComma(event) {
        var value;
        if (event) {
            value = event.replace(/ /g, ',');
            return value;
        }
        else {
            return event;
        }
    }

      CommaFormatted(value) {
        if (value !=  null && value != undefined) {
          var str = value.toString().split(".");
          str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return str.join(".");
        }
      }
}