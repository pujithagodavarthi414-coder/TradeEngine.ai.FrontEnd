import { Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../../models/Page';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeWorkExperienceDetailsModel } from '../../models/employee-work-experience-details-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { CreateEmployeeWorkExperienceDetailsTriggered, LoadEmployeeWorkExperienceDetailsTriggered, EmployeeWorkExperienceDetailsActionTypes } from '../../store/actions/employee-work-experience-details.actions';
import { CookieService } from 'ngx-cookie-service';
import { ofType, Actions } from '@ngrx/effects';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-employee-work-experience-details',
    templateUrl: 'employee-work-experience-details.component.html',
})

export class EmployeeWorkExperienceDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteWorkExperienceDetailsPopover') deleteWorkExperienceDetailsPopover;
    @ViewChildren("upsertWorkExperienceDetailsPopover") upsertWorkExperienceDetailsPopover;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeWorkExperienceDetailsList();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editWorkExperienceDetailsData: EmployeeWorkExperienceDetailsModel;
    deleteEmployeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    employeeId: string;
    sortBy: string;
    sortDirection: boolean;
    page = new Page();
    isWorkExperience: boolean;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.WorkexperienceReferenceTypeId;
    employeeWorkExperienceDetailsList$: Observable<EmployeeWorkExperienceDetailsModel[]>;
    employeeWorkExperienceDetailsLoading$: Observable<boolean>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isWorkExperience = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsCompleted),
                tap(() => {
                    this.employeeWorkExperienceDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeWorkExperienceDetailsAll));
                    this.employeeWorkExperienceDetailsList$.subscribe((result) => {
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
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeWorkExperienceDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeWorkExperienceDetailsList();
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
        this.getEmployeeWorkExperienceDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeWorkExperienceDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeWorkExperienceDetailsList();
    }

    getEmployeeWorkExperienceDetailsList() {
        let employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.sortBy = this.sortBy;
        employeeDetailsSearchModel.sortDirectionAsc = this.sortDirection;
        employeeDetailsSearchModel.pageNumber = this.page.pageNumber + 1;
        employeeDetailsSearchModel.pageSize = this.page.size;
        employeeDetailsSearchModel.searchText = this.searchText;
        employeeDetailsSearchModel.employeeId = this.employeeId;
        employeeDetailsSearchModel.isArchived = false;
        employeeDetailsSearchModel.employeeDetailType = "WorkExperienceDetails";
        this.store.dispatch(new LoadEmployeeWorkExperienceDetailsTriggered(employeeDetailsSearchModel));
        this.employeeWorkExperienceDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeWorkExperienceDetailLoading));
    }

    closeWorkExperienceDetailsPopover() {
        this.upsertWorkExperienceDetailsPopover.forEach((p) => p.closePopover());
        this.isWorkExperience = false;
    }

    editWorkExperienceDetailsById(event, upsertWorkExperienceDetailsPopup) {
        this.isWorkExperience = true;
        this.editWorkExperienceDetailsData = event;
        upsertWorkExperienceDetailsPopup.openPopover();
    }

    getWorkExperienceDetailsById(event, deleteWorkExperienceDetailsPopup) {
        this.deleteEmployeeWorkExperienceDetails = event;
        deleteWorkExperienceDetailsPopup.openPopover();
    }

    deleteWorkExperienceDetail() {
        let employeeWorkExperienceDetails = new EmployeeWorkExperienceDetailsModel();
        employeeWorkExperienceDetails.employeeId = this.deleteEmployeeWorkExperienceDetails.employeeId;
        employeeWorkExperienceDetails.employeeWorkExperienceId = this.deleteEmployeeWorkExperienceDetails.employeeWorkExperienceId;
        employeeWorkExperienceDetails.company = this.deleteEmployeeWorkExperienceDetails.company;
        employeeWorkExperienceDetails.designationId = this.deleteEmployeeWorkExperienceDetails.designationId;
        employeeWorkExperienceDetails.fromDate = this.deleteEmployeeWorkExperienceDetails.fromDate;
        employeeWorkExperienceDetails.toDate = this.deleteEmployeeWorkExperienceDetails.toDate;
        employeeWorkExperienceDetails.comments = this.deleteEmployeeWorkExperienceDetails.comments;
        employeeWorkExperienceDetails.timeStamp = this.deleteEmployeeWorkExperienceDetails.timeStamp;
        employeeWorkExperienceDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeWorkExperienceDetailsTriggered(employeeWorkExperienceDetails));
        this.deleteWorkExperienceDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelWorkExperienceDetails() {
        this.deleteEmployeeWorkExperienceDetails = new EmployeeWorkExperienceDetailsModel();
        this.deleteWorkExperienceDetailsPopover.forEach((p) => p.closePopover());
    }
}