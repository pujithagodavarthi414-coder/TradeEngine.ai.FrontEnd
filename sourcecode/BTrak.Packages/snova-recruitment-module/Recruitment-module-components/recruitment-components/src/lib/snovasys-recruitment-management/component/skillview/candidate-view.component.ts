import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChildren, ViewContainerRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CandidateSearchtModel } from '../../models/candidate-search.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-candidateview',
    templateUrl: 'candidate-view.component.html',
})
export class CandidateViewComponent implements OnInit {

    @Output() closePopup = new EventEmitter<string>();
    @ViewChildren('upsertcandidatepopup') upsertcandidatepopover;
    @Input('data')
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.candidateId = this.matData.candidate;
            }
        }
    }

    matData: any;
    candidateId: string;
    candidateDetails: any;
    candidateDetailsChanged: any;
    timeStamp: any;
    isCandidateArchived: boolean;
    jobId: string;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    injector: any;
    isArchivedEvent: boolean;

    getCandidates() {
        const candidateSearchtModel = new CandidateSearchtModel();
        candidateSearchtModel.candidateId = this.candidateId;
        candidateSearchtModel.jobOpeningId = this.jobId;
        this.recruitmentService.getCandisates(candidateSearchtModel).subscribe((response: any) => {
            if (response.success) {
                if (response.data.length > 0) {
                    this.candidateDetails = response.data[0];
                    this.candidateDetailsChanged = this.candidateDetails;
                    this.isCandidateArchived = false;
                } else {
                    this.isCandidateArchived = true;
                }
            } else {
                // this.toastr.error(response.apiResponseMessages[0].message);
            }

            this.cdRef.detectChanges();
        });
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cdRef: ChangeDetectorRef, private recruitmentService: RecruitmentService, public dialog: MatDialog,
        public dialogRef: MatDialogRef<CandidateViewComponent>, private vcr: ViewContainerRef) {
        this.candidateId = data.candidate;
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200);
        }
        this.getCandidates();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        this.isArchivedEvent = false;
    }

    candidateArchived(value) {
        if (value) {
            this.isArchivedEvent = true;
            this.closeCandidateDialog();
        }
    }

    closeCandidateDialog() {
        this.closePopup.emit('');
        if (this.currentDialog) {
            this.currentDialog.close({ success: true });
        }
        this.dialog.closeAll();

        if (this.isArchivedEvent) {
            this.dialogRef.close({ success: true, isArchived: true });
        } else {
            this.dialogRef.close({ success: true, isArchived: false });
        }
    }

}
