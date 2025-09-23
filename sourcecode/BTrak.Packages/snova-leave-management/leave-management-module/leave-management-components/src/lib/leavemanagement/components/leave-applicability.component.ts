
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialogRef } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { NewLeaveTypePageComponent } from '../containers/new-leave-type.page';
import { AddNewLeaveLeaveApplicabilityTriggered, LoadLeaveApplicabilityTriggered, LeaveApplicabilityActionTypes } from '../store/actions/leave-applicability.actions';
import { Store, select } from '@ngrx/store';
import { ofType, Actions } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { OnInit, ViewChild, Component, Input, Output, EventEmitter } from '@angular/core';
import { LeaveApplicabilityModel } from '../models/leave-applicability-model';
import { TranslateService } from '@ngx-translate/core';
import * as leaveManagementModuleReducers from "../store/reducers/index";
import * as _ from 'underscore';
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RoleModel } from '../models/role-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { State } from '../store/reducers/index';
import { BranchModel } from '../models/branch-model';
import { LeaveManagementService } from '../services/leaves-management-service';
import { GenderSearchModel } from '../models/gender';
import { MaritalStatusesSearchModel } from '../models/marital';
import { Branch } from '../models/branch';
import { EmployeeListModel } from '../models/employee';
import { LeavesService } from '../services/leaves-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {LocalStorageProperties} from '../../globaldependencies/constants/localstorage-properties';
import {SoftLabelConfigurationModel} from '../models/softlabels-model';

@Component({
    selector: "app-fm-component-leave-applicability",
    templateUrl: `leave-applicability.component.html`
})

export class LeaveApplicabilityComponent extends AppBaseComponent implements OnInit {
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allBranchSelected") private allBranchSelected: MatOption;
    @ViewChild("allEmployeeSelected") private allEmployeeSelected: MatOption;
    isEmployeeDisabled: boolean = false;
    isAnyAppSelected = false;

    @Input("leaveType")
    set selectedTabIndexByNumber(data: any) {
        this.leaveTypeId = data;
    }

    @Output() selectedTabIndex = new EventEmitter<any>();
    @Output() previousTabIndex = new EventEmitter<any>();
    @Output() closeMatDialog = new EventEmitter<string>();

    gendersList: any;
    maritalStatusesList: any;
    rolesList: RoleModel[];
    branchList: BranchModel[];
    selectRolesListData: RoleModel[];
    selectBranchListData: RoleModel[];
    loadingeaveApplicability$: Observable<boolean>;
    loadingeaveApplicabilityInprogress: boolean;
    upsertLeaveApplicabilityInprogress$: Observable<boolean>;
    leaveApplicability: LeaveApplicabilityModel;
    leaveApplicabilityId: string;
    selectedRolesList: string;
    selectedBranchList: string;
    timeStamp: any;
    leaveApplicability$: Observable<any>;
    applicabilityForm: FormGroup;
    leaveTypeId: string;
    public ngDestroyed$ = new Subject();
    isRoleList: boolean;
    isSelectAll: boolean;
    selectedRoleIds: string[];
    selectedRoleNames: string;
    allEmployeeList: any;
    employeesList: any;
    selectedEmployees: string;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private store: Store<State>, private actionUpdates$: Actions, private activatedRoute: ActivatedRoute, private route: Router,
        private snackBar: MatSnackBar, private translateService: TranslateService, private leavesService: LeaveManagementService, private leaveService: LeavesService,
        public dialogRef : MatDialogRef<NewLeaveTypePageComponent>) {
        super();
        this.isAnyAppSelected = false;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveApplicabilityActionTypes.LoadLeaveApplicabilityCompleted),
                tap(() => {
                    this.loadingeaveApplicabilityInprogress = false;
                    this.leaveApplicability$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveApplicabilityAll));
                    this.leaveApplicability$.subscribe((result) => {
                        if (result && result.length > 0) {
                            this.leaveApplicability = result[0];
                            this.selectedRoleIds = this.leaveApplicability.roleIds;
                            this.leaveApplicabilityId = this.leaveApplicability.leaveApplicabilityId;
                            this.timeStamp = this.leaveApplicability.timeStamp;
                            this.patchCustomApplicationForm(this.leaveApplicability);
                        }
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityCompleted),
                tap(() => {
                    if (this.leaveApplicabilityId) {
                        this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveApplicabilityDetailsUpdatedSuccessfully), "ok", {
                            duration: 3000
                        });
                    } else {
                        this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveApplicabilityDetailsAddedSuccessfully), "ok", {
                            duration: 3000
                        });
                    }
                    this.getLeaveApplicabilityDetails();
                    this.next();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.leaveTypeId = params.id;
            }
        });
        this.initializeForm();
        this.getLeaveApplicabilityDetails();
        this.getAllGenders();
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }


    getAllEmployees() {
        var employeeSearchResult = new EmployeeListModel();
        employeeSearchResult.isArchived = false;
        employeeSearchResult.isActive = true;
        employeeSearchResult.sortDirectionAsc = true;
        this.leaveService.getAllEmployees(employeeSearchResult).subscribe((result: any) => {
            if (result.success) {
                this.allEmployeeList = result.data;
                this.employeesList = this.allEmployeeList
            }
            if (this.leaveTypeId) {
                this.getLeaveApplicabilityDetails();
            }
        });
    }

    getLeaveApplicabilityDetails() {
        const leaveApplicabilitySearchModel = new LeaveApplicabilityModel();
        leaveApplicabilitySearchModel.leaveTypeId = this.leaveTypeId;
        this.store.dispatch(new LoadLeaveApplicabilityTriggered(leaveApplicabilitySearchModel));
        this.loadingeaveApplicability$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveApplicabilityInprogress));
    }

    getAllGenders() {
        this.loadingeaveApplicabilityInprogress = true;
        const genderSearchModel = new GenderSearchModel();
        genderSearchModel.isArchived = false;
        this.leavesService.getGenders(genderSearchModel).subscribe((response: any) => {
            this.gendersList = response.data;
            this.getRoles();
        })
    }

    getAllMaritalStatuses() {
        const maritalStatusesSearchModel = new MaritalStatusesSearchModel();
        maritalStatusesSearchModel.isArchived = false;
        this.leavesService.getMaritalStatuses(maritalStatusesSearchModel).subscribe((response: any) => {
            this.maritalStatusesList = response.data;
            this.getBranchList();
        });
    }

    getRoles() {
        const roleModel = new RoleModel();
        roleModel.isArchived = false;
        this.leavesService.getRolesForEffects(roleModel).subscribe((response: any) => {
            if (response.success) {
                this.rolesList = response.data;
                this.selectRolesListData = response.data;
            }
            this.getAllMaritalStatuses();
        });
    }

    getBranchList() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.leavesService.getBranchList(branchSearchResult).subscribe((response: any) => {
            this.branchList = response.data;
            this.getAllEmployees();
        });
    }

    initializeForm() {
        this.applicabilityForm = new FormGroup({
            minExperienceInMonths: new FormControl(null,
                Validators.compose([
                    Validators.max(100)
                ])
            ),
            maxExperienceInMonths: new FormControl(null,
                Validators.compose([
                    Validators.max(100)
                ])
            ),
            roleId: new FormControl(null,
            ),
            branchId: new FormControl(null,
            ),
            genderId: new FormControl(null,
            ),
            maritalStatusId: new FormControl(null,
            ),
            employeeId: new FormControl(null,
            ),
        })

        this.applicabilityForm.get('minExperienceInMonths').setValue("0");
    }

    upsertLeaveApplicability() {
        let leaveApplicabilityModel = new LeaveApplicabilityModel();
        leaveApplicabilityModel = this.applicabilityForm.value;
        leaveApplicabilityModel.roleId = this.selectedRoleIds;
        leaveApplicabilityModel.leaveTypeId = this.leaveTypeId;
        leaveApplicabilityModel.leaveApplicabilityId = this.leaveApplicabilityId;
        leaveApplicabilityModel.timeStamp = this.timeStamp;
        this.store.dispatch(new AddNewLeaveLeaveApplicabilityTriggered(leaveApplicabilityModel));
        this.upsertLeaveApplicabilityInprogress$ =
            this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveApplicabilityInprogress));
    }

    next() {
        this.selectedTabIndex.emit(null);
    }

    previousPage() {
        this.previousTabIndex.emit(null);
    }
    patchCustomApplicationForm(leaveApplicability) {
        this.applicabilityForm = new FormGroup({
            minExperienceInMonths: new FormControl(leaveApplicability.minExperienceInMonths,
                Validators.compose([
                    Validators.maxLength(50)
                ])
            ),
            maxExperienceInMonths: new FormControl(leaveApplicability.maxExperienceInMonths,
                Validators.compose([
                ])
            ),
            roleId: new FormControl(this.convertStringToArray(leaveApplicability.roleIds, true, false),
            ),
            branchId: new FormControl(this.convertStringToArray(leaveApplicability.branchIds, false, false),
            ),
            genderId: new FormControl(this.convertStringToArray(leaveApplicability.genderIds, false, false),
            ),
            maritalStatusId: new FormControl(this.convertStringToArray(leaveApplicability.maritalStatusIds, false, false),
            ),
            employeeId: new FormControl(this.convertStringToArray(leaveApplicability.employeeIds, false, true),
            )
        });      
        var rolesList = this.rolesList;
        var roleids = this.applicabilityForm.value.roleId;
        if (roleids && roleids.length > 0) {
            var roles = _.filter(rolesList, function (status) {
                return roleids.toString().includes(status.roleId);
            })
            this.selectedRoleNames = roles.map(x => x.roleName).toString();
        }

        var employeesList = this.employeesList;
        var employeesids = this.applicabilityForm.value.employeeId;
        if (employeesids && employeesids.length > 0) {
            var employees = _.filter(employeesList, function (status) {
                return employeesids.toString().includes(status.employeeId);
            })
            this.selectedEmployees = employees.map(x => x.userName).toString();
        }
        this.changeFields();
    }

    convertStringToArray(leaveApplicability, isRole: boolean, isEmployee: boolean) {
        if (leaveApplicability) {
            const roleIds = [];
            leaveApplicability.forEach((id) => {
                roleIds.push(id.toLowerCase());
            });
            if (isRole) {
                if (roleIds && this.rolesList && roleIds.length == this.rolesList.length) {
                    roleIds.push(0);
                    this.allSelected.select();
                }
            }
            if (isEmployee) {
                if (roleIds && this.employeesList && roleIds.length == this.employeesList.length) {
                    roleIds.push(0);
                    this.allEmployeeSelected.select();
                }
            }
            return roleIds;
        }
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            this.applicabilityForm.controls.roleId.patchValue([
                ...this.rolesList.map((item) => item.roleId),
                0
            ]);

        } else {
            this.applicabilityForm.controls.roleId.patchValue([]);
        }
        this.getRoleslistByUserId();
    }

    toggleRolePerOne(all) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.applicabilityForm.controls.roleId.value.length ===
            this.rolesList.length
        ) {
            this.allSelected.select();
        }
    }

    getRoleslistByUserId() {
        const roleids = this.applicabilityForm.value.roleId;
        const index = roleids.indexOf(0);
        if (index > -1) {
            roleids.splice(index, 1);
        }
        this.selectedRoleIds = roleids;
        var rolesList = this.rolesList;
        if (roleids && rolesList && rolesList.length > 0) {
            var roles = _.filter(rolesList, function (status) {
                return roleids.toString().includes(status.roleId);
            })
            this.selectedRoleNames = roles.map(x => x.roleName).toString();
        }
    }
    appsSelected(app) {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
    }
    goToPreviousPage() {
        this.dialogRef.close(this.isAnyAppSelected);
       // this.route.navigateByUrl('leavemanagement/dashboard');
    }

    getSelectedEmployees() {
        const employeeListDataDetailsList = this.employeesList;
        const employmentIds = this.applicabilityForm.controls['employeeId'].value;
        const index = employmentIds.indexOf(0);
        if (index > -1) {
            employmentIds.splice(index, 1);
        }

        const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
            return employmentIds.toString().includes(x.employeeId);
        })
        const employeeNames = employeeListDataDetails.map((x) => x.userName);
        this.selectedEmployees = employeeNames.toString();
    }

    toggleAllEmployeesSelected() {
        if (this.allEmployeeSelected.selected) {
            this.applicabilityForm.controls['employeeId'].patchValue([
                ...this.employeesList.map((item) => item.employeeId),
                0
            ]);
        } else {
            this.applicabilityForm.controls['employeeId'].patchValue([]);
        }
        this.getSelectedEmployees();
    }

    toggleEmployeePerOne() {
        if (this.allEmployeeSelected.selected) {
            this.allEmployeeSelected.deselect();
            return false;
        }
        if (this.applicabilityForm.controls['employeeId'].value.length === this.employeesList.length) {
            this.allEmployeeSelected.select();
        }
        this.getSelectedEmployees();
    }

    changeFields() {
        this.isEmployeeDisabled = false;
        if ((this.applicabilityForm.controls['roleId'].value.length > 0)
            || (this.applicabilityForm.controls['branchId'].value.length > 0)
            || (this.applicabilityForm.controls['genderId'].value.length > 0)
            || (this.applicabilityForm.controls['maritalStatusId'].value.length > 0)
            || (this.applicabilityForm.controls['minExperienceInMonths'].value > 0)
            || (this.applicabilityForm.controls['maxExperienceInMonths'].value > 0)) {
            this.isEmployeeDisabled = true;
            this.applicabilityForm.controls['employeeId'].setValue(null);
        }
        else {
            this.isEmployeeDisabled = false;
        }
    }
}

