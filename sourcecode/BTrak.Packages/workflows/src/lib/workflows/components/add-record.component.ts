import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivityService } from "../services/activity.service";
import { ToastrService } from "ngx-toastr";
import { WorkflowService } from "../services/workflow.service";
import { Guid } from "guid-typescript";
import * as _ from "underscore";

@Component({
    selector: "app-add-record",
    templateUrl: "./add-record.component.html"
})

export class AddRecordComponent implements OnInit {
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        this.clearForm();
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.formsList = this.matData.formsList;
            this.formname = this.matData.name;
            this.formKeys = this.matData.formKeys;
            this.isEdit = this.matData.isEdit;
            this.formValue = this.matData.formValue;
            if (this.isEdit == false) {
                this.inputParamSteps = this.insertionForm.get('inputParamSteps') as FormArray;
                this.inputParamSteps.insert(0, this.createCriteriaItem());
                this.id = Guid.create().toString();
            } else {
                this.id = this.formValue.id;
                this.insertionForm.patchValue(this.formValue);
                this.selectedFormId = this.formValue.dataSourceId;
                if (this.formValue.inputParamSteps && this.formValue.inputParamSteps.length > 0) {
                    this.formValue.inputParamSteps.forEach((value, index) => {
                        this.inputParamSteps = this.insertionForm.get('inputParamSteps') as FormArray;
                        this.inputParamSteps.insert(index, this.bindCriteriaItem(value));
                    });
                }
                if (this.selectedFormId) {
                    this.getFormKeysBasedOnId();
                }
            }
        }
    }
    formsList: any[] = [];
    customApplications: any[] = [];
    formKeys: any[] = [];
    formKeysDropdown: any[] = [];
    insertionForm: FormGroup;
    inputParamSteps: FormArray;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    formValue: any;
    formname: string;
    selectedFormId: string;
    dataSourceId: string;
    id: any;
    isLoading: boolean;
    isEdit: boolean;
    isFileUpload: boolean;
    fileUploadKey: string;

    constructor(private formBuilder: FormBuilder, public AppDialog: MatDialogRef<AddRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private activityService: ActivityService,
        private toastr: ToastrService, private workflowService: WorkflowService) {
        this.getCustomApplications();

    }
    ngOnInit() {

    }

    getCustomApplications() {
        var searchModel: any = {};
        searchModel.isArchived = false;
        searchModel.isCompanyBased = false;
        this.activityService.getCustomApplications(searchModel).subscribe((response: any) => {
            if (response.success) {
                this.customApplications = response.data;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.insertionForm = new FormGroup({
            formName: new FormControl(null, Validators.compose([])),
            name: new FormControl(null, Validators.compose([Validators.required])),
            id: new FormControl(null, Validators.compose([])),
            dataSourceId: new FormControl(null, Validators.compose([Validators.required])),
            customApplicationId: new FormControl(null, Validators.compose([Validators.required])),
            inputParamSteps: this.formBuilder.array([])
        })
    }

    upsertNewRecord() {
        let formSubmission = this.insertionForm.value;
        formSubmission.formName = this.formname;
        formSubmission.id = this.id;
        let inputParamSteps = formSubmission.inputParamSteps;
        let dataJson: any[] = [];
        inputParamSteps.forEach((param) => {
            var model: any = {};
            model[param.inputValue] = '$' + param.inputName;
            dataJson.push(model);

            var formKeys = this.formKeysDropdown;
            let filteredList = _.filter(formKeys, function (filter) {
                return filter.key == param.inputValue;
            })
            if (filteredList.length > 0) {
                let type = filteredList[0].dataType;
                if (type == "myfileuploads") {
                    this.isFileUpload = true;
                    this.fileUploadKey = filteredList[0].key;
                }
            }
        })
        formSubmission.isFileUpload = this.isFileUpload;
        formSubmission.fileUploadKey = this.fileUploadKey;
        if (dataJson.length > 0) {
            formSubmission.dataJsonKeys = JSON.stringify(dataJson);
        } else {
            formSubmission.dataJsonKeys = "";
        }
        this.currentDialog.close(formSubmission);
    }

    onNoClick() {
        this.currentDialog.close();
    }

    onFormChange(event) {
        this.selectedFormId = event;
        this.getFormKeysBasedOnId();
    }

    getFormKeysBasedOnId() {
        var searchModel: any = {};
        searchModel.id = this.selectedFormId;
        this.workflowService.getAllFormFields(searchModel).subscribe((response: any) => {
            if (response.success) {
                this.formKeysDropdown = response.data;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    addItem(index) {
        this.inputParamSteps = this.insertionForm.get('inputParamSteps') as FormArray;
        this.inputParamSteps.insert(index + 1, this.createCriteriaItem());
    }

    createCriteriaItem() {
        let id = Guid.create().toString();
        return this.formBuilder.group({
            inputName: new FormControl('', Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([Validators.required])),
            id: new FormControl(id, Validators.compose([]))
        });
    }

    bindCriteriaItem(data) {
        return this.formBuilder.group({
            inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
            inputValue: new FormControl(data.inputValue, Validators.compose([Validators.required])),
            id: new FormControl(data.id, Validators.compose([]))
        });
    }

    removeItem(index) {
        this.inputParamSteps.removeAt(index);
    }

    cancelRecordTask() {
        this.clearForm();
        this.currentDialog.close();
    }

    getControlsLength() {
        this.addItem((this.insertionForm.get('inputParamSteps') as FormArray).length - 1);
    }
}