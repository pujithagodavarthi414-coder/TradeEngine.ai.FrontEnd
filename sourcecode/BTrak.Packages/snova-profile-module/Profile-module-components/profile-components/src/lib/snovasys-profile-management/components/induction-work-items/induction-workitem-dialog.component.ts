import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, ViewChildren } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { InductionModel } from "../../models/induction.model";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { UserStory } from '../../models/userstory.model';
import { User } from '../../models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "induction-workitem-dialog",
    templateUrl: "./induction-workitem-dialog.component.html"
})

export class InductionWorItemDialogComponent extends CustomAppBaseComponent {
    @Output() closeMatDialog = new EventEmitter<boolean>();
    @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress: boolean;
    userStoriesList: UserStory[] = [];
    allUsers: User[];
    selectedOwner: User;
    selectedUserStory: UserStory;
    profileImage: string;
    employeeName: string;
    defaultProfileImage = "assets/images/faces/18.png";
    workflowId: string;
    assigneName: string;
    isTagsPopUp: boolean;
    titleText: string;
    taskStatusOrder: number;
    selectedStatusId: string;
    validationMessage: string;
    isUserStoryName = false;
    isLengthValidation = false;
    isUserStoryInputVisible = false;
    adHocWorkForm: FormGroup;
    isValid = false;
    public ngDestroyed$ = new Subject();

    constructor(
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService,
        private adhocWorkService: AdhocWorkService,
        private translateService: TranslateService,
        public AppDialog: MatDialogRef<InductionWorItemDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.employeeName = data;
        this.generateUserStories();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabelConfigurations();
        this.isUserStoryInputVisible = false;
        this.dashboardService.getUsersDropDown('').subscribe((response: any) => {
            this.allUsers = response.data;
        });
    }

    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
      this.cdRef.markForCheck();
    }

    generateUserStories() {
        const inductionModel = new InductionModel();
        this.dashboardService.getAllInductionConfigurations(inductionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userStoriesList = [];
                response.data.forEach((element) => {
                    const us = new UserStory();
                    us.userStoryName = element.inductionName;
                    us.isShow = element.isShow;
                    us.statusId = element.inductionId;
                    this.userStoriesList.push(us);
                });
            } else {
                this.userStoriesList = [];
            }
        });
    }

    onNoClick(): void {
        this.AppDialog.close();
    }

    clearForm() {
        this.isUserStoryName = false;
        this.isLengthValidation = false;
        this.cdRef.markForCheck();
        this.adHocWorkForm = new FormGroup({
            userStoryName: new FormControl("", [])
        });
    }

    showUserstoryInput() {
        this.clearForm();
        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
    }

    keyDownFunction(event) {
        this.isLengthValidation = false;
        this.isUserStoryName = false;
        let userStoryName = this.adHocWorkForm.value.userStoryName;
        userStoryName = userStoryName.trim();
        if (userStoryName && userStoryName.length > 800) {
            this.isLengthValidation = true;
            this.cdRef.markForCheck();
        } else if (!userStoryName) {
            this.isLengthValidation = false;
            this.isUserStoryName = true;
            this.cdRef.markForCheck();
        } else {
            this.isLengthValidation = false;
            this.isUserStoryName = false;
            this.cdRef.markForCheck();
        }
        if (event.keyCode == 13) {
            if (userStoryName) {
                const us = new UserStory();
                us.isShow = true;
                us.userStoryName = userStoryName;
                us.ownerUserId = null;
                us.ownerProfileImage = null;
                us.ownerName = null;
                this.userStoriesList.push(us);
                const inductionModel = new InductionModel();
                inductionModel.inductionId = null;
                inductionModel.isShow = true;
                inductionModel.inductionName = userStoryName;
                this.updateInductionConfig(inductionModel)
                this.isUserStoryInputVisible = false;
                this.clearForm();
            }
        }
    }

    updateInductionConfig(config) {
        const inductionModel = new InductionModel();
        inductionModel.inductionId = config.inductionId;
        inductionModel.isShow = config.isShow;
        inductionModel.inductionName = config.inductionName;
        inductionModel.isArchived = false;
        this.dashboardService.upsertInductionConfiguration(inductionModel).subscribe((response: any) => {
            if (response.success == true) {
            }
        });
    }

    checkName(value) {
        if (value && value.length > 0 && value.length <= 800) {
            this.isUserStoryName = false;
            this.isLengthValidation = false;
            this.cdRef.detectChanges();
        }
        if (value && value.length > 800) {
            this.isUserStoryName = false;
            this.isLengthValidation = true;
            this.cdRef.detectChanges();
        }
    }

    includeInWorkItems(event, userStory) {
        if (event.checked) {
            userStory.isShow = true;
        } else {
            userStory.isShow = false;
        }
        const inductionModel = new InductionModel();
        inductionModel.inductionId = userStory.statusId;
        inductionModel.isShow = userStory.isShow;
        inductionModel.inductionName = userStory.userStoryName;
        this.updateInductionConfig(inductionModel)
    }

    saveAssignee(inLineEditUserStoryPopup, userStory) {
        this.selectedUserStory = userStory;
        this.assigneName = userStory.ownerName;
        this.selectedOwner = userStory.ownerUserId;
        this.titleText = userStory.ownerUserId ? this.translateService.instant("PERFORMANCE.MODIFYASSIGNEE") : this.translateService.instant("PERFORMANCE.ADDASSIGNEE");
        inLineEditUserStoryPopup.openPopover();
    }

    changeAssignee(event) {
        const index = this.allUsers.findIndex((p) => p.id.toString().toLowerCase() == event.toString().toLowerCase());
        if (index > -1) {
            const storyIndex = this.userStoriesList.findIndex((q) => q.userStoryName == this.selectedUserStory.userStoryName);
            if (storyIndex > -1) {
                this.assigneName = this.allUsers[index].fullName;
                this.userStoriesList[storyIndex].ownerUserId = this.allUsers[index].id;
                this.userStoriesList[storyIndex].ownerName = this.allUsers[index].fullName;
                this.userStoriesList[storyIndex].ownerProfileImage = this.allUsers[index].profileImage;
            }
        }
        this.inLineEditPopUps.forEach((p) => p.closePopover());
    }

    closeUserStoryDialogWindow() {
        this.inLineEditPopUps.forEach((p) => p.closePopover());
    }

    saveUserStory() {
        this.isValid = true;
        this.userStoriesList.forEach((userstory) => {
            if (userstory.isShow && !userstory.ownerUserId) {
                this.isValid = false;
                this.toastr.error(this.translateService.instant("PERFORMANCE.ASSIGNEEISREQUIREDFOR") + " " + userstory.userStoryName + " " + this.translateService.instant("PERFORMANCE.ASSIGNEEISREQUIREDFOREND"));
            }
        });
        if (this.isValid) {
            this.userStoriesList.forEach((userStoryDetails) => {
                if (userStoryDetails.isShow) {
                    const userStory = new UserStory();
                    userStory.userStoryId = null;
                    userStory.isInductionGoal = true;
                    userStory.ownerUserId = userStoryDetails.ownerUserId;
                    userStory.isFromInduction = true;
                    userStory.userStoryName = this.employeeName + " - " + userStoryDetails.userStoryName;
                    this.adhocWorkService.upsertAdhocWork(userStory).subscribe((result: any) => {
                        if (result.success) {
                        } else {
                            this.validationMessage = result.apiResponseMessages[0].message;
                            this.toastr.error(this.validationMessage);
                        }
                    });
                }
            });
            this.closeMatDialog.emit(true);
            this.toastr.success(this.translateService.instant("PERFORMANCE.INDUCTIONWORKADDEDSUCCESSFULLY"));
            this.onNoClick();
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
