import { Component, Input, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Page } from "../../models/Page";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeEducationDetailsModel } from "../../models/employee-education-details-model";

import { LoadEmployeeEducationDetailsTriggered, CreateEmployeeEducationDetailsTriggered, EmployeeEducationDetailsActionTypes } from "../../store/actions/employee-education-details.action";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import { CookieService } from "ngx-cookie-service";
import { Actions, ofType } from "@ngrx/effects";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-education-details",
    templateUrl: "employee-education-details.component.html"
})

export class EmployeeEducationDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteEducationDetailsPopover") deleteEducationDetailsPopover;
    @ViewChildren("editEducationDetailsPopover") editEducationDetailsPopover;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeEducationDetailsList();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    editEducationDetailsData: EmployeeEducationDetailsModel;
    employeeEducationDetails: EmployeeEducationDetailsModel;

    permission: boolean = false;
    searchText: string = "";
    sortBy: string;
    employeeId: string;
    sortDirection: boolean;
    page = new Page();
    isEducation: boolean;

    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.EducationReferenceTypeId;
    employeeEducationDetailsLoading$: Observable<boolean>;
    employeeEducationDetailsList$: Observable<EmployeeEducationDetailsModel[]>;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        super();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.isEducation = false;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsCompleted),
                tap(() => {
                    this.employeeEducationDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeEducationDetailsAll));
                    this.employeeEducationDetailsList$.subscribe((result) => {
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
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "") {
            this.getEmployees();
        }
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeEducationDetailsList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeEducationDetailsList();
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
        this.getEmployeeEducationDetailsList();
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
        this.getEmployeeEducationDetailsList();
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeEducationDetailsList();
    }

    getEmployeeEducationDetailsList() {
        const EducationDetailsSearchResult = new EmployeeDetailsSearchModel();
        EducationDetailsSearchResult.sortBy = this.sortBy;
        EducationDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        EducationDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        EducationDetailsSearchResult.pageSize = this.page.size;
        EducationDetailsSearchResult.searchText = this.searchText;
        EducationDetailsSearchResult.employeeId = this.employeeId;
        EducationDetailsSearchResult.isArchived = false;
        EducationDetailsSearchResult.employeeDetailType = "EducationDetails";
        this.store.dispatch(new LoadEmployeeEducationDetailsTriggered(EducationDetailsSearchResult));
        this.employeeEducationDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeEducationDetailLoading));
    }

    closeUpsertEducationDetailsPopover() {
        this.editEducationDetailsPopover.forEach((p) => p.closePopover());
        this.isEducation = false;
    }

    editEducationDetailsId(event, editEducationDetailsPopover) {
        this.isEducation = true;
        this.editEducationDetailsData = event;
        editEducationDetailsPopover.openPopover();
    }

    getEducationDetailsId(event, deleteEducationDetailsPopover) {
        this.employeeEducationDetails = event;
        deleteEducationDetailsPopover.openPopover();
    }

    deleteEducationDetail() {
        const employeeEducationDetails = new EmployeeEducationDetailsModel();
        employeeEducationDetails.employeeId = this.employeeEducationDetails.employeeId;
        employeeEducationDetails.educationLevelId = this.employeeEducationDetails.educationLevelId;
        employeeEducationDetails.gpaOrScore = this.employeeEducationDetails.gpaOrScore;
        employeeEducationDetails.institute = this.employeeEducationDetails.institute;
        employeeEducationDetails.timeStamp = this.employeeEducationDetails.timeStamp;
        employeeEducationDetails.endDate = this.employeeEducationDetails.endDate;
        employeeEducationDetails.startDate = this.employeeEducationDetails.startDate;
        employeeEducationDetails.majorSpecialization = this.employeeEducationDetails.majorSpecialization;
        employeeEducationDetails.employeeEducationDetailId = this.employeeEducationDetails.employeeEducationDetailId;
        employeeEducationDetails.isArchived = true;
        this.store.dispatch(new CreateEmployeeEducationDetailsTriggered(employeeEducationDetails));
        this.deleteEducationDetailsPopover.forEach((p) => p.closePopover());
    }

    cancelEducationDetails() {
        this.employeeEducationDetails = new EmployeeEducationDetailsModel();
        this.deleteEducationDetailsPopover.forEach((p) => p.closePopover());

    }
}
