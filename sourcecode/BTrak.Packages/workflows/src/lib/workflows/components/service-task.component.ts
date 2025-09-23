import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder, FormArray } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";
import { ActivityService } from "../services/activity.service";
import { ActivityModel } from "../models/activityModel";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { MatOption } from "@angular/material/core";
import { Guid } from "guid-typescript";


@Component({
    selector: "app-service-task",
    templateUrl: "./service-task.component.html"
})
export class ServiceTaskComponent extends CustomAppBaseComponent {
    @ViewChild('addActivityDialog') addActivityDialog: TemplateRef<any>;
    @ViewChild("allSelected") private allKeysSelected: MatOption;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        this.getCustomApplications();
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.form = this.matData;
            this.formname = this.matData.name;
            this.isEdit = this.matData.isEdit;
            this.formId = this.matData.formId;
            this.getFormFieldsByFormId();
            this.formsList = this.matData.formsList;
            if (this.isEdit) {
                this.id = this.form.formValue.id;
                this.serviceTaskForm.patchValue(this.form.formValue);
                this.selectedFormId = this.form.formValue.syncFormId;
                let topicName = this.form.formValue.topic;
                // if (topicName == 'syncform_activity') {
                //     this.isFormVisible = true;
                //     this.enableCustomApplication = false;
                // } else if (topicName == 'createdataset_activity') {
                //     this.isFormVisible = false;
                //     this.enableCustomApplication = true;
                // }
                //this.bindFormName();
                //this.serviceTaskForm.get("name").setValue(this.form.formValue.name);
                //this.serviceTaskForm.get("topic").setValue(this.form.formValue.topic);
                if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                    this.form.formValue.inputparamSteps.forEach((value, index) => {
                        this.inputparamSteps = this.serviceTaskForm.get('inputparamSteps') as FormArray;
                        this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                    });
                }
                // if (this.form.formValue.dataSourceKeys && this.form.formValue.dataSourceKeys.length > 0) {
                //     this.form.formValue.dataSourceKeys.forEach((value, index) => {
                //         this.inputFormKeySteps = this.serviceTaskForm.get('dataSourceKeys') as FormArray;
                //         this.inputFormKeySteps.insert(index, this.bindFormKeyItem(value));
                //     });
                // } else if (!this.form.formValue.dataSourceKeys) {
                //     this.inputFormKeySteps = this.serviceTaskForm.get('dataSourceKeys') as FormArray;
                //     this.inputFormKeySteps.insert(0, this.createFormKeyItem());
                // }
            } else {
                this.id = Guid.create().toString();
                // this.inputFormKeySteps = this.serviceTaskForm.get('dataSourceKeys') as FormArray;
                // this.inputFormKeySteps.insert(0, this.createFormKeyItem());
            }
        }
        this.getActivities();
    }
    id: any;
    currentDialogId: any;
    currentDialog: any;
    matData: any;
    selectedKeys: string;
    dataSourceId: string;
    selectedFormKeys: any[] = [];
    fieldsDropdown: any[] = [];
    formFieldsDropDown: any[] = [];
    customApplications: any[] = [];
    formsList: any[] = [];
    serviceTaskForm: FormGroup;
    form: any;
    formId: string;
    selectedFormId: string;
    selectedFormName: string;
    enableCustomApplication: boolean;
    formname: string;
    syncFormIdIndex: number = -1;
    inputparamSteps: FormArray;
    inputFormKeySteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isFormVisible: boolean;
    isLoading: boolean;
    isEdit: any;
    topics: any //= [{ id: 1, name: 'mailtemplate-activity' }, { id: 2, name: 'notification-activity' }, { id: 3, name: 'status-update' }];
    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<ServiceTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder,
        private activityService: ActivityService, public dialog: MatDialog,
        private toastr: ToastrService) {
        super();
        this.clearForm();
        this.inputparamsStepsShow = true;


    }
    ngOnInit(): void {

    }

    getCustomApplications() {
        this.isLoading = true;
        var searchModel: any = {};
        searchModel.pageNumber = 1;
        searchModel.pageSize = 1000;
        this.activityService.getCustomApplications(searchModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.customApplications = response.data;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }
    getActivities() {
        let act = new ActivityModel();
        act.isArchive = false;
        this.activityService.getActivity(act).subscribe((result: any) => {
            if (result.success) {
                this.topics = result.data;
                if (this.isEdit) {
                    this.enableFormDropDown();
                }
            }
            else {
                this.topics = [];
            }
        })
    }

    enableFormDropDown() {
        let selectedTopic = this.form.formValue.topic;
        let topic = this.topics.find(x => x.activityName == selectedTopic);
        this.cdRef.detectChanges();
    }


    addTopic() {
        const dialogRef = this.dialog.open(this.addActivityDialog, {
            width: "95vw",
            height: "90vh",
            maxWidth: "95vw",
            disableClose: true,
            id: "add-activity-dialog",
            data: { isEdit: false, formPhysicalId: "add-activity-dialog" }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getActivities();
        });
    }

    clearForm() {
        this.serviceTaskForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            topic: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            inputparamSteps: this.formBuilder.array([]),
            id: new FormControl(this.id, Validators.compose([]))
        })
    }
    upsertUsertask() {
        this.currentDialog.close({ ...this.serviceTaskForm.value, formId: this.formId });
    }
    cancelUsertask() { this.currentDialog.close(); }
    addItem(index): void {
        this.inputparamSteps = this.serviceTaskForm.get('inputparamSteps') as FormArray;
        this.inputparamSteps.insert(index + 1, this.createcriteriaItem());
        this.addNewTestCaseStep();
    }
    addNewTestCaseStep() { }
    createcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl('', Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([])),
            id: new FormControl('', Validators.compose([]))
        });
    }
    bindcriteriaItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
            inputValue: new FormControl(data.inputValue, Validators.compose([])),
            id: new FormControl(data.id, Validators.compose([]))
        });
    }
    getCriteriaControls() {
        return (this.serviceTaskForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.serviceTaskForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.serviceTaskForm.get('inputparamSteps') as FormArray).length;
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


    onTopicChange(event) {
        var steps = this.serviceTaskForm.get('inputparamSteps') as FormArray;
        steps.clear();
        var topic = this.topics.find(x => x.activityName == event.value);
        var inputs = [];
        if (topic.inputs && topic.inputs.trim()) {
            inputs = topic.inputs.split(',');
        }
        if (inputs && inputs.length > 0) {
            inputs.forEach((value, index) => {
                if (value.trim()) {
                    steps.insert(index, this.bindInputItem(value));
                }
            });
        }
    }
    bindInputItem(data): FormGroup {
        let id = Guid.create().toString();
        return this.formBuilder.group({
            inputName: new FormControl(data, Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([])),
            id: new FormControl(id, Validators.compose([]))
        });
    }

    onFormChange(event) {
        this.selectedFormId = event;
        let formsList = this.formsList;
        let filteredList = _.filter(formsList, function (filter) {
            return filter.id == event;
        })
        if (filteredList.length > 0) {
            this.selectedFormName = filteredList[0].formName;
        }
    }

    onDataSourceChange(event) {
        this.dataSourceId = event;
        this.getFormFields();
    }

    getFormFields() {
        let workflowModel: any = {};
        workflowModel.id = this.dataSourceId;
        workflowModel.isPagingRequired = false;
        this.workflowService
            .getAllFormFields(workflowModel)
            .subscribe((responseData: any) => {
                this.formFieldsDropDown = responseData.data;
            });
    }

    getFormFieldsByFormId() {
        let workflowModel: any = {};
        workflowModel.id = this.formId;
        workflowModel.isPagingRequired = false;
        this.workflowService
            .getAllFormFields(workflowModel)
            .subscribe((responseData: any) => {
                this.fieldsDropdown = responseData.data;
            });
    }

    bindFormName() {
        let selectedFormId = this.selectedFormId;
        let formsList = this.formsList;
        let filteredList = _.filter(formsList, function (filter) {
            return filter.id == selectedFormId;
        })
        if (filteredList.length > 0) {
            this.selectedFormName = filteredList[0].formName;
        }
    }

}