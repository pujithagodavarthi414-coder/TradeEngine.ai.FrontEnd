import { Component, Inject, ChangeDetectorRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";
import { ConstantVariables } from "../../dependencies/constants/constant-variables";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { TrainingManagementService } from "../../dependencies/services/trainingmanagement.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

@Component({
    selector: "custom-app-add-new-training-course",
    templateUrl: "add-new-training-course.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomAddTrainingCourseDialogComponent extends CustomAppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();

    @Input("data")
    set _data(data: any) {                
        this.currentDialogId = data[0].formPhysicalId;;
        this.selectedTrainingCourse = data[0].data;
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        if(this.selectedTrainingCourse != null && this.selectedTrainingCourse != undefined) {
            this.trainingCourseId = this.selectedTrainingCourse.id;
        }
    }

    trainingCourseForm: FormGroup;
    selectedTrainingCourse: any;
    roleFeaturesIsInProgress$: any;
    isUpsertTrainingCourseInprogress: boolean;
    trainingCourseDetails: any;
    trainingCourseId: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;

    constructor(
        public dialogRef: MatDialogRef<CustomAddTrainingCourseDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private trainingService: TrainingManagementService,
        private translateService: TranslateService,
        ) {
        super();
        this.clearForm();
        if (data && data.data) {
            this.selectedTrainingCourse = data.data;
            this.trainingCourseId = this.selectedTrainingCourse.id;
        }

        if (data.formPhysicalId) {
            this.currentDialogId = this.data.formPhysicalId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.selectedTrainingCourse)
            this.trainingCourseForm.patchValue(this.selectedTrainingCourse);
    }

    clearForm() {
        this.trainingCourseForm = new FormGroup({
            courseName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.NameLength)])),
            courseDescription: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.DescriptionIdealLengh)])),
            validityInMonths: new FormControl(null, Validators.compose([Validators.required])),
        });
    }

    upsertTrainingCourse() {
        this.isUpsertTrainingCourseInprogress = true;
        this.trainingCourseDetails = this.trainingCourseForm.value;
        if (this.trainingCourseId) {
            this.trainingCourseDetails.id = this.trainingCourseId;
            this.trainingCourseDetails.timeStamp = this.selectedTrainingCourse.timeStamp;
        }
    
        this.trainingService.upsertTrainingCourse(this.trainingCourseDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                if (this.trainingCourseId) {
                    this.toastr.success(
                        "",
                        this.translateService.instant("TRAININGMANAGEMENT.COURSEUPDATEDSUCCESSFULLY")
                      );
                }else{
                    this.toastr.success(
                        "",
                        this.translateService.instant("TRAININGMANAGEMENT.COURSEADDEDSUCCESSFULLY")
                      );
                }
                this.trainingCourseId = response.data;
                this.trainingCourseDetails.id = this.trainingCourseId;
                this.isUpsertTrainingCourseInprogress = false;
                this.cancelAddTrainingCourseForm();
            }
            else {
                this.isUpsertTrainingCourseInprogress = false;
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }

    cancelAddTrainingCourseForm() {
        //this.dialogRef.close();
        // this.currentDialog.close();
        if (this.currentDialog) this.currentDialog.close();
        if (this.dialogRef) this.dialogRef.close();
    }

    closePopover() {
        this.clearForm();
        //this.dialogRef.close();
        // this.currentDialog.close();
        if (this.currentDialog) this.currentDialog.close();
        if (this.dialogRef) this.dialogRef.close();
    }
}