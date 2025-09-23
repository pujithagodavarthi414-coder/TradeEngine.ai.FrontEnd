import { Component, ChangeDetectorRef, ViewChild, EventEmitter, Output, Input, Inject } from '@angular/core';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { EmployeeListService } from '../services/employee-list.service';
import { CookieService } from 'ngx-cookie-service';
import * as HRMState from '../../employeeList/store/reducers/index';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { JobCategorySearchModel } from '../models/job-category-search-model';
import * as hrManagementModuleReducer from '../../employeeList/store/reducers/index';
import { ShiftTimingModel } from '../models/shift-timing-model';
import { Branch } from '../models/branch';
import { RoleModel } from '../models/role-model';
import { TimeZoneModel } from '../models/time-zone';
import { DepartmentModel } from '../models/department-model';
import { DesignationModel } from '../../employeeList/models/designations-model';
import { EmploymentStatusSearchModel } from '../models/employment-status-search-model';
import { Observable } from 'rxjs';
import { JobCategoryModel } from '../models/job-category-model';
import { tap } from 'rxjs/operators';
import { Currency } from '../models/currency';
import { EmploymentStatusModel } from '../models/employment-status-model';
import { EmployeeListModel } from '../models/employee-model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CreateEmployeeListItemTriggered } from '../store/actions/employee-list.action';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
import { GenericFormSubmitted } from '../models/generic-form-submitted.model';
import { EmployeeFieldsModel } from '../models/employee-fields.model';

export interface DialogData {
    application: GenericFormSubmitted;
}
@Component({
    selector: 'app-hr-create-employee-component',
    templateUrl: `create-employee-component.html`,
    providers: [SoftLabelPipe],
    styles: [`
        .goal-create-height {
          max-height: calc(100vh - 62vh) !important;
          overflow-x: hidden !important;
        }
    `]
})
export class CreateEmployeeComponent extends CustomAppBaseComponent {

    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("businessUnitsSelected") private businessUnitsSelected: MatOption;
    @Output() closePopup = new EventEmitter<string>();
    isAnyOperationIsInprogress: boolean;
    allBusinessUnits: BusinessUnitDropDownModel[] = [];
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    selectedBusinessUnits: any;
    submittedData: string;
    @ViewChild("formio") formio;
    formSrc: any;
    formData: any = { data: {} };
    isFormLoading: boolean = true;
    submitTrigger: any;
    isFormReadonly: boolean;
    initial: boolean = false;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    employeeFields: any;
    mandatoryfields: { key: string }[];
    formioNotSubmit: boolean;
    isFormExist: boolean;
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.isFormLoading = true;
            this.matData = data[0];
            this.employeeFields = this.matData.employeeFields;
            this.employeeEdit = this.matData.employeeEdit;
            this.formSrc = this.updateFormObject(this.matData.formSourc);
            this.isFormExist = this.formSrc.components.length > 0 ? true : false;
            this.isFormLoading = false;
            this.initial = (this.employeeEdit.userId != null && this.employeeEdit.userId != undefined && this.employeeEdit.userId != '') ? false : true;
            this.isFormReadonly = false;
            this.getEntityDropDown();
            this.getSoftLabelConfigurations();
            this.clearForm();
            if (this.canAccess_feature_CanEditOtherEmployeeDetails) {
                this.getRoles();
                this.getJobCategoryList();
                this.getShiftTimingList();
                this.getBranchList();
                this.getCurrencyList();
                this.getTimeZoneList();
                this.getDepartmentList();
                this.getDesignationList();
                this.getEmploymentStatusList();
                this.getBusinessUnits();
            }
            if (this.employeeEdit.userId != null && this.employeeEdit.userId != undefined && this.employeeEdit.userId != '') {
                this.isAllowSpecialCharacterForFirstName = true;
                this.isAllowSpecialCharacterForLastName = true;
                this.isVisible = false;
                this.branchp = this.employeeEdit.branchId;
                this.editForm(this.employeeEdit)
                this.ShiftTiming(this.employeeEdit.shiftTimingId);
                this.loadForm();
                this.cdRef.detectChanges();
            }
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.cdRef.detectChanges();

        }
    }
    @Input("isEmployeeAdd")
    set isEmployeeAdd(data: any) {
        if (data) {
            this.isFormLoading = true;
            this.formSrc = data.formSourc;
            this.isFormLoading = false;
            this.cdRef.detectChanges();
        }
    }


    userForm: FormGroup;
    shiftTiming: string = '';
    isVisible: boolean = true;
    branchp: string;
    selectedRoles: string;
    isActiveOnMobile: boolean = true;
    employeeName: string;
    validationMessage: string;
    entities: any;
    branchI: string;
    minDate = new Date(1753, 0, 1);
    isNewUser: boolean = false;
    selectedBranches: any;
    employeeEdit: any;

    jobCategoryList$: Observable<JobCategoryModel[]>;
    selectEmployeeShiftDropDownListData$: Observable<ShiftTimingModel[]>;
    selectEmployeeShiftDropDownList: ShiftTimingModel[] = [];
    branchList$: Observable<Branch[]>;
    selectRolesListData$: Observable<RoleModel[]>;
    currencyList$: Observable<Currency[]>;
    timeZoneList$: Observable<TimeZoneModel[]>;
    selectDepartmentDropDownListData$: Observable<DepartmentModel[]>;
    departmentsLoading$: Observable<boolean>;
    designationsLoading$: Observable<boolean>;
    selectDesignationDropDownListData$: Observable<DesignationModel[]>;
    employmentTypeLoading$: Observable<boolean>;
    selectEmploymentStatusDropDownListData$: Observable<EmploymentStatusModel[]>;
    upsertEmployeeInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    selectedRolesListData: RoleModel[];
    allRoles: any[];
    selectDepartmentDropDownListData: DepartmentModel[];
    softLabels: SoftLabelConfigurationModel[];


    isAllowSpecialCharacterForFirstName: boolean;
    isAllowSpecialCharacterForLastName: boolean;

    constructor(private dialogRef: MatDialogRef<CreateEmployeeComponent>, @Inject(MAT_DIALOG_DATA) private data: DialogData,
        public dialog: MatDialog, private cookieService: CookieService, private store: Store<HRMState.State>, private actionUpdates$: Actions,
        private cdRef: ChangeDetectorRef, public googleAnalyticsService: GoogleAnalyticsService, private softLabelPipe: SoftLabelPipe,
        private toaster: ToastrService, private employeeService: EmployeeListService, private translateService: TranslateService,
    ) {
        super();
        this.isFormLoading = true;
        this.submitTrigger = new EventEmitter();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getEntityDropDown();
        this.getSoftLabelConfigurations();
        if (this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getRoles();
            this.getJobCategoryList();
            this.getShiftTimingList();
            this.getBranchList();
            this.getCurrencyList();
            this.getTimeZoneList();
            this.getDepartmentList();
            this.getDesignationList();
            this.getEmploymentStatusList();
            this.getBusinessUnits();
        }
        this.submitTrigger = new EventEmitter();
    }


    getJobCategoryList() {
        var jobCategorySearchModel = new JobCategorySearchModel();
        jobCategorySearchModel.isArchived = false;
        //this.store.dispatch(new LoadJobCategoryTriggered(jobCategorySearchModel));
        this.jobCategoryList$ = this.store.pipe(select(hrManagementModuleReducer.getJobCategoryAll));
    }

    getEntityDropDown() {
        let searchText = "";
        let isEmployeeList = true;
        this.employeeService.getEntityDropDown(searchText, isEmployeeList).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    getShiftTimingList() {
        var shiftTimingSearchModel = new ShiftTimingModel();
        shiftTimingSearchModel.isArchived = false;
        //this.store.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
        this.selectEmployeeShiftDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getShiftTimingAll));
        this.selectEmployeeShiftDropDownListData$.subscribe((data) => {
            this.selectEmployeeShiftDropDownList = data;
        })
    }

    getBranchList() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        //this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
    }

    getRoles() {
        var roleModel = new RoleModel();
        roleModel.isArchived = false;
        //this.store.dispatch(new LoadRolesTriggered(roleModel));
        this.selectRolesListData$ = this.store.pipe(select(hrManagementModuleReducer.getRolesAll), tap(result => {
            this.selectedRolesListData = result
        }));
        this.selectRolesListData$.subscribe((roles) => (this.allRoles = roles));
    }

    getCurrencyList() {
        //this.store.dispatch(new LoadCurrencyTriggered());
        this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
    }

    getTimeZoneList() {
        var timeZoneModel = new TimeZoneModel;
        timeZoneModel.isArchived = false;
        // this.store.dispatch(new LoadTimeZoneListItemsTriggered(timeZoneModel));
        this.timeZoneList$ = this.store.pipe(select(hrManagementModuleReducer.getTimeZoneAll));
    }

    getDepartmentList() {
        var departmentSearchModel = new DepartmentModel();
        departmentSearchModel.isArchived = false;
        //this.store.dispatch(new LoadDepartmentListItemsTriggered(departmentSearchModel));
        this.selectDepartmentDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentAll));
        this.departmentsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentLoading));
    }


    getDesignationList() {
        var designationSearchModel = new DesignationModel();
        designationSearchModel.isArchived = false;
        //this.store.dispatch(new LoadDesignationListItemsTriggered(designationSearchModel));
        this.designationsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationLoading));
        this.selectDesignationDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationAll));
    }

    getEmploymentStatusList() {
        var employmentSearchModel = new EmploymentStatusSearchModel();
        employmentSearchModel.isArchived = false;
        // this.store.dispatch(new LoadEmploymentStatusListItemsTriggered(employmentSearchModel));
        this.employmentTypeLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusLoading));
        this.selectEmploymentStatusDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusAll));
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
            this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }

    removeSpecialCharacterForFirstName() {
        if (this.userForm.value.firstName) {
            const firstName = this.userForm.value.firstName;
            const charCode = firstName.charCodeAt(0);
            if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
                (charCode >= 48 && charCode <= 57)) {
                this.isAllowSpecialCharacterForFirstName = true;
                this.cdRef.detectChanges();
            } else {
                this.isAllowSpecialCharacterForFirstName = false;
                this.cdRef.detectChanges();
            }

        } else {
            this.isAllowSpecialCharacterForFirstName = true;
        }
    }

    removeSpecialCharacterForLastName() {
        if (this.userForm.value.surName) {
            const surName = this.userForm.value.surName;
            const charCode = surName.charCodeAt(0);
            if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
                (charCode >= 48 && charCode <= 57)) {
                this.isAllowSpecialCharacterForLastName = true;
                this.cdRef.detectChanges();
            } else {
                this.isAllowSpecialCharacterForLastName = false;
                this.cdRef.detectChanges();
            }
        } else {
            this.isAllowSpecialCharacterForLastName = true;
        }
    }

    closePopover() {
        // this.closePopup.emit("");
        this.currentDialog.close();
    }
    getHide(name) {
        let retunvalue1;
        this.employeeFields.forEach(element => {
            if (element.fieldName === name) {
                retunvalue1 = element.isHide;
            }
        });
        return !retunvalue1;
    }
    getRequired(name) {
        let retunvalue;
        this.employeeFields.forEach(element => {
            if (element.fieldName === name) {
                retunvalue = element.isRequired;
            }
        });
        return retunvalue;
    }
    toFormGroup(fields) {
        let group: any = {};

        fields.forEach(field => {

            var validations: ValidatorFn[] = [];

            if (field.isRequired) {
                validations.push(Validators.required)
            }
            if (field.fieldName === 'firstName') {
                validations.push(Validators.maxLength(50))
            } else if (field.fieldName === 'ipNumber') {
            } else if (field.fieldName === 'isActive') {
            } else if (field.fieldName === 'surName') {
                validations.push(Validators.maxLength(50))
            } else if (field.fieldName === 'email') {
                validations.push(Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'))
                validations.push(Validators.maxLength(50))
            } else if (field.fieldName === 'mobileNo') {
                validations.push(Validators.maxLength(20))
            } else if (field.fieldName === 'employeeNumber') {
                validations.push(Validators.maxLength(20))
            }
            if (field.fieldName === 'roleIds' || field.fieldName === 'multipleBranches' || field.fieldName === 'businessUnitIds') {
                group[field.fieldName] = new FormControl([], validations);
            } else {
                group[field.fieldName] = new FormControl('', validations);
            }
        });
        return new FormGroup(group);
    }
    toFormGroupData(employeeEdit) {
        let group: any = {};
        let fields = this.employeeFields;
        this.selectedRoles = employeeEdit.roleName;
        let roleIds = [];
        if (employeeEdit.roleId != null) {
            if (this.allRoles != undefined) {
                if (employeeEdit.roleIds.length === this.allRoles.length) {
                    roleIds.push(0);
                }
            }
            employeeEdit.roleId.split(',').forEach(element => {
                roleIds.push(element)
            });
        }
        this.selectedBranches = employeeEdit.permittedBranchNames;
        let selectedBranchIds = [];
        if (employeeEdit.permittedBranchIds != null) {
            if (this.entities != undefined) {
                if (employeeEdit.permittedBranchIds.split(',').length === this.entities.length) {
                    selectedBranchIds.push(0);
                }
            }
            employeeEdit.permittedBranchIds.split(',').forEach(element => {
                selectedBranchIds.push(element)
            });
        }
        this.selectedBusinessUnits = employeeEdit.businessUnitNames;
        let businessUnitIds = [];
        if (employeeEdit.businessUnitIds != null) {
            if (this.allBusinessUnits != undefined) {
                employeeEdit.businessUnitIds.split(',').forEach(element => {
                    businessUnitIds.push(element)
                });
            }
            if (businessUnitIds.length === this.allBusinessUnits.length) {
                businessUnitIds.push(0);
            }
        }
        fields.forEach(field => {

            var validations: ValidatorFn[] = [];

            if (field.mandatory) {
                validations.push(Validators.required)
            }
            if (field.fieldName === 'firstName') {
                validations.push(Validators.maxLength(50))
                group[field.fieldName] = new FormControl(employeeEdit.firstName, validations);
            } else if (field.fieldName === 'surName') {
                validations.push(Validators.maxLength(50))
                group[field.fieldName] = new FormControl(employeeEdit.surName, validations);
            } else if (field.fieldName === 'email') {
                validations.push(Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'))
                validations.push(Validators.maxLength(50))
                group[field.fieldName] = new FormControl(employeeEdit.email, validations);
            } else if (field.fieldName === 'mobileNo') {
                validations.push(Validators.maxLength(20))
                group[field.fieldName] = new FormControl(employeeEdit.mobileNo, validations);
            } else if (field.fieldName === 'employeeNumber') {
                validations.push(Validators.maxLength(20))
                group[field.fieldName] = new FormControl(employeeEdit.employeeNumber, validations);
            } else if (field.fieldName === 'roleIds') {
                group[field.fieldName] = new FormControl(roleIds, validations);
            } else if (field.fieldName === 'designationId') {
                group[field.fieldName] = new FormControl(employeeEdit.designationId, validations);
            } else if (field.fieldName === 'departmentId') {
                group[field.fieldName] = new FormControl(employeeEdit.departmentId, validations);
            } else if (field.fieldName === 'ipNumber') {
                group[field.fieldName] = new FormControl(employeeEdit.ipNumber, validations);
            } else if (field.fieldName === 'isActive') {
                group[field.fieldName] = new FormControl(employeeEdit.isActive, validations);
            } else if (field.fieldName === 'multipleBranches') {
                group[field.fieldName] = new FormControl(selectedBranchIds, validations);
            } else if (field.fieldName === 'employmentStatusId') {
                group[field.fieldName] = new FormControl(employeeEdit.employmentStatusId, validations);
            } else if (field.fieldName === 'jobCategoryId') {
                group[field.fieldName] = new FormControl(employeeEdit.jobCategoryId, validations);
            } else if (field.fieldName === 'dateOfJoining') {
                group[field.fieldName] = new FormControl(employeeEdit.dateOfJoining, validations);
            } else if (field.fieldName === 'shiftTimingId') {
                group[field.fieldName] = new FormControl(employeeEdit.shiftTimingId, validations);
            } else if (field.fieldName === 'branchId') {
                group[field.fieldName] = new FormControl(employeeEdit.branchId, validations);
            } else if (field.fieldName === 'timeZoneId') {
                group[field.fieldName] = new FormControl(employeeEdit.timeZoneId, validations);
            } else if (field.fieldName === 'currencyId') {
                group[field.fieldName] = new FormControl(employeeEdit.currencyId, validations);
            } else if (field.fieldName === 'employeeShiftId') {
                group[field.fieldName] = new FormControl(employeeEdit.employeeShiftId, validations);
            } else if (field.fieldName === 'businessUnitIds') {
                group[field.fieldName] = new FormControl(employeeEdit.businessUnitIds, validations);
            } else {
                group[field.fieldName] = new FormControl(employeeEdit[field.fieldName], validations);
            }
        });
        return new FormGroup(group);
    }

    clearForm() {
        this.mandatoryfields = [];
        this.userForm = this.toFormGroup(this.employeeFields);
        if (this.formSrc.components.length > 0) {
            this.formSrc.components.forEach(element => {
                if (element.validate) {
                    if (element.validate.required) {
                        this.mandatoryfields.push(element.key);
                    }
                }
            });
        }
    }

    editForm(employeeEdit) {
        this.userForm = this.toFormGroupData(employeeEdit);
        this.formData.data = JSON.parse(this.employeeEdit.formData);
    }

    ShiftTiming(shiftTimingId) {
        if (this.userForm.value.branchId == null || this.userForm.value.branchId == "") {
            this.userForm.get("shiftTimingId").patchValue(null);
            var error = this.translateService.instant('HRMANAGAMENT.PLEASESELECTBRANCHTHENSHIFT');
            this.toaster.error(error);
        }

        if (shiftTimingId == "selectNone") {
            this.shiftTiming = '';
        }
        else {
            this.shiftTiming = shiftTimingId;
        }
    }

    branchChanged(bId) {
        if (!this.isVisible) {
            if (this.branchp != bId) {
                this.isVisible = true;
                // tslint:disable-next-line: no-unused-expression
                this.userForm.get("shiftTimingId").patchValue(null);
            }
        }
        var index = this.selectEmployeeShiftDropDownList.findIndex((p) => p.branchId.toLowerCase().trim() == bId.toLowerCase().trim() && p.isDefault == true);
        if (bId && index > -1) {
            this.userForm.get("shiftTimingId").patchValue(this.selectEmployeeShiftDropDownList[index].shiftTimingId);
            this.cdRef.detectChanges();
        }
    }

    compareSelectedRolesFn(roles: any, selectedroles: any) {

        //this.selectAll(roles, selectedroles);

        if (roles == selectedroles) {
            return true;
        } else {
            return false;
        }

    }

    selectAll(roles: any, selectedroles: any) {
        if (selectedroles != null && selectedroles.length == roles.length) {
            this.allSelected.select();
        }
    }

    getSelectedRoles() {

        let rolevalues;
        if (Array.isArray(this.userForm.value.roleIds))
            rolevalues = this.userForm.value.roleIds;
        else
            rolevalues = this.userForm.value.roleIds.split(',');

        const component = rolevalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const rolesList = this.allRoles;
        const selectedUsersList = _.filter(rolesList, function (role) {
            return component.toString().includes(role.roleId);
        })
        const roleNames = selectedUsersList.map((x) => x.roleName);
        this.selectedRoles = roleNames.toString();
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            this.userForm.controls['roleIds'].patchValue([
                0, ...this.allRoles.map(item => item.roleId)
            ]);
        } else {
            this.userForm.controls['roleIds'].patchValue([]);
        }
        this.getSelectedRoles()
    }

    toggleGoalStatusPerOne(event) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.userForm.controls['roleIds'].value.length ===
            this.allRoles.length
        ) {
            this.allSelected.select();
        }
    }

    onKey(event) {
        if (event.keyCode == 17 || event.keyCode == 32) {
            this.userForm.controls['email'].setValue(this.userForm.controls['email'].value.toString().replace(/\s/g, ''));
        }
    }


    upsertEmployee() {
        let addEmployee = new EmployeeListModel();
        if (!this.shiftTiming)
            this.userForm.controls['shiftTimingId'].setValue('');
        addEmployee = this.userForm.value;
        this.getSelectedRoles();
        let roles;
        if (Array.isArray(this.userForm.value.roleIds))
            roles = this.userForm.value.roleIds
        else
            roles = this.userForm.value.roleIds.split(',');

        const index2 = roles.indexOf(0);
        if (index2 > -1) {
            roles.splice(index2, 1)
        }
        let entities = this.userForm.value.multipleBranches;
        const index3 = entities.indexOf(0);
        if (index3 > -1) {
            entities.splice(index3, 1)
        }
        addEmployee.roleIds = roles.join();
        addEmployee.permittedBranches = entities;
        //addEmployee.permittedBranches = entities.join();
        // addEmployee.isActive = this.isActive;
        addEmployee.isActiveOnMobile = this.isActiveOnMobile;
        addEmployee.employeeShiftId = null;
        addEmployee.isUpsertEmployee = true;
        this.formioNotSubmit = null;
        if (this.isFormExist) {
            addEmployee.formSourc = JSON.stringify(this.formio.formio.data);
            if (this.mandatoryfields.length === 0) {
                this.formioNotSubmit = false;
            } else {
                this.mandatoryfields.forEach(element => {
                    if (this.formio.formio.data[element.toString()] === "") {
                        this.formioNotSubmit = true;
                    }
                });
            }
        } else {
            this.formioNotSubmit = false;
        }
        addEmployee.departmentId = this.userForm.value.departmentId;

        let employeeLabel = this.softLabelPipe.transform("Employee", this.softLabels);
        if (!this.formioNotSubmit && this.userForm.valid) {
            if (this.employeeEdit) {
                this.isNewUser = false;
                addEmployee.timeStamp = this.employeeEdit.timeStamp;
                addEmployee.userId = this.employeeEdit.userId;
                addEmployee.employeeId = this.employeeEdit.employeeId;
                addEmployee.genderId = this.employeeEdit.genderId;
                addEmployee.nationalityId = this.employeeEdit.nationalityId;
                addEmployee.maritalStatusId = this.employeeEdit.maritalStatusId;
                addEmployee.dateOfBirth = this.employeeEdit.dateOfBirth;
                addEmployee.employeeShiftId = this.employeeEdit.employeeShiftId;
                addEmployee.registeredDateTime = this.employeeEdit.registeredDateTime;
                this.googleAnalyticsService.eventEmitter(employeeLabel, "Updated " + employeeLabel + "", addEmployee.firstName + ' ' + addEmployee.surName, 1);
            } else {
                this.isNewUser = true;
                this.employeeName = addEmployee.firstName + " " + addEmployee.surName + " (" + addEmployee.employeeNumber + ")";
                this.googleAnalyticsService.eventEmitter(employeeLabel, "Created " + employeeLabel + "", addEmployee.firstName + ' ' + addEmployee.surName, 1);
            }
            this.store.dispatch(new CreateEmployeeListItemTriggered(addEmployee));
            this.upsertEmployeeInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeListDetailLoading))
            this.currentDialog.close();
        } else {
            this.formioNotSubmit = true;
            this.cdRef.detectChanges();
        }
    }

    getBusinessUnits() {
        this.isAnyOperationIsInprogress = true;
        var businessUnitDropDownModel = new BusinessUnitDropDownModel();
        businessUnitDropDownModel.isArchived = false;
        businessUnitDropDownModel.isFromHR = true;
        this.employeeService.getBusinessUnits(businessUnitDropDownModel).subscribe((response: any) => {
            if (response.success == true) {
                this.allBusinessUnits = response.data;
                this.businessUnitsList = this.allBusinessUnits;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getSelectedBusinessUnits() {

        let businessUnitvalues;
        if (Array.isArray(this.userForm.value.businessUnitIds))
            businessUnitvalues = this.userForm.value.businessUnitIds;
        else
            businessUnitvalues = this.userForm.value.businessUnitIds.split(',');

        const component = businessUnitvalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const businessUnitsList = this.allBusinessUnits;
        const selectedBusinessUnitsList = _.filter(businessUnitsList, function (role) {
            return component.toString().includes(role.businessUnitId);
        })
        const businessUnitsNames = selectedBusinessUnitsList.map((x) => x.businessUnitName);
        this.selectedBusinessUnits = businessUnitsNames.toString();
    }

    toggleAllBusinessUnitsSelected() {
        if (this.businessUnitsSelected.selected) {
            this.userForm.controls['businessUnitIds'].patchValue([
                0, ...this.allBusinessUnits.map(item => item.businessUnitId)
            ]);
        } else {
            this.userForm.controls['businessUnitIds'].patchValue([]);
        }
        this.getSelectedBusinessUnits()
    }

    toggleBusinessUnitsPerOne() {
        if (this.businessUnitsSelected.selected) {
            this.businessUnitsSelected.deselect();
            return false;
        }
        if (
            this.userForm.controls['businessUnitIds'].value.length ===
            this.allBusinessUnits.length
        ) {
            this.businessUnitsSelected.select();
        }
    }

    onSubmit(data) {
        this.submittedData = JSON.stringify(this.formio.formio.data);
    }
    loadForm() {
        this.isFormLoading = true;
        this.formData.data = JSON.parse(this.employeeEdit.formData);
        this.submitTrigger = new EventEmitter();
        this.isFormLoading = false;
        this.cdRef.detectChanges();
    }
    getEmployeeFields() {
        let fieldDetails = new EmployeeFieldsModel();
        this.employeeService.getEmployeeFields(fieldDetails).subscribe((response: any) => {
            if (response.data) {
                this.employeeFields = response.data;
                this.clearForm();
            } else {

            }
        })
    }

    updateFormObject(formObj) {
        let updatedNewComponents = [];
        if (formObj && formObj.length > 0) {
            formObj.forEach((comp) => {
                let values = [];
                let keys = Object.keys(comp);
                keys.forEach((key) => {
                    values.push(comp[key]);
                    let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                    let idx = keys.indexOf(key);
                    if (idx > -1) {
                        keys[idx] = updatedKeyName;
                    }
                })
                var updatedModel = {};
                for (let i = 0; i < keys.length; i++) {
                    updatedModel[keys[i]] = values[i];
                }
                updatedNewComponents.push(updatedModel);
            })
        }
        let formObject : any = {};
        formObject.components = updatedNewComponents;
        return formObject;
    }
}