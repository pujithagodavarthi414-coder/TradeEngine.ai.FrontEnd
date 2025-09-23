import { Component, Input, ViewChildren, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { tap, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

import { Page } from '../../models/Page';
import { EmployeeContractModel } from "../../models/employee-contract-model";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { LoadEmployeeContractDetailsTriggered, CreateEmployeeContractDetailsTriggered, EmployeeContractDetailsActionTypes } from "../../store/actions/employee-contract-details.actions";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeService } from "../../services/employee-service";
import { Actions, ofType } from "@ngrx/effects";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SignatureModel } from '../../models/signature-model';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SignatureDialogComponent } from '../signature/signature-dialog.component';
import { ReminderDialogComponent } from '../reminders/reminder-dialog.component';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-contract-details",
    templateUrl: "employee-contract-details.component.html"
})

export class EmployeeContractDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteContractDetailsPopover") deleteContractDetailsPopover;
    @ViewChildren("editContractDetailsPopover") editContractDetailsPopover;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
        this.getEmployeeContractDetailsList();
        this.getUserId();
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    @Input("isPermanent")
    set isPermanent(data: boolean) {
        this.permanent = data;
    }

    employeeContractDetails: EmployeeContractModel;
    editContractDetailsData: EmployeeContractModel;

    searchText: string = "";
    employeeId: string;
    sortBy: string;
    userId: string;
    sortDirection: boolean;
    page = new Page();
    permission: boolean = false;
    isContract: boolean = false;
    permanent = true;
    employeeContractDetailsLoading$: Observable<boolean>;
    employeeContractDetailsList$: Observable<EmployeeContractModel[]>;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.ContractReferenceTypeId;
    public ngDestroyed$ = new Subject();

    constructor(
        private store: Store<State>, private dialog: MatDialog,
        private employeeService: EmployeeService, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions,
        private cookieService: CookieService, private hrManagementService: HRManagementService) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isContract = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsCompleted),
                tap(() => {
                    this.employeeContractDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeContractDetailsAll));
                    this.employeeContractDetailsList$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                    });
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe((result) => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // });
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "") {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            this.getEmployees();
        }
    }
    
    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeContractDetailsList();
            }
        });
    }

    getUserId() {
        this.employeeService.getEmployeeById(this.employeeId).subscribe((result: any) => {
            if (result.success === true) {
                this.userId = result.data.userId;
            }
        })
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeContractDetailsList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === "asc") {
            this.sortDirection = true;
        } else {
            this.sortDirection = false;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeContractDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) {
                return;
            }
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeContractDetailsList();
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeContractDetailsList();
    }

    viewSignature(row) {
        const signature = new SignatureModel();
        signature.referenceId = row.employmentContractId;
        signature.inviteeId = null;
        const dialogRef = this.dialog.open(SignatureDialogComponent, {
            minWidth: "60vw",
            minHeight: "80vh",
            disableClose: true,
            data: {
                signatureReference: signature,
                canEdit: this.permission,
                canDelete: this.canAccess_feature_CanEditOtherEmployeeDetails == true ? true : false
            }
        });
        dialogRef.componentInstance.closeMatDialog.subscribe((isReload: boolean) => {
            if (isReload) { }
        });
    }

    getEmployeeContractDetailsList() {
        const employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.sortBy = this.sortBy;
        employeeDetailsSearchModel.sortDirectionAsc = this.sortDirection;
        employeeDetailsSearchModel.pageNumber = this.page.pageNumber + 1;
        employeeDetailsSearchModel.pageSize = this.page.size;
        employeeDetailsSearchModel.searchText = this.searchText;
        employeeDetailsSearchModel.employeeId = this.employeeId;
        employeeDetailsSearchModel.isArchived = false;
        employeeDetailsSearchModel.employeeDetailType = "ContractDetails";
        this.store.dispatch(new LoadEmployeeContractDetailsTriggered(employeeDetailsSearchModel));
        this.employeeContractDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeContractDetailLoading));
    }

    closeUpsertContractDetailsPopover() {
        this.editContractDetailsPopover.forEach((p) => p.closePopover());
        this.isContract = false;
    }

    getContractDetailsId(event, deleteContractDetailsPopover) {
        this.employeeContractDetails = event;
        deleteContractDetailsPopover.openPopover();
    }

    deleteContractDetail() {
        const employeeContractDetails = new EmployeeContractModel();
        employeeContractDetails.employeeId = this.employeeContractDetails.employeeId;
        employeeContractDetails.employmentContractId = this.employeeContractDetails.employmentContractId;
        employeeContractDetails.contractTypeId = this.employeeContractDetails.contractTypeId;
        employeeContractDetails.contractedHours = this.employeeContractDetails.contractedHours;
        employeeContractDetails.startDate = this.employeeContractDetails.startDate;
        employeeContractDetails.endDate = this.employeeContractDetails.endDate;
        employeeContractDetails.holidayOrThisYear = this.employeeContractDetails.holidayOrThisYear;
        employeeContractDetails.holidayOrFullEntitlement = this.employeeContractDetails.holidayOrFullEntitlement;
        employeeContractDetails.hourlyRate = this.employeeContractDetails.hourlyRate;
        employeeContractDetails.timeStamp = this.employeeContractDetails.timeStamp;
        employeeContractDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeContractDetailsTriggered(employeeContractDetails));
        this.deleteContractDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelContractDetails() {
        this.employeeContractDetails = new EmployeeContractModel();
        this.deleteContractDetailsPopover.forEach((p) => p.closePopover());
    }

    editContractDetailsId(event, editContractDetailsPopover) {
        this.isContract = true;
        this.editContractDetailsData = event;
        editContractDetailsPopover.openPopover();
    }

    addReminder(row, hasReminderPermissions) {
        const formsDialog = this.dialog.open(ReminderDialogComponent, {
            minWidth: "60vw",
            minHeight: "80vh",
            hasBackdrop: true,
            direction: "ltr",
            data: {
                referenceId: row.employmentContractId,
                referenceTypeId: ConstantVariables.ContractReferenceTypeId,
                ofUser: this.userId,
                hasReminderPermissions
            },
            disableClose: true
        });
    }
}
