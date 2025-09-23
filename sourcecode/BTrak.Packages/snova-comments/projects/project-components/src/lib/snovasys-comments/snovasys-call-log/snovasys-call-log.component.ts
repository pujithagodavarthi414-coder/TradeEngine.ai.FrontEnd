import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { CallLogModel } from '../models/callLogModel';
import { UserMiniModel } from '../models/userMiniModel';
import { ComponentModel } from '../models/componentModel';
import { CallService } from '../services/call.service';
import { CallResource } from '../models/callResource';

@Component({
    selector: 'snovasys-call-log',
    templateUrl: './snovasys-call-log.component.html',
    styleUrls: ['./snovasys-call-log.component.scss'],
    inputs: ['receiverId', 'componentModel', 'isPermissionExists', 'isMobileNuberOnly']
})

export class SnovasysCallLogsComponent implements OnInit {
    @ViewChild('audioOption') audioPlayerRef: ElementRef;
    @ViewChild("callingPopOver", { static: true }) callingPopOver: any;
    @ViewChild("callLogPopOver", { static: true }) callLogPopOver: any;

    receiverId
    @Input('receiverId')
    set _receiverId(data: string) {
        this.receiverId = data;
    }

    componentModel
    @Input('componentModel')
    set _componentModel(data: ComponentModel) {
        this.componentModel = data;
        console.log(this.componentModel);
        this.componentModel.callBackFunction(this.componentModel.parentComponent);
    }

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

    @Input() isPermissionExists: boolean;

    callLogs: any = [];
    isPlaying: boolean = false;
    isPermissionExistsOnClick: boolean = false;
    activateCall: boolean = false;
    activateCallLog: boolean = false;
    callResource: CallResource;
    anyOperationInProgress: boolean = false;

    constructor(private cdRef: ChangeDetectorRef, private callService: CallService) {

    }

    ngOnInit(): void {
        this.getCallLogDetails();
    }

    logCall(isFromCall) {
        if (!isFromCall) {
            this.callResource = null;
        }
        this.activateCallLog = true;
        this.isPermissionExistsOnClick = true;
        this.callLogPopOver.open();
    }

    makeCall() {
        this.activateCall = true;
        this.callResource = null;
        this.callingPopOver.open();
    }

    closeLogPopUp(event) {
        if (event) {
            this.getCallLogDetails();
        }
        this.activateCallLog = false;
        this.isPermissionExistsOnClick = false;
        this.callLogPopOver.close();
    }

    closeCallPopUp(event) {
        this.activateCall = false;
        if (event) {
            this.callResource = event;
            this.callingPopOver.close();
            this.logCall(true);
            this.statusCheck();
        } else {
            this.callingPopOver.close();
        }
    }

    statusCheck() {
        if (this.callResource.status == 'initiated' || this.callResource.status == 'ringing' || this.callResource.status == 'answered') {
            this.callService.EndApiCall(this.componentModel, this.callResource.sid).subscribe((response: any) => {
                if (response && response.data) {
                    this.callResource = response.data;
                }
            })
        }
    }

    getCallResource(resource) {
        this.callResource = resource;
    }

    getCallLogDetails() {
        this.anyOperationInProgress = true;
        this.callService.GetCallLogs(this.componentModel, this.receiverId).subscribe((response: any) => {
            this.anyOperationInProgress = false;
            if (response && response.data && response.data.length > 0) {
                this.callLogs = response.data.filter(x => x.callFeedbackId != null);
            }
        });
    }

    goToProfile(userId: string) {

    }

    onAudioPlay() {
        this.isPlaying = true;
    }


}
