import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
// import { do } from "rxjs/operators";
import schedulerConfig from "../dependencies/components/commonSchedulerConfig";
// import * as hrManagementModuleReducer from "../../hrmanagment/store/reducers/index";
// import { ChangeDetectionStrategy } from "@angular/compiler/src/core";
import { PersistanceService } from "../dependencies/services/persistance.service";
import { Persistance } from "../dependencies/models/persistance.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TimeUsageService } from "../dependencies/services/time-usage.service";
import { AuditCompliance } from "../models/audit-compliance.model";
import { AuditService } from "../services/audits.service";
import { ConductUniqueDetailComponent } from "./conduct-unique-detail.component";
import * as moment_ from "moment";
const moment = moment_;
import { Page } from '../dependencies/models/Page';
import { SelectBranch } from '../dependencies/models/select-branch';
import { HrDashboardService } from '../dependencies/services/hr-dashboard.service';
import { DepartmentModel } from '../dependencies/models/department-model';
import { HRManagementService } from '../dependencies/services/hr-management.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditConductBryntumSchedulerComponent } from './audit-conduct-bryntum-scheduler.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as $_ from 'jquery';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
import { EmployeeService } from '../dependencies/services/employee-service';
const $ = $_;
import * as _ from 'underscore';

@Component({
    selector: "app-audit-conduct-timeline-view",
    templateUrl: "audit-conduct-timeline-view-component.html",
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditConductTimelineView extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("allBranchSelected") private allBranchSelected: MatOption;
    @ViewChild("allAuditSelected") private allAuditSelected: MatOption;
    @ViewChild("openConductsPagePopover") private openConductsPagePopover: any;
    @ViewChild(AuditConductBryntumSchedulerComponent) schedulerComponent: AuditConductBryntumSchedulerComponent;
    @Output() closePopUp = new EventEmitter<any>();
    @ViewChild("businessUnitsSelected") private businessUnitsSelected: MatOption;
    isAnyOperationIsInprogress: boolean;
    validationMessage: any;

    @Input("dashboardFilters")
    set _dashboardFilters(data: any) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    projectId: string;
    schedulerConfig = schedulerConfig;
    auditTimelineInputForm: FormGroup;
    maxDate = new Date();
    minDateForEndDateForInput = new Date();
    dashboardFilters: any;
    sortBy: any;
    sortDirection: any;
    page = new Page();
    departmentList: DepartmentModel[];
    branchesList: SelectBranch[];
    auditList: AuditCompliance[];
    filteredAuditList: AuditCompliance[];
    isSubmitted: boolean = false;
    isFromDashboard: boolean = false;
    trackerData: any;
    loadingIndicator = false;
    loadPopover = false;
    groupType: boolean = true;
    auditList$: Observable<AuditCompliance[]>;
    softLabels: SoftLabelConfigurationModel[];
    loading$: Observable<boolean>;
    appUsageData: any;
    persistanceId: string;
    trackerFilterJson: string;
    trackerFilterObject: any;
    auditConductTimelineList: any;
    conductId: any;
    startDate: Date;
    endDate: Date;
    ispageLoad = false;
    allBusinessUnits: BusinessUnitDropDownModel[] = [];
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    selectedBusinessUnits: any;

    ngOnInit() {
        super.ngOnInit();
        this.startDate = moment().startOf('month').toDate();
        this.endDate = moment().endOf('month').toDate();
        this.ispageLoad = true;
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.auditList = [];
        this.filteredAuditList = [];
        this.activatedRoute.params.subscribe((routeParams) => {
            this.persistanceId = routeParams.id;
        });
        if (!this.isFromDashboard)
            this.getAllBranches();
            this.getBusinessUnits();
        this.setCreatePlanForm();
        // this.initiateReport();
    }

    constructor(private formBuilder: FormBuilder, private hrManagement: HRManagementService,
        private hrdashboardservice: HrDashboardService, private timeUsageService: TimeUsageService,
        private cdRef: ChangeDetectorRef, private persistanceService: PersistanceService, private activatedRoute: ActivatedRoute,
        private auditService: AuditService, private routes: Router, private toastr: ToastrService, private translateService: TranslateService,
        private employeeService: EmployeeService) {
        super();

        this.getSoftLabels();

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }

        this.activatedRoute.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    setCreatePlanForm() {
        this.auditTimelineInputForm = this.formBuilder.group({
            startDate: new FormControl(this.startDate,
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl(this.endDate,
                Validators.compose([
                    Validators.required
                ])
            ),
            branchId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            audit: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            businessUnitIds: new FormControl(null,
            ),
        });

    }

    inputFormstartDateChange() {
        this.minDateForEndDateForInput = this.auditTimelineInputForm.value.startDate.toDate();
    }

    getAllBranches() {
        const selectBranch = new SelectBranch();
        this.hrdashboardservice.getAllBranches(selectBranch).subscribe((result: any) => {
            this.branchesList = result.data;
            this.getAuditList(true);
        });
    }

    savePersistance(persistanceObject: any) {
        const persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.persistanceJson = JSON.stringify(persistanceObject);
            this.persistanceService.UpsertPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    this.trackerFilterJson = JSON.parse(persistance.persistanceJson);
                }
            });
        }
    }

    initiateReport() {
        const persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    if (response.data) {
                        const data = response.data;
                        this.trackerFilterJson = JSON.parse(data.persistanceJson);
                        this.drawReport();
                    } else {
                        this.drawReport();
                    }
                } else {
                    this.drawReport();
                }
            });
        } else {
            this.drawReport();
        }
    }

    drawReport() {
        if (this.trackerFilterJson) {
            this.trackerFilterObject = this.trackerFilterJson;
            this.auditTimelineInputForm.patchValue(this.trackerFilterObject.initialFilter);
            this.minDateForEndDateForInput = this.auditTimelineInputForm.value.startDate;
            // this.getAuditConductTimelineList();
            // this.getWebAppTimeusage();
        }
    }

    toggleAllBranchSelected(event) {
        if (this.allBranchSelected.selected) {
            this.auditTimelineInputForm.controls.branchId.patchValue([
                ...this.branchesList.map((item) => item.branchId),
                0
            ]);
            this.getAuditList(false);
        } else {
            this.auditTimelineInputForm.controls.branchId.patchValue([]);
        }
    }

    tosslePerOne(all) {
        if (this.allBranchSelected.selected) {
            this.allBranchSelected.deselect();
            return false;
        }
        if (this.auditTimelineInputForm.controls.branchId.value.length == this.branchesList.length)
            this.allBranchSelected.select();
        this.getAuditList(false);
    }

    toggleAllAuditSelected(event) {
        if (this.allAuditSelected.selected) {
            this.auditTimelineInputForm.controls.audit.patchValue([
                ...this.auditList.map((item) => item.auditId),
                0
            ]);

        } else {
            this.auditTimelineInputForm.controls.audit.patchValue([]);
        }
    }

    getBusinessUnits() {
        this.isAnyOperationIsInprogress = true;
        var businessUnitDropDownModel = new BusinessUnitDropDownModel();
        businessUnitDropDownModel.isArchived = false;
        businessUnitDropDownModel.isFromHR = false ;
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
        if (Array.isArray(this.auditTimelineInputForm.value.businessUnitIds))
        businessUnitvalues = this.auditTimelineInputForm.value.businessUnitIds;
        else
        businessUnitvalues = this.auditTimelineInputForm.value.businessUnitIds.split(',');

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
            this.auditTimelineInputForm.controls['businessUnitIds'].patchValue([
                0, ...this.allBusinessUnits.map(item => item.businessUnitId)
            ]);
        } else {
            this.auditTimelineInputForm.controls['businessUnitIds'].patchValue([]);
        }
        this.getSelectedBusinessUnits();
    }

    toggleBusinessUnitsPerOne() {
        if (this.businessUnitsSelected.selected) {
            this.businessUnitsSelected.deselect();
            return false;
        }
        if (
            this.auditTimelineInputForm.controls['businessUnitIds'].value.length ===
            this.allBusinessUnits.length
        ) {
            this.businessUnitsSelected.select();
        }
    }

    getAuditList(pageLoad: boolean) {
        this.loading$ = of(true);
        this.auditList = [];
        this.auditTimelineInputForm.controls.audit.patchValue([]);
        let auditsInput: any = {};
        auditsInput.projectId = this.projectId;
        auditsInput.startDate = moment(this.auditTimelineInputForm.value.startDate);
        auditsInput.endDate = moment(this.auditTimelineInputForm.value.endDate);
        auditsInput.branchIds = this.auditTimelineInputForm.value.branchId ? this.auditTimelineInputForm.value.branchId : this.branchesList.map((item) => item.branchId);
        this.auditService.getAuditsByBranch(auditsInput).subscribe((result: any) => {
            this.loading$ = of(false);
            if (result.success == false) {
                this.auditList = [];
                if (result.apiResponseMessages && result.apiResponseMessages.length > 0) {
                    this.loading$ = of(false);
                    //this.toastr.error(result.apiResponseMessages[0].message);
                    this.cdRef.detectChanges();
                    return;
                }
            }
            else {
                this.auditList = result.data;
                if (pageLoad) {
                    this.auditTimelineInputForm.controls.branchId.patchValue([
                        ...this.branchesList.map((item) => item.branchId),
                        0
                    ]);
                    this.auditTimelineInputForm.controls.audit.patchValue([
                        ...this.auditList.map((item) => item.auditId),
                        0
                    ]);
                    this.getAuditConductTimelineList();
                }
            }
        });
    }

    getAuditConductTimelineList() {
        let auditsInput: any = {};
        auditsInput.startDate = this.auditTimelineInputForm.value.startDate;
        auditsInput.endDate = this.auditTimelineInputForm.value.endDate;
        auditsInput.branchIds = this.auditTimelineInputForm.value.branchId ? this.auditTimelineInputForm.value.branchId : this.branchesList.map((item) => item.branchId);
        auditsInput.auditIds = this.auditTimelineInputForm.value.audit ? this.auditTimelineInputForm.value.audit : this.auditList.map((item) => item.auditId);
        auditsInput.projectId = this.projectId;
        auditsInput.businessUnitIds = this.auditTimelineInputForm.value.businessUnitIds;
        this.auditService.getAuditConductTimeline(auditsInput).do((response: any) => { })
            .switchMap((responseData) => {
                if (responseData.success == false) {
                    this.trackerData = [];
                    this.appUsageData = [];
                    this.loading$ = of(false);
                    this.cdRef.detectChanges();
                }
                if (responseData.data == null) {
                    this.trackerData = [];
                    this.appUsageData = [];
                    this.loading$ = of(false);
                    this.cdRef.detectChanges();
                } else {
                    this.isSubmitted = true;
                    this.appUsageData = responseData.data;
                    this.filteredAuditList = this.auditList.filter(x => this.auditTimelineInputForm.value.audit.includes(x.auditId));
                    this.auditConductTimelineList = responseData.data;
                    this.loading$ = of(false);
                    this.cdRef.detectChanges();
                }
                return of(responseData);
            })
            .subscribe();
    }

    // toggleAllAuditSelected(event) {
    //     if (this.allAuditSelected.selected) {
    //         this.auditTimelineInputForm.controls.audit.patchValue([
    //             ...this.auditList
    //                 .filter((x) => this.auditTimelineInputForm.value.department.includes(x.departmentId))
    //                 .map((item) => item.userId),
    //             0
    //         ]);

    //     } else {
    //         this.auditTimelineInputForm.controls.audit.patchValue([]);
    //     }
    // }

    departmentChange() {
        this.allAuditSelected.deselect();
        this.auditTimelineInputForm.controls.audit.patchValue([]);
    }

    showFilter() {
        this.isSubmitted = false;
    }

    getSelectedConduct(event) {
        this.conductId = event;
        this.openConductsPagePopover.openPopover();
        this.loadPopover = true;
        this.cdRef.detectChanges();
        // const dialogRef = this.dialog.open(ConductUniqueDetailComponent, {
        //     height: 'auto',
        //     width: 'calc(100vw- 100px)',
        //     disableClose: true,
        //     data: { id: event }
        // });
    }

    closeSatPopover(event) {
        this.openConductsPagePopover.closePopover();
        this.loadPopover = false;
        this.getAuditConductTimelineList();
    }

    backToConduct() {
        // this.routes.navigate(["audits/auditsview/1"]);
        if (this.routes.url.includes("/audit/")) {
            this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/audit/conducts');
          } else {
            this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
          }
    }

    closeFilter() {
        this.isSubmitted = true;
    }

    zoomIn() {
        this.schedulerComponent.zoomIn();
    }

    zoomOut() {
        this.schedulerComponent.zoomOut();
    }

    fitContent(optionalParameters: any) {

        if (optionalParameters['gridsterView']) {

            var parentElement = optionalParameters['gridsterViewSelector'];
            if ($(parentElement + ' #style-1').length > 0) {
                $(parentElement + ' #style-1').height($(parentElement).height() - 140);

                $(parentElement + ' #style-1 #audit-conduct-scheduler').css({ "min-width": "700px", "margin-bottom": "20px" });
                $(parentElement + ' #style-1 .b-widget-scroller').addClass('widget-scroll');
            }
        }

    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.routes.navigateByUrl('/projects');
    }
}