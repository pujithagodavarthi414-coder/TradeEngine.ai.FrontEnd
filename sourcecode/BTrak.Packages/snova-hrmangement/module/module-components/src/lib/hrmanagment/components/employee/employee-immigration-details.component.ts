import { Component, Input, ViewChildren, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap, takeUntil } from 'rxjs/operators';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Page } from '../../models/Page';
import { EmployeeImmigrationDetailsModel } from '../../models/employee-immigration-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadEmployeeImmigrationDetailsTriggered, CreateEmployeeImmigrationDetailsTriggered, EmployeeImmigrationDetailsActionTypes } from '../../store/actions/employee-immigration-details.action';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Actions, ofType } from '@ngrx/effects';
import { EmployeeService } from '../../services/employee-service';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { ReminderDialogComponent } from '../reminders/reminder-dialog.component';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-immigration-details',
    templateUrl: 'employee-immigration-details.component.html',
})

export class EmployeeImmigrationDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteImmigrationDetailsPopover') deleteImmigrationDetailsPopover;
    @ViewChildren("editImmigrationDetailsPopover") editImmigrationDetailsPopover;
    @ViewChild("reminderDialogComponent2") reminderDialogComponent2: TemplateRef<any>;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeImmigrationDetailsList();
            this.getUserId();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editImmigrationDetailsData: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    sortBy: string;
    employeeId: string;
    sortDirection: boolean;
    userId: string;
    page = new Page();
    isImmigration: boolean = false;
    employeeImmigrationDetailsLoading$: Observable<boolean>;
    employeeImmigrationDetailsList$: Observable<EmployeeImmigrationDetailsModel[]>;
    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.ImmigrationReferenceTypeId;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private dialog: MatDialog,
        private employeeService: EmployeeService, private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super()
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isImmigration = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsCompleted),
                tap(() => {
                    this.employeeImmigrationDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeImmigrationDetailsAll));
                    this.employeeImmigrationDetailsList$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        this.cdRef.detectChanges();
                    });
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.userId = userId;
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeImmigrationDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeImmigrationDetailsList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeImmigrationDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeImmigrationDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeImmigrationDetailsList();
    }

    getUserId() {
        this.employeeService.getEmployeeById(this.employeeId).subscribe((result: any) => {
            if (result.success === true) {
                this.userId = result.data.userId;
            }
        })
    }

    getEmployeeImmigrationDetailsList() {
        const immigrationDetailsSearchResult = new EmployeeDetailsSearchModel();
        immigrationDetailsSearchResult.sortBy = this.sortBy;
        immigrationDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        immigrationDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        immigrationDetailsSearchResult.pageSize = this.page.size;
        immigrationDetailsSearchResult.searchText = this.searchText;
        immigrationDetailsSearchResult.employeeId = this.employeeId;
        immigrationDetailsSearchResult.isArchived = false;
        immigrationDetailsSearchResult.employeeDetailType = "ImmigrationDetails";
        this.store.dispatch(new LoadEmployeeImmigrationDetailsTriggered(immigrationDetailsSearchResult));
        this.employeeImmigrationDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeImmigrationDetailLoading));
    }

    closeUpsertImmigrationDetailsPopover() {
        this.editImmigrationDetailsPopover.forEach((p) => p.closePopover());
        this.isImmigration = false;
    }

    // addImmigrationDetail(editImmigrationDetailsPopover) {
    //     this.isImmigration = true;
    //     this.editImmigrationDetailsData = null;
    //     editImmigrationDetailsPopover.openPopover();
    // }

    editImmigrationDetailsId(event, editImmigrationDetailsPopover) {
        this.isImmigration = true;
        this.editImmigrationDetailsData = event;
        editImmigrationDetailsPopover.openPopover();
    }

    getImmigrationDetailsId(event, deleteImmigrationDetailsPopover) {
        this.employeeImmigrationDetails = event;
        deleteImmigrationDetailsPopover.openPopover();
    }

    deleteImmigrationDetail() {
        let employeeImmigrationDetails = new EmployeeImmigrationDetailsModel();
        employeeImmigrationDetails.employeeId = this.employeeImmigrationDetails.employeeId;
        employeeImmigrationDetails.employeeImmigrationId = this.employeeImmigrationDetails.employeeImmigrationId;
        employeeImmigrationDetails.expiryDate = this.employeeImmigrationDetails.expiryDate;
        employeeImmigrationDetails.documentNumber = this.employeeImmigrationDetails.documentNumber;
        employeeImmigrationDetails.issuedDate = this.employeeImmigrationDetails.issuedDate;
        employeeImmigrationDetails.timeStamp = this.employeeImmigrationDetails.timeStamp;
        employeeImmigrationDetails.document = this.employeeImmigrationDetails.document;
        employeeImmigrationDetails.countryId = this.employeeImmigrationDetails.countryId;
        employeeImmigrationDetails.eligibleReviewDate = this.employeeImmigrationDetails.eligibleReviewDate;
        employeeImmigrationDetails.comments = this.employeeImmigrationDetails.comments;
        employeeImmigrationDetails.eligibleStatus = this.employeeImmigrationDetails.eligibleStatus;
        employeeImmigrationDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeImmigrationDetailsTriggered(employeeImmigrationDetails));
        this.deleteImmigrationDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelImmigrationDetails() {
        this.employeeImmigrationDetails = new EmployeeImmigrationDetailsModel();
        this.deleteImmigrationDetailsPopover.forEach((p) => p.closePopover());
    }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, referenceTypeId: ConstantVariables.ImmigrationReferenceTypeId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }

    addReminder(row, hasReminderPermissions) {
        let dialogId = "unique-reminder-dialog1";
        const formsDialog = this.dialog.open(this.reminderDialogComponent2, {
            minWidth: "60vw",
            minHeight: "80vh",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                referenceId: row.employeeImmigrationId,
                referenceTypeId: ConstantVariables.ImmigrationReferenceTypeId,
                ofUser: this.userId,
                hasReminderPermissions,
                dialogId: dialogId
            },
            disableClose: true
        });
        formsDialog.afterClosed().subscribe((result: any) => {
            if (result.redirection) {
                //this.closePopUp.emit(true);
            }

        });
    }
}
