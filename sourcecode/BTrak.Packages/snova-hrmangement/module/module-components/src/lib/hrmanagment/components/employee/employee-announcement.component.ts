import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { State } from "../../store/reducers/index";
import { UserModel } from "../../models/user";
import { SelectBranchModel } from '../../models/select-branch-model';
import { AnnouncementModel } from '../../models/announcement.model';
import { AnnounceToDropDown } from '../../models/announceto-dropdown.model';
import { SelectBranch } from '../../models/select-branch';
import { Branch } from '../../models/branch';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HRManagementService } from '../../services/hr-management.service';
import { EmployeeService } from '../../services/employee-service';
import { GetUserProfileByIdTriggered } from '../../store/actions/user-profile.action';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';

@Component({
    selector: "app-hr-employee-announcement",
    templateUrl: "employee-announcement.component.html"
})

export class EmployeeAnnouncementComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertAnnouncementPopUp") upsertAnnouncementPopover;
    @ViewChildren("deleteAnnouncementPopUp") deleteAnnouncementPopover;

    employeeId: string;
    announcements: AnnouncementModel[] = [];
    announcement: AnnouncementModel;
    branchList$: Observable<Branch[]>;
    announcedList: AnnounceToDropDown[] = [];
    isEditorAvailable = false;
    employees: AnnounceToDropDown[] = [];
    branches: AnnounceToDropDown[] = [];
    announcementId: string;
    announcementMessage: string;
    isSelectVisible = false;
    announcedTo: string;
    softLabels: SoftLabelConfigurationModel[];
    nextVisible = true;
    announcementLevel: number;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress = false;
    validationMessage: string;
    announcementForm: FormGroup;
    selectBranches: SelectBranchModel[];
    userData$: Observable<UserModel>;

    public initSettings = {
        plugins: "paste,lists advlist",
        branding: false,
        //powerpaste_allow_local_images: false,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    isAssign = false;
    showTitleTooltip = false;
    employeeIds: any[];
    brachIds: any[];
    announcementNumber = 0;
    totalAnnouncements = 0;
    companyId: string;
    announcementName: string;
    announcedIds: any[] = [];

    constructor(
        private hrManagementService: HRManagementService,
        public snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private cookieService: CookieService,
        private toastr: ToastrService,
        private employeeService: EmployeeService,
        private store: Store<State>) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
        this.getAllBranches();
        this.clearForm();
        this.getCurrentEmployee();
        this.getEmployees();
        this.companyId = this.cookieService.get(LocalStorageProperties.CompanyId);
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.store.dispatch(new GetUserProfileByIdTriggered(userId));
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
    }

    getAllBranches() {
        const selectBranch = new SelectBranch();
        selectBranch.isArchived = false;
        this.employeeService.getAllBranches(selectBranch).subscribe((result: any) => {
            this.selectBranches = result.data;
            this.branches = [];
            if (this.selectBranches.length > 0) {
                this.selectBranches.forEach((branch: SelectBranchModel) => {
                    const branchdata = {
                        key: branch.branchId,
                        value: branch.branchName
                    }
                    this.branches.push(branchdata);
                })
                this.brachIds = this.selectBranches.map(x => x.branchId);
            }
        })
    }

    getEmployees() {
        this.hrManagementService.getEmployees().subscribe((response: any) => {
            if (response.success === true) {
                const employees = response.data;
                this.employees = [];
                if (employees.length > 0) {
                    employees.forEach((employee) => {
                        employee = {
                            key: employee.employeeId,
                            value: employee.nickName
                        };
                        this.employees.push(employee);
                    })
                }
                this.employeeIds = employees.map(x => x.employeeId);
            }
            this.cdRef.detectChanges();
        });
    }

    getCurrentEmployee() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data ? result.data.employeeId : null;
                if (this.employeeId) {
                    this.getAnnouncements();
                }
            }
            this.cdRef.detectChanges();
        });
    }

    getAnnouncements() {
        this.announcementNumber = 0;
        this.totalAnnouncements = 0;
        const announcement = new AnnouncementModel();
        announcement.employeeId = this.employeeId;
        this.hrManagementService.getAnnouncements(announcement).subscribe((result: any) => {
            if (result.success === true) {
                this.announcements = result.data;
                if (this.announcements.length > 0) {
                    this.totalAnnouncements = this.announcements[0].totalAnnouncements;
                    this.cdRef.detectChanges();
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0];
                this.toastr.error(this.validationMessage);
            }
        });
    }

    changeannouncement(changenumber: number) {
        this.announcementNumber = this.announcementNumber + changenumber;
        if (this.totalAnnouncements > (this.announcementNumber + 1)) {
            this.nextVisible = true;
        } else {
            this.nextVisible = false;
        }
    }

    upsertAnnouncement() {
        this.isAnyOperationIsInprogress = true;
        const announcement = this.announcementForm.value;
        const announcementData = new AnnouncementModel();
        announcementData.announcementId = this.announcementId;
        announcementData.announcement = this.announcementMessage;
        announcementData.announcementLevel = announcement.announcementLevel;
        announcementData.announcedTo = "";
        if (announcement.announcedTo.length > 0) {
            let i = 0;
            announcement.announcedTo.forEach((p: string) => {
                if (i == 0) {
                    announcementData.announcedTo = p;
                    i++;
                } else {
                    announcementData.announcedTo = announcementData.announcedTo + "," + p;
                }
            });
        }
        this.hrManagementService.upsertAnnouncement(announcementData).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertAnnouncementPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.isEditorAvailable = false;
                this.getAnnouncements();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteAnnouncement() {
        this.isAnyOperationIsInprogress = true;
        const announcement = new AnnouncementModel();
        announcement.announcementId = this.announcementId;
        announcement.announcement = this.announcementMessage;
        announcement.announcedTo = this.announcedTo;
        announcement.announcementLevel = this.announcementLevel;
        announcement.isArchived = true;
        this.hrManagementService.upsertAnnouncement(announcement).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteAnnouncementPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAnnouncements();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    createAnnouncementPopupOpen(upsertAnnouncementPopUp) {
        this.clearForm();
        this.isEditorAvailable = true;
        this.announcementName = this.translateService.instant("ANNOUNCEMENT.ADDANNOUNCEMENT");
        upsertAnnouncementPopUp.openPopover();
    }

    closeUpsertAnnouncementPopup() {
        this.isEditorAvailable = false;
        this.clearForm();
        this.upsertAnnouncementPopover.forEach((p) => p.closePopover());
    }

    onChange(mrChange: MatRadioChange) {
        this.announcedIds = [];
        this.announcedList = [];
        if (mrChange.value == 0) {
            this.isSelectVisible = false;
            this.announcementForm.get("announcedTo").patchValue([this.companyId]);
        } else if (mrChange.value == 1) {
            this.isSelectVisible = true;
            this.announcedIds = this.brachIds;
            this.announcedList = this.branches;
            this.announcementForm.get("announcedTo").patchValue([]);
        } else if (mrChange.value == 2) {
            this.isSelectVisible = true;
            this.announcedIds = this.employeeIds;
            this.announcedList = this.employees;
            this.announcementForm.get("announcedTo").patchValue([]);
        }
        this.announcementForm.get("announcedTo").markAsUntouched();
        this.cdRef.detectChanges();
    }

    editAnnouncementPopupOpen(row, upsertAnnouncementPopUp) {
        this.clearForm();
        this.isEditorAvailable = true;
        this.announcementId = row.announcementId;
        if (row.announcementLevel == 0) {
            this.isSelectVisible = false;
        } else if (row.announcementLevel == 1) {
            this.isSelectVisible = true;
            this.announcedIds = this.brachIds;
            this.announcedList = this.branches;
        } else if (row.announcementLevel == 2) {
            this.isSelectVisible = true;
            this.announcedIds = this.employeeIds;
            this.announcedList = this.employees;
        }
        const announcementtype = row.announcementLevel == 0 ? "0" : row.announcementLevel == 1 ? "1" : "2";
        this.announcementForm.get("announcement").patchValue(row.announcement);
        this.announcementMessage = row.announcement;
        this.announcementForm.get("announcementLevel").patchValue(announcementtype);
        this.announcementForm.get("announcedTo").patchValue(row.announcedTo.split(','));
        this.announcementName = this.translateService.instant("ANNOUNCEMENT.EDITANNOUNCEMENT");
        upsertAnnouncementPopUp.openPopover();
    }

    deleteAnnouncementPopUpOpen(row, deleteAnnouncementPopUp) {
        this.announcementId = row.announcementId;
        this.announcementMessage = row.announcement;
        this.announcedTo = row.announcedTo;
        this.announcementLevel = row.announcementLevel;
        deleteAnnouncementPopUp.openPopover();
    }

    closeDeleteAnnouncementDialog() {
        this.deleteAnnouncementPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.announcedIds = [];
        this.isSelectVisible = false;
        this.announcedList = [];
        this.announcementId = null;
        this.announcementMessage = null;
        this.isEditorAvailable = false;
        this.announcedTo = null;
        this.announcementLevel = 0;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.announcementForm = new FormGroup({
            announcement: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            announcementLevel: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            announcedTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

}
