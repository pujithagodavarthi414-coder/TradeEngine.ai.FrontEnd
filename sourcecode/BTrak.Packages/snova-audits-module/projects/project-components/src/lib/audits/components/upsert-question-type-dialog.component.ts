import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuditService } from '../services/audits.service';

@Component({
    selector: "upsert-question-type-dialog",
    templateUrl: "upsert-question-type-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpsertQuestionTypeDialogComponent {
    questionTypeDetails: any;
    masterQuestionTypeId: string;

    editQuestionType: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UpsertQuestionTypeDialogComponent>, private translateService: TranslateService, private formBuilder: FormBuilder, private auditService: AuditService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        this.editQuestionType = data.editQuestionType;
        this.questionTypeDetails = data.questionTypeDetails;
        this.masterQuestionTypeId = data.masterQuestionTypeId;
    }

    closeDialog() {
        this.dialogRef.close({ success: false });
    }

    closeUpsert(value) {
        if (value) {
            if (value.success)
                this.dialogRef.close({ success: value });
            else if (!value.success)
                this.dialogRef.close({ success: value });
        } else {
            this.closeDialog();
        }
    }
}