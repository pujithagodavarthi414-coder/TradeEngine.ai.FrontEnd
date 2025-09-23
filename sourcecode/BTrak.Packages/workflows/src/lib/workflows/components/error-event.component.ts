import { ChangeDetectorRef, Component, Inject, Input, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";
import { ErrorEventType } from '../models/enum';
import { ErrorModel } from "../models/ErrorModel";
import { ActivityService } from "../services/activity.service";

@Component({
    selector: "app-error-event",
    templateUrl: "./error-event.component.html"
})
export class ErrorEventComponent extends CustomAppBaseComponent {
    @ViewChild('addErrorDialog') addErrorDialog: TemplateRef<any>;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.form = this.matData;
            this.formname = this.matData.name;
            this.isEdit = this.matData.isEdit;
            this.actions = this.matData.items;
        }
    }
    errorEventForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    actions: any[] = [];
    errorEventTypes: any = [
        { id: '0', name: 'Error End Event' },
        { id: '1', name: 'Error Boundary Event' },
        // { id: '2', name: 'Error Start Event' },
    ];
    errorList: any;
    constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<ErrorEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,
        private activityService: ActivityService) {
        super();
        // this.form = data;
        // this.formname = data.name;
        // this.isEdit = data.isEdit;
        // this.actions = data.items;
    }
    ngOnInit(): void {
        this.clearForm();
        this.getErrorList();
        this.onChangeErrorEventType();
        this.inputparamsStepsShow = true;
        if (this.isEdit) {
            this.errorEventForm.patchValue(this.form.formValue);
            this.errorEventForm.get('name').setValue(this.form.formValue.name);
            this.errorEventForm.get('errorCode').setValue(this.form.formValue.errorCode);
            this.errorEventForm.get('errorMessage').setValue(this.form.formValue.errorMessage);
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.errorEventForm.get('inputparamSteps') as FormArray;
                    this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                });
            }
        }
    }
    getErrorList() {
        let em = new ErrorModel();
        em.isArchive = false;
        this.activityService.getError(em).subscribe((result: any) => {
            if (result.success) {
                this.errorList = result.data;
            }
            else {
                this.errorList = [];
            }
        })
    }
    clearForm() {
        this.errorEventForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            errorCode: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            errorMessage: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            errorEventType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([])
        })
    }
    upsertErrorEvent() {
        this.currentDialog.close({ ...this.errorEventForm.value, formId: this.form.formId });
    }
    cancelErrorEvent() { this.currentDialog.close(); }
    addItem(index): void {

        this.inputparamSteps = this.errorEventForm.get('inputparamSteps') as FormArray;
        this.inputparamSteps.insert(index + 1, this.createcriteriaItem());
        this.addNewTestCaseStep();
    }
    addNewTestCaseStep() { }
    createcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl('', Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([]))
        });
    }
    bindcriteriaItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
            inputValue: new FormControl(data.inputValue, Validators.compose([]))
        });
    }

    getCriteriaControls() {
        return (this.errorEventForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.errorEventForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.errorEventForm.get('inputparamSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }
    removeItem(index) {
        this.inputparamSteps.removeAt(index);
        this.addNewTestCaseStep();
    }
    onNoClick(): void {
        this.currentDialog.close();
    }
    onChangeErrorEventType() {
        this.errorEventForm.get('errorEventType').valueChanges.subscribe((value: any) => {
            if (value == ErrorEventType.ErrorBoundaryEvent) {
                this.errorEventForm.addControl('taskName', new FormControl('', Validators.required));
            } else {
                this.errorEventForm.removeControl('taskName');
            }
            this.errorEventForm.get('taskName')?.updateValueAndValidity();
        });
    }
    addError() {
        const dialogRef = this.dialog.open(this.addErrorDialog, {
            width: "95vw",
            height: "90vh",
            maxWidth: "95vw",
            disableClose: true,
            id: "add-error-dialog",
            data: { isEdit: false, formPhysicalId: "add-error-dialog" }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getErrorList();
        });
    }
    onErrorChange(val) {
        var er = this.errorList.find(x => x.errorCode == val);
        if (er) {
            this.errorEventForm.get('errorMessage').setValue(val);
            this.errorEventForm.get('errorCode').setValue(er.errorCode);
        }
    }
}