import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { LocalStorageProperties } from "../../../constants/localstorage-properties";
import { FileUploadService } from "../../../services/fileUpload.service";
import { LivesManagementService } from "../../../services/lives-management.service";

@Component({
    selector: 'app-kpi-dialog',
    templateUrl: './add-kpi-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AddKpiDialogComponent implements OnInit {
    validationMessage: any;
    clientimageUrl: any;
    currentUser: any;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.programId = this.matData.programId;
            this.isFromProgram = this.matData.isFromProgram;
            this.dataSetId = this.matData.dataSetId;
            this.formName = this.matData.formName;
            this.isEdit = this.matData.isEdit;
            let components = this.matData.formComponents;
            components = this.updateComponents(components);
            this.form = { components: [] };
            this.form.components = components;
            let formJson = this.form;
            formJson = this.getUploadObjects(this.form, 'type', 'myfileuploads', true, ['myfileuploads']);
            formJson = this.getObjects(formJson, 'key', 'country', true);
            if (this.isEdit == true) {
                this.isNewRecord = false;
            }
            else {
                this.isNewRecord = true;
            }
            this.form = formJson;
            if (this.matData.formData) {
                this.formData.data = this.matData.formData;
                this.clientimageUrl = this.matData.formData.imageUrl;
            }
        }

    }
    dateKeys: any[] = [];
    fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    isFromProgram: boolean;
    id: any;
    isUpsertLoading: boolean;
    matData: any;
    formName: string;
    currentDialogId: any;
    currentDialog: any;
    kpiId: string;
    programId: string;
    formData: any = { data: {} };
    form: any;
    dataSetId: any;
    isEdit: boolean;
    isNewRecord: boolean;

    @Output() closeMatDialog = new EventEmitter<any>();
    @Output() emitDateKeys = new EventEmitter<any>();
    constructor(public addKpiDialog: MatDialogRef<AddKpiDialogComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any, private liveService: LivesManagementService, private toastr: ToastrService, private fileUploadService: FileUploadService,
        private cookieService: CookieService) {
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.kpiId = this.matData.kpiId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
    }

    ngOnInit() {

    }

    onNoClick() {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
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

    submiData() {
        if (this.isFromProgram) {
            this.closeMatDialog.emit(this.formData.data);
            if (this.currentDialog) {
                this.currentDialog.close();
                this.currentDialog.close({ formData: this.formData.data, imageUrl: this.clientimageUrl });
            }
        } else {
            var kpiUpsertModel: any = {};
            kpiUpsertModel.programId = this.programId;
            kpiUpsertModel.template = 'ESGIndicators';
            kpiUpsertModel.formData = this.formData.data;
            kpiUpsertModel.id = this.dataSetId;
            kpiUpsertModel.dataSourceId = '409f7fae-a15a-4195-8963-6338b5d860bc';
            kpiUpsertModel.isNewRecord = this.isNewRecord;
            if (this.dateKeys.length > 0) {
                var unique = [...new Set(this.dateKeys)];
                unique.forEach((x: any) => {
                    var value = kpiUpsertModel.formData[x];
                    if (value.length > 0) {
                        var splitArray = value.split("T");
                        kpiUpsertModel.formData[x] = splitArray[0];
                    }
                });
            }
            this.isUpsertLoading = true;
            this.liveService.upsertESGIndicators(kpiUpsertModel).subscribe((response: any) => {
                this.isUpsertLoading = false;
                if (response.success) {
                    if (this.isNewRecord == false) {
                        this.toastr.success("", 'KPI updated successfully');
                    } else {
                        this.toastr.success("", 'KPI added successfully');
                    }
                    this.closeMatDialog.emit(true);
                    if (this.currentDialog) {
                        this.currentDialog.close();
                        this.currentDialog.close({ success: true });
                    }
                } else {
                    this.toastr.error('', response.apiResponseMessages[0].message);
                }
            })
        }
    }

    getDisabledObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getDisabledObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj['disabled'] = newVal;
            }
            else if (i != key && !list.includes(obj[key])) {
                obj['disabled'] = false;
            }
        }
        return obj;
    }
    getUploadObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getUploadObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj.properties['referenceTypeId'] = this.dataSetId;
                obj.properties['referenceTypeName'] = (obj.label != null && obj.label != undefined && obj.label != "") ? obj.label : obj.key;
            }
            else if (i != key && !list.includes(obj[key])) {

            }
        }
        return obj;
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
                if (obj["type"] == "datetime") {
                    this.dateKeys.push(obj["key"]);
                }
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
        this.emitDateKeys.emit(this.dateKeys);
        return obj;
    }

    clientuploadEventHandler(files: FileList) {
        //this.anyOperationInProgress = true;
        var file = files.item(0);
        var fileName = file.name;
        var fileExtension = fileName.split('.');
        if (this.fileTypes.includes(file.type)) {
            var moduleTypeId = 15;
            var formData = new FormData();
            formData.append("file", file);
            formData.append("isFromProfileImage", 'true');
            this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
                if (response.data) {
                    this.clientimageUrl = response.data[0].filePath;
                    //this.anyOperationInProgress = false;
                }
                else {
                    this.validationMessage = response.apiResponseMessages;
                }
            })
        }
        else {
            this.toastr.error("Please select images with extension .jpg, .png, .jpeg");
        }
    }
    getObjects(obj, key, val, newVal) {
        var environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val, newValue));
            }
            else if (i == key && (obj[key] == val)) {
                if (obj['dataSrc'] == "url") {
                    obj['lazyLoad'] = false
                    obj['widget'] = 'choicesjs'
                    obj['selectValues'] = 'data';
                    const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224' : document.location.origin + '/backend/';
                    var url = obj['data'].url.substring(obj['data'].url.indexOf("d/") + 1);
                    // console.log(url);
                    obj['data'].url = APIEndpoint + url;
                    // console.log(APIEndpoint + url);
                    // obj['data'].url = obj['data'].url.replace('backend',environment.apiURL);
                    obj['data'].headers = [
                        { key: 'Content-Type', value: 'application/json' },
                        { key: 'Authorization', value: 'Bearer ' + this.currentUser }
                    ]
                    obj['dataSrc'] = 'url';
                }
            }

        }
        return obj;
    }
}