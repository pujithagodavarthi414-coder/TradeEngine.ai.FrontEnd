import { Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../..//models/Page';
import { EmployeeMembershipDetailsModel } from '../../models/employee-Membership-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadEmployeeMembershipDetailsTriggered, CreateEmployeeMembershipDetailsTriggered, EmployeeMembershipDetailsActionTypes } from '../../store/actions/employee-Membership-details.action';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee-service';
import { CookieService } from 'ngx-cookie-service';
import { Actions, ofType } from '@ngrx/effects';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { ReminderDialogComponent } from '../reminders/reminder-dialog.component';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-membership-details',
    templateUrl: 'employee-membership-details.component.html',
})

export class EmployeeMembershipDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteMembershipDetailsPopover') deleteMembershipDetailsPopover;
    @ViewChildren("editMembershipDetailsPopover") editMembershipDetailsPopover;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeMembershipDetailsList();
            this.getUserId();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editMembershipDetailsData: EmployeeMembershipDetailsModel;
    employeeMembershipDetails: EmployeeMembershipDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    sortBy: string;
    employeeId: string;
    userId: string;
    sortDirection: boolean;
    page = new Page();
    scroll: boolean = true;
    isMembership: boolean = false;
    employeeMembershipDetailsLoading$: Observable<boolean>;
    employeeMembershipDetailsList$: Observable<EmployeeMembershipDetailsModel[]>;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.MembershipReferenceTypeId;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private dialog: MatDialog,
        private employeeService: EmployeeService, private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isMembership = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsCompleted),
                tap(() => {
                    this.employeeMembershipDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeMembershipDetailsAll));
                    this.employeeMembershipDetailsList$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        this.cdRef.detectChanges();
                        this.scroll = true;
                    })
                })
            )
            .subscribe();
        window.onresize = () => {
            this.scroll = (window.innerWidth < 1200);
        };
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
                this.getEmployeeMembershipDetailsList();
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
        this.getEmployeeMembershipDetailsList();
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
        this.getEmployeeMembershipDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeMembershipDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeMembershipDetailsList();
    }

    getEmployeeMembershipDetailsList() {
        const membershipDetailsSearchResult = new EmployeeDetailsSearchModel();
        membershipDetailsSearchResult.sortBy = this.sortBy;
        membershipDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        membershipDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        membershipDetailsSearchResult.pageSize = this.page.size;
        membershipDetailsSearchResult.searchText = this.searchText;
        membershipDetailsSearchResult.employeeId = this.employeeId;
        membershipDetailsSearchResult.isArchived = false;
        membershipDetailsSearchResult.employeeDetailType = "MembershipDetails";
        this.store.dispatch(new LoadEmployeeMembershipDetailsTriggered(membershipDetailsSearchResult));
        this.employeeMembershipDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeMembershipDetailLoading));
    }

    closeUpsertMembershipDetailsPopover() {
        this.editMembershipDetailsPopover.forEach((p) => p.closePopover());
        this.isMembership = false;
    }

    editMembershipDetailsId(event, editMembershipDetailsPopover) {
        this.isMembership = true;
        this.editMembershipDetailsData = event;
        editMembershipDetailsPopover.openPopover();
    }

    getMembershipDetailsId(event, deleteMembershipDetailsPopover) {
        this.employeeMembershipDetails = event;
        deleteMembershipDetailsPopover.openPopover();
    }

    deleteMembershipDetail() {
        let employeeMembershipDetails = new EmployeeMembershipDetailsModel();
        employeeMembershipDetails.renewalDate = this.employeeMembershipDetails.renewalDate;
        employeeMembershipDetails.employeeMembershipId = this.employeeMembershipDetails.employeeMembershipId;
        employeeMembershipDetails.subscriptionPaidByName = this.employeeMembershipDetails.subscriptionPaidByName;
        employeeMembershipDetails.commenceDate = this.employeeMembershipDetails.commenceDate;
        employeeMembershipDetails.subscriptionAmount = this.employeeMembershipDetails.subscriptionAmount;
        employeeMembershipDetails.membershipId = this.employeeMembershipDetails.membershipId;
        employeeMembershipDetails.employeeId = this.employeeMembershipDetails.employeeId;
        employeeMembershipDetails.subscriptionId = this.employeeMembershipDetails.subscriptionId;
        employeeMembershipDetails.currencyId = this.employeeMembershipDetails.currencyId;
        employeeMembershipDetails.nameOfTheCertificate = this.employeeMembershipDetails.nameOfTheCertificate;
        employeeMembershipDetails.issueCertifyingAuthority = this.employeeMembershipDetails.issueCertifyingAuthority;
        employeeMembershipDetails.timeStamp = this.employeeMembershipDetails.timeStamp;
        employeeMembershipDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeMembershipDetailsTriggered(employeeMembershipDetails));
        this.deleteMembershipDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelMembershipDetails() {
        this.employeeMembershipDetails = new EmployeeMembershipDetailsModel();
        this.deleteMembershipDetailsPopover.forEach((p) => p.closePopover());
    }

    // addMembershipDetail(editMembershipDetailsPopover) {
    //     this.isMembership = true;
    //     this.editMembershipDetailsData = null;
    //     editMembershipDetailsPopover.openPopover();
    // }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, referenceTypeId: ConstantVariables.MembershipReferenceTypeId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }

    addReminder(row, hasReminderPermissions) {
        const formsDialog = this.dialog.open(ReminderDialogComponent, {
            minWidth: "60vw",
            minHeight: "80vh",
            hasBackdrop: true,
            direction: "ltr",
            data: {
                referenceId: row.employeeMembershipId,
                referenceTypeId: ConstantVariables.MembershipReferenceTypeId,
                ofUser: this.userId,
                hasReminderPermissions
            },
            disableClose: true
        });
    }
}
