import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ComponentModel } from '../models/componentModel';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SmsService } from '../services/sms.service';
import { MessageConstants } from '../globaldependencies/constants/MessageConstants';

@Component({
    selector: 'snovasys-sms',
    templateUrl: './snovasys-sms.component.html',
    styleUrls: ['./snovasys-sms.component.scss'],
    inputs: ['receiverId', 'componentModel', 'isPermissionExists']
})

export class SnovasysSmsComponent implements OnInit {
    templates: any;
    template: string;
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
    constructor(private cdRef: ChangeDetectorRef, private smsService: SmsService, private toastr: ToastrService,
        private translateService: TranslateService) {

    }

    ngOnInit(): void {

    }

    getSmsTemplates() {
        this.smsService.getSMSTemplates(this.componentModel).subscribe((response: any) => {
            if (response && response.data) {
                this.templates = [...response.data];
            }
        });
    }

    templateChange(event) {
        this.smsService.getDataBasedTemplate(event.value, this.componentModel).subscribe((response: any) => {
            if (response && response.data) {

            }
        });
    }

    sendRemainder() {
        let templateMessage = {
            templateId: this.template
        }
        this.smsService.sendMessage(templateMessage, this.componentModel).subscribe((response: any) => {
            if(response && response.data){
                this.toastr.success(MessageConstants.SmsSentSuccess);
            }
            if (response && response.apiResponseMessages) {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }

}
