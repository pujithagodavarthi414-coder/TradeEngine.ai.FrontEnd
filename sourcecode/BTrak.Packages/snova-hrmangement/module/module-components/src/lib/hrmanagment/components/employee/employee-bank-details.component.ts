import { Component, Input, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";

import { Page } from '../../models/Page';
import { EmployeeBankDetailsModel } from "../../models/employee-bank-details-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { LoadEmployeeBankDetailsTriggered, EmployeeBankDetailsActionTypes } from "../../store/actions/employee-bank-details.actions";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { CookieService } from "ngx-cookie-service";
import { Actions, ofType } from "@ngrx/effects";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-bank-details",
    templateUrl: "employee-bank-details.component.html"
})

export class EmployeeBankDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("addBankDetailsPopover") addBankDetailsPopover;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeBankDetailsList();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editBankDetailsData: EmployeeBankDetailsModel;

    permission: boolean = false;
    page2 = new Page();
    sortBy: string;
    employeeId: string;
    sortDirection: boolean;
    searchText: string;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.BankDetailsReferenceTypeId;
    employeeBankDetailsLoading$: Observable<boolean>;
    employeeBankDetailsList$: Observable<EmployeeBankDetailsModel[]>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private cookieService: CookieService,
        private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions) {
        super();
        this.page2.size = 30;
        this.page2.pageNumber = 0;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsCompleted),
                tap(() => {
                    this.employeeBankDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeBankDetailsAll));
                    this.employeeBankDetailsList$.subscribe((result) => {
                        this.page2.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page2.totalPages = this.page2.totalElements / this.page2.size;
                        this.cdRef.detectChanges();
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.employeeId == null || this.employeeId == "")
            this.getEmployees();
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeBankDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page2.pageNumber = pageInfo.offset;
        this.getEmployeeBankDetailsList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === "asc") {
            this.sortDirection = true;
        } else {
            this.sortDirection = false;
        }
        this.page2.size = 30;
        this.page2.pageNumber = 0;
        this.getEmployeeBankDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) {
                return;
            }
        }
        this.page2.size = 30;
        this.page2.pageNumber = 0;
        this.getEmployeeBankDetailsList();
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeBankDetailsList();
    }

    getEmployeeBankDetailsList() {
        const salaryDetailsSearchResult = new EmployeeBankDetailsModel();
        salaryDetailsSearchResult.sortBy = this.sortBy;
        salaryDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        salaryDetailsSearchResult.pageNumber = this.page2.pageNumber + 1;
        salaryDetailsSearchResult.pageSize = this.page2.size;
        salaryDetailsSearchResult.searchText = this.searchText;
        salaryDetailsSearchResult.employeeId = this.employeeId;
        salaryDetailsSearchResult.isArchived = false;
        this.store.dispatch(new LoadEmployeeBankDetailsTriggered(salaryDetailsSearchResult));
        this.employeeBankDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeBankDetailLoading));
    }

    addBankDetailDetailsId(editBankDetailsPopover) {
        this.editBankDetailsData = null;
        editBankDetailsPopover.openPopover();
    }


    editBankDetailDetails(row, editBankDetailsPopover) {
        this.editBankDetailsData = row;
        editBankDetailsPopover.openPopover();
    }

    closeUpsertBankDetailsPopover() {
        this.addBankDetailsPopover.forEach((p) => p.closePopover());
    }
}
