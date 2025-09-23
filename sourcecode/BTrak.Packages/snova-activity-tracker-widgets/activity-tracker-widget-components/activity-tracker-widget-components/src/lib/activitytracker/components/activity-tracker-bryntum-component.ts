import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { Observable, of } from "rxjs";
import SchedulerConfig from "../../globaldependencies/components/commonSchedulerConfig";
import { EmployeeAppUsageSearch } from "../models/employee-app-usage-search";
import { ActivatedRoute } from "@angular/router";
import { Page } from '../models/Page';
import { SelectBranch } from '../models/select-branch';
import { Persistance } from '../models/persistance.model';
import { DepartmentModel } from '../models/department-model';
import { EmployeeListModel } from '../models/employee-model copy';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivityTrackerBryntumSchedulerComponent } from './activity-bryntum-scheduler.component';
import * as $_ from 'jquery';
const $ = $_;

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    }
  };
  
@Component({
    selector: "app-view-activitytracker-bryntum-report",
    templateUrl: "activity-tracker-bryntum-component.html",
    // changeDetection: ChangeDetectionStrategy.OnPush
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
      ]
})

export class ActivityTrackerBryntumReportView extends CustomAppBaseComponent implements OnInit {
    @ViewChild("alldepartmentsSelected") private alldepartmentsSelected: MatOption;
    @ViewChild("allEmployeesSelected") private allEmployeesSelected: MatOption;
    @ViewChild("allbranchSelected") private allbranchSelected: MatOption;
    @ViewChild("scheduler1") schedulerComponent: any;

    schedulerConfig: any = SchedulerConfig;
    activityTrackerInputForm: FormGroup;
    maxDate = new Date();
    minDateForEndDateForInput = new Date();
    sortBy: any;
    sortDirection: any;
    page = new Page();
    departmentList: DepartmentModel[];
    branchesList: SelectBranch[];
    employeeListDataDetails: EmployeeListModel[];
    isSubmitted: boolean = false;
    trackerData: any;
    loadingIndicator = false;
    groupType: boolean = true;
    employeeListDataDetails$: Observable<EmployeeListModel[]>;
    loading$: Observable<boolean>;
    appUsageData: any;
    trackerTimeSheetData: any;
    trackerUserstoryData: any;
    timesheetOverlayChecker: boolean;
    userStoryOverlayChecker: boolean;
    persistanceId: string;
    trackerFilterJson: string;
    trackerFilterObject: any;
    userCountForBranch: number = 0;
    activityTrackerChecker: boolean;
    idleTimeOverlayChecker: boolean;
    idleTimeData: any;

    ngOnInit() {
        super.ngOnInit();
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.employeeListDataDetails = [];
        this.activatedRoute.params.subscribe((routeParams) => {
            this.persistanceId = routeParams.id;
        });
        this.getAllBranches();
        this.getdepartments();
        this.setCreatePlanForm();
        this.activityTrackerInputForm.controls.startDate.patchValue(new Date());
        this.activityTrackerInputForm.controls.endDate.patchValue(new Date());
        this.initiateReport();
    }

    constructor(private formBuilder: FormBuilder, private timeUsageService: ActivityTrackerService,
        private cdRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
        super();
        this.appUsageData = [];
        this.timesheetOverlayChecker = false;
        this.userStoryOverlayChecker = false;
        this.activityTrackerChecker = false;
    }

    setCreatePlanForm() {
        this.activityTrackerInputForm = this.formBuilder.group({
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            department: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            branchId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            employee: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            groupType: new FormControl(true,
                Validators.compose([])
            )
        });

    }

    inputFormstartDateChange() {
        this.minDateForEndDateForInput = this.activityTrackerInputForm.value.startDate.toDate();
    }

    getAllBranches() {
        const selectBranch = new SelectBranch();
        selectBranch.isArchived = false;
        this.timeUsageService.getAllBranches(selectBranch).subscribe((result: any) => {
            this.branchesList = result.data;
            this.initiateReport();
        });
    }

    getdepartments() {
        const departmentModel = new DepartmentModel();
        departmentModel.isArchived = false;
        this.timeUsageService.getdepartment(departmentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.departmentList = response.data;
                this.initiateReport();
            }
        });
    }

    toggleAllBranchSelected(value) {
        if (this.allbranchSelected.selected) {
            this.activityTrackerInputForm.controls.branchId.patchValue([
                ...this.branchesList.map((item) => item.branchId),
                0
            ]);

        } else {
            this.activityTrackerInputForm.controls.branchId.patchValue([]);
        }
        this.getUsersList(this.activityTrackerInputForm.value.branchId);
    }

    toggleBranchSelected() {
        if (this.allbranchSelected.selected) {
            this.allbranchSelected.deselect();
            this.getUsersList(this.activityTrackerInputForm.value.branchId);
            return false;
        }
        if (this.activityTrackerInputForm.get("branchId").value.length == this.branchesList.length) {
            this.allbranchSelected.select();
            this.getUsersList(this.activityTrackerInputForm.value.branchId);
        }
        else if(this.activityTrackerInputForm.get("branchId").value.length != this.branchesList.length) {
            this.allbranchSelected.deselect();
            this.getUsersList(this.activityTrackerInputForm.value.branchId);
        }
    }

    getUsersList(branchId?: string) {
        const employeeListSearchResult = new EmployeeDetailsSearchModel();
        // employeeListSearchResult.branchId = branchId;
        employeeListSearchResult.sortBy = this.sortBy;
        employeeListSearchResult.sortDirectionAsc = this.sortDirection;
        employeeListSearchResult.pageNumber = this.page.pageNumber + 1;
        employeeListSearchResult.pageSize = this.page.size;
        employeeListSearchResult.isArchived = false;
        this.allEmployeesSelected.deselect();
        this.activityTrackerInputForm.controls.employee.patchValue([]);
        this.activityTrackerInputForm.controls.employee.markAsUntouched({ onlySelf: true });
        this.timeUsageService.getEmployeeDetails(employeeListSearchResult).subscribe((response: any) => {
            if (response.success) {
                if (this.trackerFilterJson && this.trackerFilterObject && this.trackerFilterObject.initialFilter) {
                    this.employeeListDataDetails = response.data.employeePersonalDetails;
                    this.activityTrackerInputForm.controls.employee.patchValue(this.trackerFilterObject.initialFilter.employee);
                    this.getWebAppTimeusage();
                } else {
                    if (this.activityTrackerInputForm.value.branchId.length > 0) {
                        var employees = response.data.employeePersonalDetails;
                        var userList: any = [];
                        var branchList = this.activityTrackerInputForm.value.branchId;
                        branchList.map((b) => {
                            employees.map((user) => {
                                if (user.branchId.includes(b)) {
                                    userList.push(user);
                                }
                            });
                        });
                        userList = new Set(userList);
                        userList = Array.from(userList);
                        this.employeeListDataDetails = userList;
                    } else {
                        this.employeeListDataDetails = response.data.employeePersonalDetails;
                    }
                }
            }
        });
    }

    savePersistance(persistanceObject: any) {
        const persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = true;
            persistance.persistanceJson = JSON.stringify(persistanceObject);
            this.timeUsageService.UpsertPersistance(persistance).subscribe((response: any) => {
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
            persistance.isUserLevel = true;
            this.timeUsageService.GetPersistance(persistance).subscribe((response: any) => {
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
            this.activityTrackerInputForm.patchValue(this.trackerFilterObject.initialFilter);
            this.timesheetOverlayChecker = this.trackerFilterObject.timesheetOverlayChecker;
            this.activityTrackerChecker = this.trackerFilterObject.activityTrackerChecker;
            this.userStoryOverlayChecker = this.trackerFilterObject.userStoryOverlayChecker;
            this.minDateForEndDateForInput = this.activityTrackerInputForm.value.startDate;
            this.getUsersList(this.trackerFilterObject.initialFilter.branchId);
            // this.getWebAppTimeusage();
        } else {
            this.activityTrackerChecker = true;
            this.timesheetOverlayChecker = true;
            if (this.departmentList && this.branchesList) {
                this.activityTrackerInputForm.controls.department.patchValue([
                    ...this.departmentList.map((item) => item.departmentId),
                    0
                ]);
                this.activityTrackerInputForm.controls.branchId.patchValue([
                    ...this.branchesList.map((item) => item.branchId),
                    0
                ]);
                const employeeListSearchResult = new EmployeeDetailsSearchModel();
                employeeListSearchResult.sortBy = this.sortBy;
                employeeListSearchResult.sortDirectionAsc = this.sortDirection;
                employeeListSearchResult.pageNumber = this.page.pageNumber + 1;
                employeeListSearchResult.pageSize = this.page.size;
                this.timeUsageService.getEmployeeDetails(employeeListSearchResult).subscribe((response: any) => {
                    if (response.success) {
                        this.employeeListDataDetails = response.data.employeePersonalDetails;
                        this.activityTrackerInputForm.controls.employee.patchValue([
                            ...this.employeeListDataDetails.map((item) => item.userId),
                            0
                        ]);
                        this.getWebAppTimeusage();
                    }
                });
            }
        }
    }

    getWebAppTimeusage() {
        if (this.employeeListDataDetails.length == 0) {
            this.toastr.error("There are no users for the selected branch please select a branch with users");
            return false;
        }
        if (!this.trackerFilterObject || this.trackerFilterObject.initialFilter != this.activityTrackerInputForm.value) {
            if (!this.trackerFilterObject) {
                this.trackerFilterObject = {};
            }
            this.trackerFilterObject.initialFilter = this.activityTrackerInputForm.value;
            this.savePersistance(this.trackerFilterObject);
        }
        this.loading$ = of(true);
        let WebAppUsageModel = new EmployeeAppUsageSearch();
        WebAppUsageModel.dateFrom = this.activityTrackerInputForm.value.startDate;
        WebAppUsageModel.dateTo = this.activityTrackerInputForm.value.endDate;
        // var employee = this.activityTrackerInputForm.value.employee;
        // const pos = employee.indexOf(0);
        // if(pos > -1)
        // employee = employee.splice(pos, 1);
        WebAppUsageModel.userId = this.activityTrackerInputForm.value.employee;
        WebAppUsageModel.branchId = this.activityTrackerInputForm.value.branchId;
        this.timeUsageService.getAppUsageCompleteReport(WebAppUsageModel)
            .do((response: any) => { })
            .switchMap((responseData) => {
                if (responseData.success == false) {
                    // this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.trackerData = [];
                    this.appUsageData = [];
                    this.loading$ = of(false);
                    this.groupType = this.activityTrackerInputForm.value.groupType;
                    if (this.timesheetOverlayChecker) {
                        let event = { checked: true };
                        this.timeSheetOverlay(event);
                    }
                    if (this.userStoryOverlayChecker) {
                        let event = { checked: true };
                        this.userStoryOverlay(event);
                    }
                    if(this.idleTimeOverlayChecker) {
                        let event = { checked: true};
                        this.idleTimeOverlay(event);
                    }
                    this.isSubmitted = true;
                    this.cdRef.detectChanges();
                }
                // if (responseData.data == null) {
                //     this.trackerData = [];
                //     this.appUsageData = [];
                //     this.loading$ = of(false);
                //     this.cdRef.detectChanges();
                // }
                 else {
                    this.groupType = this.activityTrackerInputForm.value.groupType;
                    this.isSubmitted = true;
                    if (responseData.data == null) {
                        this.trackerData = [];
                        this.appUsageData = [];
                    }
                    if (this.activityTrackerChecker) {
                        this.appUsageData = Object.assign([], responseData.data);
                        this.trackerData = responseData.data;
                    }
                    // if (this.activityTrackerChecker) {
                    //     let event = { checked: true };
                    //     this.activityTrackerOverlay(event);
                    // }
                    if (this.timesheetOverlayChecker) {
                        let event = { checked: true };
                        this.timeSheetOverlay(event);
                    }
                    if (this.userStoryOverlayChecker) {
                        let event = { checked: true };
                        this.userStoryOverlay(event);
                    }
                    if(this.idleTimeOverlayChecker) {
                        let event = { checked: true};
                        this.idleTimeOverlay(event);
                    }
                    if (!this.activityTrackerChecker && !this.timesheetOverlayChecker && !this.userStoryOverlayChecker && !this.idleTimeOverlayChecker) {
                        let event = { checked: true };
                        this.activityTrackerChecker = true;
                        this.appUsageData = responseData.data;
                        this.trackerData = responseData.data;
                        this.timesheetOverlayChecker = true;
                        this.timeSheetOverlay(event);
                        // this.userStoryOverlayChecker = true;
                        // this.userStoryOverlay(event);
                    }
                    // this.isSubmitted = true;
                    this.loading$ = of(false);
                    this.cdRef.detectChanges();
                }
                return of(responseData);
            })
            .subscribe();
    }

    toggleAlldepartmentsSelected() {
        if (this.alldepartmentsSelected.selected) {
            this.activityTrackerInputForm.controls.department.patchValue([
                ...this.departmentList.map((item) => item.departmentId),
                0
            ]);

        } else {
            this.activityTrackerInputForm.controls.department.patchValue([]);
        }
        this.activityTrackerInputForm.controls.employee.markAsUntouched({ onlySelf: true });
    }

    toggledepartmentSelected() {
        this.activityTrackerInputForm.controls.employee.markAsUntouched({ onlySelf: true });
        if (this.alldepartmentsSelected.selected) {
            this.alldepartmentsSelected.deselect();
            return false;
        }
        if (this.activityTrackerInputForm.get("department").value.length == this.departmentList.length) {
            this.alldepartmentsSelected.select();
        }
    }

    toggleAllEmployeesSelected(event) {
        if (this.allEmployeesSelected.selected) {
            if (this.alldepartmentsSelected.selected) {
                this.activityTrackerInputForm.controls.employee.patchValue([
                    ...this.employeeListDataDetails
                        // .filter((x) => this.activityTrackerInputForm.value.department.includes(x.departmentId))
                        .map((item) => item.userId),
                    0
                ]);
            } else {
                this.activityTrackerInputForm.controls.employee.patchValue([
                    ...this.employeeListDataDetails.filter((x) => this.activityTrackerInputForm.value.department.includes(x.departmentId))
                        .map((item) => item.userId),
                    0
                ]);
            }
        } else {
            this.activityTrackerInputForm.controls.employee.patchValue([]);
        }
    }

    toggleEmployeeSelected() {
        if (this.allEmployeesSelected.selected) {
            this.allEmployeesSelected.deselect();
            return false;
        }
        if (this.alldepartmentsSelected.selected) {
            if (this.activityTrackerInputForm.get("employee").value.length == this.employeeListDataDetails.length) {
                this.allEmployeesSelected.select();
            }
        } else {
            var userList = this.employeeListDataDetails.filter((x) => this.activityTrackerInputForm.value.department.includes(x.departmentId)).map((item) => item.userId);
            if (this.activityTrackerInputForm.get("employee").value.length == userList.length) {
                this.allEmployeesSelected.select();
            }
        }
    }

    departmentChange() {
        this.allEmployeesSelected.deselect();
        this.activityTrackerInputForm.controls.employee.patchValue([]);
    }

    activityTrackerOverlay(event) {
        if (this.trackerFilterObject.activityTrackerChecker != event.checked) {
            this.trackerFilterObject.activityTrackerChecker = event.checked;
            this.savePersistance(this.trackerFilterObject);
        }
        if (!event.checked) {
            this.loadTimelinViewerData();
        } else {
            let WebAppUsageModel = new EmployeeAppUsageSearch();
            WebAppUsageModel.dateFrom = this.activityTrackerInputForm.value.startDate;
            WebAppUsageModel.dateTo = this.activityTrackerInputForm.value.endDate;
            // var employee = this.activityTrackerInputForm.value.employee;
            // const pos = employee.indexOf(0);
            // if(pos > -1)
            // employee = employee.splice(pos, 1);
            WebAppUsageModel.userId = this.activityTrackerInputForm.value.employee;
            WebAppUsageModel.branchId = this.activityTrackerInputForm.value.branchId;
            this.timeUsageService.getAppUsageCompleteReport(WebAppUsageModel)
                .do((response: any) => { })
                .switchMap((responseData) => {
                    if (responseData.success == false) {
                        // this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.trackerData = [];
                        this.loadingIndicator = false;
                    }
                    if (responseData.data == null) {
                        this.trackerData = [];
                        this.loadingIndicator = false;
                    } else {
                        this.groupType = this.activityTrackerInputForm.value.groupType;
                        this.trackerData = responseData.data;
                        this.loadingIndicator = false;
                        this.loadTimelinViewerData();
                    }
                    this.cdRef.detectChanges();
                    return of(responseData);
                })
                .subscribe();
        }
    }

    timeSheetOverlay(event) {
        if (this.trackerFilterObject.timesheetOverlayChecker != event.checked) {
            this.trackerFilterObject.timesheetOverlayChecker = event.checked;
            this.savePersistance(this.trackerFilterObject);
        }
        if (!event.checked) {
            this.loadTimelinViewerData();
        } else {
            let WebAppUsageModel = new EmployeeAppUsageSearch();
            WebAppUsageModel.dateFrom = this.activityTrackerInputForm.value.startDate;
            WebAppUsageModel.dateTo = this.activityTrackerInputForm.value.endDate;
            // var employee = this.activityTrackerInputForm.value.employee;
            // const pos = employee.indexOf(0);
            // if(pos > -1)
            // employee = employee.splice(pos, 1);
            WebAppUsageModel.userId = this.activityTrackerInputForm.value.employee;
            WebAppUsageModel.branchId = this.activityTrackerInputForm.value.branchId;
            this.timeUsageService.getAppUsageTimesheetReport(WebAppUsageModel)
                .do((response: any) => { })
                .switchMap((responseData) => {
                    if (responseData.success == false) {
                        // this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.trackerTimeSheetData = [];
                        this.loadingIndicator = false;
                    }
                    if (responseData.data == null) {
                        this.trackerTimeSheetData = [];
                        this.loadingIndicator = false;
                    } else {
                        this.groupType = this.activityTrackerInputForm.value.groupType;
                        this.trackerTimeSheetData = responseData.data;
                        this.loadingIndicator = false;
                        this.loadTimelinViewerData();
                    }
                    this.cdRef.detectChanges();
                    return of(responseData);
                })
                .subscribe();
        }
    }

    userStoryOverlay(event) {
        if (this.trackerFilterObject.userStoryOverlayChecker != event.checked) {
            this.trackerFilterObject.userStoryOverlayChecker = event.checked;
            this.savePersistance(this.trackerFilterObject);
        }
        if (!event.checked) {
            this.loadTimelinViewerData();
        } else {
            let WebAppUsageModel = new EmployeeAppUsageSearch();
            WebAppUsageModel.dateFrom = this.activityTrackerInputForm.value.startDate;
            WebAppUsageModel.dateTo = this.activityTrackerInputForm.value.endDate;
            // var employee = this.activityTrackerInputForm.value.employee;
            // const pos = employee.indexOf(0);
            // if(pos > -1)
            // employee = employee.splice(pos, 1);
            WebAppUsageModel.userId = this.activityTrackerInputForm.value.employee;
            WebAppUsageModel.branchId = this.activityTrackerInputForm.value.branchId;
            this.timeUsageService.getAppUsageUserStoryReport(WebAppUsageModel)
                .do((response: any) => { })
                .switchMap((responseData) => {
                    if (responseData.success == false) {
                        // this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.trackerUserstoryData = [];
                        this.loadingIndicator = false;
                    }
                    if (responseData.data == null) {
                        this.trackerUserstoryData = [];
                        this.loadingIndicator = false;
                    } else {
                        this.groupType = this.activityTrackerInputForm.value.groupType;
                        this.trackerUserstoryData = responseData.data;
                        this.loadingIndicator = false;
                        this.loadTimelinViewerData();
                    }
                    this.cdRef.detectChanges();
                    return of(responseData);
                })
                .subscribe();
        }

    }

    idleTimeOverlay(event) {
        if (this.trackerFilterObject.idleTimeOverlayChecker != event.checked) {
            this.trackerFilterObject.idleTimeOverlayChecker = event.checked;
            this.savePersistance(this.trackerFilterObject);
        }
        if (!event.checked) {
            this.loadTimelinViewerData();
        } else {
            let WebAppUsageModel = new EmployeeAppUsageSearch();
            WebAppUsageModel.dateFrom = this.activityTrackerInputForm.value.startDate;
            WebAppUsageModel.dateTo = this.activityTrackerInputForm.value.endDate;
            // var employee = this.activityTrackerInputForm.value.employee;
            // const pos = employee.indexOf(0);
            // if(pos > -1)
            // employee = employee.splice(pos, 1);
            WebAppUsageModel.userId = this.activityTrackerInputForm.value.employee;
            WebAppUsageModel.branchId = this.activityTrackerInputForm.value.branchId;
            this.timeUsageService.getIdleTimeReport(WebAppUsageModel)
                .do((response: any) => { })
                .switchMap((responseData) => {
                    if (responseData.success == false) {
                        // this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.idleTimeData = [];
                        this.loadingIndicator = false;
                    }
                    if (responseData.data == null) {
                        this.idleTimeData = [];
                        this.loadingIndicator = false;
                    } else {
                        this.groupType = this.activityTrackerInputForm.value.groupType;
                        this.idleTimeData = responseData.data;
                        this.loadingIndicator = false;
                        this.loadTimelinViewerData();
                        // if (this.timesheetOverlayChecker) {
                        //     this.appUsageData = [...this.trackerData, ...this.trackerTimeSheetData, ...this.trackerUserstoryData];
                        // } else {
                        //     this.appUsageData = [...this.trackerData, ...this.trackerUserstoryData];
                        // }
                    }
                    this.cdRef.detectChanges();
                    return of(responseData);
                })
                .subscribe();
        }
    }

    loadTimelinViewerData() {
        let tracker: any = [];
        let timeSheet: any = [];
        let userStory: any = [];
        let idle: any = [];
        if (this.activityTrackerChecker) {
            tracker = this.trackerData;
        }
        if (this.timesheetOverlayChecker) {
            timeSheet = this.trackerTimeSheetData;
        }
        if (this.userStoryOverlayChecker) {
            userStory = this.trackerUserstoryData;
        }
        if (this.idleTimeOverlayChecker) {
            idle = this.idleTimeData;
        }
        this.appUsageData = [...tracker, ...timeSheet, ...userStory, ...idle];
        this.cdRef.detectChanges();
    }

    showFilter() {
        this.isSubmitted = false;
    }

    overLayHandel(event){
        if (this.activityTrackerChecker) {
            let event = { checked: true };
            this.activityTrackerOverlay(event);
        }
        if (this.timesheetOverlayChecker) {
            let event = { checked: true };
            this.timeSheetOverlay(event);
        }
        if (this.userStoryOverlayChecker) {
            let event = { checked: true };
            this.userStoryOverlay(event);
        }
        if (this.idleTimeOverlayChecker) {
            let event = { checked: true };
            this.idleTimeOverlay(event);
        }
        this.loadTimelinViewerData();
    }

    zoomIn() {
        this.schedulerComponent.schedulerEngine.zoomIn();
    }
 
    zoomOut() {
        this.schedulerComponent.schedulerEngine.zoomOut();
    }

    fitContent(optionalParameters?: any) {
        try {
            if (optionalParameters) {
                var parentElementSelector = '';
                var minHeight = '';
                if (optionalParameters['popupView']) {
                    parentElementSelector = optionalParameters['popupViewSelector'];
                    minHeight = `calc(90vh - 200px)`;
                }
                else if (optionalParameters['gridsterView']) {
                    parentElementSelector = optionalParameters['gridsterViewSelector'];
                    minHeight = `${$(parentElementSelector).height() - 40}px`;
                }
                else if (optionalParameters['individualPageView']){
                    parentElementSelector = optionalParameters['individualPageSelector'];
                    minHeight = `calc(100vh - 90px)`;
                }

                var counter = 0;
                var applyHeight = setInterval(function() {
                    if(counter > 10){
                        clearInterval(applyHeight); 
                    }
                    counter++;
                    if ($(parentElementSelector + ' activity-bry-scheduler .b-widget.b-container').length > 0) {
                        $(parentElementSelector + ' activity-bry-scheduler .b-widget.b-container').css('min-height', minHeight);
                        clearInterval(applyHeight);
                    }
                }, 1000);
            }
        }
        catch (err) {
            clearInterval(applyHeight);
            console.log(err);
        }
    }
}
