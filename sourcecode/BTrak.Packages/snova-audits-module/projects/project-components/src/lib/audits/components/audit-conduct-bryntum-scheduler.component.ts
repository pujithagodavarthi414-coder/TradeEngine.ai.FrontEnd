import { CurrencyPipe, DatePipe } from "@angular/common";
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
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../dependencies/services/common.service";
// import { State } from "app/shared/store/reducers/index";
// import { EmployeeRateSheetModel } from "app/views/hrmanagment/models/employee-ratesheet-model";
// import { WeekdayModel } from "app/views/masterdatamanagement/models/hr-models/weekday-model";
// import { HolidayModel } from "app/views/masterdatamanagement/models/leaves-models/holiday-model";
import { LeavesManagementService } from "../dependencies/services/leaves-management.service";
import { MasterDataManagementService } from "../dependencies/services/master-data-management.service";
import { Guid } from "guid-typescript";
import * as moment_ from "moment";
const moment = moment_;
import { ToastrService } from "ngx-toastr";
// import { Scheduler as SchedulerModule } from "../../../../../bryntum-scheduler/scheduler.module.js";
// UMD bundle is used to support IE11 browser. If you don't need it just use import from 'bryntum-scheduler' instead
import { AssignmentModel, AssignmentStore, EventModel, PresetManager, Scheduler, ViewPreset } from "@snovasys/snova-timeline-viewer/scheduler.umd.js";
import * as _ from "underscore";
// import { FetchSizedAndCachedImagePipe } from "app/shared/pipes/fetchSizedAndCachedImage.pipe";
import { MatDialog } from "@angular/material/dialog";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { ConductUniqueDetailComponent } from "./conduct-unique-detail.component";

@Component({
    selector: "audit-conduct-bry-scheduler",
    template: "",
})
export class AuditConductBryntumSchedulerComponent implements OnInit, OnChanges, OnDestroy {

    private elementRef: ElementRef;
    public schedulerEngine: Scheduler;
    private presetManager: PresetManager;
    private newViewPreset: ViewPreset;
    private breakMins: number;
    private error: boolean;
    private errorMessage: string;
    private auditList: any;

    private featureRe: RegExp = /Feature$/;
    private selectedPlan: any[];
    private minDate: Date;
    private maxDate: Date;
    private requestData: any;
    private userActivityScreenshots: any;
    private screen: any;
    private screenshots: any;
    private hrMilliSecs: number = 3600000;

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
    @Input() eventLayout: string = "stack";
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
    @Input() viewPreset: string = "monthAndYear";
    @Input() width: number | string;
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
    @Input() conductData: any;
    @Input("auditList")
    set _auditList(data) {
        this.auditList = data;
        this.createEmployeeAsResource();
    }

    @Input("requestData")
    set _requestData(data) {
        if (data) {
            this.requestData = data;
        } else {
            this.requestData = {};
            this.requestData.startDate = new Date();
            this.requestData.endDate = new Date();
        }
    }

    @Output() selectedConduct = new EventEmitter<any>();
    softLabels: SoftLabelConfigurationModel[];
    auditName: any;
    constructor(element: ElementRef, private commonService: CommonService, private router: Router,
        private leaveManagementService: LeavesManagementService,
        private masterDataManagement: MasterDataManagementService, private toastr: ToastrService,
        private translateService: TranslateService, private cp: CurrencyPipe,
        // private imagePipe: FetchSizedAndCachedImagePipe,
        private datePipe: DatePipe,
        public dialog: MatDialog) {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        if (!this.softLabels || this.softLabels.length === 0) {
            this.auditName = "Audit";
          } else if(!this.softLabels[0].auditLabel || this.softLabels[0].auditLabel == "") {
            this.auditName = "Audit";
          } else {
            this.auditName = this.softLabels[0].auditLabel;
          }

        // Needed later, used as target when rendering Bryntum Scheduler
        this.screen = [];
        this.userActivityScreenshots = [];
        this.screenshots = [];
        this.selectedPlan = [];
        this.elementRef = element;
    }

    ngOnInit() {
        const
            config = {
                // Render scheduler to components element
                appendTo: this.elementRef.nativeElement,

                // Listeners, will relay events
                listeners: {
                    async catchAll(event) {
                        // console.log(event);
                        if (event.type === "eventclick") {
                            if (event.eventRecord && event.eventRecord.data && event.eventRecord.data.event && event.eventRecord.data.event.auditConductId) {
                                if(event.eventRecord.data.event.auditConductId != Guid.EMPTY && (new Date(event.eventRecord.data.event.deadline) >= new Date() || event.eventRecord.data.event.isCompleted)){
                                    this.selectedConduct.emit(event.eventRecord.data.event.auditConductId);
                                }
                            }
                        }

                        // if (event.type === "eventselectionchange") {
                        //     if (event.selected && event.selected.length > 0) {
                        //         this.selectedConduct.emit(event.selected[0].data.event.auditConductId);
                        //         // this.openConductUniquePage(event.selected[0].data.event);
                        //         // this.getActTrackerUserActivityScreenshots(event.selected[0].data.event);
                        //     }
                        // }
                    },

                    thisObj: this
                },

                features: {}
            };

        this.getEditConfig();
        // relay properties with names matching this.featureRe to features
        this.features.forEach((featureName) => {
            if (featureName in this) {
                config.features[featureName.replace(this.featureRe, "")] = this[featureName];
            }
        });

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
        const engine = this.schedulerEngine = new Scheduler(config);
        this.globalConfigChanges();
        this.schedulerEngine.readOnly = true;

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
            if (changes && changes._auditList) {
                this.schedulerEngine.resourceStore.removeAll();
                this.schedulerEngine.resourceStore.add(this.resources);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "resources");
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "events");
            }
        }
    } // eo function ngOnChanges

    ngOnDestroy(): void {
        if (this.schedulerEngine && (typeof this.schedulerEngine == "object")) {
            this.schedulerEngine.destroy();
        }
    } // eo function ngOnDestroy

    getEditConfig() {
        this.eventTooltipFeature = {
            template: data => {
                let name = "";
                if (data.eventRecord && data.eventRecord.data) {
                    const event = data.eventRecord.event;

                    let quesCount = event.totalQuestions;
                    let answCount = event.totalAnswers;
                    let unAnswCount = quesCount - answCount;
                    let validCount = event.totalValidAnswers;
                    let inValidCount = answCount - validCount;
                    let percent = (validCount / answCount) * 100;
                    let compliancePercent = percent.toFixed(2);
                    name = `Created by - ${event.createdByUserName}, Compliance percentage ${isNaN(percent) ? 0 : compliancePercent} %`;                 
                    
                    if (new Date(event.deadline) <= new Date() && !event.isCompleted) {
                        name = name + "<br/> Overdue"
                    } else if (quesCount > 0 && answCount > 0 && event.isCompleted) {
                        name = name + "<br/> Conduct completed"
                    } else if (quesCount > 0 && answCount > 0 && !event.isCompleted) {
                        name = name + "<br/> In progress"
                    } else if ((quesCount > 0 && answCount <= 0)) {
                        name = name + "<br/> Not started"
                    } else if (event.auditConductId == Guid.EMPTY) {
                        name = name + "<br/> Conduct is not yet created"
                    }
                }
                return ` ${name}
                  ${data.startClockHtml}
                  ${data.endClockHtml}
                `;
            }
        }

        this.columns = [];
        this.columns.push(
            {
                text: 'Branch',
                width: '13em',
                field: 'type',
                hidden: true
            },
            {
                text: this.auditName,
                width: '13em',
                field: 'name',
                showEventCount: false,
                showRole: false,
                hidden: false
            })
        this.groupFeature = "type";
    }

    globalConfigChanges() {
        this.schedulerEngine.zoomTo({ level: 11 });
    }

    loadGridData() {
        if (this.conductData && this.conductData.length > 0) {
            this.events = this.conductData.map((event, index) => {
                let startTime: any;
                let endTime: any;
                // if (event.isCompleted) {
                //     let diff = new Date(event.lastAnswerdDateTime).valueOf() - new Date(event.firstAnswerdDateTime).valueOf();
                //     if(diff < this.hrMilliSecs){
                //         startTime = this.commonService.convertUtcToLocal(moment(event.firstAnswerdDateTime));
                //         let endDate = new Date(startTime);
                //         endDate.setHours(endDate.getHours() + 1);
                //         endTime = moment(endDate);
                //     }else{
                //         startTime = this.commonService.convertUtcToLocal(moment(event.firstAnswerdDateTime));
                //         endTime = this.commonService.convertUtcToLocal(moment(event.lastAnswerdDateTime));
                //         // startTime = moment(event.firstAnswerdDateTime);
                //         // endTime = moment(event.lastAnswerdDateTime);
                //     }
                // } else 
                if(event.cronStartDate && event.cronEndDate && !event.isCompleted){
                    // startTime = this.commonService.convertUtcToLocal(moment(event.cronStartDate));
                    // endTime = this.commonService.convertUtcToLocal(moment(event.deadline));
                    startTime = moment(event.cronStartDate);
                    endTime = moment(event.deadline);
                }
                else if(event.cronStartDate && event.cronEndDate && event.isCompleted){
                    // startTime = this.commonService.convertUtcToLocal(moment(event.cronStartDate));
                    // endTime = this.commonService.convertUtcToLocal(moment(event.deadline));
                    startTime = moment(event.cronStartDate);
                    // endTime = moment(event.deadline).utc();
                    var localTime  = moment.utc(event.deadline).toDate();
                    endTime = moment(localTime);
                }
                else{
                    // startTime = this.commonService.convertUtcToLocal(moment(event.createdDatetime));
                    // endTime = this.commonService.convertUtcToLocal(moment(event.deadline));
                    startTime = moment(event.createdDatetime);
                    endTime = moment(event.deadline);
                }
                // let logDate = moment(event.createdDate).format("DD MMM YYYY");
                let backColor = "";
                let compliancePercent
                // if (event.startDate && event.endDate) {
                //     backColor = "green";
                // } else if (event.startDate && !event.endDate) {
                //     backColor = "orange";
                // } else if (!event.startDate && !event.endDate) {
                //     backColor = "yellow";
                // }

                let quesCount = event.totalQuestions;
                let answCount = event.totalAnswers;
                let unAnswCount = quesCount - answCount;
                let validCount = event.totalValidAnswers;
                let inValidCount = answCount - validCount;
                let percent = (validCount / answCount) * 100;
                compliancePercent = percent.toFixed(2);
                let status: string;
                if (new Date(event.deadline) <= new Date() && !event.isCompleted) {
                    status = "OD"
                } else if (quesCount > 0 && answCount > 0 && event.isCompleted) {
                    status = "Completed"
                } else if (quesCount > 0 && answCount > 0 && !event.isCompleted) {
                    status = "IP"
                } else if (event.auditConductId != Guid.EMPTY) {
                    status = "NS"
                } else if (event.auditConductId == Guid.EMPTY) {
                    status = "NYC"
                }

                if(event.auditConductId){
                    backColor = "purple";
                }

                if (quesCount > 0 && answCount <= 0) {
                    backColor = 'blue';
                }
                if (quesCount > 0 && answCount > 0 && !event.isCompleted) {
                    backColor = 'orange';
                }
                if (quesCount > 0 && answCount > 0 && event.isCompleted) {
                    backColor = 'green';
                }
                if (new Date(event.deadline) <= new Date() && !event.isCompleted) {
                    backColor = 'red';
                }
                
                const name = `<div style="margin: auto;">${status}, CP ${isNaN(percent) ? 0 : compliancePercent} %</div>`;
                return {
                    startDate: startTime.toDate(),
                    endDate: endTime.toDate(),
                    event,
                    eventColor: backColor,
                    resourceId: event.auditId,
                    type: event.branchName,
                    name
                }
            });
            if (this.schedulerEngine) {
                this.setSchedulerTimeSpan();
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                // this.schedulerEngine.scrollToDate(this.minDate, false)
            }
        } else {
            this.events = [];
            this.selectedPlan = [];
            if (this.schedulerEngine) {
                this.setSchedulerTimeSpan();
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
            }
        }
        // this.addResource();
    }

    createEmployeeAsResource() {
        this.resources = [];
        let resourceValues = this.auditList.map((audit) => {
            return {
                id: audit.auditId,
                name: `${ audit.auditName} - (${_.filter(this.conductData, function(conductAudit: any){return conductAudit.auditId == audit.auditId && conductAudit.auditConductId != Guid.EMPTY}).length})`,
                type: audit.branchName
            }
        });

        this.resources = [...resourceValues];
    };

    openConductUniquePage(data) {
        const dialogRef = this.dialog.open(ConductUniqueDetailComponent, {
            height: "auto",
            width: "calc(100vw- 100px)",
            disableClose: true,
            data: { Id: data.auditConductId }
        });
        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (result.success) {
        //         if (result.data) {
        //             this.requestId = result.data.requestId;
        //             this.selectedSolution = result.data.solution;
        //             this.selectedPlan = result.data.plans;
        //             this.filteredPlansList = result.data.plans;
        //             this.setTotalBudget();
        //         }
        //     }
        // });
    }

    setSchedulerTimeSpan() {
        let min = moment((moment(this.requestData.startDate).format("DD-MM-YYYY") + " 00:00"), "DD-MM-YYYY HH:mm");
        let max = moment((moment(this.requestData.endDate).format("DD-MM-YYYY") + " 23:59"), "DD-MM-YYYY HH:mm");
        this.schedulerEngine.setTimeSpan(min.toDate(), max.toDate());
    }

    zoomIn(){
        this.schedulerEngine.zoomIn();
    }

    zoomOut(){
        this.schedulerEngine.zoomOut();
    }
}
