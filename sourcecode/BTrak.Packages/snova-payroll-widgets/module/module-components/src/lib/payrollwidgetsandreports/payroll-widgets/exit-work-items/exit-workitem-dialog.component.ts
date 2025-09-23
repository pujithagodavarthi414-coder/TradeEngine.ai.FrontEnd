import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, ViewChildren } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { ExitModel } from "../../models/exit.model";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { UserStory } from '../../models/userstory.model';
import { User } from '../../models/exit-user.model';
import { PayRollService } from '../../services/PayRollService';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "exit-workitem-dialog",
    templateUrl: "./exit-workitem-dialog.component.html"
})

export class ExitWorItemDialogComponent extends CustomAppBaseComponent {
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
    loggedInUserId: string;
    constructor(
        private cookieService: CookieService,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        private payRollService: PayRollService,
        private translateService: TranslateService,
        public AppDialog: MatDialogRef<ExitWorItemDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        
        if (this.routes.url.split("/")[3]) {
          
            this.loggedInUserId = this.routes.url.split("/")[3];
        } else {
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        this.employeeName = data;
        this.generateUserStories();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabelConfigurations();
        this.isUserStoryInputVisible = false;
        this.payRollService.getUsersDropDown('').subscribe((response: any) => {
            this.allUsers = response.data;
        });
    }

    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
      this.cdRef.markForCheck();
    } 

    generateUserStories() {
        const exitModel = new ExitModel();
        exitModel.userId = this.loggedInUserId;
              this.payRollService.getAllExitConfigurations(exitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userStoriesList = [];
                response.data.forEach((element) => {
                    const us = new UserStory();
                    us.userStoryName = element.exitName;
                   // us.isShow = element.isShow;
                    us.statusId = element.exitId;
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
                const exitModel = new ExitModel();
                exitModel.exitId = null;
                exitModel.isShow = true;
                exitModel.exitName = userStoryName;
                exitModel.userId= this.loggedInUserId;
               // console.log(exitModel);
                this.updateExitConfig(exitModel)
                                this.isUserStoryInputVisible = false;
                this.clearForm();
            }
        }
    }

    
    updateExitConfig(config) {
        const exitModel = new ExitModel();
        exitModel.exitId = config.exitId;
        exitModel.isShow = config.isShow;
        exitModel.exitName = config.exitName;
        exitModel.isArchived = false;
        exitModel.userId = this.loggedInUserId;
       
        this.payRollService.upsertExitConfiguration(exitModel).subscribe((response: any) => {
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
        const exitModel = new ExitModel();
        exitModel.exitId = userStory.statusId;
        exitModel.isShow = userStory.isShow;
        exitModel.exitName = userStory.userStoryName;
        this.updateExitConfig(exitModel)
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
                    userStory.isExitGoal = true;
                    userStory.ownerUserId = userStoryDetails.ownerUserId;
                    userStory.userStoryName = this.employeeName + " - " + userStoryDetails.userStoryName;
                   
                   this.payRollService.upsertAdhocWork(userStory).subscribe((result: any) => {
                        if (result.success) {
                        } else {
                            this.validationMessage = result.apiResponseMessages[0].message;
                            this.toastr.error(this.validationMessage);
                        }
                    });
                }
            });
            this.closeMatDialog.emit(true);
            this.toastr.success(this.translateService.instant("PERFORMANCE.EXITWORKADDEDSUCCESSFULLY"));
            this.onNoClick();
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next;
    }
}
