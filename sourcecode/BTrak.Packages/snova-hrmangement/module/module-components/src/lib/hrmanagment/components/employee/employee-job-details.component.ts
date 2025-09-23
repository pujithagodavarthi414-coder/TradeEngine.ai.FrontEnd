import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Branch } from '../../models/branch';
import { DepartmentModel } from '../../models/department-model';
import { JobCategoryModel } from '../../models/job-category-model';
import { EmployeeJobDetailsModel } from '../../models/employee-job-model';
import { EmploymentStatusModel } from '../../models/employment-status-model';
import { JobCategorySearchModel } from '../../models/job-category-search-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmploymentStatusSearchModel } from '../../models/employment-status-search-model';
import { DesignationModel } from '../../models/designations-model';
import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';
import { LoadJobCategoryTriggered } from '../../store/actions/job-category.actions';
import { LoadDepartmentListItemsTriggered } from '../../store/actions/department.action';
import { LoadDesignationListItemsTriggered } from '../../store/actions/designation.action';
import { LoadEmploymentStatusListItemsTriggered } from '../../store/actions/employment-status.action';
import { EmployeeJobDetailsActionTypes, CreateEmployeeJobDetailsTriggered, GetEmployeeJobDetailsByIdTriggered } from '../../store/actions/employee-job-details.action';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { LoadBranchTriggered } from '../../store/actions/branch.actions';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: 'app-hr-component-employee-job-details',
    templateUrl: 'employee-job-details.component.html',
})

export class EmployeeJobDetailsComponent extends CustomAppBaseComponent {
    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeJobDetails();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeeJobDetailsForm: FormGroup;

    selectedEmployeeJobDetails: EmployeeJobDetailsModel;

    permission: boolean = false;
    employeeId: string;
    isView: boolean = true;
    isForm: boolean = false;
    isData: boolean = true;
    minDate = new Date(1753, 0, 1);
    isPermanent = true;

    branchList$: Observable<Branch[]>;
    jobCategoryList$: Observable<JobCategoryModel[]>;
    selectedEmployeeJobDetails$: Observable<EmployeeJobDetailsModel>;
    selectDepartmentDropDownListData$: Observable<DepartmentModel[]>;
    selectDesignationDropDownListData$: Observable<DesignationModel[]>;
    selectEmploymentStatusDropDownListData$: Observable<EmploymentStatusModel[]>;
    upsertEmployeeJobDetailsInProgress$: Observable<boolean>;
    noticePeriodOptions: any[] = [
        { value: 1, viewValue: 1 },
        { value: 2, viewValue: 2 },
        { value: 3, viewValue: 3 },
        { value: 4, viewValue: 4 },
        { value: 5, viewValue: 5 },
        { value: 6, viewValue: 6 }
    ];
    public ngDestroyed$ = new Subject();
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.JobDetailsReferenceTypeId;
    constructor(private dialog: MatDialog, private actionUpdates$: Actions, private store: Store<State>, private route: Router,
        private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdCompleted),
                tap(() => {
                    this.selectedEmployeeJobDetails$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeJobDetailsDataById));
                    this.selectedEmployeeJobDetails$.subscribe((result) => {
                        if (result && result[0]) {
                            this.selectedEmployeeJobDetails = result[0];
                            this.employeeJobDetailsForm.patchValue(this.selectedEmployeeJobDetails);
                            this.isData = false;
                            this.isPermanent = this.selectedEmployeeJobDetails.isPermanent;
                        }
                        this.cdRef.markForCheck();
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsCompleted),
                tap(() => {
                    this.isForm = false;
                    this.isView = true;
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeJobDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeJobDetails = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeeJobDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getBranchList();
            this.getDepartmentList();
            this.getJobCategoryList();
            this.getDesignationList();
            this.getEmploymentStatusList();
            this.getEmployees();
        }
        this.initializeEmployeeJobDetailsForm();
    }

    getEmployees() {

        var userId = ''
        if (this.route.url.includes("profile") && this.route.url.split("/")[3]) {
            userId = this.route.url.split("/")[3];
        }
        else {
            userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeJobDetails();
            }
        });
    }

    getEmployeeJobDetails() {
        let employeeJobDetails = new EmployeeDetailsSearchModel();
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "") {
            this.getEmployees();
        }
        employeeJobDetails.employeeId = this.employeeId;
        employeeJobDetails.employeeDetailType = "JobDetails";
        employeeJobDetails.isArchived = false;
        this.store.dispatch(new GetEmployeeJobDetailsByIdTriggered(employeeJobDetails));
    }

    enableDisableForm() {
        this.isForm = true;
        this.isView = false;
    }

    getDesignationList() {
        var designationSearchModel = new DesignationModel();
        designationSearchModel.isArchived = false;
        this.store.dispatch(new LoadDesignationListItemsTriggered(designationSearchModel));
        this.selectDesignationDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationAll));
    }

    getEmploymentStatusList() {
        const employmentSearchModel = new EmploymentStatusSearchModel();
        employmentSearchModel.isArchived = false;
        this.store.dispatch(new LoadEmploymentStatusListItemsTriggered(employmentSearchModel));
        this.selectEmploymentStatusDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusAll));
    }

    getJobCategoryList() {
        var jobCategorySearchModel = new JobCategorySearchModel();
        jobCategorySearchModel.isArchived = false;
        this.store.dispatch(new LoadJobCategoryTriggered(jobCategorySearchModel));
        this.jobCategoryList$ = this.store.pipe(select(hrManagementModuleReducer.getJobCategoryAll));
    }

    getDepartmentList() {
        var departmentSearchModel = new DepartmentModel();
        departmentSearchModel.isArchived = false;
        this.store.dispatch(new LoadDepartmentListItemsTriggered(departmentSearchModel));
        this.selectDepartmentDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentAll));
    }

    getBranchList() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
    }

    initializeEmployeeJobDetailsForm() {
        this.employeeJobDetailsForm = new FormGroup({
            designationId: new FormControl("",
                Validators.compose([
                    Validators.required,
                ])
            ),
            employmentStatusId: new FormControl("",
                Validators.compose([
                    Validators.required,
                ])
            ),
            jobCategoryId: new FormControl("",
                Validators.compose([
                    Validators.required,
                ])
            ),
            joinedDate: new FormControl("", [
            ]),
            departmentId: new FormControl("",
                Validators.compose([
                    Validators.required,
                ])
            ),
            branchId: new FormControl("",
                Validators.compose([
                    Validators.required,
                ])
            ),
            noticePeriodInMonths: new FormControl("",
                Validators.compose([

                ])
            ),
        });
    }

    saveEmployeeJobDetails() {
        let employeeJobDetailsModel = new EmployeeJobDetailsModel();
        employeeJobDetailsModel = this.employeeJobDetailsForm.value;
        employeeJobDetailsModel.employeeId = this.employeeId;
        if (this.selectedEmployeeJobDetails) {
            employeeJobDetailsModel.employeeJobDetailId = this.selectedEmployeeJobDetails.employeeJobDetailId;
            employeeJobDetailsModel.timeStamp = this.selectedEmployeeJobDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeJobDetailsTriggered(employeeJobDetailsModel));
        this.upsertEmployeeJobDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeJobDetailLoading));
    }

    resetEmployeeJobDetails(formDirective: FormGroupDirective) {
        if (this.selectedEmployeeJobDetails) {
            formDirective.resetForm();
            this.employeeJobDetailsForm.patchValue(this.selectedEmployeeJobDetails);
            this.isForm = false;
            this.isView = true;
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
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

    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;

        if (optionalParameters['gridsterView']) {
          
            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }

                    count++;

                    var parentElement = optionalParameters['gridsterViewSelector'];
                    var elementId = '#employee-contract-details';
                    if ($(parentElement + ' ' + elementId + ' datatable-body').length > 0) {
                                             
                        var parentElementHeight = $(parentElement).height();
                        if ($(parentElement + ' #widget-scroll-id').length > 0){
                            var parentContentHeight = parentElementHeight - 35;                            
                            $(parentElement + ' #widget-scroll-id').css({"height": parentContentHeight + "px" });
                        }

                        if (parentElementHeight <= 350)
                            $(parentElement + ' ' + elementId + ' datatable-body').css({"height": "35px" });                           
                       
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);

        }

    }

}