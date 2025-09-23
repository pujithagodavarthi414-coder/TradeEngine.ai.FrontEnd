import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren, NgModuleRef, ViewContainerRef, NgModuleFactoryLoader, NgModuleFactory, Type } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { ObservationTypeModel } from "../models/observation-type.model";
import { ResidentObservations } from "../models/resident-observations.model";
import { GenericFormService } from "../services/generic-form.service";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { SoftLabelConfigurationModel } from '../../../models/softlabels.model';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { WidgetService } from '../../../services/widget.service';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { Dashboard } from '../../../models/dashboard.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CustomFieldService } from '../services/custom-field.service';

@Component({
    selector: "app-resident-observations",
    templateUrl: "resident-observations-app.component.html"
})

export class ResidentObservationsComponent extends CustomAppBaseComponent implements OnInit {
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
            this.dashboardName = "Form observations";
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isEditAppName = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    formJson: any;
    formData: any;
    selectedObservationName: string;
    validationMessage: string;
    isAnyOperationIsInprogress = false;
    observationTypes: ObservationTypeModel[] = [];
    observationTypeId: string;
    moduleTypeId = 78;
    formId: string = null;
    formIdFound = false;
    customFormComponent: CustomFormFieldModel;
    customFields: CustomFormFieldModel[];
    selectedObservation: string = null;
    gettingFormInProgress = false;
    observationsFound = false;
    reports: ResidentObservations[] = [];
    public ngDestroyed$ = new Subject();
    @ViewChildren("upsertObservationTypePopUp") upsertObservationTypePopover;
    @ViewChildren("viewObservationPopUp") viewObservationPopover;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    observationDetails: GridDataResult;
    gridData = { data: [], total: 0 };
    pageSize = 10;
    skip = 0;
    public sort: SortDescriptor[] = [{
        field: "createdDateTime",
        dir: "desc"
    }];

    constructor(
        private route: ActivatedRoute, private genericFromService: GenericFormService,
        private cdRef: ChangeDetectorRef, private toaster: ToastrService, private datePipe: DatePipe,
        private customFieldService: CustomFieldService,
        private softLabelPipe: SoftLabelPipe, private snackbar: MatSnackBar, private translateService: TranslateService,
        private widgetService: WidgetService) {
        super();
        this.route.params.subscribe((params) => {
            if (params["formid"] != null && params["formid"] !== undefined) {
                this.formId = params["formid"];
                this.formIdFound = true;
                this.getObservationTypes();
            } else {
                this.formIdFound = false;
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
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
                this.observationTypes = result.data;
                this.getUserObservations();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    getUserObservations() {
        this.reports = [];
        this.gridData = { data: [], total: 0 };
        this.skip = 0;
        this.pageSize = 10;
        if (this.formId) {
            this.observationsFound = false;
            this.isAnyOperationIsInprogress = true;
            const customForm = new CustomFormFieldModel();
            customForm.moduleTypeId = this.moduleTypeId;
            customForm.referenceId = this.formId;
            this.genericFromService.getResidentObservations(customForm).subscribe((result: any) => {
                if (result.success === true) {
                    const resultForms = result.data;
                    if (resultForms && resultForms.length > 0) {
                        this.observationsFound = true;
                        resultForms.forEach((form) => {
                            form.formJson = JSON.parse(form.formJson);
                            form.formData = { data: {} };
                            form.formData.data = JSON.parse(form.formDataJson);
                            this.reports.push(form);
                        });
                        this.gridData.data = this.reports;
                        this.gridData.total = resultForms.length;
                        this.sortObservations();
                    }
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    cellClickHandler(dataItem, viewObservationPopover) {
        this.selectedObservationName = dataItem.observationName;
        this.formJson = dataItem.formJson;
        this.formData = dataItem.formData;
        this.cdRef.detectChanges();
        viewObservationPopover.openPopover();
    }

    closeviewPopOver() {
        this.selectedObservationName = "";
        this.formJson = "";
        this.formData = "";
        this.viewObservationPopover.forEach((p) => p.closePopover());
        this.cdRef.detectChanges();
    }

    openMenu() {
        this.observationTypeId = "selectone";
    }
    // getFormFields(customFormModel, observation) {
    //     this.customFieldService.searchCustomFields(customFormModel).subscribe((result) => {
    //         if (result.success === true) {
    //             const resultForms = result.data;
    //             if (resultForms && resultForms.length > 0) {
    //                 resultForms.forEach((form) => {
    //                     if (form.formDataJson) {
    //                         this.observationsFound = true;
    //                         const report = new ResidentObservations();
    //                         report.observationName = observation.observationTypeName
    //                         report.formJson = JSON.parse(form.formJson);
    //                         report.formData = { data: {} };
    //                         report.formName = form.formName;
    //                         report.formData.data = JSON.parse(form.formDataJson);
    //                         report.createdDateTime = form.createdDateTime;
    //                         report.submittedByUser = form.submittedByUser;
    //                         report.submittedByUserId = form.submittedByUserId;
    //                         report.profileImage = form.profileImage;
    //                         this.reports.push(form);
    //                         this.gridData.data.push(form);
    //                         this.gridData.total = this.gridData.total + 1;
    //                         this.sortObservations()
    //                     }
    //                 });
    //             }
    //             this.cdRef.detectChanges();
    //         } else {
    //             this.validationMessage = result.apiResponseMessages[0].message;
    //             this.toaster.error(this.validationMessage);
    //         }
    //     });
    // }

    pageChange({ skip, take }: PageChangeEvent): void {
        this.isAnyOperationIsInprogress = true;
        this.skip = skip;
        this.pageSize = take;
        this.sortObservations();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.isAnyOperationIsInprogress = true;
        this.sort = sort;
        this.skip = 0;
        this.pageSize = 10;
        this.sortObservations();
    }

    private loadData(): void {
        this.observationDetails = {
            data: this.gridData.data.slice(this.skip, this.skip + this.pageSize),
            total: this.gridData.total
        };
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    }

    private sortObservations(): void {
        this.gridData = {
            data: orderBy(this.gridData.data, this.sort),
            total: this.gridData.total
        };
        this.loadData();
    }

    observationTypeSelected(observationTypeId, submitObservationPopupOver) {
        if (observationTypeId != "selectone") {
            this.gettingFormInProgress = true;
            this.cdRef.detectChanges();
            submitObservationPopupOver.openPopover();
            const customFormModel = new CustomFormFieldModel();
            customFormModel.moduleTypeId = this.moduleTypeId;
            customFormModel.referenceTypeId = observationTypeId;
            customFormModel.referenceId = observationTypeId;
            this.customFieldService.searchCustomFields(customFormModel).subscribe((result: any) => {
                if (result.success === true) {
                    this.customFields = result.data;
                    this.cdRef.detectChanges();
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                }
                this.gettingFormInProgress = false;
                this.cdRef.detectChanges();
            });
        }
    }


    closePopOver() {
        this.observationTypeId = "selectone";
        this.upsertObservationTypePopover.forEach((p) => p.closePopover());
        this.cdRef.detectChanges();
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
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success),
                            { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = "";
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
}
