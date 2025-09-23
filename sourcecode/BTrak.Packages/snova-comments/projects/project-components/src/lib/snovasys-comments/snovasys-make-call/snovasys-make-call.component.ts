import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CallLogModel } from '../models/callLogModel';
import { UserMiniModel } from '../models/userMiniModel';
import { timer } from 'rxjs';
import { CallService } from '../services/call.service';
import { ComponentModel } from '../models/componentModel';
import { CallOutcome } from '../models/callOutcomeModel';
import { CallResource } from '../models/callResource';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Twilio, Device } from "twilio-client/dist/twilio.min";
// const Device = require('twilio-client').Device;

// declare const Twilio: any;

@Component({
    selector: 'snovasys-make-call',
    templateUrl: './snovasys-make-call.component.html',
    styleUrls: ['./snovasys-make-call.component.scss'],
    inputs: ['receiverId', 'componentModel', 'isPermissionExists']
})

export class SnovasysCallsComponent implements OnInit, OnDestroy {
    @ViewChild('audioOption') audioPlayerRef: ElementRef;

    callLogs: CallLogModel[] = [];
    isPlaying: boolean = false;
    subscribeTimer: any;
    interval: any;
    secondCounter: number = 0;
    minuteCounter: number = 0;
    hourCounter: number = 0;
    isCallStarted: boolean = false;
    callerList: any = [];
    calleeList: any = [];
    toCaller: string;
    fromCallee: string;
    callOutcomes: CallOutcome;
    callResource: CallResource;
    device: any;
    connection: any;
    isDisconnecting: boolean = false;
    componentModel
    @Input('componentModel')
    set _componentModel(data: ComponentModel) {
        this.componentModel = data;
        this.componentModel.callBackFunction(this.componentModel.parentComponent);
    }
    receiverId
    @Input('receiverId')
    set _receiverId(data: string) {
        this.receiverId = data;
    }

    @Input() isPermissionExists: boolean;

    isMobileNuberOnly
    @Input('isMobileNuberOnly')
    set _isMobileNuberOnly(data: any) {
        this.isMobileNuberOnly = data;
    }

    mobileNumber
    @Input('mobileNumber')
    set _mobileNumber(data: any) {
        this.mobileNumber = data;
    }

    @Output() closePopup = new EventEmitter<any>();
    @Output() getCallResource = new EventEmitter<any>();
    constructor(private cdRef: ChangeDetectorRef, private callService: CallService, private toastr: ToastrService,
        private translateService: TranslateService) {

    }

    ngOnDestroy(): void {
        this.endCall();
    }

    ngOnInit(): void {
        // this.callerList.push({ callerId: '+91 9000972459', callerName: "Praveen Kumar P" }, { callerId: '+91 9000972445', callerName: "Kumar P" });
        // this.calleeList.push({ calleeId: '+91 9034972459', calleeName: "Raven" }, { callerId: '+91 9026972445', callerName: "Naveen P" });

        this.getTwilioToken();
        this.getOutwardCallerId();
        // this.getListCustomersToCall();
        this.getCustomWidgets();
    }

    getCustomWidgets() {
        if (!this.isMobileNuberOnly) {
            let widgetdata = {
                isArchived: false,
                isFavouriteWidget: false,
                pageNumber: 1,
                pageSize: 16,
                sortDirectionAsc: true,
                tags: "",
                widgetId: "null",
                isQuery: true,
                searchText: "Phone Number"
            };
            this.callService.GetCustomWidgets(this.componentModel, widgetdata).subscribe((response: any) => {
                if (response && response.data) {
                    let query = response.data[0];
                    let widgetDetails = {
                        customWidgetId: query.widgetId,
                        dashboardFilters: { formId: this.receiverId },
                        isAll: true,
                        isArchived: false,
                        isMyself: false,
                        isReportingOnly: false,
                        submittedFormId: null,
                        workspaceId: null
                    }
                    this.callService.GetCustomWidgetsGridData(this.componentModel, widgetDetails).subscribe((response: any) => {
                        if (response && response.data && response.data.queryData) {
                            this.callerList = JSON.parse(response.data.queryData);
                        }
                    })

                }
                // this.callerList.push({ MobileNumber: '+919000972459', Name: "Praveen Kumar P" });
                // this.callerList.push({ MobileNumber: '+919949909336', Name: "Leela P" });
                // this.callerList.push({ MobileNumber: '+919632500314', Name: "Dheeraj" });
            })
        } else {
            var caller = this.mobileNumber.split(",");
            this.callerList.push({ MobileNumber: caller[0], Name: caller[0] });
            this.toCaller = caller[0];
        }
    }

    getTwilioToken() {
        this.callService.GetCallToken(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.device = Device.setup(response.data);
                this.setupHandlers();
            }
        });
    }

    setupHandlers() {
        let localDevice = this;
        this.device.on('ready', (ready) => {

        })
            .on('connect', function (connection) {
                localDevice.connection = connection;
            })
            .on('disconnect', function (connection) {
                localDevice.connection = connection;
                localDevice.updateCallEnd();
            })
            .on('error', function (connection) {
                localDevice.connection = connection;
                localDevice.updateCallEnd();
            });
    }

    getOutwardCallerId() {
        this.callService.GetOutwardCallerIds(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.calleeList = [...response.data];
            }
        });
    }

    getListCustomersToCall() {
        this.callService.GetListCustomersToCall(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.callerList = [...response.data];
            }
        });
    }

    callStarted() {
        this.isCallStarted = true;
        this.startTimer();
        this.initiateBrowserCall();
        // this.getCallEvents();
        // var params = { "To": "+919000972459", "IsRecord": true };
        // let connection = Twilio.Device.connect(params);
        // console.log(connection);
    }

    initiateBrowserCall() {
        var params = { "From": this.fromCallee, "To": this.toCaller, "IsRecord": true, "Url": "http://demo.twilio.com/docs/voice.xml" };
        let connection = this.device.connect(params);
        console.log(connection);
    }

    initiateApiCall() {
        let toCall;
        if (this.toCaller.includes("+")) {
            toCall = this.toCaller;
        }

        this.callService.InitiateApiCall(this.componentModel, this.fromCallee, this.toCaller).subscribe((response: any) => {
            if (response && response.data) {
                this.callResource = response.data;
                this.getCallResource.emit(this.callResource);
            }
            if (response && response.apiResponseMessages) {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.endCall();
            }
        })
    }

    endApiCall(callSid: string) {
        if (callSid) {
            let data = { callPathSID: callSid, callFrom: this.fromCallee, callTo: this.toCaller };
            this.callService.EndApiCall(this.componentModel, data).subscribe((response: any) => {
                this.isDisconnecting = false;
                if (response && response.data) {
                    this.device.destroy();
                    this.callResource = response.data;
                    this.isCallStarted = false;
                    this.stopTimer();
                    this.closePopup.emit(this.callResource);
                }
            })
        }
    }

    endCall() {
        this.device.disconnectAll();
    }

    updateCallEnd() {
        if (!this.isDisconnecting) {
            this.isDisconnecting = true;
            if (this.connection && this.connection.parameters.CallSid) {
                this.endApiCall(this.connection.parameters.CallSid);
            }
            else {
                this.isCallStarted = false;
                this.closePopup.emit(this.callResource);
                this.stopTimer();
                // this.device.destroy();
            }
        }
    }

    getCallEvents() {
        this.callService.GetCallActiveEvents().subscribe((response) => {
            console.log(response);
        });
    }

    statusCheck() {
        this.callService.GetStatusCheck(this.componentModel, this.callResource.sid).subscribe((response: any) => {
            if (response && response.data) {
                if (response.data.status != "queued" && response.data.status != "ringing" && response.data.status != "in-progress") {
                    this.endCall();
                }
            }
        });
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.callResource) {
                this.statusCheck();
            }
            if (this.secondCounter == 60) {
                this.minuteCounter++;
                this.secondCounter = 0;
                if (this.minuteCounter == 60) {
                    this.hourCounter++;
                }
            } else {
                this.secondCounter++;
            }
            this.cdRef.detectChanges();
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.interval);
        this.hourCounter = 0;
        this.minuteCounter = 0;
        this.secondCounter = 0;
        this.cdRef.detectChanges();
    }

    triggerChange(event, callType) {

    }

}
