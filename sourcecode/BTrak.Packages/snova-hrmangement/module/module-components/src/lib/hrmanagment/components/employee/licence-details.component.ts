import { Component, Input, ViewChildren, ChangeDetectorRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Page } from '../../models/Page';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeLicenceDetailsModel } from '../../models/employee-licence-details-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadEmployeeLicenceDetailsTriggered, CreateEmployeeLicenceDetailsTriggered, EmployeeLicenceDetailsActionTypes } from '../../store/actions/employee-licence-details.actions';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ofType, Actions } from '@ngrx/effects';
import { EmployeeService } from '../../services/employee-service';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HRManagementService } from '../../services/hr-management.service';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { ReminderDialogComponent } from '../reminders/reminder-dialog.component';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-licence-details',
    templateUrl: 'licence-details.component.html',
})

export class EmployeeLicenseDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteLicenceDetailsPopover') deleteLicenceDetailsPopover;
    @ViewChildren("editLicenceDetailsPopover") editLicenceDetailsPopover;
    @ViewChild("reminderDialogComponent1") reminderDialogComponent: TemplateRef<any>;
    @Output() closePopUp = new EventEmitter<any>();
    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeLicenceDetailsList();
            this.getUserId();
        }
    }
    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeeLicenceDetails: EmployeeLicenceDetailsModel;
    editLicenceDetailsData: EmployeeLicenceDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    employeeId: string;
    sortBy: string;
    sortDirection: boolean;
    page = new Page();
    isLicence: boolean = false;
    moduleTypeId = 1;
    userId: string;
    referenceTypeId: string = ConstantVariables.LicenceReferenceTypeId;

    employeeLicenceDetailsLoading$: Observable<boolean>;
    employeeLicenceDetailsList$: Observable<EmployeeLicenceDetailsModel[]>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, public dialog: MatDialog,
        private employeeService: EmployeeService, private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isLicence = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsCompleted),
                tap(() => {
                    this.employeeLicenceDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeLicenceDetailsAll));
                    this.employeeLicenceDetailsList$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        this.cdRef.detectChanges();
                    })
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
                this.getEmployeeLicenceDetailsList();
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
        this.getEmployeeLicenceDetailsList();
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
        this.getEmployeeLicenceDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeLicenceDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeLicenceDetailsList();
    }

    getEmployeeLicenceDetailsList() {
        const licenceDetailsSearchResult = new EmployeeDetailsSearchModel();
        licenceDetailsSearchResult.sortBy = this.sortBy;
        licenceDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        licenceDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        licenceDetailsSearchResult.pageSize = this.page.size;
        licenceDetailsSearchResult.searchText = this.searchText;
        licenceDetailsSearchResult.employeeId = this.employeeId;
        licenceDetailsSearchResult.isArchived = false;
        licenceDetailsSearchResult.employeeDetailType = "LicenceDetails";
        this.store.dispatch(new LoadEmployeeLicenceDetailsTriggered(licenceDetailsSearchResult));
        this.employeeLicenceDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeLicenceDetailLoading));
    }

    closeUpsertLicenceDetailsPopover() {
        this.editLicenceDetailsPopover.forEach((p) => p.closePopover());
        this.isLicence = false;
    }

    getLicenceDetailsId(event, deleteLicenceDetailsPopover) {
        this.employeeLicenceDetails = event;
        deleteLicenceDetailsPopover.openPopover();
    }

    deleteLicenceDetail() {
        let employeeLicenceDetails = new EmployeeLicenceDetailsModel();
        employeeLicenceDetails.employeeId = this.employeeLicenceDetails.employeeId;
        employeeLicenceDetails.employeeLicenceDetailId = this.employeeLicenceDetails.employeeLicenceDetailId;
        employeeLicenceDetails.licenceExpiryDate = this.employeeLicenceDetails.licenceExpiryDate;
        employeeLicenceDetails.licenceNumber = this.employeeLicenceDetails.licenceNumber;
        employeeLicenceDetails.licenceTypeId = this.employeeLicenceDetails.licenceTypeId;
        employeeLicenceDetails.licenceIssuedDate = this.employeeLicenceDetails.licenceIssuedDate;
        employeeLicenceDetails.timeStamp = this.employeeLicenceDetails.timeStamp;
        employeeLicenceDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeLicenceDetailsTriggered(employeeLicenceDetails));
        this.deleteLicenceDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelLicenceDetails() {
        this.employeeLicenceDetails = new EmployeeLicenceDetailsModel();
        this.deleteLicenceDetailsPopover.forEach((p) => p.closePopover());
    }

    editLicenceDetailsId(event, editLicenceDetailsPopover) {
        this.isLicence = true;
        this.editLicenceDetailsData = event;
        editLicenceDetailsPopover.openPopover();
    }

    // addLicenceDetail(editLicenceDetailsPopover) {
    //     this.isLicence = true;
    //     this.editLicenceDetailsData = null;
    //     editLicenceDetailsPopover.openPopover();
    // }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, referenceTypeId: ConstantVariables.LicenceReferenceTypeId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }

    addReminder(row, hasReminderPermissions) {
        let dialogId = "unique-reminder-dialog";
        const formsDialog = this.dialog.open(this.reminderDialogComponent, {
            minWidth: "60vw",
            minHeight: "80vh",
            hasBackdrop: true,
            direction: "ltr",
            id:dialogId,
            data: {
                referenceId: row.employeeLicenceDetailId,
                referenceTypeId: ConstantVariables.LicenceReferenceTypeId,
                ofUser: this.userId,
                hasReminderPermissions,
                dialogId: dialogId
            },
            disableClose: true
        });
        formsDialog.afterClosed().subscribe((result: any) => {
            if (result.redirection) {
            //   this.closePopUp.emit(true);
            }
            
          });
        
    }
    closeCurrentDialog() {
        this.closePopUp.emit(true);
      }
}
