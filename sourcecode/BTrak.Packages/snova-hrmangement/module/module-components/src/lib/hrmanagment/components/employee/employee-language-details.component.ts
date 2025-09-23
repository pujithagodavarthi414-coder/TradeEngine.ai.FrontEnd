import { Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Page } from '../../models/Page';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeeLanguageDetailsModel } from '../../models/employee-language-details-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadEmployeeLanguageDetailsTriggered, CreateEmployeeLanguageDetailsTriggered, EmployeeLanguageDetailsActionTypes } from '../../store/actions/employee-language-details.actions';
import { CookieService } from 'ngx-cookie-service';
import { Actions, ofType } from '@ngrx/effects';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-employee-language-details',
    templateUrl: 'employee-language-details.component.html',
})

export class EmployeeLanguageDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren('deleteLanguageDetailsPopover') deleteLanguageDetailsPopover;
    @ViewChildren("upsertLanguageDetailsPopover") upsertLanguageDetailsPopover;

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeLanguageDetailsList();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editLanguageDetailsData: EmployeeLanguageDetailsModel;
    deleteEmployeeLanguageDetails: EmployeeLanguageDetailsModel;

    permission: boolean = false;
    searchText: string = '';
    employeeId: string;
    sortBy: string;
    sortDirection: boolean;
    page = new Page();
    isLanguage: boolean;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.LanguageReferenceTypeId;
    employeeLanguageDetailsList$: Observable<EmployeeLanguageDetailsModel[]>;
    employeeLanguageDetailsLoading$: Observable<boolean>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isLanguage = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsCompleted),
                tap(() => {
                    this.employeeLanguageDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeLanguageDetailsAll));
                    this.employeeLanguageDetailsList$.subscribe((result) => {
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

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeLanguageDetailsList();
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeLanguageDetailsList();
            }
        });
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
        this.getEmployeeLanguageDetailsList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) return;
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeLanguageDetailsList();
    }

    closeSearch() {
        this.searchText = '';
        this.getEmployeeLanguageDetailsList();
    }

    getEmployeeLanguageDetailsList() {
        let employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.sortBy = this.sortBy;
        employeeDetailsSearchModel.sortDirectionAsc = this.sortDirection;
        employeeDetailsSearchModel.pageNumber = this.page.pageNumber + 1;
        employeeDetailsSearchModel.pageSize = this.page.size;
        employeeDetailsSearchModel.searchText = this.searchText;
        employeeDetailsSearchModel.employeeId = this.employeeId;
        employeeDetailsSearchModel.isArchived = false;
        employeeDetailsSearchModel.employeeDetailType = "LanguageDetails";
        this.store.dispatch(new LoadEmployeeLanguageDetailsTriggered(employeeDetailsSearchModel));
        this.employeeLanguageDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeLanguageDetailLoading));
    }

    closeLanguageDetailsPopover() {
        this.upsertLanguageDetailsPopover.forEach((p) => p.closePopover());
        this.isLanguage = false;
    }

    editLanguageDetailsById(event, upsertLanguageDetailsPopover) {
        this.isLanguage = true;
        this.editLanguageDetailsData = event;
        upsertLanguageDetailsPopover.openPopover();
    }

    getLanguageDetailsById(event, deleteLanguageDetailsPopover) {
        this.deleteEmployeeLanguageDetails = event;
        deleteLanguageDetailsPopover.openPopover();
    }

    deleteLanguageDetail() {
        let employeeLanguageDetails = new EmployeeLanguageDetailsModel();
        employeeLanguageDetails.employeeId = this.deleteEmployeeLanguageDetails.employeeId;
        employeeLanguageDetails.employeeLanguageId = this.deleteEmployeeLanguageDetails.employeeLanguageId;
        employeeLanguageDetails.languageId = this.deleteEmployeeLanguageDetails.languageId;
        employeeLanguageDetails.fluencyId = this.deleteEmployeeLanguageDetails.fluencyId;
        employeeLanguageDetails.competencyId = this.deleteEmployeeLanguageDetails.competencyId;
        employeeLanguageDetails.comments = this.deleteEmployeeLanguageDetails.comments;
        employeeLanguageDetails.timeStamp = this.deleteEmployeeLanguageDetails.timeStamp;
        employeeLanguageDetails.canSpeak = this.deleteEmployeeLanguageDetails.canSpeak;
        employeeLanguageDetails.canRead = this.deleteEmployeeLanguageDetails.canRead;
        employeeLanguageDetails.canWrite = this.deleteEmployeeLanguageDetails.canWrite;
        employeeLanguageDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeLanguageDetailsTriggered(employeeLanguageDetails));
        this.cancelLanguageDetails();
    }

    cancelLanguageDetails() {
        this.deleteEmployeeLanguageDetails = new EmployeeLanguageDetailsModel();
        this.deleteLanguageDetailsPopover.forEach((p) => p.closePopover());
    }
}