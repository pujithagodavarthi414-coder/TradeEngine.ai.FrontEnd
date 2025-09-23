import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CallLogModel } from '../models/callLogModel';
import { UserMiniModel } from '../models/userMiniModel';
import { timer } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CallService } from '../services/call.service';
import { ComponentModel } from '../models/componentModel';
import { CallOutcome } from '../models/callOutcomeModel';
import { CallResource } from '../models/callResource';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'snovasys-log-call',
    templateUrl: './snovasys-log-call.component.html',
    styleUrls: ['./snovasys-log-call.component.scss']
})

export class SnovasysLogCallsComponent implements OnInit {
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
    logCallFormGroup: FormGroup;
    isEnabled: boolean = false;
    isCommentsTextValidation: boolean = false;
    isButtonDisabled: boolean = false;
    maxDate: Date = new Date();
    callOutcomeList: CallOutcome;
    isAnyOperationIsInProgress: boolean;
    receiverId
    @Input('receiverId')
    set _receiverId(data: string) {
        this.receiverId = data;
    }

    @Input() isPermissionExists: boolean;

    componentModel
    @Input('componentModel')
    set _componentModel(data: ComponentModel) {
        this.componentModel = data;
        this.componentModel.callBackFunction(this.componentModel.parentComponent);
    }

    callResource
    @Input('callResource')
    set _callResource(data: CallResource) {
        if (data) {
            this.callResource = data;
        }
    }

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

    @Output() closePopup = new EventEmitter<any>();

    public initSettings = {
        plugins: 'lists advlist,wordcount,powerpaste',
        powerpaste_allow_local_images: true,
        powerpaste_word_import: 'prompt',
        powerpaste_html_import: 'prompt',
        toolbar: 'undo redo | bold italic | bullist numlist outdent indent| charactercount | link image code',
        menubar: false,
        statusbar: false,
    };

    constructor(private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder, private callService: CallService,
        private toastr: ToastrService, private translateService: TranslateService) {
        // this.callerList.push({ callerId: '+91 9000972459', callerName: "Praveen Kumar P" }, { callerId: '+91 9000972445', callerName: "Kumar P" });

    }

    ngOnInit(): void {
        this.isAnyOperationIsInProgress = false;
        this.getCallOutcomes();
        this.initLogForm();
        this.getCustomWidgets();
        if (this.callResource) {
            this.logCallFormGroup.controls["callConnectedTo"].patchValue(this.callResource.to);
            this.logCallFormGroup.controls["callOutcomeCode"].patchValue(this.callResource.status);
            this.logCallFormGroup.controls["callLoggedDate"].patchValue(this.callResource.endTime);
            this.logCallFormGroup.controls["callLoggedTime"].patchValue(this.callResource.endTime);
            this.logCallFormGroup.controls["callStartedOn"].patchValue(this.callResource.startTime);
            this.logCallFormGroup.controls["callEndedOn"].patchValue(this.callResource.endTime);
        }
        this.isEnabled = true;
    }

    initLogForm() {
        this.logCallFormGroup = this.formBuilder.group({
            callDescription: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(1000)
                ])
            ),
            callLoggedDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            callLoggedTime: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            callDuration: new FormControl("",
                Validators.compose([
                ])
            ),
            callRecordingLink: new FormControl("",
                Validators.compose([
                ])
            ),
            callOutcomeCode: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            callConnectedTo: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            callStartedOn: new FormControl("",
                Validators.compose([
                ])
            ),
            callEndedOn: new FormControl("",
                Validators.compose([
                ])
            ),
        });
    }


    getCustomWidgets() {
        if(!this.isMobileNuberOnly) {
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
        })
        // this.callerList.push({ MobileNumber: '+919000972459', Name: "Praveen Kumar P" });
        // this.callerList.push({ MobileNumber: '+919949909336', Name: "Leela P" });
        // this.callerList.push({ MobileNumber: '+919632500314', Name: "Dheeraj" });
        }  else {
            var caller = this.mobileNumber.split(",");
            this.callerList.push({ MobileNumber: caller[0], Name: caller[0] });
        }
    }

    getCallOutcomes() {
        this.callService.GetCallOutcomes(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.callOutcomeList = response.data;
            }
        });
    }

    insertCallLogForm() {
        if (this.logCallFormGroup.valid) {
            this.isAnyOperationIsInProgress = true;
            let formData = this.logCallFormGroup.value;
            formData.receiverId = this.receiverId;
            formData.activityType = this.callResource ? "online" : "offline";
            formData.callResource = JSON.stringify(this.callResource);
            this.callService.UpsertCallLog(this.componentModel, formData).subscribe((response: any) => {
                if (response && response.data) {
                    this.callResource = null;
                    this.closeLogCallFormDialog(true);
                }
                this.isAnyOperationIsInProgress = false;
            });
        } else {
            this.toastr.error(this.translateService.instant("CRM.PLEASEFILLALLDETAILS"));
        }
    }

    closeLogCallFormDialog(isDataLoad) {
        if (!this.callResource) {
            this.closePopup.emit(isDataLoad);
        } else {
            this.insertCallLogForm();
        }
    }

    buttonDisabledInProgress(comments) {
        if (this.logCallFormGroup && this.logCallFormGroup.value) {
            if (this.logCallFormGroup.value.callDescription) {
                this.isButtonDisabled = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isButtonDisabled = true;
                this.cdRef.detectChanges();
            }
            if (comments.event.target.textContent.length > 800) {
                this.isCommentsTextValidation = true;
                this.isButtonDisabled = true;
                this.cdRef.detectChanges();
            }
            else {
                this.isCommentsTextValidation = false;
                this.isButtonDisabled = false;
                this.cdRef.detectChanges();
            }
        } else {
            this.isCommentsTextValidation = false;
            this.isButtonDisabled = false;
            this.cdRef.detectChanges();
        }
    }
}
