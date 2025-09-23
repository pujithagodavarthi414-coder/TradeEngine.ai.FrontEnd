import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { CustomFormsComponent } from "@thetradeengineorg1/snova-custom-fields";
import { CustomFieldsActionTypes, UpsertCustomFieldTriggered } from "@thetradeengineorg1/snova-custom-fields";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { UserstoryTypeModel } from '../../models/projects/user-story-type-model';
import { CustomFormFieldModel } from '../../models/projects/custom-fileds-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { CompanysettingsModel } from '../../models/company-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ProjectManagementService } from '../../services/project-management.service';
import { State } from '../../store/reducers';
import { Dashboard } from '../../models/dashboard';

@Component({
    selector: "app-fm-component-user-story-type",
    templateUrl: `user-story-type.component.html`

})

export class UserStoryTypeComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    companySettingsModel$: Observable<any[]>;
    dashboardFilters: DashboardFilterModel;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    @ViewChildren("upsertUserStoryTypePopUp") upsertUserStoryTypePopover;
    @ViewChildren("deleteUserStoryTypePopUp") deleteUserStoryTypePopover;
    // @ViewChildren("deleteBranchPopUp") deleteBranchPopover;
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardId: string;    
    dashboardName: string;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Work item types";
        }
    }

    isreload: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress = false;
    userstoryTypes: UserstoryTypeModel[];
    customFormComponent: CustomFormFieldModel;
    deleteUserStoryTypeModel: UserstoryTypeModel;
    searchText: string;
    userStoryTypeForm: FormGroup;
    validationErrorMessage: string;
    public isArchived = false;
    temp: any;
    isThereAnError = false;
    isBugBoardEnable: boolean;
    isButtonVisible: boolean;
    validationMessage: string;
    userStoryTypeEdit: string;
    userStoryTypeId: string;
    userStoryTypeName: string;
    shortName: string;
    isQaRequired: boolean;
    isLogTimeRequired: boolean;
    timeStamp: any;
    userStoryType: UserstoryTypeModel;
    isEdit: boolean;
    isBug: boolean;
    isEditForm: boolean;
    isFormType: boolean;
    moduleTypeId = 4;
    public ngDestroyed$ = new Subject();
    public color = "";

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabels();
        this.getAllCompanySettings();
        this.getAllUserStoryTypes();
    }

    constructor(
        private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService,
        private translateService: TranslateService, private projectsService: ProjectManagementService, public snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog, private softLabelPipe: SoftLabelPipe,
        private masterSettings: MasterDataManagementService
    ) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CustomFieldsActionTypes.UpsertCustomFieldCompleted),
                tap(() => {
                    if (!this.isEditForm) {
                        this.upsertUserStoryTypePopover.forEach((p) => p.closePopover());
                        this.isThereAnError = false;
                        this.customFormComponent = null;
                        this.clearForm();
                        this.formGroupDirective.resetForm();
                        this.getAllUserStoryTypes();
                    } else {
                        this.isThereAnError = false;
                        this.customFormComponent = null;
                    }
                })
            )
            .subscribe();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getAllCompanySettings() {
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.masterSettings.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {
                let companyResult = response.data.filter(item => item.key.trim() == "EnableBugBoard");
                if (companyResult.length > 0) {
                    this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
                }
            }
        });
    }

    getAllUserStoryTypes() {
        this.isAnyOperationIsInprogress = true;
        const userstoryTypeModel = new UserstoryTypeModel();
        userstoryTypeModel.isArchived = this.isArchived;
        this.projectsService.SearchUserStoryTypes(userstoryTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userstoryTypes = response.data;
                this.temp = this.userstoryTypes;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    upsertUserStoryType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.userStoryType = this.userStoryTypeForm.value;
        this.userStoryType.userStoryTypeName = this.userStoryType.userStoryTypeName.trim();
        this.userStoryType.shortName = this.userStoryType.shortName.trim();
        this.userStoryType.userStoryTypeId = this.userStoryTypeId;
        this.userStoryType.timeStamp = this.timeStamp;
        if (this.userStoryType.userStoryTypeId) {
            this.isEditForm = true;
        } else {
            this.isEditForm = false;
        }
        this.projectsService.upsertUserStoryType(this.userStoryType).subscribe((response: any) => {
            if (response.success == true) {
                if (!this.isEdit && this.customFormComponent) {
                    this.customFormComponent.referenceId = response.data;
                    this.customFormComponent.referenceTypeId = response.data;
                    this.store.dispatch(new UpsertCustomFieldTriggered(this.customFormComponent));
                } else {
                    this.upsertUserStoryTypePopover.forEach((p) => p.closePopover());
                    this.isThereAnError = false;
                    this.clearForm();
                    formDirective.resetForm();
                    this.getAllUserStoryTypes();
                }

            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    editUserStoryTypePopupOpen(row, upsertUserStoryTypePopUp) {
        this.isEditForm = true;
        this.userStoryTypeForm.patchValue(row);
        this.userStoryTypeId = row.userStoryTypeId;
        this.color = row.userStoryTypeColor;
        this.userStoryTypeName = row.userStoryTypeName;
        this.shortName = row.shortName;
        this.isQaRequired = row.isForQa;
        this.isLogTimeRequired = row.isLogTime;
        this.isBug = row.isBug;
        this.userStoryTypeEdit = this.translateService.instant("USERSTORYTYPES.EDITUSERSTORYTYPE");
        this.timeStamp = row.timeStamp;
        this.isEdit = true;
        this.isButtonVisible = true;
        this.isFormType = true;
        this.cdRef.detectChanges();
        upsertUserStoryTypePopUp.openPopover();
    }

    deleteUserStoryTypePopupOpen(row, deleteUserStoryPopUp) {
        this.deleteUserStoryTypeModel = row;
        this.isThereAnError = false;
        this.validationErrorMessage = null;
        deleteUserStoryPopUp.openPopover();
    }

    createUserStoryTypePopupOpen(upsertUserStoryTypePopUp) {
        upsertUserStoryTypePopUp.openPopover();
        this.userStoryTypeEdit = this.translateService.instant("USERSTORYTYPES.CREATEUSERSTORYTYPE");
    }

    closeUpsertUserStoryTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.isFormType = !this.isFormType;
        this.upsertUserStoryTypePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.isButtonVisible = false;
        this.isEdit = false;
        this.color = "";
        this.isThereAnError = false;
        this.validationMessage = null;
        this.userStoryType = null;
        this.userStoryTypeId = null;
        this.customFormComponent = null;
        this.userStoryTypeForm = new FormGroup({
            userStoryTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            isQaRequired: new FormControl("", []),
            isLogTimeRequired: new FormControl("", []),
            isBug: new FormControl("", []),
            shortName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            userStoryTypeColor: new FormControl("", Validators.compose([
                Validators.required
            ]))
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((userStoryType) => (userStoryType.userStoryTypeName.toLowerCase().indexOf(this.searchText) > -1) || (userStoryType.shortName.toLowerCase().toString().indexOf(this.searchText) > -1));
        this.userstoryTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    clearFormData() {
        this.customFormComponent = null;
    }

    openCustomForm() {
        let dialogId = "app-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "70%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: 4, referenceId: this.userStoryTypeId, referenceTypeId: this.userStoryTypeId,
                customFieldComponent: this.customFormComponent, isButtonVisible: this.isButtonVisible, formPhysicalId: dialogId, dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        // formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
        //     formsDialog.close();
        //     if (!result) {
        //         this.isreload = 'text';
        //         this.cdRef.detectChanges();
        //     }
        // });
        // formsDialog.componentInstance.submitFormComponent.subscribe((result) => {
        //     formsDialog.close();
        //     if (result) {
        //         this.customFormComponent = result;
        //         this.cdRef.detectChanges();
        //     }
        // });
    }

    closeDialog(result) {
        result.dialog.close();
        if (!result.emitString) {
            this.isFormType = true;
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
            this.cdRef.detectChanges();
        }
    }

    submitFormComponent(result) {
        result.dialog.close();
        if (result.emitData) {
            this.customFormComponent = result.emitData;
            this.cdRef.detectChanges();
        }
    }

    editFormComponent() {
        this.openCustomForm();
    }

    closePopUp() {
        this.isFormType = !this.isFormType;
        this.upsertUserStoryTypePopover.forEach((p) => p.closePopover());
    }

    deleteWorkItemType() {
        this.isAnyOperationIsInprogress = true;
        this.deleteUserStoryTypeModel.isArchived = true;
        this.projectsService.deleteUserStoryType(this.deleteUserStoryTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeArchivePopup();
                this.getAllUserStoryTypes();
            } else {
                this.isThereAnError = true;
                this.validationErrorMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationErrorMessage);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.closeArchivePopup();
            }
        });
    }

    closeArchivePopup() {
        this.deleteUserStoryTypePopover.forEach((p) => p.closePopover());
    }

    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.masterSettings.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = '';
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
