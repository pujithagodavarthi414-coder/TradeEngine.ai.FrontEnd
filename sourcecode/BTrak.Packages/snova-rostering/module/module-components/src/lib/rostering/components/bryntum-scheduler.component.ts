import { CurrencyPipe } from "@angular/common";
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../models/constant-variables";
import { CommonService } from "../services/common.service";
import { EmployeeRateSheetModel } from "../models/employee-ratesheet-model";
import { WeekdayModel } from "../models/weekday-model";
import { HolidayModel } from "../models/holiday-model";
import { Guid } from "guid-typescript";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
// import { Scheduler as SchedulerModule } from "../../../../../bryntum-scheduler/scheduler.module";
// UMD bundle is used to support IE11 browser. If you don't need it just use import from 'bryntum-scheduler' instead
import {
    AssignmentModel, AssignmentStore, EventModel,
    PresetManager, Scheduler, StringHelper, ViewPreset, WidgetHelper, DateHelper
} from "@snovasys/snova-timeline-viewer/scheduler.umd.js";


import { RosterBasicRequirement } from "../models/roster-basic-model";
import { RosterPlan } from "../models/roster-create-plan-model";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import { DataType } from "../models/roster-request-plan-model";
import { RosterCommonService } from "../services/roster-common-service";
import { RosterService } from "../services/roster-service";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import * as RosterState from "../store/reducers/index";
import * as moment_ from "moment";
import { EmployeeRateTagInput } from '../models/employee-ratetag-Input-model';
const moment = moment_;

@Component({
    selector: "bry-scheduler",
    template: "",
})
export class BryntumSchedulerComponent implements OnInit, OnChanges, OnDestroy {

    private elementRef: ElementRef;
    public schedulerEngine: Scheduler;
    private presetManager: PresetManager;
    private newViewPreset: ViewPreset;
    private breakMins: number;
    private error: boolean;
    private errorMessage: string;
    priorInputData: any;

    private featureRe: RegExp = /Feature$/;
    private selectedPlan: any[];

    /* #region features */
    private features: string[] = [
        "cellEditFeature",
        "cellTooltipFeature",
        "columnDragToolbarFeature",
        "columnLinesFeature",
        "columnPickerFeature",
        "columnReorderFeature",
        "columnResizeFeature",
        "contextMenuFeature",
        "dependenciesFeature",
        "dependencyEditFeature",
        "eventContextMenuFeature",
        "eventDragCreateFeature",
        "eventDragFeature",
        "eventEditFeature",
        "eventFilterFeature",
        "eventResizeFeature",
        "eventTooltipFeature",
        "filterBarFeature",
        "filterFeature",
        "groupFeature",
        "groupSummaryFeature",
        "headerContextMenuFeature",
        "headerZoom",
        "labelsFeature",
        "nonWorkingTimeFeature",
        "panFeature",
        "quickFindFeature",
        "regionResizeFeature",
        "resourceTimeRangesFeature",
        "rowReorderFeature",
        "scheduleContextMenuFeature",
        "scheduleTooltipFeature",
        "searchFeature",
        "sortFeature",
        "stripeFeature",
        "summaryFeature",
        "timeRangesFeature",
        "treeFeature"
        // "excelExporter",
        // "pdfExportFeature"
    ];
    /* #endregion */

    /* #region configs */
    private configs: string[] = [
        "assignments",
        "assignmentStore",
        "autoHeight",
        "barMargin",
        "columns",
        "crudManager",
        "dependencyStore",
        "displayDateFormat",
        "emptyText",
        "endDate",
        "eventBodyTemplate",
        "eventColor",
        "eventLayout",
        "eventRenderer",
        "events",
        "eventEdit",
        "eventStore",
        "eventStyle",
        "fillTicks",
        "height",
        "maxHeight",
        "maxWidth",
        "maxZoomLevel",
        "milestoneAlign",
        "minHeight",
        "minWidth",
        "minZoomLevel",
        "partner",
        "readOnly",
        "resources",
        "resourceStore",
        "resourceTimeRanges",
        "responsiveLevels",
        "rowHeight",
        "scrollLeft",
        "scrollTop",
        "selectedEvents",
        "snap",
        "startDate",
        "tickWidth",
        "timeRanges",
        "timeResolution",
        "viewportCenterDate",
        "viewPreset",
        "width",
        "zoomLevel",

        // schedulerId maps to id of the underlying scheduler
        "schedulerId",

        // only for examples, delete if you don't need them
        "transitionDuration",
        "useInitialAnimation",
        "resourceMargin"
    ]

    /* #endregion */

    /* #region Configs */
    // schedulerId translates to id for the scheduler enging
    @Input() schedulerId: string;

    @Input() assignments: AssignmentModel[] | object[];
    @Input() assignmentStore: AssignmentStore | object;
    @Input() autoHeight: boolean = false;
    @Input() barMargin: number = 5;
    @Input() columns: object[];
    @Input() crudManager: object;
    @Input() dependencyStore: object;
    @Input() displayDateFormat: string;
    @Input() emptyText: string;
    @Input() endDate: any;
    @Input() eventBodyTemplate: any;
    @Input() eventColor: string;
    @Input() eventLayout: string = "pack";
    @Input() eventRenderer: any;
    @Input() events: object[];
    @Input() eventEdit: object | boolean;
    @Input() eventStore: object;
    @Input() eventStyle: string = "border";
    @Input() fillTicks: boolean;
    @Input() height: number | string;
    @Input() maxHeight: number | string;
    @Input() maxWidth: number | string;
    @Input() maxZoomLevel: number;
    @Input() milestoneAlign: string;
    @Input() minHeight: number | string;
    @Input() minWidth: number | string;
    @Input() minZoomLevel: number;
    @Input() partner: any;
    @Input() readOnly: boolean = false;
    @Input() resources: object[];
    @Input() resourceStore: object;
    @Input() resourceTimeRanges: object;
    @Input() responsiveLevels: any;
    @Input() rowHeight: number = 45;
    @Input() scrollLeft: number;
    @Input() scrollTop: number;
    @Input() selectedEvents: EventModel[];
    @Input() snap: boolean;
    @Input() startDate: any;
    @Input() tickWidth: number;
    @Input() timeRanges: object | boolean;
    @Input() timeResolution: object;
    @Input() viewportCenterDate: any;
    @Input() viewPreset: string = "hourAndDay";
    @Input() width: number | string = "100%";
    @Input() zoomLevel: number;
    /* #endregion */

    /* #region Features, only used for initialization */
    @Input() cellEditFeature: boolean | object = true;
    @Input() cellTooltipFeature: boolean | object = true;
    @Input() columnDragToolbarFeature: boolean | object = true;
    @Input() columnLinesFeature: boolean | object = true;
    @Input() columnPickerFeature: boolean = true;
    @Input() columnReorderFeature: boolean = true;
    @Input() columnResizeFeature: boolean = true;
    @Input() contextMenuFeature: boolean | object;
    @Input() dependenciesFeature: boolean | object = false;
    @Input() dependencyEditFeature: boolean | object = false;
    @Input() eventContextMenuFeature: boolean | object = true;
    @Input() eventDragCreateFeature: boolean | object = true;
    @Input() eventDragFeature: boolean | object = true;
    @Input() eventEditFeature: boolean | object = true;
    @Input() eventFilterFeature: boolean | object = true;
    @Input() eventResizeFeature: boolean | object = true;
    @Input() eventTooltipFeature: boolean | object = true;
    @Input() filterBarFeature: boolean | object;
    @Input() filterFeature: boolean | object;
    @Input() groupFeature: boolean | object | string = "type";
    @Input() groupSummaryFeature: boolean | object;
    @Input() headerZoom: boolean | object = true;
    @Input() headerContextMenuFeature: boolean | object;
    @Input() labelsFeature: boolean | object;
    @Input() nonWorkingTimeFeature: boolean;
    @Input() panFeature: boolean | object;
    @Input() quickFindFeature: boolean | object;
    @Input() regionResizeFeature: boolean;
    @Input() resourceTimeRangesFeature: boolean;
    @Input() rowReorderFeature: boolean;
    @Input() scheduleContextMenuFeature: boolean | object = true;
    @Input() scheduleTooltipFeature: boolean | object = true;
    @Input() searchFeature: boolean;
    @Input() sortFeature: boolean | object | string = true;
    @Input() stripeFeature: boolean = true;
    @Input() summaryFeature: boolean | object;
    @Input() timeRangesFeature: boolean | object[] = true;
    @Input() treeFeature: boolean;
    @Input() resourceMargin: number = 10;

    // @Input() excelExporterFeature: boolean | object = true;
    // @Input() pdfExportFeature: boolean | object = true;

    /* #endregion */

    // for examples only, delete
    @Input() transitionDuration: number;
    @Input() useInitialAnimation: string;

    @Input("schedulerData")
    set _schedulerData(data) {
        this.selectedPlan = data;
        // this.loadGridData();
    }

    @Input("breakmins")
    set _breakMins(data) {
        if (data) {
            this.breakMins = data;
        } else {
            this.breakMins = 0;
        }
    }

    @Input("isOverlay") isOverlay;
    @Input("priorInputData")
    set _priorInputData(data) {
        this.priorInputData = data;

        if (data && data.startDate && this.schedulerEngine) {
            this.minDate = moment(this.priorInputData.startDate).toDate();
            this.maxDate = moment(this.priorInputData.endDate).toDate();
            this.setSchedulerTimeSpan();
        }
    }

    selectedSolution: any;
    isActual: DataType;
    isEditable: boolean;
    requestDetails: any;
    employeeListData: any;
    filteredEmployeeList: any;
    currencyCode: any;
    departmentList: any;
    filteredDepartmentList: any;
    shiftTimeList: any;
    filteredShiftTimeList: any;
    isNew: boolean;
    batch: boolean;
    holidays: any;
    weekdays: any;
    minDate: any;
    maxDate: any;

    @Input("selectedSolution")
    set _selectedSolution(data) {
        this.selectedSolution = data;
    }

    @Input("isActual")
    set _isActual(data) {
        this.isActual = data;
        // this.loadGridData();
    }

    @Input("isEditable")
    set _isEditable(data) {
        this.isEditable = data;
    }

    @Input("requestData")
    set _requestData(data) {
        this.requestDetails = data;
        // this.loadGridData();
    }

    @Input("zoom")
    set _zoom(data) {
        if (this.schedulerEngine) {
            if (data > 0)
                this.schedulerEngine.zoomIn()
            else
                this.schedulerEngine.zoomOut()
        }
    }

    @Input("employeeListDataDetails")
    set _employeeListDataDetails(data) {
        this.employeeListData = [];
        if (data && data.length > 0) {
            data.forEach((value, index) => {
                let employee: any = Object.assign({}, value);
                employee.fullName = value.firstName + " " + value.surName;
                this.employeeListData.push(employee);
            })
            this.filteredEmployeeList = [...this.employeeListData];
        }
        this.createEmployeeAsResource();
        // this.loadGridData();
    }
    get _employeeListDataDetails() {
        return this.employeeListData;
    }

    @Input("currencyCode")
    set _currencyCode(data) {
        this.currencyCode = data;
    }

    @Input("departments")
    set _departments(data) {
        this.departmentList = data;
        this.filteredDepartmentList = data;
    }

    @Input("shifts")
    set _shifts(data) {
        this.shiftTimeList = data;
        this.filteredShiftTimeList = data;
    }

    @Output() updateBudgetLabels = new EventEmitter<any>();
    @Output() selectedEvent = "";
    @Output() onSchedulerEvents = new EventEmitter<object>();

    constructor(element: ElementRef, private commonService: CommonService, private router: Router,
        private rosterStore: Store<RosterState.State>,
        private rosterService: RosterService, private toastr: ToastrService,
        private translateService: TranslateService, private cp: CurrencyPipe, private rosterCommonService: RosterCommonService) {

        this.selectedPlan = [];
        this.elementRef = element;
    }

    ngOnInit() {
        // this.maxDate.setDate(this.minDate.getDate() + 7);
        this.getAllHolidays();
        this.getAllWeekDays();

        const
            config = {
                // Render scheduler to components element
                appendTo: this.elementRef.nativeElement,

                // Listeners, will relay events
                listeners: {
                    async catchAll(event) {
                        if (event.type === "export") {
                            console.log(event);
                        }
                        console.log(event.type);
                        // if (event.type === 'eventselectionchange') {
                        //     this.selectedEvent = event.selected.length ? event.selected[0].name : '';
                        // }
                        if (event.type === "presetchange") {
                            console.log(event);
                        }
                        if (event.type === "beforeeventeditshow") {
                            let eventRecord = event.eventRecord;
                            if (eventRecord.data && eventRecord.data.plan) {
                                if (eventRecord.data.plan.isOverlay) {
                                    event.editor.hide();
                                    return false;
                                }
                            }
                        }
                        if (event.type === "transitionend") {
                            return false;
                        }
                        if (event.type === "eventsbeforeadd") {
                        }
                        if (event.type === "eventresizeend") {
                            let planData = event && event.eventRecord && event.eventRecord.data;
                            await this.validatePlan(planData, event.changes);
                        }
                        if (event.type === "aftereventdrop") {
                            let planData = event && event.eventRecords && event.eventRecords[0].data;
                            await this.validatePlan(planData, event.changes);
                        }
                        if (event.type === "eventsadd") {
                            // this.isNew = true;
                        }
                        if (event.type === "eventsupdate") { // "eventsupdate"
                            // this.isNew = false;
                            let planData = event.record.data;
                            await this.validatePlan(planData, event.changes);
                        }
                        if (event.type === "aftereventsave") {
                            let planData = event && event.eventRecord && event.eventRecord.data;
                            await this.validatePlan(planData, event.changes);
                        }
                        if (event.type === "eventsremove") {
                            let planData = event.records[0].data;
                            this.selectedPlan = this.selectedPlan.filter((item) => item.planId !== planData.id);
                            this.loadGridData();
                            this.updateBudgetLabels.emit(this.selectedPlan);
                        }
                        if (event.type === "beforeeventdelete") {
                            let planData = event.eventRecords[0].data;
                            this.selectedPlan = this.selectedPlan.filter((item) => item.planId !== planData.id);
                            this.loadGridData();
                            this.updateBudgetLabels.emit(this.selectedPlan);
                        }
                        if (event.type === "beforeitem") {
                            if (event && event.item && event.item.html === "Approve") {
                                if (event.eventRecord.data && event.eventRecord.data.plan) {
                                    await this.overlayApprove(event.eventRecord.data);
                                }
                            }
                        }
                        if (event.type === "scheduledblclick") {
                            let holidaydates = this.holidays.map((x) => new Date(x.date).toLocaleDateString());
                            if (holidaydates.includes(new Date(event.date).toLocaleDateString())) {
                                this.requestDetails.includeHolidays = true;
                                this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterSelectedHoliday));
                            }
                            if (this.weekdays.find((x) => x.isWeekend && x.weekDayId == moment(event.date).day())) {
                                this.requestDetails.includeWeekends = true;
                                this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterSelectedWeekEnd));
                            }
                        }
                        // if (event.type === "eventdblclick") {
                        //     let eventRecord = event.eventRecord;
                        //     let e = event.event;
                        //     console.log(eventRecord);
                        //     if (eventRecord.data && eventRecord.data.plan) {
                        //         if (eventRecord.data.plan.isOverlay) {
                        //             e.stopPropagation();
                        //             e.preventDefault();
                        //             await this.validatePlan(eventRecord.data);
                        //         }
                        //     }
                        // }

                        this.onSchedulerEvents.emit(event);
                    },

                    thisObj: this
                },

                features: {}
            }
            ;

        // relay properties with names matching this.featureRe to features
        this.features.forEach((featureName) => {
            if (featureName in this) {
                config.features[featureName.replace(this.featureRe, "")] = this[featureName];
            }
        });

        this.getEditConfig();

        // Pass configs on to scheduler
        this.configs.forEach((configName) => {
            if (configName in this) {
                // application may want to pass id for the engine is schedulerId
                if ("schedulerId" === configName && this[configName]) {
                    config["id"] = this[configName];
                } else {
                    config[configName] = this[configName];
                }
            }
        });

        // The application may have passed string id of the partner so
        // we attempt to find the real instance of the scheduler with that id
        if (config["partner"] && "string" === typeof (config["partner"])) {
            const bryntum = window["bryntum"];
            const partner = bryntum && bryntum.get && bryntum.get(config["partner"]);
            config["partner"] = partner || undefined;
        }
        if (this.priorInputData && this.priorInputData.startDate) {
            config["startDate"] = this.priorInputData.startDate;
            config["endDate"] = this.priorInputData.endDate;
            this.minDate = this.priorInputData.startDate.toDate();
            this.maxDate = this.priorInputData.endDate.toDate();
        }
        if (!config["endDate"]) {
            let startDate = moment(config["startDate"]);
            config["endDate"] = startDate.add(7, "days").toDate();
        }
        const engine = this.schedulerEngine = new Scheduler(config);
        this.globalConfigChanges();
        this.schedulerEngine.readOnly = !this.isEditable;

        // this.schedulerEngine.setViewPreset(this.newGlobalPresets);
        // Adds new preset to the scheduler instance only. All newly created scheduler instances will **not** have it.
        // Relay events from eventStore and resourceStore, making them a bit easier to catch in your app.
        // The events are prefixed with 'events' and 'resources', turning and 'add' event into either 'eventsAdd' or
        // 'resourcesAdd'
        // engine.eventStore.relayAll(engine, "events");
        // engine.resourceStore.relayAll(engine, "resources");

        this.loadGridData();
    } // eo function ngOnInit

    ngOnChanges(changes: SimpleChanges) {

        const me = this;

        if (me.schedulerEngine) {
            // Iterate over all changes
            // @ts-ignore
            Object.entries(changes).forEach(([name, { currentValue }]) => {
                // Apply changes that match configs to grid
                if (me.configs.includes(name)) {
                    me.schedulerEngine[name] = currentValue;
                }

                if (me.features.includes(name)) {
                    me.schedulerEngine[name.replace(this.featureRe, "")] = currentValue;
                }
            });

            this.createEmployeeAsResource();
            this.loadGridData();
            if (changes && changes._employeeListDataDetails) {
                this.schedulerEngine.resourceStore.removeAll();
                this.schedulerEngine.resourceStore.add(this.resources);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "resources");
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "events");
            }
            if (changes && changes._requestData && this.requestDetails.requiredFromDate) {
                this.minDate = this.commonService.convertUtcToLocal(new Date(this.requestDetails.requiredFromDate)).toDate();
                this.maxDate = this.commonService.convertUtcToLocal(new Date(this.requestDetails.requiredToDate)).toDate();
                this.setSchedulerTimeSpan();
            }
        }
    } // eo function ngOnChanges

    removeEvent() {
        const scheduler = this.schedulerEngine;
        scheduler.eventStore.remove(scheduler.selectedEvents);
        this.selectedEvent = "";
    } // eo function removeEvent

    addEvent() {
        const scheduler = this.schedulerEngine;

        const event = new scheduler.eventStore.modelClass({
            resourceId: scheduler.resourceStore.first.id,
            startDate: scheduler.startDate,
            duration: 1,
            durationUnit: "h",
            name: "New task",
            eventType: "Meeting"
        });

        // editEvent is dynamically assigned to Scheduler from the EditEvent feature, and is thus not part of typings
        // @ts-ignore
        scheduler.editEvent(event);
    } // eo function addEvent

    ngOnDestroy(): void {
        if (this.schedulerEngine && (typeof this.schedulerEngine == "object")) {
            this.schedulerEngine.destroy();
        }
    } // eo function ngOnDestroy

    getAllHolidays() {
        const isArchived = false;
        const holidaysModel = new HolidayModel();
        holidaysModel.isArchived = isArchived;

        this.rosterService.getAllHolidays(holidaysModel).subscribe((response: any) => {
            if (response.success == true) {
                this.holidays = response.data;
            }
        });
    }

    getAllWeekDays() {
        const isArchived = false;
        const weekDayModel = new WeekdayModel();
        weekDayModel.isArchived = isArchived;

        this.rosterService.getAllWeekDays(weekDayModel).subscribe((response: any) => {
            if (response.success == true) {
                this.weekdays = response.data;
            }
        });
    }

    getEditConfig() {
        // this.eventRenderer = ({ eventRecord, tplData }) => {
        //     if (eventRecord.data && eventRecord.data.isOverlay) {
        //         tplData.height = 25;
        //     }
        //     return eventRecord.name;
        // }

        this.groupFeature = "type";
        this.eventEdit = {
            readOnly: this.isEditable,
            extraItems: [
                {
                    type: "combo",
                    name: "eventType",
                    // Using this ref hooks dynamic toggling of fields per eventType up
                    ref: "eventTypeField",
                    label: "Type",
                    index: 1,
                    items: ["Appointment", "Internal", "Meeting"]
                },
                {
                    type: "text",
                    name: "location",
                    label: "Location",
                    index: 2,
                    // This field is only displayed for meetings
                    dataset: { eventType: "Meeting" }
                }
            ]
        }
        this.eventEditFeature = {
            extraItems: [
                {
                    type: "combo",
                    name: "eventType",
                    // Using this ref hooks dynamic toggling of fields per eventType up
                    ref: "eventTypeField",
                    label: "Type",
                    index: 1,
                    items: ["Appointment", "Internal", "Meeting"]
                },
                {
                    type: "text",
                    name: "location",
                    label: "Location",
                    index: 2,
                    // This field is only displayed for meetings
                    dataset: { eventType: "Meeting" }
                }
            ]
        }
    }

    globalConfigChanges() {
        // const locale = this.schedulerEngine.localeManager.locale as any;
        // locale.DateHelper.parsers = { L: "DD MMM YYYY", LT: "HH:mm" };
        // this.schedulerEngine.localeManager.locale = locale;
        // this.schedulerEngine.zoomTo({ level: 14 });
    }

    async validatePlan(planData, changes?: any) {
        let iserror = false;
        this.error = false;
        const plans = this.selectedPlan.filter((x) => !x.isOverlay && new Date(x.planDate).getDate() === planData.startDate.getDate() &&
            planData.resourceId == (x.employeeId || x.plannedEmployeeId || x.actualEmployeeId)
            && planData.id != x.planId);
        if (plans && plans.length > 0) {
            this.error = true;
            this.errorMessage = this.translateService.instant(ConstantVariables.RosterEmployeeRepeat);
            this.toastr.error("", this.errorMessage);
            this.loadGridData();
            return false;
        }
        if (planData.startDate >= planData.endDate) {
            this.error = true;
            this.errorMessage = this.translateService.instant(ConstantVariables.RosterEnterValidStartAndEndDates);
            this.toastr.error("", this.errorMessage);
            this.loadGridData();
            return false;
        }
        let errMsg: string;
        if (planData.resourceId) {
            const rosterPlan = new RosterPlan();

            let basicdetails = new RosterBasicRequirement();
            basicdetails.rostEmployeeId = planData.resourceId;
            basicdetails.rostStartDate = planData.startDate;
            basicdetails.rostEndDate = planData.endDate;
            rosterPlan.rosterBasicDetails = basicdetails;
            rosterPlan.requestId = this.requestDetails.requestId;
            await this.rosterService.checkRosterName(rosterPlan)
                .do((response) => {
                    if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
                        iserror = true;
                        errMsg = response.apiResponseMessages[0].message;
                        this.toastr.error("", response.apiResponseMessages[0].message);
                    } else {
                        iserror = false;
                    }
                })
                .switchMap((response) => {
                    this.error = iserror;
                    this.errorMessage = errMsg;
                    if (iserror) {
                        this.loadGridData();
                    } else {
                        // const employee = this._employeeListDataDetails.find((x) => x.employeeId == planData.resourceId);
                        this.latestBudget(planData, planData.resourceId);
                    }
                    return of(iserror);
                })
                .subscribe();
        }
    }

    setPlan(planData, rate) {
        // if (this.isNew) {
        //     if (planData.resourceId) {
        //         let changedMinutes = moment.duration(moment(planData.endDate, "HH:mm:ss").diff(moment(planData.startDate, "HH:mm:ss"))).asMinutes();
        //         changedMinutes = (changedMinutes - this.breakMins) < 0 ? 0 : changedMinutes - this.breakMins;
        //         let employee = this.employeeListData.find((x) => x.employeeId == planData.resourceId);
        //         let rate = this.latestBudget(planData.startDate, employee.employeeId);
        //         let newplan = this.addorUpdatePlans(null, employee, planData, true);
        //         newplan.totalRatebudg = this.rosterCommonService.roundtoTwo(((changedMinutes / 60) * rate));
        //         if (this.isActual == DataType.Actual) {
        //             newplan.actualRate = this.rosterCommonService.roundtoTwo(((changedMinutes / 60) * rate));
        //         } else {
        //             newplan.plannedRate = this.rosterCommonService.roundtoTwo(((changedMinutes / 60) * rate));
        //         }
        //         this.selectedPlan.push(newplan);
        //     }
        // } else {
        if (planData.resourceId) {
            let newSubPlans: any = [];
            const employee = this._employeeListDataDetails.find((x) => x.employeeId == planData.resourceId);

            let changedDuration = moment.duration(moment(planData.endDate).diff(moment(planData.startDate)));
            let changedMinutes = changedDuration.asMinutes();
            changedMinutes = (changedMinutes - this.breakMins) < 0 ? 0 : changedMinutes - this.breakMins;

            if (Guid.isGuid(planData.id)) {
                const planUpdate = this.selectedPlan.find((x) => x.planId == planData.id);
                this.selectedPlan = this.selectedPlan.filter((x) => x.planId != planData.id);
                let plannedDuration = moment.duration(moment((planUpdate.toTime || planUpdate.plannedToTime), "HH:mm:ss").diff(moment((planUpdate.fromTime || planUpdate.plannedFromTime), "HH:mm:ss")));
                let plannedMinutes = plannedDuration.asMinutes();
                let budgetperminute = planUpdate.totalRate / plannedMinutes;

                // let rate = this.latestBudget(planData, employee.employeeId)
                // if (!rate) {
                //     rate = budgetperminute * 60;
                // }

                let rosterPlan = this.addorUpdatePlans(planUpdate, employee, planData, false);
                // rosterPlan.totalRate = this.rosterCommonService.roundtoTwo(((changedMinutes / 60) * rate));
                rosterPlan.totalRate = this.rosterCommonService.roundtoTwo(rate);

                if (this.isActual == DataType.Actual) {
                    rosterPlan.actualRate = this.rosterCommonService.roundtoTwo(rate);
                } else {
                    rosterPlan.plannedRate = this.rosterCommonService.roundtoTwo(rate);
                }
                newSubPlans.push(rosterPlan);
                this.selectedPlan.push(rosterPlan);
            } else {
                // let rate = this.latestBudget(planData, employee.employeeId);
                let newplan = this.addorUpdatePlans(null, employee, planData, true);
                newplan.totalRate = this.rosterCommonService.roundtoTwo(rate);
                if (this.isActual == DataType.Actual) {
                    newplan.actualRate = this.rosterCommonService.roundtoTwo(rate);
                } else {
                    newplan.plannedRate = this.rosterCommonService.roundtoTwo(rate);
                }
                newSubPlans.push(newplan);
                this.selectedPlan.push(newplan);
            }
        }
        // }
    }

    loadGridData() {

        if (this.selectedPlan && this.selectedPlan.length > 0) {
            if (this.requestDetails && this.requestDetails.statusName == "Approved") {
                let resourceType: any = this.schedulerEngine.columns.find(x => x.type == 'resourceInfo');
                if (resourceType) {
                    resourceType.showRole = false;
                }
                this.resources = this.selectedPlan.map((employee) => {
                    return {
                        id: employee.actualEmployeeId,
                        name: employee.actualEmployeeName,
                        department: employee.departmentName ? employee.departmentName : "Not Known",
                        // role: employee.roleName,
                        type: employee.departmentName ? employee.departmentName : "Not Known",
                        imageUrl: employee.actualEmployeeProfileImage ? employee.actualEmployeeProfileImage : "assets/images/faces/18.png",
                    }
                }).filter((obj, pos, arr) => {
                    return arr.map(mapObj => mapObj["id"]).indexOf(obj["id"]) === pos;
                });

                this.schedulerEngine.resourceStore.removeAll();
                this.schedulerEngine.resourceStore.add(this.resources);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "resources");
            }
            if (this.requestDetails && this.employeeListData) {
                this.events = this.selectedPlan.map((plan, index) => {
                    const startTime = this.commonService.convertUtcToLocal(this.setTime(plan, true), this.isActual == DataType.Actual);
                    const endTime = this.commonService.convertUtcToLocal(this.setTime(plan, false), this.isActual == DataType.Actual);
                    if (startTime.hour() >= 12 && endTime.hour() <= 12 && endTime < startTime) {
                        endTime.add(1, "days");
                    } else if (endTime < startTime) {
                        if (new Date(plan.planDate) < startTime.toDate()) {
                            startTime.add(-1, "days");
                        } else {
                            endTime.add(1, "days");
                        }
                    }
                    if (!this.priorInputData) {
                        if (!this.minDate || new Date(this.minDate) > startTime.toDate()) {
                            this.minDate = startTime.toDate();
                        }
                        if (!this.maxDate || new Date(this.maxDate) < endTime.toDate()) {
                            this.maxDate = endTime.toDate()
                        }
                    }
                    let timeFormat;
                    if (startTime.day != endTime.day) {
                        timeFormat = startTime.format("Do MMM YYYY hh:mm a") + " - " + endTime.format("Do MMM YYYY hh:mm a");
                    } else {
                        timeFormat = startTime.format("hh:mm a") + " - " + endTime.format("hh:mm a");
                    }
                    let rate = this.isActual == DataType.Actual ? plan.actualRate : (plan.plannedRate ? plan.plannedRate : plan.totalRate);
                    const currencyCode = this.cp.transform(rate ? rate : 0, this.currencyCode);
                    let hours = moment.duration(endTime.diff(startTime)).asHours();
                    const header = `
                    <div style='display:flex; flex-wrap: wrap'>
                    <div class="mr-05">
                        <div> ${timeFormat} </div>
                    </div>
                    <div class="mr-05">
                        <div> Rate: ${currencyCode} (${this.rosterCommonService.roundtoTwo(hours)} hrs) </div>
                    </div>`
                    return {
                        id: plan.planId || Guid.create().toString(),
                        resourceId: plan.employeeId || plan.plannedEmployeeId || plan.actualEmployeeId,
                        type: plan.departmentName ? plan.departmentName : "Not Known",
                        startDate: startTime.toDate(),
                        endDate: endTime.toDate(),
                        plan,
                        eventColor: this.isActual == DataType.Actual ? "green" : (plan.isOverlay ? "teal" : "blue"),
                        name: header,
                        isOverlay: plan.isOverlay
                    }
                });
                if (this.schedulerEngine) {
                    this.setSchedulerTimeSpan();
                    this.schedulerEngine.eventStore.removeAll();
                    this.schedulerEngine.eventStore.add(this.events);
                    // this.schedulerEngine.scrollToDate(this.minDate, false)
                }
            }
        } else {
            this.events = [];
            this.selectedPlan = [];
            if (this.schedulerEngine) {
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                if (this.priorInputData && this.priorInputData.startDate) {
                    this.minDate = this.priorInputData.startDate.toDate();
                    this.maxDate = this.priorInputData.endDate.toDate();
                    this.setSchedulerTimeSpan();
                    this.schedulerEngine.scrollToDate(this.minDate, { animate: false })
                }
            }
        }
        // this.addResource();
    }

    createEmployeeAsResource() {
        this.resources = this.employeeListData.map((employee) => {
            return {
                id: employee.employeeId || employee.plannedEmployeeId || employee.actualEmployeeId,
                name: employee.userName,
                department: employee.departmentName ? employee.departmentName : "Not Known",
                role: employee.roleName,
                type: employee.departmentName ? employee.departmentName : "Not Known",
                imageUrl: employee.profileImage ? employee.profileImage : "assets/images/faces/18.png",
                href: "https://snovasys.snovasys.io/"
            }
        })
    };

    addResource() {
        let resource = {
            id: Guid.create().toString(),
            name: "Praveen 1",
            department: "Depart 1",
            role: "role 1",
            type: "no shift",
            imageUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
            href: this.goToUserProfile
        };
        this.resources.push(resource);
    }

    setTime(dataItem: any, isStart) {
        const date = moment(dataItem.planDate).format("DD-MM-YYYY");
        let endTime;
        if (!this.requestDetails || !this.requestDetails.requestId) {
            if (isStart) {
                if (dataItem.fromTime) {
                    endTime = dataItem.fromTime;
                } else {
                    endTime = "00:00:00";
                }
            } else {
                if (dataItem.toTime) {
                    endTime = dataItem.toTime;
                } else {
                    endTime = "23:59:59";
                }
            }
        } else {
            if ((this.requestDetails && this.requestDetails.requestId) && this.isActual == DataType.Actual) {
                if (isStart) {
                    if (dataItem.actualFromTime) {
                        endTime = dataItem.actualFromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.actualToTime) {
                        endTime = dataItem.actualToTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            } else if ((this.requestDetails && this.requestDetails.requestId) && this.isActual == DataType.Planned) {
                if (isStart) {
                    if (dataItem.plannedFromTime || dataItem.fromTime) {
                        endTime = dataItem.plannedFromTime || dataItem.fromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.plannedToTime || dataItem.toTime) {
                        endTime = dataItem.plannedToTime || dataItem.toTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            } else {
                if (isStart) {
                    if (dataItem.fromTime) {
                        endTime = dataItem.fromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.toTime) {
                        endTime = dataItem.toTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            }
        }

        return moment(date + " " + endTime, "DD-MM-YYYY HH:mm");
    }

    latestBudget(planData: any, employeeId: string) {
        let employeeIds = [];
        employeeIds.push(employeeId)
        let employeeRateTagInput = new EmployeeRateTagInput();
        employeeRateTagInput.createdDate = planData.startDate;
        employeeRateTagInput.startTime = planData.startDate
        employeeRateTagInput.startTime = this.commonService.covertTimeIntoUtcTime(planData.startDate).format("HH:mm");
        employeeRateTagInput.endTime = this.commonService.covertTimeIntoUtcTime(planData.endDate).format("HH:mm");
        employeeRateTagInput.employeeIds = employeeIds;

        let rate = 0;
        this.rosterService.getEmployeeRates(employeeRateTagInput)
            .do((response: any) => { })
            .switchMap((response) => {
                if (response && response.data && response.data.length > 0) {
                    rate = response.data[0].rate;
                    this.setPlan(planData, rate);
                    this.loadGridData();
                    this.updateBudgetLabels.emit(this.selectedPlan);
                }
                return of(response);
            })
            .subscribe();
        return rate;
    }

    addorUpdatePlans(planUpdate: any, employee: any, formValue: any, isNew: boolean) {
        let rosterPlan: any = {};
        rosterPlan.currencyCode = isNew ? this.currencyCode : planUpdate.currencyCode;
        rosterPlan.departmentId = employee.departmentId;
        rosterPlan.departmentName = employee.departmentId ? this.departmentList.find((x) => x.departmentId == employee.departmentId).departmentName : "";
        rosterPlan.employeeId = employee.employeeId;
        rosterPlan.employeeName = employee.firstName + " " + employee.surName;
        rosterPlan.planDate = this.commonService.convertToDate(formValue.startDate);
        rosterPlan.planId = isNew ? Guid.create().toString() : planUpdate.planId;
        rosterPlan.shiftId = isNew ? (employee.shiftTimingId ? employee.shiftTimingId : formValue.shiftId) : planUpdate.shiftId;
        rosterPlan.solutionId = isNew || !this.selectedSolution ? Guid.create().toString() : this.selectedSolution.solutionId;
        rosterPlan.employeeProfileImage = employee.employeeProfileImage;
        rosterPlan.shiftName = isNew ? "" : planUpdate.shiftName;
        rosterPlan.fromTime = this.commonService.covertTimeIntoUtcTime(formValue.startDate).format("HH:mm");
        rosterPlan.toTime = this.commonService.covertTimeIntoUtcTime(formValue.endDate).format("HH:mm");

        if (this.isActual == DataType.Actual) {
            rosterPlan.actualFromTime = this.commonService.covertTimeIntoUtcTime(formValue.startDate).format("HH:mm");
            rosterPlan.actualToTime = this.commonService.covertTimeIntoUtcTime(formValue.endDate).format("HH:mm");
        } else {
            rosterPlan.plannedFromTime = this.commonService.covertTimeIntoUtcTime(formValue.startDate).format("HH:mm");
            rosterPlan.plannedToTime = this.commonService.covertTimeIntoUtcTime(formValue.endDate).format("HH:mm");
        }

        return rosterPlan;
    }

    async overlayApprove(plan) {
        await this.validatePlan(plan);
    }

    // exportExcel() {
    //     const fields = [];
    //     // The superclass fieldMaps are all prototype chained in, so no hasOwnProperty required
    //     for (const fieldName in this.schedulerEngine.eventStore.modelClass.fieldMap) {
    //         if (this.schedulerEngine.eventStore.modelClass.fieldMap[fieldName].persist !== false) {
    //             fields.push(fieldName);
    //         }
    //     }
    //     this.schedulerEngine.features.excelExporter.export({
    //         filename: 'Export all event fields',
    //         eventColumns: fields
    //     });
    // }

    exportPDF() {
        this.schedulerEngine.features.pdfExport.showExportDialog();
    }

    goToUserProfile(selectedUserId) {
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    setSchedulerTimeSpan() {
        let min = moment((moment(this.minDate).format("DD-MM-YYYY") + " 00:00"), "DD-MM-YYYY HH:mm");
        let max = moment((moment(this.maxDate).format("DD-MM-YYYY") + " 23:59"), "DD-MM-YYYY HH:mm");
        this.schedulerEngine.setTimeSpan(min.toDate(), max.toDate());
    }
}

// eof
