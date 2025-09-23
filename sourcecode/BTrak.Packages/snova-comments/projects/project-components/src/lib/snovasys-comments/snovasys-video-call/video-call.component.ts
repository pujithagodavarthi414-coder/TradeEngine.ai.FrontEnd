import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy, Inject, ViewContainerRef } from '@angular/core';
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
import { BandwidthProfileMode, connect, createLocalTracks, createLocalVideoTrack, NetworkQualityConfiguration, Track, VP8CodecSettings } from "twilio-video";
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RoomModel } from '../models/roomModel';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../models/localstorage-properties';
// const Device = require('twilio-client').Device;
// const Connect = require('twilio-video');

// declare const Twilio: any;

@Component({
    selector: 'snova-video-call',
    templateUrl: './video-call.component.html',
    styleUrls: ['./video-call.component.scss']
})

export class VideoCallComponent implements OnInit, OnDestroy, VP8CodecSettings {
    @Output() afterClosed = new EventEmitter<any>();
    @ViewChild("closeVideoCallPopover", { static: true }) closeVideoCallPopover: any;

    device: any;
    connection: any;
    isRoomConnected: boolean;
    connectedRoom: any;
    componentModel: ComponentModel
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    roomData: any;
    id: any;
    injector: any;
    roomName: any;
    isInprogress: boolean = true;
    videoMode: BandwidthProfileMode = 'grid';
    dominantSpeakerPriority: Track.Priority = 'standard';
    networkQuality: NetworkQualityConfiguration;
    isHost: boolean;
    roomDetails: any;
    currentUserId: string;
    savingInProgress: boolean;
    isMicrophone: boolean;
    isVideo: boolean;
    userName: string;
    isVideoHide: boolean;
    isTrackHandled: boolean;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.roomData = this.matData.data;
                this.roomName = this.roomData.roomName;
                this.cdRef.detectChanges();
                this.initiateBrowserCall();
            }
        }
    }


    ngOnDestroy(): void {

    }

    ngOnInit(): void {
        // this.getTwilioToken();
        this.injector = this.vcr.injector;
        this.networkQuality.local = 1;
        this.networkQuality.remote = 1;
    }

    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<VideoCallComponent>,
        private cdRef: ChangeDetectorRef, private callService: CallService, private toastr: ToastrService, private vcr: ViewContainerRef,
        private translateService: TranslateService, private cookieService: CookieService) {
        if (Object.keys(data).length) {
            this.roomData = data.data;

            if (data.dialogId) {
                this.currentDialogId = this.data.dialogId;
                this.id = setTimeout(() => {
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                }, 1200)
            }
            this.initiateBrowserCall();
        }

    }
    codec: any = 'VP8';
    simulcast?: boolean = true;

    getTwilioToken() {
        let localConnectedRoom = this;
        var roomInputModel = new RoomModel();
        roomInputModel.name = this.roomData.roomName;
        roomInputModel.receiverId = this.roomData.receiverId;
        roomInputModel.participantName = this.roomData.participantName;
        this.userName = this.roomData.participantName;
        this.callService.GetVideoCallToken(this.roomData.componentModel, roomInputModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response && response.data && response.data != null && response.data != "completed") {
                    var data =  response.data;
                    this.roomDetails = data;
                    this.isInprogress = true;
                    if(data.createdByUserId == this.currentUserId){
                        this.isHost = true;
                    } else {
                        this.isHost = false;
                    }
                    this.connectToRoom(data.token);
                } else if (response && response.data && response.data != null && response.data == "completed") {
                    this.isInprogress = false;
                }
            }
        });
    }

    getTwilioTokenForParticipant() {
        var roomInputModel = new RoomModel();
        roomInputModel.name = this.roomData.roomName;
        roomInputModel.receiverId = this.roomData.receiverId;
        roomInputModel.participantName = this.roomData.participantName;
        this.userName = this.roomData.participantName;
        this.callService.GetVideoCallTokenForParticipant(roomInputModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response && response.data && response.data != null && response.data != "completed") {
                    this.isInprogress = true;
                    this.connectToRoom(response.data);
                } else if (response && response.data && response.data != null && response.data == "completed") {
                    this.isInprogress = false;
                }
            }
        });
    }

    connectToRoom(token) {
        this.isMicrophone = true;
        this.isVideo = true;
        let localConnectedRoom = this;
        // var params = { audio: true, name: this.roomData.roomName, video: { width: 10, height: 10 } };
        var params = { audio: true, name: this.roomData.roomName, video: { height: 720, frameRate: 24},
            bandwidthProfile:{ 
                video: { 
                        maxTracks: 10,
                        mode: this.videoMode,
                        dominantSpeakerPriority: this.dominantSpeakerPriority, 
                        maxSubscriptionBitrate: 2500000,
                        renderDimensions: {
                        high: {height:1080, width:1920},
                        standard: {height:720, width:1280},
                        low: {height:176, width:144}
                    }
                }
            },
            //For multiparty rooms (participants>=3)
            preferredVideoCodecs: [{ codec: this.codec, simulcast: this.simulcast }],
            networkQuality: this.networkQuality
        };
        this.cdRef.detectChanges();
        this.device = connect(token, params);

        this.device.then(room => {
            localConnectedRoom.connectedRoom = room;
            localConnectedRoom.isRoomConnected = true;
            createLocalVideoTrack().then(track => {
                const localMediaContainer = document.getElementById('localmedia');
                localMediaContainer.appendChild(track.attach()).style.width="150px";
                // document.getElementById('localmedia').children[0]
            });
            console.log('Connected to Room "%s"', room.name);

            // room.participants.forEach(this.participantConnected);

            // room.on('participantConnected', this.participantConnected);

            // room.on('participantDisconnected', this.participantDisconnected);
            // room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));

            //    room.on('disconnected', room => {
            //         // Detach the local media elements
            //         room.localParticipant.tracks.forEach(publication => {
            //             const attachedElements = publication.track.detach();
            //             attachedElements.forEach(element => element.remove());
            //         });
            //         })

            room.once('participantConnected', participant => {
                console.log(`Participant "${participant.identity}" has connected to the Room`);
            });
              
              // Log Participants as they disconnect from the Room
            room.once('participantDisconnected', participant => {
                this.getRoomStatus();
                console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                // var removeList = document.getElementById('remote-media-div');
                // if (removeList.hasChildNodes()) {
                //     removeList.remove();
                //     // removeList.removeChild(removeList.childNodes[0]);
                // }

                // room.participants.forEach(participant => {
                //     participant.tracks.forEach(publication => {
                //         if (publication.track) {
                //             document.getElementById('remote-media-div').appendChild(publication.track.attach()).style.width="175px";
                //         }
                //     });
    
                //     participant.on('trackSubscribed', track => {
                //         document.getElementById('remote-media-div').appendChild(track.attach()).style.width="180px"; // binds remote participant audio and video
                //     });
                // });
            });

            room.on('participantConnected', participant => {
                console.log(`Participant "${participant.identity}" connected`);

                participant.tracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        const track = publication.track;
                        if(!document.getElementById('remote-media-div')){
                            document.createElement('div').setAttribute("id", "remote-media-div");
                        }
                        document.getElementById('remote-media-div').appendChild(track.attach()); //.style.width="160px";
                        // for remote mute events
                        this.handleTrackDisabled(publication.track);
                        this.handleTrackEnabled(publication.track);
                    }
                    if (publication.track) {
                        document.getElementById('remote-media-div').appendChild(publication.track.attach()); //.style.width="165px";
                    }

                    publication.on('unsubscribed', this.handleTrackDisabled);
                    publication.on('subscribed', this.handleTrackEnabled);

                    publication.on('unsubscribed', () => {
                        /* Hide the associated <video> element and show an avatar image. */
                    });

                    publication.on('subscribed', () => {
                        /* Hide the avatar image and show the associated <video> element. */
                    });
                });

                participant.on('trackSubscribed', track => {
                    if(!document.getElementById('remote-media-div')){
                        document.createElement('div').setAttribute("id", "remote-media-div");
                    }
                    if(this.isVideoHide){
                        this.isVideoHide = false;
                        this.isTrackHandled = false;
                        var removeList = document.getElementById('remote-media-div');
                        if (removeList.hasChildNodes()) {
                            // removeList.remove();
                            var childListLength = removeList.childElementCount;
                            for(var i=0; i < childListLength; i++){
                                removeList.removeChild(removeList.childNodes[0]); 
                            }
                        }
                    }
                    document.getElementById('remote-media-div').appendChild(track.attach()); //.style.width="170px";
                });

                participant.on('trackUnsubscribed', track => {
                    var iden = participant;
                    // console.log(iden);
                    // console.log(track);
                    this.isVideoHide = true;
                    if(!this.isTrackHandled) {
                        this.isTrackHandled = true;
                    track.detach().forEach(element => element.remove());
                        this.getRoomStatus();
                    if(iden){
                        var div = document.createElement("div");
                        div.style.width = "250px";
                        div.style.height = "250px";
                        div.style.background = "#121111d6";
                        div.style.color = "white";
                        div.style.margin = "10px";
                        div.style.fontSize = "16px";
                        div.style.textAlign = "center";
                        div.style.display = "flex";
                        div.innerHTML = iden.identity;
                        document.getElementById("remote-media-div").appendChild(div);
                    }
                    }
                    //this.handleTrackDisabled(track);
                });
            });

            room.on('participantDisconnected', participant =>{
                this.getRoomStatus();
                console.log(`Participant "${participant.identity}" disconnected`);

                var removeList = document.getElementById('remote-media-div');
                if (removeList.hasChildNodes()) {
                    // removeList.remove();
                    var childListLength = removeList.childElementCount;
                    for(var i=0; i < childListLength; i++){
                        removeList.removeChild(removeList.childNodes[0]); 
                    }
                }

                room.participants.forEach(participant => {
                    participant.tracks.forEach(publication => {
                        if (publication.track) {
                            document.getElementById('remote-media-div').appendChild(publication.track.attach()); //.style.width="175px";
                        }
                    });
    
                    participant.on('trackSubscribed', track => {
                        if(!document.getElementById('remote-media-div')){
                            document.createElement('div').setAttribute("id", "remote-media-div");
                        }
                        if(this.isVideoHide){
                            this.isVideoHide = false;
                            this.isTrackHandled = false;
                            var removeList = document.getElementById('remote-media-div');
                            if (removeList.hasChildNodes()) {
                                // removeList.remove();
                                var childListLength = removeList.childElementCount;
                                for(var i=0; i < childListLength; i++){
                                    removeList.removeChild(removeList.childNodes[0]); 
                                }
                            }
                        }
                        document.getElementById('remote-media-div').appendChild(track.attach()); //.style.width="180px"; // binds remote participant audio and video
                    });

                    participant.on('trackUnsubscribed', track => {
                        var iden = participant;
                        // console.log(iden);
                        // console.log(track);
                        this.isVideoHide = true;
                        if(!this.isTrackHandled) {
                            this.isTrackHandled = true;
                        track.detach().forEach(element => element.remove());
                            this.getRoomStatus();
                        if(iden){
                            var div = document.createElement("div");
                            div.style.width = "250px";
                            div.style.height = "250px";
                            div.style.background = "#121111d6";
                            div.style.color = "white";
                            div.style.margin = "10px";
                            div.style.fontSize = "16px";
                            div.style.textAlign = "center";
                            div.style.display = "flex";
                            div.innerHTML = iden.identity;
                            document.getElementById("remote-media-div").appendChild(div);
                        }
                        }
                    });
                });
            });

            // attaches the remote participant audio and video tha are connected
            room.participants.forEach(participant => {
                participant.tracks.forEach(publication => {
                    if (publication.track) {
                        document.getElementById('remote-media-div').appendChild(publication.track.attach()); //.style.width="175px";
                    }
                });

                participant.on('trackSubscribed', track => {
                    if(!document.getElementById('remote-media-div')){
                        document.createElement('div').setAttribute("id", "remote-media-div");
                    }
                    if(this.isVideoHide){
                        this.isVideoHide = false;
                        this.isTrackHandled = false;
                        var removeList = document.getElementById('remote-media-div');
                        if (removeList.hasChildNodes()) {
                            // removeList.remove();
                            var childListLength = removeList.childElementCount;
                            for(var i=0; i < childListLength; i++){
                                removeList.removeChild(removeList.childNodes[0]); 
                            }
                        }
                    }
                    document.getElementById('remote-media-div').appendChild(track.attach()); //.style.width="180px"; // binds remote participant audio and video
                });

                participant.on('trackUnsubscribed', track => {
                    var iden = participant;
                    // console.log(iden);
                    // console.log(track);
                    this.isVideoHide = true;
                    if(!this.isTrackHandled) {
                        this.isTrackHandled = true;
                    track.detach().forEach(element => element.remove());
                        this.getRoomStatus();
                    if(iden){
                        var div = document.createElement("div");
                        div.style.width = "250px";
                        div.style.height = "250px";
                        div.style.background = "#121111d6";
                        div.style.color = "white";
                        div.style.margin = "10px";
                        div.style.fontSize = "16px";
                        div.style.textAlign = "center";
                        div.style.display = "flex";
                        div.innerHTML = iden.identity;
                        document.getElementById("remote-media-div").appendChild(div);
                    }
                    }
                });
            });

            room.on('disconnected', room => {
                // Detach the local media elements
                room.localParticipant.tracks.forEach(publication => {
                    const attachedElements = publication.track.detach();
                    attachedElements.forEach(element => element.remove());
                });
            });
        });

    }

    handleTrackDisabled(track) {
        track.on('disabled', () => {
            /* Hide the associated <video> element and show an avatar image. */
        });
    }

    handleTrackEnabled(track) {
        track.on('enabled', () => {
            /* Hide the avatar image and show the associated <video> element. */
        });
    }

    initiateBrowserCall() {
        var currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
        if (currentUser != null && currentUser != undefined && currentUser != "") {
            this.getTwilioToken();
        } else {
            this.getTwilioTokenForParticipant();
        }
        // this.isRoomConnected = true;
    }

    disConnectFromRoom() {
        this.connectedRoom.on('disconnected', room => {
            // Detach the local media elements
            room.localParticipant.tracks.forEach(publication => {
                const attachedElements = publication.track.detach();
                attachedElements.forEach(element => element.remove());
            });
        });

        // To disconnect from a Room
        this.connectedRoom.disconnect();
    }

    muteAudio() {
        this.connectedRoom.localParticipant.audioTracks.forEach(publication => {
            publication.track.disable();
        });
        this.isMicrophone = false;
        this.cdRef.detectChanges();
    }

    muteVideo() {
        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.disable();
        });

        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.stop();
            publication.unpublish();
        });
        this.isVideo = false;
        this.cdRef.detectChanges();
    }

    unmuteAudio() {
        this.connectedRoom.localParticipant.audioTracks.forEach(publication => {
            publication.track.enable();
        });
        this.isMicrophone = true;
        this.cdRef.detectChanges();
    }

    unmuteVideo() {
        this.connectedRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.enable();
        });

        createLocalVideoTrack().then(localVideoTrack => {
            return this.connectedRoom.localParticipant.publishTrack(localVideoTrack);
        }).then(publication => {
            console.log('Successfully unmuted your video:', publication);
        });
        this.isVideo = true;
        this.cdRef.detectChanges();
    }

    closeDialog() {
        if(this.isRoomConnected){
            this.closeVideoCallPopover.open();
        } else {
            if (this.currentDialog) this.currentDialog.close({ success: true });
        }
    }

    confirmClose() {
        if(this.connectedRoom) {
            this.disConnectFromRoom();
        }
        this.closeVideoCallPopover.close();
        if (this.currentDialog) this.currentDialog.close({ success: true });
    }

    endRoomAndDisconnect(){
        if(this.connectedRoom) {
            this.endRoom();
        } else {
            this.closeVideoCallPopover.close();
            if (this.currentDialog) this.currentDialog.close({ success: true });
        }
    }

    endRoom(){
        this.savingInProgress = true;
        var roomInput = new RoomModel();
        roomInput.name = this.roomData.roomName;
        roomInput.receiverId = this.roomData.receiverId;
        roomInput.id = this.roomDetails.id;
        roomInput.roomSid = this.roomDetails.roomSid;
        roomInput.status = "completed";
        this.callService.createRoom(this.roomData.componentModel, roomInput).subscribe((response: any) => {
            if(response && response.data){
                this.toastr.success("The room "+ this.roomData.roomName + " ended successfully");
                this.closeVideoCallPopover.close();
                if (this.currentDialog) this.currentDialog.close({ success: true });
            }
            this.savingInProgress = false;
            this.cdRef.detectChanges();
        });
    }

    cancelClose() {
        this.closeVideoCallPopover.close();
    }

    getRoomStatus() {
        var roomInput = new RoomModel();
        roomInput.name = this.roomData.roomName;
        roomInput.receiverId = this.roomData.receiverId;
        roomInput.id = this.roomDetails.id;
        roomInput.roomSid = this.roomDetails.roomSid;
        this.callService.GetVideoCallRoomStatus(roomInput).subscribe((response: any) => {
            if(response && response.data){
                if(response.data == "in-progress" || response.data == null) {

                } else {
                    this.toastr.success("The room "+ this.roomData.roomName + " ended");
                    this.closeVideoCallPopover.close();
                    if (this.currentDialog) this.currentDialog.close({ success: true });
                }
            }
            this.savingInProgress = false;
            this.cdRef.detectChanges();
        });
    }
}