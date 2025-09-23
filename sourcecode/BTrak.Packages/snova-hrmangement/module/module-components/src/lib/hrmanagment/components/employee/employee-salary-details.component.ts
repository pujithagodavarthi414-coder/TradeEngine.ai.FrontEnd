import { Component, Input, ViewChildren, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { AddSalaryDetailsComponent } from './add-salary-details.component';

import { Page } from '../../models/Page';
import { EmployeeSalaryDetailsModel } from '../../models/employee-salary-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadEmployeeSalaryDetailsTriggered, CreateEmployeeSalaryDetailsTriggered, EmployeeSalaryDetailsActionTypes } from '../../store/actions/employee-salary-details.actions';
import { CookieService } from 'ngx-cookie-service';
import { Actions, ofType } from '@ngrx/effects';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-hr-component-salary-details',
    templateUrl: 'employee-salary-details.component.html',
})

export class EmployeeSalaryDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteSalaryDetailsPopover') deleteSalaryDetailsPopover;
    @ViewChildren("editSalaryDetailsPopover") editSalaryDetailsPopover;
    @ViewChild('removeAllBtn') removeAllBtn: ElementRef<MatButton>;
    SalaryDetail: EmployeeSalaryDetailsModel[];
    userId: string;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeSalaryDetailsList();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editSalaryDetailsData: EmployeeSalaryDetailsModel;
    employeeSalaryDetails: EmployeeSalaryDetailsModel;
    allEmployeeSalaryDetailsList: EmployeeSalaryDetailsModel[];

    permission: boolean = false;
    searchText: string = '';
    sortBy: string;
    isEmployee: boolean = false;
    employeeId: string;
    sortDirection: boolean;
    salaryResult: any;
    page = new Page();

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.SalaryReferenceTypeId;
    employeeSalaryDetailsLoading$: Observable<boolean>;
    employeeSalaryDetailsList$: Observable<EmployeeSalaryDetailsModel[]>;
    isAccessPayRollTemplate: Boolean;
    public ngDestroyed$ = new Subject();
    
    constructor(private store: Store<State>, public dialogRef: MatDialogRef<AddSalaryDetailsComponent>,private activatedRoute: ActivatedRoute,private router: Router,
        public dialog: MatDialog, private cookieService: CookieService, private hrManagementService: HRManagementService, 
        private cdRef: ChangeDetectorRef, private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsTriggered),
                tap(() => {
                this.employeeSalaryDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeSalaryDetailsAll));
                this.employeeSalaryDetailsList$.subscribe(result => {
                    if (result) {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        this.salaryResult = result;
                        if (result.length >= 0) {
                            this.permanent(this.salaryResult);
                        }
                    }
                    this.cdRef.markForCheck();
                })
            })
        )
        .subscribe();

        // if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
        //     this.getEmployees();
        // this.employeeSalaryDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeSalaryDetailsAll), tap(result => {
        //     this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
        //     this.page.totalPages = this.page.totalElements / this.page.size;
        //     this.salaryResult = result;

        //     if (result.length > 0) {
        //         this.permanant(this.salaryResult);
        //     }
        //     else {
        //         this.isEmployee = true
        //     }
        // })
        // )

    }
    permanent(salaryResult) {
        if(salaryResult !=undefined && salaryResult !=null && salaryResult.length > 0)
            this.isEmployee = salaryResult[0].isPermanent;
    }
    openDialog(event): void {
        const dialogRef = this.dialog.open(AddSalaryDetailsComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { employeeId: this.employeeId, editSalaryDetailsData: event, isPermission: this.permission, employeeSalaryDetailsList: this.allEmployeeSalaryDetailsList}
        });

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        //     (this.removeAllBtn as any)._getHostElement().blur()
        // });
    }

    ngOnInit() {
        super.ngOnInit();
        if(this.router.url.includes('/payrollmanagement/Employees')){
            this.activatedRoute.paramMap.subscribe(params => {
                this.userId = params.get('id');
              });
              this.employeeId=this.userId;
              this.getEmployeeSalaryDetailsList();
        }
        // this.canAccess_feature_ConfigureEmployeePayrollTemplates$.subscribe(result => {
        //     this.isAccessPayRollTemplate = result;
        // })
        this.isAccessPayRollTemplate = this.canAccess_feature_ConfigureEmployeePayrollTemplates;

        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();



    }

    getEmployees() {

        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeSalaryDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeSalaryDetailsList();
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
        this.getEmployeeSalaryDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeSalaryDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeSalaryDetailsList();
    }

    getEmployeeSalaryDetailsList() {
        const salaryDetailsSearchResult = new EmployeeDetailsSearchModel();
        salaryDetailsSearchResult.sortBy = this.sortBy;
        salaryDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        salaryDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        salaryDetailsSearchResult.pageSize = this.page.size;
        salaryDetailsSearchResult.searchText = this.searchText;
        salaryDetailsSearchResult.employeeId = this.employeeId;
        salaryDetailsSearchResult.isArchived = false;
        salaryDetailsSearchResult.employeeDetailType = "SalaryDetails";
        this.store.dispatch(new LoadEmployeeSalaryDetailsTriggered(salaryDetailsSearchResult));
        this.employeeSalaryDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeSalaryDetailLoading));
    }

    closeUpsertSalaryDetailsPopover() {
        this.editSalaryDetailsPopover.forEach((p) => p.closePopover());
    }

    getSalaryDetailsId(event, deleteSalaryDetailsPopover) {
        this.employeeSalaryDetails = event;
        deleteSalaryDetailsPopover.openPopover();
    }

    deleteSalaryDetail() {
        let employeeSalaryDetails = new EmployeeSalaryDetailsModel();
        employeeSalaryDetails.employeeSalaryDetailId = this.employeeSalaryDetails.employeeSalaryDetailId;
        employeeSalaryDetails.endDate = this.employeeSalaryDetails.endDate;
        employeeSalaryDetails.employeeId = this.employeeSalaryDetails.employeeId;
        employeeSalaryDetails.payGradeId = this.employeeSalaryDetails.payGradeId;
        employeeSalaryDetails.salaryComponent = this.employeeSalaryDetails.salaryComponent;
        employeeSalaryDetails.payFrequencyId = this.employeeSalaryDetails.payFrequencyId;
        employeeSalaryDetails.currencyId = this.employeeSalaryDetails.currencyId;
        employeeSalaryDetails.amount = this.employeeSalaryDetails.amount;
        employeeSalaryDetails.startDate = this.employeeSalaryDetails.startDate;
        employeeSalaryDetails.paymentMethodId = this.employeeSalaryDetails.paymentMethodId;
        employeeSalaryDetails.salaryParticularsFileId = this.employeeSalaryDetails.salaryParticularsFileId;
        employeeSalaryDetails.comments = this.employeeSalaryDetails.comments;
        employeeSalaryDetails.timeStamp = this.employeeSalaryDetails.timeStamp;
        employeeSalaryDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeSalaryDetailsTriggered(employeeSalaryDetails));
        this.deleteSalaryDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelSalaryDetails() {
        this.employeeSalaryDetails = new EmployeeSalaryDetailsModel();
        this.deleteSalaryDetailsPopover.forEach((p) => p.closePopover());
    }

    addSalaryDetail(editSalaryDetailsPopover) {
        this.editSalaryDetailsData = null;
        editSalaryDetailsPopover.openPopover();
    }
}