import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { UserModel } from "../../models/user";
import { CookieService } from "ngx-cookie-service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { EmployeeBadgeModel } from '../../models/employee-badge.model';
import { BadgeModel } from '../../models/badge-model';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { State } from "../../store/reducers/index";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-employee-badge",
    templateUrl: "employee-badges.component.html"
})

export class EmployeeBadgeComponent extends CustomAppBaseComponent implements OnInit {

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getBadgesAssignedToEmployee();
        }
    }

    employeeId: string;
    badge: EmployeeBadgeModel;
    badges: EmployeeBadgeModel[] = [];

    @ViewChildren("deleteBadgePopUp") deleteBadgePopover;

    public isArchived = false;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress = false;
    badgeId: string;
    validationMessage: string;
    badgeForm: FormGroup;
    isAssign = false;
    showTitleTooltip = false;
    badgesList: BadgeModel[] = [];
    employees: any[] = [];
    employeeIds: any[];
    userData$: Observable<UserModel>;
    currentEmployeeId: string;

    constructor(
        private hrManagementService: HRManagementService,
        public snackbar: MatSnackBar,
        private cookieService: CookieService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private store: Store<State>) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.badges=[];
        this.getAllBadges();
        this.getEmployees();
        this.getBadgesAssignedToEmployee();
       // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
        // this.canAccess_feature_ViewBadgesAssignedToEmployee$.subscribe((result) => {
        //     this.canAccess_feature_ViewBadgesAssignedToEmployee = result;
        //     this.getBadgesAssignedToEmployee();
        // })
    }

    getBadgesAssignedToEmployee() {
        this.badges=[];
        if (this.canAccess_feature_ViewBadgesAssignedToEmployee == true && this.employeeId) {
            this.isAnyOperationIsInprogress = true;
            const badge = new EmployeeBadgeModel();
            badge.userId = this.employeeId;
            badge.isForOverView = false;
            this.hrManagementService.getBadgesAssignedToEmployee(badge).subscribe((result: any) => {
                if (result.success === true) {
                    this.badges = result.data;
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.isAnyOperationIsInprogress = false;
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            })
        }
    }

    getAllBadges() {
        const badgeModel = new BadgeModel();
        badgeModel.isArchived = this.isArchived;
        this.hrManagementService.getBadges(badgeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.badgesList = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toastr.error(this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {

                if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "") {
                    this.employeeId = result.data.employeeId;
                    this.getBadgesAssignedToEmployee();
                }

                // this.employeeId = result.data.employeeId;
                this.currentEmployeeId = result.data ? result.data.employeeId : null;
            }
            this.hrManagementService.getEmployees().subscribe((response: any) => {
                if (response.success === true) {
                    this.employees = response.data;
                    if (this.currentEmployeeId && this.employees && this.employees.length > 0) {
                        const index = this.employees.findIndex((p) => p.employeeId.toLowerCase() == this.currentEmployeeId.toLowerCase());
                        if (index > -1) {
                            this.employees.splice(index, 1);
                        }
                    }
                    this.employeeIds = this.employees.map(x => x.employeeId);
                }
                this.cdRef.detectChanges();
            });
            this.cdRef.detectChanges();
        });
    }

    checkTitleTooltipStatus(description) {
        if (description && description.length > 195) {
            this.showTitleTooltip = true;
        } else {
            this.showTitleTooltip = false;
        }
    }

    AssignBadge() {
        this.isAnyOperationIsInprogress = true;
        this.badge = this.badgeForm.value;
        this.hrManagementService.assignBadgeToEmployee(this.badge).subscribe((response: any) => {
            if (response.success === true) {
                this.isAssign = false;
                this.clearForm();
                this.getBadgesAssignedToEmployee();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteBadge() {
        this.isAnyOperationIsInprogress = true;
        this.badge = new EmployeeBadgeModel();
        this.badge.id = this.badgeId;
        this.badge.isArchived = true;
        this.hrManagementService.assignBadgeToEmployee(this.badge).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteBadgePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getBadgesAssignedToEmployee();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    aggignBadgePopupOpen() {
        this.isAssign = true;
    }

    closeUpsertBadgePopup() {
        this.isAssign = false;
        this.clearForm();
    }

    deleteBadgePopUpOpen(row, deleteBadgePopUp) {
        this.badgeId = row.id;
        deleteBadgePopUp.openPopover();
    }

    closeDeleteBadgeDialog() {
        this.clearForm();
        this.deleteBadgePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.badgeId = null;
        this.badge = null;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.badgeForm = new FormGroup({
            assignedTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            badgeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            badgeDescription: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            )
        })
    }

}
