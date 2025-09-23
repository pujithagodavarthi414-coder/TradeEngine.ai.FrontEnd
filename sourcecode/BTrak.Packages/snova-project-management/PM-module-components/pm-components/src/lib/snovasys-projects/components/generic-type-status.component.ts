import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, ViewContainerRef, Type } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'generic-type-status',
    templateUrl: './generic-type-status.component.html'
})

export class GenericTypeStatusComponent extends CustomAppBaseComponent  implements OnInit {

    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        if (this.referenceId) {
        }
    }

    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        this.referenceTypeId = data;
        if (this.referenceTypeId) {
            if(this.referenceTypeId.toLowerCase() == ConstantVariables.AuditReferenceTypeId) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenAudit);
            } else if(this.referenceTypeId.toLowerCase() == ConstantVariables.ConductReferenceTypeId.toLowerCase()) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenConduct);
            } else if(this.referenceTypeId.toLowerCase() == ConstantVariables.AuditsUploadEvidenceReferenceTypeId.toLowerCase()) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenAuditUpload);
            } else if(this.referenceTypeId.toLowerCase() == ConstantVariables.ConductsUploadEvidenceReferenceTypeId.toLowerCase()) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenConductUpload);
            } else if(this.referenceTypeId.toLowerCase() == ConstantVariables.AuditQuestionsUploadEvidenceReferenceTypeId.toLowerCase()) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenAuditQuestionUpload);
            } else if(this.referenceTypeId.toLowerCase() == ConstantVariables.ConductQuestionsEvidenceUploadReferenceTypeId.toLowerCase()) {
                this.displayText = this.translateService.instant(ConstantVariables.OpenAuditQuestionUpload);
            }
            // else if(this.referenceTypeId.toLowerCase() == ConstantVariables.AuditQuestionsReferenceTypeId) {
            //     this.displayText = this.translateService.instant(ConstantVariables.OpenConduct);
            // }
        }
    }
    @ViewChild("GenericStatusDetailComponent") GenericStatusDetailComponent: TemplateRef<any>;
    referenceId: string;
    referenceTypeId: string;
    displayText: string;
    userStoryId: any;
    constructor( public dialog: MatDialog,  private translateService: TranslateService) {
        super();
    }
    ngOnInit(){}

    OpenStatusDialg() {
        let dialogId = "generic-status-detail";
        const formsDialog = this.dialog.open(this.GenericStatusDetailComponent, {
            // minWidth: "80vw",
            // minHeight: "50vh",
            // hasBackdrop: true,
            // direction: "ltr",
            // id: dialogId,
            minWidth: "80vw",
            minHeight: "50vh",
            id: dialogId,
            data: {
                referenceId: this.referenceId, referenceTypeId: this.referenceTypeId, formPhysicalId: dialogId, dialogId: dialogId,
                userStoryId: this.userStoryId
            },
            disableClose: true
        });
    }
}