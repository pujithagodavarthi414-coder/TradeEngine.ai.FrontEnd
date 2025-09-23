import { DatePipe } from "@angular/common";
import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    Inject
} from "@angular/core";
import { Guid } from "guid-typescript";
// import { Scheduler as SchedulerModule } from "../../../../../bryntum-scheduler/scheduler.module.js";
// UMD bundle is used to support IE11 browser. If you don't need it just use import from 'bryntum-scheduler' instead
import { AssignmentModel, AssignmentStore, EventModel, PresetManager, Scheduler, StringHelper, ViewPreset, WidgetHelper } from "@snovasys/snova-timeline-viewer/scheduler.umd.js";
// import _ = require("underscore");
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
// import { FetchSizedAndCachedImagePipe } from "app/shared/pipes/fetchSizedAndCachedImage.pipe";
import { ActivityTrackerScreeshotViewer } from "./activity-tracker-screenshot-report-component";
import { MatDialog } from "@angular/material/dialog";

import * as moment_ from "moment";
import { ActivityTrackerService } from '../services/activitytracker-services';
const moment = moment_;

@Component({
    selector: "activity-bry-scheduler",
    template: "",
    viewProviders: [ActivityTrackerService]
})
export class ActivityTrackerBryntumSchedulerComponent implements OnInit, OnChanges, OnDestroy {

    private elementRef: ElementRef;
    public schedulerEngine: Scheduler;
    private presetManager: PresetManager;
    private newViewPreset: ViewPreset;
    private breakMins: number;
    private error: boolean;
    private errorMessage: string;
    private employeeList: any;
    private groupType: boolean;

    private featureRe: RegExp = /Feature$/;
    private selectedPlan: any[];
    private minDate: Date;
    private maxDate: Date;
    private requestData: any;
    private userActivityScreenshots: any;
    private webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    private screen: any;
    private screenshots: any;

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
    @Input() viewPreset: string = "minuteAndHour";
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
    @Input() trackerData: any;
    @Input("employeeList")
    set _employeeList(data) {
        this.employeeList = data;
        this.createEmployeeAsResource();
    }

    @Input("groupType")
    set _groupType(data) {
        if (data == "false") {
            this.groupType = false;
        } else {
            this.groupType = true;
        }
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

    constructor(element: ElementRef,
        private timeUsageService: ActivityTrackerService,
        private datePipe: DatePipe,
        private dialog: MatDialog) {
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
                        if (event.type === "eventselectionchange") {
                            console.log(event);
                            var screenShotEvent = ["Productive","UnProductive","IdleTime","Neutral"];
                            var isScreenshot= false;
                            screenShotEvent.forEach((x) => {
                                if(x == event.selected[0].data.event.applicationTypeName){
                                    isScreenshot = true;
                                }
                            })
                            if (event.selected && event.selected.length > 0 && isScreenshot) {
                                this.getActTrackerUserActivityScreenshots(event.selected[0].data.event);
                            }
                        }
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
            if (changes && (changes._employeeListDataDetails || this.resources)) {
                this.schedulerEngine.resourceStore.removeAll();
                this.schedulerEngine.resourceStore.add(this.resources);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, "resources");
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                this.schedulerEngine.eventStore.relayAll(this.schedulerEngine, "events");
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
                    // name = event.applicationTypeName || event.UserStoryName;
                    if (event.applicationTypeName == "Productive") {
                        name = "Productive";
                    } else if (event.applicationTypeName == "UnProductive") {
                        name = "Un-productive";
                    } else if (event.applicationTypeName == "IdleTime") {
                        name = "Idle";
                    } else if (event.applicationTypeName == "Log") {
                        name = "Total logged in time ";
                    } else if (event.applicationTypeName == "Lunch") {
                        name = "Lunch break";
                    } else if (event.applicationTypeName == "Break") {
                        name = "Break";
                    } else if (event.applicationTypeName == "Neutral") {
                        name = "Neutral";
                    } else if (event.applicationTypeName == "Offline") {
                        name = "Offline";
                    } else if (event.applicationTypeName == "Inactive") {
                        name = "Inactive";
                    } else if (event.applicationTypeName == "Active") {
                        name = "Active";
                    } else if (event.applicationTypeName == "User Story") {
                        name = event.userStoryName;
                    } else if (!event.applicationTypeName) {
                        name = event.userStoryName;
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
                text: 'Date',
                width: '13em',
                field: 'type',
                hidden: !this.groupType
            },
            {
                type: 'resourceInfo',
                text: 'Name',
                width: '13em',
                field: 'name',
                showEventCount: false,
                showRole: false,
                hidden: this.groupType
            })
        if (!this.groupType) {
            this.groupFeature = "type";
        } else {
            this.groupFeature = "name";
        }
    }

    globalConfigChanges() {
        this.schedulerEngine.zoomTo({ level: 14 });
    }

    loadGridData() {
        if (this.trackerData && this.trackerData.length > 0) {
            this.events = this.trackerData.map((event, index) => {
                let startTime = this.convertUtcToLocal(moment(event.startTime));
                let endTime = this.convertUtcToLocal(moment(event.endTime));
                let minutes = moment.duration(endTime.diff(startTime)).asMinutes();
                let logDate = moment(event.createdDate).format("DD MMM YYYY");
                let backColor = "";
                if (event.applicationTypeName == "Productive") {
                    backColor = "green";
                } else if (event.applicationTypeName == "UnProductive") {
                    backColor = "orange";
                } else if (event.applicationTypeName == "IdleTime") {
                    backColor = "yellow";
                } else if (event.applicationTypeName == "Log") {
                    backColor = "indigo";
                } else if (event.applicationTypeName == "Lunch" || event.applicationTypeName == "Break") {
                    backColor = "pink";
                } else if(event.applicationTypeName == "Offline" || event.applicationTypeName == "Inactive") {
                    backColor = "red";
                } else {
                    backColor = "violet";
                }
                return {
                    startDate: startTime.toDate(),
                    endDate: endTime.toDate(),
                    event,
                    eventColor: backColor,
                    // name: event.spentTime + " min",
                    resourceId: event.resourceId,
                    type: logDate
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

        let resourceValues = this.trackerData.map((employee) => {
            if (employee.createdDate) {
                let logDate = moment(employee.createdDate).format("DD MMM YYYY");
                return {
                    id: employee.resourceId,
                    name: employee.userName,
                    type: logDate,
                    imageUrl: "assets/images/faces/18.png"
                }
            }
        });

        var flags = [], output = [], l = resourceValues.length, i;
        for (i = 0; i < l; i++) {
            if (flags[resourceValues[i].id]) { continue; }
            flags[resourceValues[i].id] = true;
            output.push(resourceValues[i]);
        }
        this.resources = [...output];
    };

    addResource() {
        let resource = {
            id: Guid.create().toString(),
            name: "Praveen 1",
            department: "Depart 1",
            role: "role 1",
            type: "no shift",
            imageUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
        };
        this.resources.push(resource);
    }

    getActTrackerUserActivityScreenshots(event) {
        // this.loading = true;
        this.userActivityScreenshots = [];
        this.webAppUsageSearch = new WebAppUsageSearchModel();
        this.webAppUsageSearch.dateFrom = event.startTime;
        this.webAppUsageSearch.dateTo = event.endTime;
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.userId.push(event.userId);
        this.webAppUsageSearch.isApp = false;
        this.timeUsageService.getActTrackerUserActivityScreenshots(this.webAppUsageSearch).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.userActivityScreenshots = responseData.data;
                var isempty = false;
                if (this.userActivityScreenshots.length == 0) {
                    // this.noData = true;
                    this.screenshots = [];
                    this.screen = [];
                    this.userActivityScreenshots = [];
                    isempty = true;
                    const dialogRef = this.dialog.open(ActivityTrackerScreeshotViewer, {
                        height: "auto",
                        width: "calc(100vw- 100px)",
                        disableClose: true,
                        data: { userActivityScreenshots: this.userActivityScreenshots, screen: this.screen, webAppUsage: this.webAppUsageSearch }
                    });
                }
                if (this.userActivityScreenshots.length > 0) {
                    // this.noData = false;
                    let i = 0;
                    this.userActivityScreenshots.forEach((item) => {
                        item.screenshotDetails.forEach((x) => {
                            const tempdate = this.datePipe.transform(x.screenShotDateTime, "MMM d, y, h:mm:ss a");
                            this.screen.push(x);
                            // const album = {
                            //     small: this.imagePipe.transform(x.screenShotUrl ? x.screenShotUrl : '', '', ''),
                            //     big: this.imagePipe.transform(x.screenShotUrl ? x.screenShotUrl : '', '', ''),
                            //     screenShotId: x.screenShotId,
                            //     name: x.name,
                            //     applicationName: x.applicationName,
                            //     applicationTypeName: x.applicationTypeName,
                            //     screenShotDateTime: x.screenShotDateTime,
                            //     description:
                            //         `<div>
                            //                 <div class="pull-left text-left ml-5">
                            //                     <img class="employee_img" src="${ x.profileImage}" style="float: none;" *ngIf="profileImage(x.profileImage)" />
                            //                     ${ x.name} <br> ${x.roleName} <br> 
                            //                     <label class="activity-font-custom">${ tempdate}</label>
                            //                     <div>
                            //                         <div>
                            //                             <span class="fa fa-keyboard-o"></span>
                            //                             Keystrokes / min: ${ x.keyStroke}&nbsp;&nbsp;&nbsp;
                            //                             <span class="fa fa-mouse-pointer"></span>
                            //                             Mouse movements / min: ${ x.mouseMovement}
                            //                         </div>
                            //                     </div>
                            //                 </div>
                            //             </div>`
                            // };
                            // this.screenshots.push(album);
                        })
                        // let galleryImage = new ScreenshotModel();
                        // galleryImage.date = item.date;
                        // galleryImage.screenshotDetails = this.screenshots;
                        // this.galleryImages.push(galleryImage);
                        // this.images = true;
                        this.screenshots = [];
                        i++;
                    });

                    const dialogRef = this.dialog.open(ActivityTrackerScreeshotViewer, {
                        height: "auto",
                        width: "calc(100vw- 100px)",
                        disableClose: true,
                        data: { userActivityScreenshots: this.userActivityScreenshots, screen: this.screen, webAppUsage: this.webAppUsageSearch }
                    });
                }
                else {
                    // this.images = false;
                    if(!isempty){
                    this.screenshots = [];
                    this.screen = [];
                    this.userActivityScreenshots = [];
                    const dialogRef = this.dialog.open(ActivityTrackerScreeshotViewer, {
                        height: "auto",
                        width: "calc(100vw- 100px)",
                        disableClose: true,
                        data: { userActivityScreenshots: this.userActivityScreenshots, screen: this.screen, webAppUsage: this.webAppUsageSearch }
                    });
                }
                }
            }
            // this.loading = false;
        })
    }

    setSchedulerTimeSpan() {
        let min = moment((moment(this.requestData.startDate).format("DD-MM-YYYY") + " 00:00"), "DD-MM-YYYY HH:mm");
        let max = moment((moment(this.requestData.endDate).format("DD-MM-YYYY") + " 23:59"), "DD-MM-YYYY HH:mm");
        this.schedulerEngine.setTimeSpan(min.toDate(), max.toDate());
    }


    convertUtcToLocal(inputTime) {
        if (inputTime == null || inputTime == "")
            return null;

        let dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) != "string") {
            let formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local()
        }
        if (typeof (inputTime) === "string") {
            var current = new Date();
            var timeSplit = inputTime.toString().split(":");
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            let formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local()
        }
    }
}
