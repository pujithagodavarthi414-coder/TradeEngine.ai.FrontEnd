import { Component, Input, ViewChildren, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { PayRollService } from '../../services/PayRollService';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
import { AddRateTagsComponent } from './add-ratetags.component';
import { RateTagConfigurationModel } from '../../models/RateTagConfigurationModel';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { HrBranchModel } from '../../models/branch-model';
import { RateTagRoleBranchConfigurationModel } from '../../models/ratetagrolebranchconfiguration';
import { TranslateService } from '@ngx-translate/core';
import { RateTagRoleBranchConfigurationInputModel } from '../../models/ratetagrolebranchconfigurationinputmodel';
const moment = moment_;

@Component({
    selector: "app-ratetag-configuration",
    templateUrl: "ratetag-configuration.component.html",
    styles: [`
    .rolebranch-ratetag-card{
        height: 800px;
      }
    `]
})

export class RateTagConfigurationComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteRateTagPopUp") deleteRateTagPopover;
    @ViewChildren("rateTagConfigurationPopUp") rateTagConfigurationPopover;
    @ViewChildren("deleteRateTagConfigurationPopUp") deleteRateTagConfigurationPopover;

    isAnyOperationIsInprogress: boolean;
    temp: any;
    permission: boolean;
    employeeId: string;
    searchText = "";
    sortBy: string;
    ratetag: any;
    rateTagConfiguration: RateTagConfigurationModel;
    rateTagConfigurationsLoading: boolean;
    rateTagConfigurationList: RateTagRoleBranchConfigurationModel[] = [];
    rateTagConfigurationForm: FormGroup;
    rolesList: any[];
    branchList: HrBranchModel[];
    isShow: boolean = false;
    rateTagBranchId: string;
    rateTagRoleId: string;
    selectedRateTagRoleBranchConfigurationId: string;
    rateTagRoleBranchConfigurationHighLightId: string;
    rateTagsList: RateTagConfigurationModel[] = [];
    timeStamp: any;
    rateTagRoleBranchConfigurationId: any;
    rateTagConfigurationText: string;
    isArchivedType: boolean = false;
    rateTagConfigurationMoldel: RateTagRoleBranchConfigurationModel;
    rateTagsLoading: boolean;
    roleBranchOrEmployeeInputModel: RateTagRoleBranchConfigurationInputModel = new RateTagRoleBranchConfigurationInputModel();
    rateTagsListCount: number;

    constructor(public dialogRef: MatDialogRef<AddRateTagsComponent>, public dialog: MatDialog, private cookieService: CookieService,
        private payRollService: PayRollService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private translateService: TranslateService) { super() }

    openDialog(rateTagsList): void {
        if (this.selectedRateTagRoleBranchConfigurationId) {
            const dialogRef = this.dialog.open(AddRateTagsComponent, {
                height: 'auto',
                width: 'calc(100vw)',
                disableClose: true,
                panelClass: 'ratetag-dialog',
                data: { roleBranchOrEmployeeInputModel: this.roleBranchOrEmployeeInputModel, rateTagsList: rateTagsList }
            });

            dialogRef.afterClosed().subscribe((result) => {
                this.getRateTagConfigurations();
            });
        }
        else {
            this.toastr.error(this.translateService.instant('RATETAG.SELECTRATETAGROLEBRANCHMESSAGE'));
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllRoles();
        this.getAllBranches();
        this.getRateTagRoleBranchConfigurations();
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.rateTagConfigurationForm = new FormGroup({
            branchId: new FormControl(null,
            ),
            roleId: new FormControl(null,
            ),
            startDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            priority: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    getAllRoles() {
        this.payRollService
            .getAllRoles()
            .subscribe((responseData: any) => {
                this.rolesList = responseData.data;
            });
    }

    getAllBranches() {
        var hrBranchModel = new HrBranchModel();
        hrBranchModel.isArchived = false;
        this.payRollService.getBranches(hrBranchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branchList = response.data;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
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
            || (ratetag.startDate == null ? null : moment(ratetag.startDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.endDate == null ? null : moment(ratetag.endDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1))
        )));
        this.rateTagsList = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.getRateTagConfigurations();
    }

    getRateTagConfigurations() {
        this.rateTagsLoading = true;
        var rateTagConfigurationModel = new RateTagConfigurationModel();
        rateTagConfigurationModel.isArchived = this.isArchivedType;
        rateTagConfigurationModel.rateTagRoleBranchConfigurationId = this.selectedRateTagRoleBranchConfigurationId;
        this.payRollService.getRateTagConfigurations(rateTagConfigurationModel).subscribe((result: any) => {
            if (result.success === true) {
                this.rateTagsList = result.data;
                this.rateTagsListCount = this.rateTagsList.length;
                this.temp = this.rateTagsList;
            }
            else {
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
            this.rateTagsLoading = false;
            this.cdRef.detectChanges();
        });
    }

    getRateTagRoleBranchConfigurations() {
        this.rateTagConfigurationsLoading = true;
        var rateTagRoleBranchConfigurationModel = new RateTagRoleBranchConfigurationModel();
        rateTagRoleBranchConfigurationModel.isArchived = this.isArchivedType;
        this.payRollService.getRateTagRoleBranchConfigurations(rateTagRoleBranchConfigurationModel).subscribe((result: any) => {
            if (result.success === true) {
                this.rateTagConfigurationList = result.data;
                if (this.rateTagConfigurationList.length > 0) {
                    this.selectedRateTagRoleBranchConfigurationId = result.data[0].rateTagRoleBranchConfigurationId;
                    this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId = result.data[0].rateTagRoleBranchConfigurationId;
                    this.roleBranchOrEmployeeInputModel.roleId = result.data[0].roleId;
                    this.roleBranchOrEmployeeInputModel.branchId = result.data[0].branchId;
                    this.roleBranchOrEmployeeInputModel.startDate = result.data[0].startDate;
                    this.roleBranchOrEmployeeInputModel.endDate = result.data[0].endDate;
                    this.roleBranchOrEmployeeInputModel.isDisabled = true;
                    this.rateTagRoleBranchConfigurationHighLightId = this.selectedRateTagRoleBranchConfigurationId;
                    this.getRateTagConfigurations();
                }
            }
            else {
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
            this.rateTagConfigurationsLoading = false;
            this.cdRef.detectChanges();
        });
    }

    selectedRateTagConfiguration(rateTagConfiguration) {
        this.selectedRateTagRoleBranchConfigurationId = rateTagConfiguration.rateTagRoleBranchConfigurationId;
        this.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId = rateTagConfiguration.rateTagRoleBranchConfigurationId;
        this.roleBranchOrEmployeeInputModel.roleId = rateTagConfiguration.roleId;
        this.roleBranchOrEmployeeInputModel.branchId = rateTagConfiguration.branchId;
        this.roleBranchOrEmployeeInputModel.startDate = rateTagConfiguration.startDate;
        this.roleBranchOrEmployeeInputModel.endDate = rateTagConfiguration.endDate;
        this.rateTagRoleBranchConfigurationHighLightId = this.selectedRateTagRoleBranchConfigurationId;
        this.getRateTagConfigurations();
    }

    getRateTagDetailsId(event, deleteRateTagDetailsPopover) {
        this.rateTagConfiguration = event;
        deleteRateTagDetailsPopover.openPopover();
    }

    deleteRateTagDetail() {
        this.isAnyOperationIsInprogress = true;
        const rateTagConfiguration = new RateTagConfigurationModel();
        rateTagConfiguration.rateTagConfigurationId = this.rateTagConfiguration.rateTagConfigurationId;
        rateTagConfiguration.rateTagRoleBranchConfigurationId = this.rateTagConfiguration.rateTagRoleBranchConfigurationId;
        rateTagConfiguration.rateTagId = this.rateTagConfiguration.rateTagId;
        rateTagConfiguration.rateTagCurrencyId = this.rateTagConfiguration.rateTagCurrencyId;
        rateTagConfiguration.rateTagForId = this.rateTagConfiguration.rateTagForId;
        rateTagConfiguration.ratePerHour = this.rateTagConfiguration.ratePerHour;
        rateTagConfiguration.ratePerHourMon = this.rateTagConfiguration.ratePerHourMon;
        rateTagConfiguration.ratePerHourTue = this.rateTagConfiguration.ratePerHourTue;
        rateTagConfiguration.ratePerHourWed = this.rateTagConfiguration.ratePerHourWed;
        rateTagConfiguration.ratePerHourThu = this.rateTagConfiguration.ratePerHourThu;
        rateTagConfiguration.ratePerHourFri = this.rateTagConfiguration.ratePerHourFri;
        rateTagConfiguration.ratePerHourSat = this.rateTagConfiguration.ratePerHourSat;
        rateTagConfiguration.ratePerHourSun = this.rateTagConfiguration.ratePerHourSun;
        rateTagConfiguration.timeStamp = this.rateTagConfiguration.timeStamp;
        rateTagConfiguration.isArchived = true;

        this.payRollService.updatetRateTagConfiguration(rateTagConfiguration).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteRateTagPopover.forEach((p) => p.closePopover());
                this.getRateTagConfigurations();
            }
            else {
                this.rateTagConfigurationList = []
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    cancelRateTagDetails() {
        this.rateTagConfiguration = new RateTagConfigurationModel();
        this.deleteRateTagPopover.forEach((p) => p.closePopover());
    }

    addRateTagDetail(editRateTagDetailsPopover) {
        this.rateTagConfiguration = null;
        this.rateTagRoleBranchConfigurationId = null;
        editRateTagDetailsPopover.openPopover();
    }

    createRateTagConfigurationPopupOpen(rateTagConfigurationPopUp) {
        this.rateTagConfigurationText = "RATETAGCONFIGURATION.ADDRATETAGCONFIGURATION"
        rateTagConfigurationPopUp.openPopover();
    }

    closeUpsertRateTagConfigurationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.rateTagConfigurationPopover.forEach((p) => p.closePopover());
    }

    editRateTagConfigurationPopupOpen(row, rateTagConfigurationPopUp) {
        this.timeStamp = row.timeStamp;
        this.rateTagConfigurationForm.patchValue(row);
        this.rateTagConfigurationText = "RATETAGCONFIGURATION.EDITRATETAGCONFIGURATION"
        this.rateTagRoleBranchConfigurationId = row.rateTagRoleBranchConfigurationId;
        rateTagConfigurationPopUp.openPopover();
    }

    UpsertRateTagRoleBranchConfiguration(formDirective: FormGroupDirective) {
        const rateTagConfiguration = new RateTagRoleBranchConfigurationModel();
        rateTagConfiguration.branchId = this.rateTagConfigurationForm.value.branchId;
        rateTagConfiguration.roleId = this.rateTagConfigurationForm.value.roleId;
        rateTagConfiguration.startDate = this.rateTagConfigurationForm.value.startDate;
        rateTagConfiguration.endDate = this.rateTagConfigurationForm.value.endDate;
        rateTagConfiguration.priority = this.rateTagConfigurationForm.value.priority;
        if (this.rateTagRoleBranchConfigurationId) {
            rateTagConfiguration.rateTagRoleBranchConfigurationId = this.rateTagRoleBranchConfigurationId;
            rateTagConfiguration.timeStamp = this.timeStamp;
        }
        this.payRollService.UpsertRateTagRoleBranchConfiguration(rateTagConfiguration).subscribe((result: any) => {
            if (result.success === true) {
                this.rateTagConfigurationPopover.forEach((p) => p.closePopover());
                formDirective.resetForm();
                this.getRateTagRoleBranchConfigurations();
                this.clearForm();
            }
            else {
                this.toastr.error("", result.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteRateTagConfigurationPopUpOpen(row, deleteRateTagConfigurationPopUp) {
        this.rateTagConfigurationMoldel = new RateTagRoleBranchConfigurationModel();
        this.rateTagConfigurationMoldel = row;
        deleteRateTagConfigurationPopUp.openPopover();
    }

    archiveRateTagConfiguration() {
        this.rateTagConfigurationMoldel.isArchived = !this.isArchivedType;
        this.payRollService.UpsertRateTagRoleBranchConfiguration(this.rateTagConfigurationMoldel).subscribe((result: any) => {
            if (result.success === true) {
                this.getRateTagRoleBranchConfigurations();
                this.deleteRateTagConfigurationPopover.forEach((p) => p.closePopover());
            }
            else {
                this.toastr.error("", result.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeDeleteRateTagConfigurationPopUpOpen() {
        this.deleteRateTagConfigurationPopover.forEach((p) => p.closePopover());
    }
}
