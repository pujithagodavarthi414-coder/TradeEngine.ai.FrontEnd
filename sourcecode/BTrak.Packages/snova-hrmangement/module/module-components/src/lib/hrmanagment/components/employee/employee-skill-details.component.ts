import { Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { Page } from '../../models/Page';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeSkillDetailsModel } from '../../models/employee-skill-details-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers';

import { CreateEmployeeSkillDetailsTriggered, LoadEmployeeSkillDetailsTriggered, EmployeeSkillDetailsActionTypes } from '../../store/actions/employee-skill-details.actions';
import { CookieService } from 'ngx-cookie-service';
import { ofType, Actions } from '@ngrx/effects';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-employee-skill-details',
    templateUrl: 'employee-skill-details.component.html',
})

export class EmployeeSkillDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteSkillDetailsPopover') deleteSkillDetailsPopovers;
    @ViewChildren("upsertSkillDetailsPopover") upsertSkillDetailsPopover;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeSkillDetailsList();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editSkillDetailsData: EmployeeSkillDetailsModel;
    deleteEmployeeSkillDetails: EmployeeSkillDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    employeeId: string;
    sortBy: string;
    sortDirection: boolean;
    page = new Page();
    isSkill: boolean;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.SkillDetailsReferenceTypeId;
    employeeSkillDetailsList$: Observable<EmployeeSkillDetailsModel[]>;
    employeeSkillDetailsLoading$: Observable<boolean>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isSkill = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsCompleted),
                tap(() => {
                    this.employeeSkillDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeSkillDetailsAll));
                    this.employeeSkillDetailsList$.subscribe((result) => {
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
                this.getEmployeeSkillDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeSkillDetailsList();
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
        this.getEmployeeSkillDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeSkillDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeSkillDetailsList();
    }

    getEmployeeSkillDetailsList() {
        let employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.sortBy = this.sortBy;
        employeeDetailsSearchModel.sortDirectionAsc = this.sortDirection;
        employeeDetailsSearchModel.pageNumber = this.page.pageNumber + 1;
        employeeDetailsSearchModel.pageSize = this.page.size;
        employeeDetailsSearchModel.searchText = this.searchText;
        employeeDetailsSearchModel.employeeId = this.employeeId;
        employeeDetailsSearchModel.isArchived = false;
        employeeDetailsSearchModel.employeeDetailType = "SkillDetails";
        this.store.dispatch(new LoadEmployeeSkillDetailsTriggered(employeeDetailsSearchModel));
        this.employeeSkillDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeSkillDetailLoading));
    }

    closeSkillDetailsPopover() {
        this.upsertSkillDetailsPopover.forEach((p) => p.closePopover());
        this.isSkill = false;
    }

    editSkillDetailsById(event, upsertSkillDetailsPopup) {
        this.isSkill = true;
        this.editSkillDetailsData = event;
        upsertSkillDetailsPopup.openPopover();
    }

    getSkillDetailsById(event, deleteSkillDetailsPopover) {
        this.deleteEmployeeSkillDetails = event;
        deleteSkillDetailsPopover.openPopover();
    }

    deleteSkillDetail() {
        let employeeSkillDetails = new EmployeeSkillDetailsModel();
        employeeSkillDetails.employeeId = this.deleteEmployeeSkillDetails.employeeId;
        employeeSkillDetails.monthsOfExperience = this.deleteEmployeeSkillDetails.monthsOfExperience;
        employeeSkillDetails.skillId = this.deleteEmployeeSkillDetails.skillId;
        employeeSkillDetails.monthsOfExperience = this.deleteEmployeeSkillDetails.monthsOfExperience;
        employeeSkillDetails.comments = this.deleteEmployeeSkillDetails.comments;
        employeeSkillDetails.dateFrom = new Date();
        employeeSkillDetails.employeeSkillId = this.deleteEmployeeSkillDetails.employeeSkillId;
        employeeSkillDetails.timeStamp = this.deleteEmployeeSkillDetails.timeStamp;
        employeeSkillDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeSkillDetailsTriggered(employeeSkillDetails));
        this.deleteSkillDetailsPopovers.forEach((p) => p.closePopover());
    }

    cancelSkillDetails() {
        this.deleteEmployeeSkillDetails = new EmployeeSkillDetailsModel();
        this.deleteSkillDetailsPopovers.forEach((p) => p.closePopover());
    }
}