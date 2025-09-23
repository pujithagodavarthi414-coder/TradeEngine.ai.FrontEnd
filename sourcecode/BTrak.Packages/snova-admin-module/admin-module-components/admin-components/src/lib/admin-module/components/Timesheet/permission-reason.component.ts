import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetManagementService } from '../../services/timesheet-managemet.service';
import { PermissionReasonModel } from '../../models/permission-reason-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-fm-component-permission-reason',
    templateUrl: `permission-reason.component.html`
})

export class PermissionReasonComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertPermissionReasonPopUp") upsertPermissionReasonPopover;
    @ViewChildren("deletePermissionReasonPopUp") deletePermissionReasonPopover;

    constructor(private translateService: TranslateService, private timesheetService: TimeSheetManagementService, private snackbar: MatSnackBar,private toastr : ToastrService
        , private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPermissionReasons();
    }

    permissionReasons: any;
    isAnyOperationIsInprogress: boolean = false;
    deletePermissionIsInprogress: boolean = false;
    isArchived: boolean = false;
    permissionReasonId: string;
    permission: PermissionReasonModel;
    isThereAnError: boolean = false;
    validationMessage: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    permissionReasonForm: FormGroup;
    isFiltersVisible: boolean;
    permissionReason: string;
    permissionEdit: string;

    getAllPermissionReasons() {
        this.isAnyOperationIsInprogress = true;
        var permissionReasonModel = new PermissionReasonModel();
        permissionReasonModel.isArchived = this.isArchived;
        this.timesheetService.getAllPermissionReasons(permissionReasonModel).subscribe((response: any) => {
            if (response.success == true) {
                this.permissionReasons = response.data;
                this.temp = this.permissionReasons;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    upsertPermissionReason(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.permission = this.permissionReasonForm.value;
        this.permission.permissionReason = this.permission.permissionReason.trim();
        this.permission.permissionReasonId = this.permissionReasonId;
        this.permission.timeStamp = this.timeStamp;
        this.permission.isArchived = this.isArchived;

        this.timesheetService.upsertPermissionReasons(this.permission).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPermissionReasonPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPermissionReasons();
            }
            else {
                this.isThereAnError = true;
               // this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deletePermissionReason() {
        this.deletePermissionIsInprogress = true;

        this.permission = new PermissionReasonModel();
        this.permission.permissionReasonId = this.permissionReasonId;
        this.permission.permissionReason = this.permissionReason;
        this.permission.timeStamp = this.timeStamp;
        this.permission.isArchived = !this.isArchived;

        this.timesheetService.upsertPermissionReasons(this.permission).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePermissionReasonPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.deletePermissionIsInprogress= false;
                this.getAllPermissionReasons();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.deletePermissionIsInprogress = false;
            }
        });
    }

    createPermissionReasonPopUp(upsertPermissionReasonPopUp) {
        upsertPermissionReasonPopUp.openPopover();
        this.permissionEdit = this.translateService.instant('PERMISSIONREASON.ADDPERMISSIONREASON');
    }

    closeUpsertPermissionReasonPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPermissionReasonPopover.forEach((p) => p.closePopover());
    }

    deletePermissionReasonPopUpOpen(row, deletePermissionReasonPopUp) {
        this.permissionReasonId = row.id;
        this.permissionReason = row.permissionReason;
        this.timeStamp = row.timeStamp;
        deletePermissionReasonPopUp.openPopover();
    }

    closeDeletePermissionDialog() {
        this.isThereAnError = false;
        this.deletePermissionReasonPopover.forEach((p) => p.closePopover());
    }

    editPermissionReasonPopupOpen(row, upsertPermissionReasonPopUp) {
        this.permissionReasonForm.patchValue(row);
        this.permissionReasonId = row.id;
        this.timeStamp = row.timeStamp;
        this.permissionEdit = this.translateService.instant('PERMISSIONREASON.EDITPERMISSIONREASON');
        upsertPermissionReasonPopUp.openPopover();
    }

    clearForm() {
        this.permissionReason = null;
        this.permissionReasonId = null;
        this.permission = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.permissionReasonForm = new FormGroup({
            permissionReason: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(permission => permission.permissionReason.toLowerCase().indexOf(this.searchText) > -1);
        this.permissionReasons = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
