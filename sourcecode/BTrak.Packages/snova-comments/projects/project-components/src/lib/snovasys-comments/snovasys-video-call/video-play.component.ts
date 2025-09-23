import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy, TemplateRef, ViewContainerRef, Inject } from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
// const Device = require('twilio-client').Device;
// const Connect = require('twilio-video');

// declare const Twilio: any;

@Component({
    selector: 'snovasys-video-call-play',
    templateUrl: './video-play.component.html'
})

export class SnovasysVideoPlayComponent implements OnInit, OnDestroy {
    @ViewChild("videoPlayer", { static: true }) videoplayer: ElementRef;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.videoLink = this.matData.data;
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.cdRef.detectChanges();
                this.videoplayer.nativeElement.play();
            }
        }
    }

    matData: any;
    currentDialogId: any;
    currentDialog: any;
    injector: any;
    videoLink: any;
    id: any;

    ngOnDestroy(): void {

    }

    ngOnInit(): void {
        this.injector = this.vcr.injector;
    }

    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SnovasysVideoPlayComponent>,
        private cdRef: ChangeDetectorRef, private callService: CallService, private toastr: ToastrService, private vcr: ViewContainerRef,
        private translateService: TranslateService, private cookieService: CookieService) {
            if (Object.keys(data).length) {
                if(data.data){
                    this.videoLink = this.data.data;
                }
                if (data.dialogId) {
                    this.currentDialogId = this.data.dialogId;
                    this.id = setTimeout(() => {
                        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                    }, 1200)
                }
            }
    }

    toggleVideo() {
        this.videoplayer.nativeElement.play();
    }

    closeDialog(){
        if (this.currentDialog) this.currentDialog.close({ success: true });
    }
}