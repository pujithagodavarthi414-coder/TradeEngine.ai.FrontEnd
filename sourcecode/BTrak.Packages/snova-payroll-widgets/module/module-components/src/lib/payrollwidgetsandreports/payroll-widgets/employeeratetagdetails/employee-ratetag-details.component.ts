import { Component, Input, ViewChildren, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeRateTagModel } from "../../models/employee-ratetag-model";
import { PayRollService } from '../../services/PayRollService';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
import { EmployeeRateTagConfigurationModel } from '../../models/employeeratetagconfiguration';
import { AddRateTagsComponent } from '../ratetagconfiguration/add-ratetags.component';
import { RateTagRoleBranchConfigurationInputModel } from '../../models/ratetagrolebranchconfigurationinputmodel';
import { EmployeeRateTagInsertModel } from '../../models/employee-ratetag-insert-model';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
const moment = moment_;

@Component({
    selector: "app-employee-ratetag-details",
    templateUrl: "employee-ratetag-details.component.html",
    styles: [`
    .employee-ratetag-card{
        height: 780px;
      }
    `]
})

export class EmployeeRateTagDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteRateTagPopUp") deleteRateTagPopover;
    @ViewChild("clearCustomizeRateTagPopUp") clearCustomizeRateTagPopover;

    isAnyOperationIsInprogress: boolean;
    temp: any;
    rateTagConfigurationsLoading: boolean;
    isArchivedType: boolean;
    rateTagConfigurationList: EmployeeRateTagConfigurationModel[] = [];
    selectedEmployeeRateTagConfigurationId: any;
    employeeRateTagConfigurationHighLightId: any;
    clearCustomizeRateTagDetailsInProgress: boolean;
    employeeRateTagDetailsListCount: number;
    softLabels: SoftLabelConfigurationModel[];

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeRateTagConfigurations();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    permission: boolean;
    employeeId: string;
    searchText = "";
    sortBy: string;
    ratetag: any;
    isPermanent: boolean = false;
    employeeRateTag: EmployeeRateTagModel;
    employeeRateTagDetailsLoading: boolean;
    employeeRateTagDetailsList: EmployeeRateTagModel[];
    roleBranchOrEmployeeInputModel: RateTagRoleBranchConfigurationInputModel;
    overRiddedRateTagsCount: number;

    constructor(public dialogRef: MatDialogRef<AddRateTagsComponent>, public dialog: MatDialog, private cookieService: CookieService,
        private payRollService: PayRollService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) { super() }

    openDialog(rateTagsList): void {
        this.roleBranchOrEmployeeInputModel.employeeId = this.employeeId
        if (rateTagsList != null) {
            this.roleBranchOrEmployeeInputModel.isDisabled = true;
        }
        else {
            this.roleBranchOrEmployeeInputModel.startDate = null;
            this.roleBranchOrEmployeeInputModel.endDate = null;
            this.roleBranchOrEmployeeInputModel.isDisabled = false;
            this.roleBranchOrEmployeeInputModel.isInHerited = false;
            this.roleBranchOrEmployeeInputModel.priority = null;
        }
        const dialogRef = this.dialog.open(AddRateTagsComponent, {
            height: 'auto',
            width: 'calc(100vw)',
            disableClose: true,
            panelClass: 'ratetag-dialog',
            data: { roleBranchOrEmployeeInputModel: this.roleBranchOrEmployeeInputModel, rateTagsList: rateTagsList }
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.getEmployeeRateTagConfigurations();
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();       
        this.roleBranchOrEmployeeInputModel = new RateTagRoleBranchConfigurationInputModel();
        this.getEmployeeRateTagConfigurations();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }
    

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((ratetag => (((ratetag.rateTagName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.rateTagForNames == null ? null : ratetag.rateTagForNames.toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHour == null ? null : ratetag.ratePerHour.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourMon == null ? null : ratetag.ratePerHourMon.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourTue == null ? null : ratetag.ratePerHourTue.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourWed == null ? null : ratetag.ratePerHourWed.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourThu == null ? null : ratetag.ratePerHourThu.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourFri != null && ratetag.ratePerHourFri.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun != null && ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun != null && ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.priority == null ? null : ratetag.priority.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.rateTagStartDate == null ? null : moment(ratetag.rateTagStartDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.rateTagEndDate == null ? null : moment(ratetag.rateTagEndDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1))
        )));
        this.employeeRateTagDetailsList = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeRateTagDetails();
    }

    getEmployeeRateTagConfigurations() {
        this.rateTagConfigurationsLoading = true;
        var employeeRateTagConfigurationModel = new EmployeeRateTagConfigurationModel();
        employeeRateTagConfigurationModel.employeeId = this.employeeId;
        this.payRollService.getEmployeeRateTagConfigurations(employeeRateTagConfigurationModel).subscribe((result: any) => {
            if (result.success === true) {
                this.rateTagConfigurationList = result.data;
                if (this.rateTagConfigurationList.length > 0) {
                    this.selectedEmployeeRateTagConfigurationId = result.data[0].rateTagRoleBranchConfigurationId;
                    this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId = result.data[0].rateTagRoleBranchConfigurationId;
                    this.roleBranchOrEmployeeInputModel.roleId = result.data[0].roleId;
                    this.roleBranchOrEmployeeInputModel.branchId = result.data[0].branchId;
                    this.employeeRateTagConfigurationHighLightId = this.selectedEmployeeRateTagConfigurationId;
                    this.roleBranchOrEmployeeInputModel.startDate = result.data[0].startDate;
                    this.roleBranchOrEmployeeInputModel.endDate = result.data[0].endDate;
                    this.roleBranchOrEmployeeInputModel.isInHerited = result.data[0].isInHerited;
                    this.roleBranchOrEmployeeInputModel.priority = result.data[0].priority;
                }
                this.getEmployeeRateTagDetails();
            }
            else {
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
            this.rateTagConfigurationsLoading = false;
            this.cdRef.detectChanges();
        });
    }

    selectedEmployeeRateTagConfiguration(rateTagConfiguration) {
        this.selectedEmployeeRateTagConfigurationId = rateTagConfiguration.rateTagRoleBranchConfigurationId;
        this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId = rateTagConfiguration.rateTagRoleBranchConfigurationId;
        this.roleBranchOrEmployeeInputModel.roleId = rateTagConfiguration.roleId;
        this.roleBranchOrEmployeeInputModel.branchId = rateTagConfiguration.branchId;
        this.roleBranchOrEmployeeInputModel.startDate = rateTagConfiguration.startDate;
        this.roleBranchOrEmployeeInputModel.endDate = rateTagConfiguration.endDate;
        this.roleBranchOrEmployeeInputModel.isInHerited = rateTagConfiguration.isInHerited;
        this.roleBranchOrEmployeeInputModel.priority = rateTagConfiguration.priority;
        this.employeeRateTagConfigurationHighLightId = this.selectedEmployeeRateTagConfigurationId;
        this.getEmployeeRateTagDetails();
    }

    getEmployeeRateTagDetails() {
        this.employeeRateTagDetailsLoading = true;
        var employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.employeeId = this.employeeId;
        if (!this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId) {
            employeeDetailsSearchModel.startDate = this.roleBranchOrEmployeeInputModel.startDate;
            employeeDetailsSearchModel.endDate = this.roleBranchOrEmployeeInputModel.endDate;
            employeeDetailsSearchModel.groupPriority = this.roleBranchOrEmployeeInputModel.priority;
        }
        else {
            employeeDetailsSearchModel.rateTagRoleBranchConfigurationId = this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId;
        }

        employeeDetailsSearchModel.isArchived = false;
        employeeDetailsSearchModel.employeeDetailType = "RateTagDetails";
        this.payRollService.getEmployeeDetails(employeeDetailsSearchModel).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeRateTagDetailsList = result.data.employeeRateTagDetails;
                this.employeeRateTagDetailsListCount = this.employeeRateTagDetailsList.length;
                this.overRiddedRateTagsCount = this.employeeRateTagDetailsList.filter(x => x.isOverRided == true).length;
                this.temp = this.employeeRateTagDetailsList;
            }
            else {
                this.employeeRateTagDetailsList = []
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
            this.employeeRateTagDetailsLoading = false;
            this.cdRef.detectChanges();
        });
    }

    getRateTagDetailsId(event, deleteRateTagDetailsPopover) {
        this.employeeRateTag = event;
        deleteRateTagDetailsPopover.openPopover();
    }

    deleteRateTagDetail() {
        this.isAnyOperationIsInprogress = true;
        const employeeRateTagDetails = new EmployeeRateTagModel();
        employeeRateTagDetails.employeeRateTagId = this.employeeRateTag.employeeRateTagId;
        employeeRateTagDetails.rateTagId = this.employeeRateTag.rateTagId;
        employeeRateTagDetails.rateTagEmployeeId = this.employeeRateTag.rateTagEmployeeId;
        employeeRateTagDetails.rateTagCurrencyId = this.employeeRateTag.rateTagCurrencyId;
        employeeRateTagDetails.rateTagStartDate = this.employeeRateTag.rateTagStartDate;
        employeeRateTagDetails.rateTagEndDate = this.employeeRateTag.rateTagEndDate;
        employeeRateTagDetails.rateTagForId = this.employeeRateTag.rateTagForId;
        employeeRateTagDetails.ratePerHour = this.employeeRateTag.ratePerHour;
        employeeRateTagDetails.ratePerHourMon = this.employeeRateTag.ratePerHourMon;
        employeeRateTagDetails.ratePerHourTue = this.employeeRateTag.ratePerHourTue;
        employeeRateTagDetails.ratePerHourWed = this.employeeRateTag.ratePerHourWed;
        employeeRateTagDetails.ratePerHourThu = this.employeeRateTag.ratePerHourThu;
        employeeRateTagDetails.ratePerHourFri = this.employeeRateTag.ratePerHourFri;
        employeeRateTagDetails.ratePerHourSat = this.employeeRateTag.ratePerHourSat;
        employeeRateTagDetails.ratePerHourSun = this.employeeRateTag.ratePerHourSun;
        employeeRateTagDetails.timeStamp = this.employeeRateTag.timeStamp;
        employeeRateTagDetails.isArchived = true;

        this.payRollService.updateEmployeeRateTagDetails(employeeRateTagDetails).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteRateTagPopover.forEach((p) => p.closePopover());
                this.getEmployeeRateTagDetails();
            }
            else {
                this.employeeRateTagDetailsList = []
                this.toastr.error("", result.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    cancelRateTagDetails() {
        this.employeeRateTag = new EmployeeRateTagModel();
        this.deleteRateTagPopover.forEach((p) => p.closePopover());
    }

    addRateTagDetail(editRateTagDetailsPopover) {
        this.employeeRateTag = null;
        editRateTagDetailsPopover.openPopover();
    }

    openCustomizeRateTagPopover(clearCustomizeRateTagPopUp) {
        clearCustomizeRateTagPopUp.openPopover();
    }

    closeCustomizeRateTagPopover() {
        this.employeeRateTag = new EmployeeRateTagModel();
        this.clearCustomizeRateTagPopover.closePopover();
    }

    clearCustomizeRateTagDetails() {
        this.clearCustomizeRateTagDetailsInProgress = true;
        var employeeRateTagInsertModel = new EmployeeRateTagInsertModel();
        employeeRateTagInsertModel.rateTagEmployeeId = this.employeeId;
        employeeRateTagInsertModel.rateTagStartDate = this.roleBranchOrEmployeeInputModel.startDate;
        employeeRateTagInsertModel.rateTagEndDate = this.roleBranchOrEmployeeInputModel.endDate;
        employeeRateTagInsertModel.isClearCustomize = true;

        this.payRollService.insertEmployeeRateTagDetails(employeeRateTagInsertModel).subscribe((response: any) => {
            if (response.success == true) {
                this.getEmployeeRateTagConfigurations();
                this.closeCustomizeRateTagPopover();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.clearCustomizeRateTagDetailsInProgress = false;
        });
    }
}
