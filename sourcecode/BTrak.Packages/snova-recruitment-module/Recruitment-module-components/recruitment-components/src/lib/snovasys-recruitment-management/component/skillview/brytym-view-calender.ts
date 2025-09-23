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
} from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import {
    AssignmentModel, AssignmentStore, EventModel,
    Scheduler
} from '@snovasys/snova-timeline-viewer/scheduler.umd.js';
import * as moment_ from 'moment';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CandidateViewComponent } from './candidate-view.component';
import { DatePipe } from '@angular/common';
const moment = moment_;

@Component({
    selector: 'bry-scheduler-interview',
    template: '',
})
export class BryntumSchedulerComponent implements OnInit, OnChanges, OnDestroy {
    private elementRef: ElementRef;
    public schedulerEngine: Scheduler;
    private breakMins: number;
    private errorMessage: string;
    priorInputData: any;
    datePipeString: string;

    private featureRe: RegExp = /Feature$/;
    private selectedPlan: any[];

    /* #region features */
    private features: string[] = [
        'cellEditFeature',
        'cellTooltipFeature',
        'columnDragToolbarFeature',
        'columnLinesFeature',
        'columnPickerFeature',
        'columnReorderFeature',
        'columnResizeFeature',
        'contextMenuFeature',
        'dependenciesFeature',
        'dependencyEditFeature',
        'eventContextMenuFeature',
        'eventDragCreateFeature',
        'eventDragFeature',
        'eventEditFeature',
        'eventFilterFeature',
        'eventResizeFeature',
        'eventTooltipFeature',
        'filterBarFeature',
        'filterFeature',
        'groupFeature',
        'groupSummaryFeature',
        'headerContextMenuFeature',
        'headerZoom',
        'labelsFeature',
        'nonWorkingTimeFeature',
        'panFeature',
        'quickFindFeature',
        'regionResizeFeature',
        'resourceTimeRangesFeature',
        'rowReorderFeature',
        'scheduleContextMenuFeature',
        'scheduleTooltipFeature',
        'searchFeature',
        'sortFeature',
        'stripeFeature',
        'summaryFeature',
        'timeRangesFeature',
        'treeFeature'
        // "excelExporter",
        // "pdfExportFeature"
    ];
    /* #endregion */

    /* #region configs */
    private configs: string[] = [
        'assignments',
        'assignmentStore',
        'autoHeight',
        'barMargin',
        'columns',
        'crudManager',
        'dependencyStore',
        'displayDateFormat',
        'emptyText',
        'endDate',
        'eventBodyTemplate',
        'eventColor',
        'eventLayout',
        'eventRenderer',
        'events',
        'eventEdit',
        'eventStore',
        'eventStyle',
        'fillTicks',
        'height',
        'maxHeight',
        'maxWidth',
        'maxZoomLevel',
        'milestoneAlign',
        'minHeight',
        'minWidth',
        'minZoomLevel',
        'partner',
        'readOnly',
        'resources',
        'resourceStore',
        'resourceTimeRanges',
        'responsiveLevels',
        'rowHeight',
        'scrollLeft',
        'scrollTop',
        'selectedEvents',
        'snap',
        'startDate',
        'tickWidth',
        'timeRanges',
        'timeResolution',
        'viewportCenterDate',
        'viewPreset',
        'width',
        'zoomLevel',

        // schedulerId maps to id of the underlying scheduler
        'schedulerId',

        // only for examples, delete if you don't need them
        'transitionDuration',
        'useInitialAnimation',
        'resourceMargin'
    ];

    /* #endregion */

    /* #region Configs */
    // schedulerId translates to id for the scheduler enging
    @Input() schedulerId: string;

    @Input() assignments: AssignmentModel[] | object[];
    @Input() assignmentStore: AssignmentStore | object;
    @Input() autoHeight = false;
    @Input() barMargin = 5;
    @Input() columns: object[];
    @Input() crudManager: object;
    @Input() dependencyStore: object;
    @Input() displayDateFormat: string;
    @Input() emptyText: string;
    @Input() endDate: any;
    @Input() eventBodyTemplate: any;
    @Input() eventColor: string;
    @Input() eventLayout = 'pack';
    @Input() eventRenderer: any;
    @Input() events: object[];
    @Input() eventEdit: object | boolean;
    @Input() eventStore: object;
    @Input() eventStyle = 'border';
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
    @Input() readOnly = false;
    @Input() resources: object[];
    @Input() resourceStore: object;
    @Input() resourceTimeRanges: object;
    @Input() responsiveLevels: any;
    @Input() rowHeight = 45;
    @Input() scrollLeft: number;
    @Input() scrollTop: number;
    @Input() selectedEvents: EventModel[];
    @Input() snap: boolean;
    @Input() startDate: any;
    @Input() tickWidth: number;
    @Input() timeRanges: object | boolean;
    @Input() timeResolution: object;
    @Input() viewportCenterDate: any;
    @Input() viewPreset = 'hourAndDay';
    @Input() width: number | string = '100%';
    @Input() zoomLevel: number;
    /* #endregion */

    /* #region Features, only used for initialization */
    @Input() cellEditFeature: boolean | object = false;
    @Input() cellTooltipFeature: boolean | object = true;
    @Input() columnDragToolbarFeature: boolean | object = false;
    @Input() columnLinesFeature: boolean | object = true;
    @Input() columnPickerFeature = true;
    @Input() columnReorderFeature = true;
    @Input() columnResizeFeature = false;
    @Input() contextMenuFeature: boolean | object;
    @Input() dependenciesFeature: boolean | object = false;
    @Input() dependencyEditFeature: boolean | object = false;
    @Input() eventContextMenuFeature: boolean | object = true;
    @Input() eventDragCreateFeature: boolean | object = false;
    @Input() eventDragFeature: boolean | object = false;
    @Input() eventEditFeature: boolean | object = false;
    @Input() eventFilterFeature: boolean | object = true;
    @Input() eventResizeFeature: boolean | object = false;
    @Input() eventTooltipFeature: boolean | object = true;
    @Input() filterBarFeature: boolean | object;
    @Input() filterFeature: boolean | object;
    @Input() groupFeature: boolean | object | string = 'type';
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
    @Input() stripeFeature = true;
    @Input() summaryFeature: boolean | object;
    @Input() timeRangesFeature: boolean | object[] = true;
    @Input() treeFeature: boolean;
    @Input() resourceMargin = 10;
    @Input() transitionDuration: number;
    @Input() useInitialAnimation: string;
    rosterCommonService: any;
    jobDetails: any;
    requestData: any;
    groupType: any;
    @Input('schedulerData')
    set _schedulerData(data) {
        this.selectedPlan = data;
        this.loadGridData();
    }

    @Input('isOverlay') isOverlay;
    @Input('priorInputData')
    set _priorInputData(data) {
        this.priorInputData = data;

        if (data && data.startDate && this.schedulerEngine) {
            this.minDate = moment(this.priorInputData.startDate).toDate();
            this.maxDate = moment(this.priorInputData.endDate).toDate();
            this.setSchedulerTimeSpan();
        }
    }
    @Input('requestData')
    set _RequestData(data) {
        if (data) {
            this.requestData = data;
        }
    }

    selectedSolution: any;
    isActual: any;
    isEditable: boolean;
    requestDetails: any;
    rosterService: any;
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

    @Input('selectedSolution')
    set _selectedSolution(data) {
        this.selectedSolution = data;
    }

    @Input('isActual')
    set _isActual(data) {
        this.isActual = data;
        this.loadGridData();
    }

    @Input('isEditable')
    set _isEditable(data) {
        this.isEditable = data;
    }

    @Input('requestData')
    set _requestData(data) {
        if (data) {
            this.requestDetails = data;
        } else {
            this.requestDetails = {};
            this.requestDetails.startDate = new Date();
            this.requestDetails.endDate = new Date();
        }
        this.loadGridData();
    }

    @Input('zoom')
    set _zoom(data) {
        if (this.schedulerEngine) {
            if (data > 0) {
                this.schedulerEngine.zoomIn();
            } else {
                this.schedulerEngine.zoomOut();
            }
        }
    }

    @Input('jobDetails')
    set _employeeListDataDetails(data) {
        this.employeeListData = [];
        if (data && data.length > 0) {
            data.forEach((value) => {
                const employee: any = Object.assign({}, value);
                employee.fullName = value.interviewerName;
                this.employeeListData.push(employee);
            })
            this.filteredEmployeeList = [...this.employeeListData];
        }
        this.createEmployeeAsResource();
        this.loadGridData();
    }
    get _employeeListDataDetails() {
        return this.employeeListData;
    }

    @Input('currencyCode')
    set _currencyCode(data) {
        this.currencyCode = data;
    }

    @Input('departments')
    set _departments(data) {
        this.departmentList = data;
        this.filteredDepartmentList = data;
    }
    @Input('shifts')
    set _shifts(data) {
        this.shiftTimeList = data;
        this.filteredShiftTimeList = data;
    }

    @Output() updateBudgetLabels = new EventEmitter<any>();
    @Output() selectedEvent = '';
    @Output() onSchedulerEvents = new EventEmitter<object>();
    @Output() candidateArchived = new EventEmitter<any>();

    constructor(element: ElementRef, private commonService: CommonService, private router: Router,
                private toastr: ToastrService, public dialog: MatDialog, private datePipe: DatePipe,
    ) {

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
                        if (event.type === 'export') {
                            console.log(event);
                        }
                        console.log(event.type);

                        if (event.type === 'eventselectionchange') {
                            console.log(event);
                            const screenShotEvent = ['employeedetails'];
                            let isScreenshot = true;
                            screenShotEvent.forEach((x) => {
                                if (x === event.selected[0].data.candidateId) {
                                    isScreenshot = true;
                                }
                            });
                            if (event.selected && event.selected.length > 0 && isScreenshot) {
                                this.openJoBCandidate(event.selected[0].data.candidateId);

                            }
                        }

                        this.onSchedulerEvents.emit(event);
                    },

                    thisObj: this
                },

                features: {}
            }
            ;
        this.getEditConfig();
        // relay properties with names matching this.featureRe to features
        this.features.forEach((featureName) => {
            if (featureName in this) {
                config.features[featureName.replace(this.featureRe, '')] = this[featureName];
            }
        });



        // Pass configs on to scheduler
        this.configs.forEach((configName) => {
            if (configName in this) {
                // application may want to pass id for the engine is schedulerId
                if ('schedulerId' === configName && this[configName]) {
                    config['id'.toString()] = this[configName];
                } else {
                    config[configName] = this[configName];
                }
            }
        });

        if (config['partner'.toString()] && 'string' === typeof (config['partner'.toString()])) {
            const bryntum = window['bryntum'.toString()];
            const partner = bryntum && bryntum.get && bryntum.get(config['partner'.toString()]);
            config['partner'.toString()] = partner || undefined;
        }
        const engine = this.schedulerEngine = new Scheduler(config);
        this.schedulerEngine.readOnly = true;

        this.loadGridData();
    } // eo function ngOnInit

    ngOnChanges(changes: SimpleChanges) {

        const me = this;
        this.getEditConfig();
        if (me.schedulerEngine) {
            // Iterate over all changes
            // @ts-ignore
            Object.entries(changes).forEach(([name, { currentValue }]) => {
                // Apply changes that match configs to grid
                if (me.configs.includes(name)) {
                    me.schedulerEngine[name] = currentValue;
                }

                if (me.features.includes(name)) {
                    me.schedulerEngine[name.replace(this.featureRe, '')] = currentValue;
                }
            });

            this.createEmployeeAsResource();
            this.loadGridData();

            if (changes && changes._employeeListDataDetails) {
                this.schedulerEngine.resourceStore.removeAll();
                this.schedulerEngine.resourceStore.add(this.resources);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, 'resources');
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                this.schedulerEngine.resourceStore.relayAll(this.schedulerEngine, 'events');
            }
            if (changes && changes._requestData && this.requestDetails.requiredFromDate) {
                this.minDate = this.commonService.convertUtcToLocal(new Date(this.requestDetails.requiredFromDate)).toDate();
                this.maxDate = this.commonService.convertUtcToLocal(new Date(this.requestDetails.requiredToDate)).toDate();
                this.setSchedulerTimeSpan();
            }
        }
    } // eo function ngOnChanges
    ngOnDestroy(): void {
        if (this.schedulerEngine && (typeof this.schedulerEngine === 'object')) {
            this.schedulerEngine.destroy();
        }
    }
    removeEvent() {
        const scheduler = this.schedulerEngine;
        scheduler.eventStore.remove(scheduler.selectedEvents);
        this.selectedEvent = '';
    } // eo function removeEvent

    addEvent() {
        const scheduler = this.schedulerEngine;

        const event = new scheduler.eventStore.modelClass({
            resourceId: scheduler.resourceStore.first.id,
            startDate: scheduler.startDate,
            duration: 1,
            durationUnit: 'H',
            name: 'New Interview',
            eventType: 'Interview'
        });

        // editEvent is dynamically assigned to Scheduler from the EditEvent feature, and is thus not part of typings
        // @ts-ignore
        scheduler.editEvent(event);
    } // eo function addEvent

    getEditConfig() {
        this.eventTooltipFeature = {
            template: data => {
                const name = '';
                if (data.eventRecord && data.eventRecord.data) {
                    const event = data.eventRecord.event;
                }
                return ` ${name}
                ${data.startClockHtml}
                ${data.endClockHtml}
              `;
            }
        };
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
            });
        if (!this.groupType) {
            this.groupFeature = 'type';
        } else {
            this.groupFeature = 'name';
        }
        //  this.cdRef.detectChanges();
    }

    globalConfigChanges() {
        this.schedulerEngine.zoomTo({ level: 15 });
    }

    async validatePlan(planData) {
        const plans = this.selectedPlan.filter((x) => !x.isOverlay && new Date(x.planDate).getDate() === planData.startDate.getDate() &&
            planData.resourceId === (x.employeeId || x.plannedEmployeeId || x.actualEmployeeId)
            && planData.id !== x.planId);
        if (plans && plans.length > 0) {
            this.toastr.error('', this.errorMessage);
            this.loadGridData();
            return false;
        }
        if (planData.startDate >= planData.endDate) {
            // this.errorMessage = this.translateService.instant(ConstantVariables);
            this.toastr.error('', this.errorMessage);
            this.loadGridData();
            return false;
        }
    }

    loadGridData() {
        console.log(this.filteredEmployeeList);
        if (this.filteredEmployeeList && this.filteredEmployeeList.length > 0) {
            this.events = this.filteredEmployeeList.map((event, index) => {
                let startTime;
                let endTime;
                const candidateId = event;
                startTime = this.convertUtcToLocal(moment(event.startTime));
                endTime = this.convertUtcToLocal(moment(event.endTime));
                const minutes = moment.duration(endTime.diff(startTime)).asMinutes();
                const logDate = moment(event.dateFrom).format('DD MMM YYYY');
                let backColor = '';
                const date = event.candidateName + ' ' +
                    '(' + this.datePipe.transform(startTime, 'h:mm a') + ' - ' + this.datePipe.transform(endTime, 'h:mm a') + ') ';
                backColor = 'green';
                return {
                    startDate: startTime.toDate(),
                    endDate: endTime.toDate(),
                    candidateId,
                    eventColor: backColor,
                    name: date,
                    resourceId: event.resourceId,
                    type: logDate
                };
            });
            if (this.schedulerEngine) {
                this.setSchedulerTimeSpan();
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
            }
        } else {
            this.events = [];
            this.selectedPlan = [];
            if (this.schedulerEngine) {
                this.setSchedulerTimeSpan();
                this.schedulerEngine.eventStore.removeAll();
                this.schedulerEngine.eventStore.add(this.events);
                // this.cdRef.detectChanges();
            }
            // this.addResource();
        }
    }
    setSchedulerTimeSpan() {
        const min = moment((moment(this.requestDetails.startDate).format('DD-MM-YYYY') + ' 00:00'), 'DD-MM-YYYY HH:mm');
        const max = moment((moment(this.requestDetails.endDate).format('DD-MM-YYYY') + ' 23:59'), 'DD-MM-YYYY HH:mm');
        this.schedulerEngine.setTimeSpan(min.toDate(), max.toDate());
    }

    createEmployeeAsResource() {
        this.resources = [];
        if (this.employeeListData) {
            const resourceValues = this.employeeListData.map((employee) => {
                if (employee.dateFrom) {
                    const logDate = moment(employee.dateFrom).format('DD MMM YYYY');
                    return {
                        id: employee.resourceId,
                        name: employee.interviewerName,
                        type: logDate,
                        imageUrl: employee.interviewerProfileImage ? employee.interviewerProfileImage : 'assets/images/faces/18.png'
                    };
                }
            });

            const flags = [];
            const output = [];
            const l = resourceValues.length;
            let i;
            for (i = 0; i < l; i++) {
                if (resourceValues) {
                    if (flags[resourceValues[i].id]) { continue; }
                    flags[resourceValues[i].id] = true;
                    output.push(resourceValues[i]);
                }
            }

            this.resources = [...output];
        }
    }

    addResource() {
        const resource = {
            id: Guid.create().toString(),
            name: 'Praveen 1',
            department: 'Depart 1',
            role: 'role 1',
            type: 'no shift',
            imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
            href: this.goToUserProfile
        };
        this.resources.push(resource);
    }


    goToUserProfile(selectedUserId) {
        this.router.navigate(['dashboard/profile', selectedUserId, 'overview']);
    }
    openJoBCandidate(event) {
        const dialogId = 'app-candidateview';
        const dialogRef = this.dialog.open(CandidateViewComponent, {
            disableClose: true,
            id: dialogId,
            direction: 'ltr',
            width: '1800px', height: '90%',
            data: { job: event, candidate: event, dialogId },
            panelClass: 'userstory-dialog-scroll'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.success) {
                if (result.isArchived) {
                    this.candidateArchived.emit(true);
                }
                //   this.getBrytumViewJobDetails();
                console.log('The dialog was closed');
            }
        });

    }


    convertUtcToLocal(inputTime) {
        if (inputTime == null || inputTime === '') {
            return null;
        }

        const dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) !== 'string') {
            const formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment(formatted).format()).local();
        }
        if (typeof (inputTime) === 'string') {
            const current = new Date();
            const timeSplit = inputTime.toString().split(':');
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            const formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment(formatted).format()).local();
        }
    }
}
