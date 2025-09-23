import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, Type, ViewContainerRef, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";;
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ObservationTypeModel } from "../models/observation-type.model";
import { GenericFormService } from "../services/generic-form.service";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { SoftLabelConfigurationModel } from '../../../models/softlabels.model';
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { WidgetService } from '../../../services/widget.service';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { Dashboard } from '../../../models/dashboard.model';
import { CustomFieldService } from '../services/custom-field.service';
import * as _ from "underscore";
import { CustomFormsComponent } from '@thetradeengineorg1/snova-custom-fields';
@Component({
    selector: "observations-app",
    templateUrl: `observations-app.component.html`
})

export class ObservationsTypeComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    @ViewChildren("upsertObservationTypePopUp") upsertObservationTypePopover;
    @ViewChildren("deleteObservationTypePopUp") deleteObservationTypePopover;
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    @ViewChild("appCustomFormComponent") appCustomFormComponent: TemplateRef<any>;
    roleFeaturesIsInProgress$: Observable<boolean>;
    observationTypes: ObservationTypeModel[] = [];
    observationType: ObservationTypeModel;
    deleteObservation: ObservationTypeModel;
    isAnyOperationIsInprogress = false;
    customFormComponent: CustomFormFieldModel;
    temp: any;
    searchText: string;
    observationTypeForm: FormGroup;
    validationErrorMessage: string;
    public isArchived = false;
    isThereAnError = false;
    isButtonVisible: boolean;
    validationMessage: string;
    observationTypeId: string = null;
    userStoryTypeName: string;
    timeStamp: any;
    isEdit: boolean;
    isEditForm: boolean;
    isFormType: boolean;
    moduleTypeId = 78;
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
            this.dashboardName = "Observation types";
        }
    }

    public ngDestroyed$ = new Subject();

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabels();
        this.getObservationTypes();
    }

    constructor(
        private widgetService: WidgetService,
        public customFieldService: CustomFieldService,
        private translateService: TranslateService, public snackbar: MatSnackBar, private genericFromService: GenericFormService, private softLabelPipe: SoftLabelPipe,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog, private toaster: ToastrService) {
        super();
    }

    getSoftLabels() {
        this.softLabels = localStorage.getItem(LocalStorageProperties.SoftLabels) ? JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels)) : [];
    }

    getObservationTypes() {
        this.isAnyOperationIsInprogress = true;
        const observationSearchModel = new ObservationTypeModel();
        observationSearchModel.isArchived = false;
        this.genericFromService.getObservationType(observationSearchModel).subscribe((result: any) => {
            if (result.success === true) {
                this.temp = result.data;
                this.filterByName(null);
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    upsertObservationType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.observationType = this.observationTypeForm.value;
        this.observationType.observationTypeName = this.observationType.observationTypeName.trim();
        this.observationType.observationTypeId = this.observationTypeId;
        this.observationType.isArchived = this.isArchived;
        this.observationType.timeStamp = this.timeStamp;
        if (this.observationType.observationTypeId) {
            this.isEditForm = true;
        } else {
            this.isEditForm = false;
        }
        this.genericFromService.upsertObservationType(this.observationType).subscribe((response: any) => {
            if (response.success === true) {
                if (!this.isEdit && this.customFormComponent) {
                    this.customFormComponent.referenceId = response.data;
                    this.customFormComponent.referenceTypeId = response.data;
                    this.customFieldService
                        .upsertcustomField(this.customFormComponent)
                        .subscribe((response: any) => {
                            if (response.success === true) {
                                if (!this.isEditForm) {
                                    this.upsertObservationTypePopover.forEach((p) => p.closePopover());
                                    this.isThereAnError = false;
                                    this.customFormComponent = null;
                                    this.clearForm();
                                    this.formGroupDirective.resetForm();
                                    this.getObservationTypes();
                                } else {
                                    this.isThereAnError = false;
                                    this.customFormComponent = null;
                                }
                            } else {
                                this.toaster.error(response.apiResponseMessages);
                            }
                        });

                } else {
                    this.upsertObservationTypePopover.forEach((p) => p.closePopover());
                    this.isThereAnError = false;
                    this.clearForm();
                    formDirective.resetForm();
                }
                this.getObservationTypes();
                this.closeUpsertObservationTypePopup(formDirective);

            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteObservationTypePopupOpen(row, deleteUserStoryPopUp) {
        this.deleteObservation = row;
        this.isThereAnError = false;
        this.validationErrorMessage = null;
        deleteUserStoryPopUp.openPopover();
    }

    deleteObservationType() {
        this.isAnyOperationIsInprogress = true;
        this.deleteObservation.isArchived = true;
        this.genericFromService.upsertObservationType(this.deleteObservation).subscribe((response: any) => {
            if (response.success === true) {
                this.closeArchivePopup();
                this.getObservationTypes();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeArchivePopup() {
        this.clearForm();
        this.deleteObservationTypePopover.forEach((p) => p.closePopover());
    }

    createObservationTypePopupOpen(upsertObservationTypePopUp) {
        this.clearForm();
        upsertObservationTypePopUp.openPopover();
    }

    closeUpsertObservationTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.isFormType = !this.isFormType;
        this.upsertObservationTypePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.deleteObservation = null;
        this.timeStamp = null;
        this.isButtonVisible = false;
        this.isEdit = false;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.customFormComponent = null;
        this.observationType = null;
        this.observationTypeId = null;
        this.observationTypeForm = new FormGroup({
            observationTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((observationType) =>
            (observationType.observationTypeName.toLowerCase().indexOf(this.searchText) > -1));
        this.observationTypes = temp;
    }

    editObservationTypePopupOpen(row, upsertObservationTypePopUp) {
        this.isEditForm = true;
        this.observationTypeForm.patchValue(row);
        this.observationType = new ObservationTypeModel();
        this.observationTypeId = row.observationTypeId;
        this.observationType.observationTypeName = row.observationTypeName;
        this.timeStamp = row.timeStamp;
        this.isEdit = true;
        this.isButtonVisible = true;
        this.isFormType = true;
        this.isThereAnError = false;
        this.cdRef.detectChanges();
        upsertObservationTypePopUp.openPopover();
    }

    closeSearch() {
        this.filterByName(null);
    }

    clearFormData() {
        this.customFormComponent = null;
    }


    openCustomForm() {
        let dialogId = "app-custom-form-dialog";
        const formsDialog = this.dialog.open(this.appCustomFormComponent, {
            height: "70%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: this.moduleTypeId, referenceId: this.observationTypeId, referenceTypeId: this.observationTypeId,
                customFieldComponent: this.customFormComponent, isButtonVisible: this.isButtonVisible,
                dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
    }

    closeMatDialog() {
        this.dialog.closeAll();
    }
    submitFormComponent(result) {
        this.dialog.closeAll();
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
        this.upsertObservationTypePopover.forEach((p) => p.closePopover());
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
            this.widgetService.updateDashboardName(dashBoardModel)
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
                        this.toaster.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toaster.warning("", message);
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
