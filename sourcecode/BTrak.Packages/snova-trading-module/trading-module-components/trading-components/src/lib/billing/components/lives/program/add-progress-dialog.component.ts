import { T } from "@angular/cdk/keycodes";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Guid } from "guid-typescript";
import { ToastrService } from "ngx-toastr";
import { BudgetForm } from "../../../models/budget-form";
import { KP02Form } from "../../../models/kp02-form";
import { KP03Form } from "../../../models/kp03-form";
import { ProgramDetails } from "../../../models/programs-details.model";
import { ProgramModel } from "../../../models/programs-model";
import { ProgressForm } from "../../../models/progress-form";
import { ProgressModel } from "../../../models/progress-model";
import { LivesManagementService } from "../../../services/lives-management.service";

@Component({
    selector: 'app-progress-dialog',
    templateUrl: './add-progress-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AddProgressDialogComponent implements OnInit {
  
    isVerified: boolean;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.progressId = this.matData.dataSetId;
            this.isVerified = this.matData.isVerified;
            let components = this.matData.components;
            if (this.matData.kpiName) {
                this.kpiName = this.matData.kpiName;
            } else {
                this.kpiName = 'KPI01';
            }
            components = this.updateComponents(components);
            this.form = { components: [] };
            this.form.components = components;
            let formJson = this.form;
            formJson = this.getUploadObjects(this.form, 'type', 'myfileuploads', true, ['myfileuploads']);
            this.form = formJson;
            if (this.matData.formData) {
                this.formData.data = this.matData.formData;
            }
            this.dataSourceId = this.matData.dataSourceId;
            this.programId = this.matData.programId;
            if (this.matData.dataSetId) {
                this.dataSetId = this.matData.dataSetId;
            }

            if (this.matData?.isNewRecord && this.matData?.isNewRecord != null) {
                this.isNewRecord = this.matData.isNewRecord;
            }
        }

    }
    id: any;
    progressId: any;
    matData: any;
    selectedIndex: number;
    currentDialogId: any;
    currentDialog: any;
    formData: any = { data: {} };
    form: any;
    dataSetId: any = null;
    kpiName: string;
    isLoadingInProgress: boolean;
    dataSourceId: any;
    programId: any;
    isNewRecord: boolean = false;
    programDetails: ProgramDetails[] = [];

    @Output() closeMatDialog = new EventEmitter<any>();
    constructor(public addKpiDialog: MatDialogRef<AddProgressDialogComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any, public livesServices: LivesManagementService, private toastr: ToastrService) {
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
    }

    ngOnInit() {
        this.getPrograms();
    }

    onNoClick() {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: false });
        }
        else if (this.addKpiDialog) this.addKpiDialog.close();
    }

    onChange(event) {
        console.log(event);
        if ((event?.detail.hasOwnProperty('changed') && (event?.detail?.changed != undefined)) || event?.detail.hasOwnProperty('changed') == false) {
            if (event.detail.data) {
                this.formData.data = event.detail.data;
            }

        }
    }

    getUploadObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getUploadObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj.properties['referenceTypeId'] = this.progressId;
                obj.properties['referenceTypeName'] = this.kpiName;
            }
            else if (i != key && !list.includes(obj[key])) {

            }
        }
        return obj;
    }

    submiData() {
        // this.closeMatDialog.emit(this.formData.data);
        // if (this.currentDialog) {
        //     this.currentDialog.close();
        //     this.currentDialog.close({ success: true, formData: this.formData.data, kpiName: this.kpiName });
        // }
        var progressData = new ProgressModel();
        this.isLoadingInProgress = true;
        progressData.dataSourceId = this.dataSourceId;
        progressData.formData = this.formData.data;
        progressData.kpiType = this.kpiName;
        progressData.template = "ProgramProgress";
        progressData.dataSetId = this.dataSetId;
        progressData.isArchived = false;
        progressData.isVerified = this.isVerified;
        progressData.isNewRecord = this.isNewRecord;
        var programName = "";
        if (this.kpiName == "KPI01") {
            programName = this.formData.data["programName"];
        } else if (this.kpiName == "KPI02") {
            programName = this.formData.data["programDetails"];
        } else if (this.kpiName == "KPI03") {
            programName = this.formData.data["programDetails"];
        }

        if (programName != "" && programName != undefined) {
            var program = this.programDetails.filter(x => x.programName == programName);
            this.programId = program[0].programId;
        }
        progressData.programId = this.programId;

        this.livesServices.upsertProgramProgress(progressData)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.isLoadingInProgress = false;
                    this.currentDialog.close({ success: true });
                }
                else {
                    this.isLoadingInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    updateComponents(components) {
        let updatedNewComponents = [];
        components.forEach((comp) => {
            let values = [];
            let keys = Object.keys(comp);
            keys.forEach((key) => {
                values.push(comp[key]);
                let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                let idx = keys.indexOf(key);
                if (idx > -1) {
                    keys[idx] = updatedKeyName;
                }
            })
            var updatedModel = {};
            for (let i = 0; i < keys.length; i++) {
                updatedModel[keys[i]] = values[i];
            }
            updatedNewComponents.push(updatedModel);
        })
        components = updatedNewComponents;
        components = this.getcaseObj(components)
        return components;
    }

    getcaseObj(obj) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getcaseObj(obj[i]));
            } else if (i) {
                var updatedNewComponents = [], components;
                components = obj.components;
                if (components && components.length >= 1) {
                    components.forEach((comp) => {
                        let values = [];
                        let keys = Object.keys(comp);
                        keys.forEach((key) => {
                            values.push(comp[key]);
                            let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                            let idx = keys.indexOf(key);
                            if (idx > -1) {
                                keys[idx] = updatedKeyName;
                            }
                        })
                        var updatedModel = {};
                        for (let i = 0; i < keys.length; i++) {
                            updatedModel[keys[i]] = values[i];
                        }
                        updatedNewComponents.push(updatedModel);
                    })
                }
                obj.components = updatedNewComponents;
            }
        }
        return obj;
    }

    updateFormJson(components) {
        components = this.updateComponents(components);
        this.form = { components: [] };
        this.form.components = components;
        let formJson = this.form;
        formJson = this.getUploadObjects(this.form, 'type', 'myfileuploads', true, ['myfileuploads']);
        this.form = formJson;
    }

    getPrograms() {
        var programModel = new ProgramModel();
        this.livesServices.getPrograms(programModel).subscribe((response: any) => {
            if (response.success) {
                this.programDetails = response.data;
                this.programDetails.forEach((x) => {
                    x.formDataObject = JSON.parse(x.formData);
                })
            } else {

            }
        });
    }
}