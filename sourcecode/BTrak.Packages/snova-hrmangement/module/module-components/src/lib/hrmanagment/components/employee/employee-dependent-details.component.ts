import { Component, Input, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { tap, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

import { Page } from "../../models/Page";
import { EmployeeDependentContactModel } from "../../models/employee-dependent-contact-model";
import { EmployeeDependentContactSearchModel } from "../../models/employee-dependent-contact-search-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { LoadEmployeeDependentDetailsTriggered, CreateEmployeeDependentDetailsTriggered, EmployeeDependentDetailsActionTypes } from "../../store/actions/employee-dependent-details.actions";
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { Actions, ofType } from "@ngrx/effects";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-dependent-details",
    templateUrl: "employee-dependent-details.component.html"
})

export class EmployeeDependentDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteDependentDetailsPopover") deleteDependentDetailsPopover;
    @ViewChildren("editDependentDetailsPopover") editDependentDetailsPopover;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeDependentDetailsList();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeeDependentDetails: EmployeeDependentContactModel;
    editDependencyDetailsData: EmployeeDependentContactModel;

    searchText: string = "";
    employeeId: string;
    sortBy: string;
    sortDirection: boolean;
    page = new Page();
    permission: boolean = false;
    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.DependentsReferenceTypeId;
    employeeDependentDetailsLoading$: Observable<boolean>;
    employeeDependentDetailsList$: Observable<EmployeeDependentContactModel[]>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsCompleted),
                tap(() => {
                    this.employeeDependentDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeDependentDetailsAll));
                    this.employeeDependentDetailsList$.subscribe((result) => {
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
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeDependentDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeDependentDetailsList();
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
        this.getEmployeeDependentDetailsList();
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
        this.getEmployeeDependentDetailsList();
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeDependentDetailsList();
    }

    getEmployeeDependentDetailsList() {
        const employeeDependentContactSearchResult = new EmployeeDependentContactSearchModel();
        employeeDependentContactSearchResult.sortBy = this.sortBy;
        employeeDependentContactSearchResult.sortDirectionAsc = this.sortDirection;
        employeeDependentContactSearchResult.pageNumber = this.page.pageNumber + 1;
        employeeDependentContactSearchResult.pageSize = this.page.size;
        employeeDependentContactSearchResult.searchText = this.searchText;
        employeeDependentContactSearchResult.employeeId = this.employeeId;
        employeeDependentContactSearchResult.isArchived = false;
        employeeDependentContactSearchResult.isDependentContact = true;
        employeeDependentContactSearchResult.isEmergencyContact = false;
        this.store.dispatch(new LoadEmployeeDependentDetailsTriggered(employeeDependentContactSearchResult));
        this.employeeDependentDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeDependentDetailLoading));
        this.cdRef.detectChanges();
    }

    closeUpsertDependentDetailsPopover() {
        this.editDependentDetailsPopover.forEach((p) => p.closePopover());
    }

    getDependentDetailsId(event, deleteDependentDetailsPopover) {
        this.employeeDependentDetails = event;
        deleteDependentDetailsPopover.openPopover();
    }

    deleteDependentDetail() {
        const employeeDependentDetails = new EmployeeDependentContactModel();
        employeeDependentDetails.employeeId = this.employeeDependentDetails.employeeId;
        employeeDependentDetails.emergencyContactId = this.employeeDependentDetails.employeeDependentId;
        employeeDependentDetails.firstName = this.employeeDependentDetails.firstName;
        employeeDependentDetails.lastName = this.employeeDependentDetails.lastName;
        employeeDependentDetails.relationshipId = this.employeeDependentDetails.relationshipId;
        employeeDependentDetails.mobileNo = this.employeeDependentDetails.mobileNo;
        employeeDependentDetails.isEmergencyContact = false;
        employeeDependentDetails.isDependentContact = true;
        employeeDependentDetails.timeStamp = this.employeeDependentDetails.timeStamp;
        employeeDependentDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeDependentDetailsTriggered(employeeDependentDetails));
        this.deleteDependentDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelDependentDetails() {
        this.employeeDependentDetails = new EmployeeDependentContactModel();
        this.deleteDependentDetailsPopover.forEach((p) => p.closePopover());
    }

    editDependentDetailsId(event, editDependentDetailsPopover) {
        this.editDependencyDetailsData = event;
        editDependentDetailsPopover.openPopover();
    }

    // addDependentDetail(editDependentDetailsPopover) {
    //     this.editDependencyDetailsData = null;
    //     editDependentDetailsPopover.openPopover();
    // }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, referenceTypeId: ConstantVariables.DependentsReferenceTypeId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }
}
