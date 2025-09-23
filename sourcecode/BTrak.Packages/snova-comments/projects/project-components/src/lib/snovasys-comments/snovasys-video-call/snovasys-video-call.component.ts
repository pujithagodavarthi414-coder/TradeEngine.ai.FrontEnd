import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy, TemplateRef } from '@angular/core';
import { CallLogModel } from '../models/callLogModel';
import { UserMiniModel } from '../models/userMiniModel';
import { timer } from 'rxjs';
import { CallService } from '../services/call.service';
import { ComponentModel } from '../models/componentModel';
import { CallOutcome } from '../models/callOutcomeModel';
import { CallResource } from '../models/callResource';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Twilio, Device  } from "twilio-client/dist/twilio.min";
import { connect, createLocalTracks, createLocalVideoTrack } from "twilio-video";
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RoomModel } from '../models/roomModel';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// const Device = require('twilio-client').Device;
// const Connect = require('twilio-video');

// declare const Twilio: any;

@Component({
    selector: 'snovasys-video-call',
    templateUrl: './snovasys-video-call.component.html',
    styleUrls: ['./snovasys-video-call.component.scss']
})

export class SnovasysVideoCallComponent implements OnInit, OnDestroy {
    @ViewChild("createRoomPopover", { static: true }) createRoomPopover: any;
    @ViewChild("joinRoomPopOver", { static: true }) joinRoomPopOver: any;
    @ViewChild("createRoomFormDirective", { static: true }) createRoomFormDirective : FormGroupDirective;
    @ViewChild("joinRoomFormDirective", { static: true }) joinRoomFormDirective : FormGroupDirective;
    @ViewChild("videoCallDialog", { static: true }) private videoCallDialog: TemplateRef<any>;
    @ViewChild("videoCallPlayDialog", { static: true }) private videoCallPlayDialog: TemplateRef<any>;
    @ViewChild("videoPlayer") videoplayer: ElementRef;
    @ViewChild("joinRoomOnlyPopOver", { static: true }) joinRoomOnlyPopOver: any;
    @ViewChild("joinRoomOnlyFormDirective", { static: true }) joinRoomOnlyFormDirective: FormGroupDirective;

    createRoomForm: FormGroup;
    joinRoomForm: FormGroup;
    joinRoomOnlyForm: FormGroup;

    savingInProgress: boolean;
    device: any;
    connection: any;
    isRoomConnected: boolean;
    connectedRoom: any;
    roomName: any;
    participantName: any;
    isAnyOperationsInprogress: boolean;
    videoCallLogs: any = [];
    joiningParticipantName: string = "";
    enableJoin: boolean = false;
    anyOperationInProgress: boolean;

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
    set _isMobileNuberOnly(data: any){
        this.isMobileNuberOnly = data;
    }

    mobileNumber
    @Input('mobileNumber')
    set _mobileNumber(data: any){
        this.mobileNumber = data;
    }

    @Input() canCreateRoom: boolean;
    canViewVideoLog: boolean;
    @Input('canViewVideoLog')
    set _canViewVideoLog(data: any){
        this.canViewVideoLog = data;
        if(this.canViewVideoLog){
            this.getCallLogDetails();
        }
    }

    isVideoCallFromPopup
    @Input('isVideoCallFromPopup')
    set _isVideoCallFromPopup(data: any){
        this.isVideoCallFromPopup = data;
    }

    canJoinRoomOnly: boolean;
    @Input('canJoinRoomOnly')
    set _canJoinRoomOnly(data: any){
        this.canJoinRoomOnly = data;
    }

    constructor(private cdRef: ChangeDetectorRef, private callService: CallService, private toastr: ToastrService,
        private translateService: TranslateService, public dialog: MatDialog, private router: Router) {

    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {
        this.formValidate();
        if(this.canViewVideoLog){
            this.getCallLogDetails();
        }
        // this.getTwilioToken();
    }

    formValidate(){
        this.createRoomForm = new FormGroup({
            roomName: new FormControl(null, Validators.compose([
                Validators.required
              ]))
          });
        
        this.joinRoomForm = new FormGroup({
        roomName: new FormControl(null, Validators.compose([
            Validators.required
            ])),
        participantName: new FormControl(null, Validators.compose([
            Validators.required
            ]))
        });

        this.joinRoomOnlyForm = new FormGroup({
            roomName: new FormControl(null, Validators.compose([
                Validators.required
                ]))
            });
    }

    getTwilioToken() {
        this.callService.GetCallToken(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.joinRoomPopOver.close();
                var params = { audio: true, name: this.joinRoomForm.value.roomName, video: { width: 640, height: 300 }};
                this.device = connect(response.data, params);
                // { "From": this.fromCallee, "To": this.toCaller, "IsRecord": true, "Url": "http://demo.twilio.com/docs/voice.xml" };
                // let connection = this.device.connect(params);

                //console.log(connection);
                this.isRoomConnected= true;
                this.cdRef.detectChanges();
                this.device.then(room => {
                    this.connectedRoom = room;
                    console.log('Connected to Room "%s"', room.name);
                    
                    room.participants.forEach(this.participantConnected);
                    room.on('participantConnected', this.participantConnected);
                    
                    room.on('participantDisconnected', this.participantDisconnected);
                    room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));

                    room.on('disconnected', room => {
                        // Detach the local media elements
                        room.localParticipant.tracks.forEach(publication => {
                          const attachedElements = publication.track.detach();
                          attachedElements.forEach(element => element.remove());
                        });
                      });
                    });

                    createLocalVideoTrack().then(track => {
                        const localMediaContainer = document.getElementById('localmedia');
                        localMediaContainer.appendChild(track.attach());
                      });
                // this.setupHandlers();
            }
        });
    }

    setupHandlers(){
        let localDevice = this;
        this.device.on('ready', (ready) => {

        })
            .on('participantConnected', function (connection) {
                localDevice.connection = connection;
            })
            .on('participantDisconnected', function (connection) {
                localDevice.connection = connection;
            })
            .once('participantConnected', function (connection) {
                // localDevice.connection = connection;
            })
            .once('participantDisconnected', function (connection) {
                // localDevice.connection = connection;
            })
            .on('error', function (connection) {
                localDevice.connection = connection;
                this.isRoomConnected = false;
            });
            
            // room.once('participantConnected', participant => {
            //     console.log(`Participant "${participant.identity}" has connected to the Room`);
            //   });
              
              
            //   room.once('participantDisconnected', participant => {
            //     console.log(`Participant "${participant.identity}" has disconnected from the Room`);
            //   });
    }

    openCreteRoom(){
        this.createRoomPopover.open();
    }

    openJoinRoom() {
        this.joinRoomFormDirective.resetForm();
        this.formValidate();
        this.joinRoomPopOver.open();
    }

    closeCeateRoomPopup(formDirective: FormGroupDirective){
        formDirective.resetForm();
        this.formValidate();
        this.createRoomPopover.close();
    }

    closeJoinRoom(formDirective: FormGroupDirective){
        formDirective.resetForm();
        this.joinRoomPopOver.close();
    }

    closeJoiningRoom(){
        this.joinRoomFormDirective.resetForm();
        this.formValidate();
        this.joinRoomPopOver.close();
    }

    createRoom(formDirective: FormGroupDirective){
        this.savingInProgress = true;
        var roomInput = new RoomModel();
        roomInput.id = null;
        roomInput.name = this.createRoomForm.value.roomName;
        roomInput.receiverId = this.receiverId;
        this.callService.createRoom(this.componentModel, roomInput).subscribe((response: any) => {
            if(response && response.data){
                this.toastr.success("The room "+ response.data.unique_name + " created successfully");
            }
            this.savingInProgress = false;
            formDirective.resetForm();
            this.formValidate();
            this.joinRoomPopOver.close();
            this.cdRef.detectChanges();
        });
    }

    joinRoom(formDirective: FormGroupDirective){
        // this.initiateBrowserCall();

        let dialogId = "video-call-dialog";
        this.roomName = this.joinRoomForm.value.roomName;
        this.participantName = this.joinRoomForm.value.participantName;
        const dialogRef = this.dialog.open(this.videoCallDialog, {
        height: "90vh",
        width: "80%",
        direction: 'ltr',
        id: dialogId,
        data: { data: this, dialogId: dialogId },
        disableClose: true,
        panelClass: 'userstory-dialog-scroll'
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.success) {
            formDirective.resetForm();
            this.formValidate();
            this.joinRoomPopOver.close();
            this.getCallLogDetails();
        }
      });
    }

    joinRoomByName(){
        let dialogId = "video-call-particpant-dialog";
        this.roomName = this.mobileNumber;
        this.participantName = this.joiningParticipantName;
        const dialogRef = this.dialog.open(this.videoCallDialog, {
        height: "90vh",
        width: "80%",
        direction: 'ltr',
        id: dialogId,
        data: { data: this, dialogId: dialogId },
        disableClose: true,
        panelClass: 'userstory-dialog-scroll'
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.success) {
            this.joiningParticipantName = null;
        }
      });
    }

    initiateBrowserCall() {
        this.getTwilioToken();
        // var params = { audio: true, name: this.joinRoomForm.value.roomName, video: { width: 640, height: 300 }};
        // // { "From": this.fromCallee, "To": this.toCaller, "IsRecord": true, "Url": "http://demo.twilio.com/docs/voice.xml" };
        // // let connection = this.device.connect(params);

        // //console.log(connection);
        // this.device.connect(params).then(room => {
        //     console.log('Connected to Room "%s"', room.name);
          
        //     room.participants.forEach(this.participantConnected);
        //     room.on('participantConnected', this.participantConnected);
          
        //     room.on('participantDisconnected', this.participantDisconnected);
        //     room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));
        //   });
    }

    participantConnected(participant) {
        console.log('Participant "%s" connected', participant.identity);
      
        const div = document.createElement('div');
        div.id = participant.sid;
        div.innerText = participant.identity;
      
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              this.trackSubscribed(div, publication.track);
            }
          });
          
        participant.on('trackSubscribed', track => this.trackSubscribed(div, track));
        participant.on('trackUnsubscribed', this.trackUnsubscribed);
      
        document.body.appendChild(div);
      }
      
    participantDisconnected(participant) {
        console.log('Participant "%s" disconnected', participant.identity);
        document.getElementById(participant.sid).remove();
      }
      
    trackSubscribed(div, track) {
        div.appendChild(track.attach());
      }
      
    trackUnsubscribed(track) {
        track.detach().forEach(element => element.remove());
      }

    disConnectFromRoom(){
        this.device.destroy();
        this.connectedRoom.disconnect();
    }

    muteAudio(){
        this.connectedRoom.localParticipant.audioTracks.forEach(publication => {
            publication.track.disable();
          });
    }

    muteVideo(){
        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.disable();
          });

        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.stop();
            publication.unpublish();
        });
    }

    unmuteAudio(){
        this.connectedRoom.localParticipant.audioTracks.forEach(publication => {
            publication.track.enable();
          });
    }

    unmuteVideo(){
        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.enable();
          });

        createLocalVideoTrack().then(localVideoTrack => {
            return this.connectedRoom.localParticipant.publishTrack(localVideoTrack);
            }).then(publication => {
            console.log('Successfully unmuted your video:', publication);
        });
    }

    toggleVideo(event: any) {
        this.videoplayer.nativeElement.play();
      }
    
    onVideoPlay(value){
        let dialogId = "video-call-play-dialog";
        const dialogRef = this.dialog.open(this.videoCallPlayDialog, {
        //height: "90vh",
        width: "auto",
        direction: 'ltr',
        id: dialogId,
        data: { data: value, dialogId: dialogId },
        disableClose: true,
        panelClass: 'userstory-dialog-scroll'
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.success) {

        }
      });
    }

    goToProfile(userId: string) {

    }

    joiningParticipantNameChange(){
        if(this.joiningParticipantName.length > 0){
            this.enableJoin = true;
        } else {
            this.enableJoin = false;
        }
    }

    getCallLogDetails() {
        var roomModel = new RoomModel();
        roomModel.receiverId = this.receiverId;
        this.isAnyOperationsInprogress = true;
        this.callService.SearchVideoCallLog(this.componentModel, roomModel).subscribe((response: any) => {
            if (response && response.data && response.data.length > 0) {
                this.videoCallLogs = response.data;
            } else{
                this.videoCallLogs = [];
            }
            this.isAnyOperationsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    openJoinRoomOnly() {
        this.joinRoomOnlyFormDirective.resetForm();
        this.formValidate();
        this.joinRoomOnlyPopOver.open();
    }

    joinRoomOnly(formDirective: FormGroupDirective){
        var value = this.joinRoomOnlyForm.value.roomName;
        var roomInputModel = new RoomModel();
        roomInputModel.name = value;
        this.callService.GetVideoCallTokenForParticipant(roomInputModel).subscribe((response: any) => {
            if (response.success == true) {
                if(response.data ==  null) {
                    this.toastr.error(""+this.translateService.instant('CRM.INVALIDROOMERROR'));
                } else {
                    if(response.data == "completed") {
                        this.toastr.warning(""+ this.translateService.instant('CRM.VIDEOCALLCOMPLETEERROR'));
                    } else {
                        this.openInNewTab(value);
                    }
                }
            } else {

            }
            formDirective.resetForm();
            this.formValidate();
            this.joinRoomOnlyPopOver.close();
        });
    }

    closeJoinRoomOnly(formDirective: FormGroupDirective){
        formDirective.resetForm();
        this.formValidate();
        this.joinRoomOnlyPopOver.close();
    }

    closeJoiningRoomOnly(){
        this.joinRoomOnlyFormDirective.resetForm();
        this.formValidate();
        this.joinRoomOnlyPopOver.close();
    }

    openInNewTab(value) {
        const angularRoute = this.router.url;
        const url = window.location.href;
        var redirectionUrl = url.replace(angularRoute, '');
        redirectionUrl = redirectionUrl + "/application/joincall/" + value + "/" + this.receiverId;
        window.open(redirectionUrl, "_blank");
      }
}