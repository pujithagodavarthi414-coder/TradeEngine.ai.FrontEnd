import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TradeTemplateModel } from "../../models/trade-template-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { ColorPickerService } from "ngx-color-picker";
import { LocalStorageProperties } from "../../constants/localstorage-properties";
import { CookieService } from "ngx-cookie-service";
import * as formUtils from 'formiojs/utils/formUtils.js';


@Component({
    selector: "add-trade-template-dialog",
    templateUrl: "./add-trade-templates.component.html",
    providers: [ColorPickerService]
})

export class AddTradeTemplateDialog implements OnInit {
    color: any;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.templateTypes = this.matData.templateTypes;
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            if (this.matData.row) {
                this.tradeTemplateFormJson = this.matData.row.fields.TradeTemplateJson ? JSON.parse(this.matData.row.fields.TradeTemplateJson) : Object.assign({}, this.basicForm);
                this.tradeTemplateName = this.matData.row.tradeTemplateName;
                this.tradeTemplateId = this.matData.row.tradeTemplateId;
                this.templateTypeId = this.matData.row.fields.TemplateTypeId;
                this.formBgColor = this.matData.row.formBgColor;
                this.templateForm.controls['tradeTemplateName'].setValue(this.tradeTemplateName);
                this.templateForm.controls['templateTypeId'].setValue(this.templateTypeId);
                this.templateForm.controls['formBgColor'].setValue(this.formBgColor)
            }
            else {
                this.tradeTemplateFormJson = Object.assign({}, this.basicForm);
            }
            this.isPreview = this.matData.isPreview;
            if (this.tradeTemplateFormJson) {
                this.updateComponents();
            }
        }
    }
    submission:any={data:{}}
    @Output() closeMatDialog = new EventEmitter<boolean>();
    tradeTemplateFormJson: any;
    tradeTemplateName: string;
    tradeTemplateId: string;
    formBgColor: any;
    timeStamp: any;
    isAddInProgress: boolean;
    isPreview: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    public basicForm = { components: [] };
    templateTypeId: string;
    templateForm: FormGroup;
    templateTypes: any;
    isFormView: boolean = true;
    disable: boolean  = false;
    currentUser: any;
    formOutput : any;
    constructor(public tradeTemplateDialog: MatDialogRef<AddTradeTemplateDialog>, public dialog: MatDialog, private cdRef : ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any, private billingService: BillingDashboardService, private cookieService: CookieService,
        private toastr: ToastrService) {
        this.initializeForm();
        this.formOutput = { components: [] };
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
            this.tradeTemplateFormJson = this.matData.tradeTemplateFormJson ? JSON.parse(this.matData.tradeTemplateFormJson) : Object.assign({}, this.basicForm);
            this.tradeTemplateName = this.matData.tradeTemplateName;
            this.timeStamp = this.matData.timeStamp;
            this.tradeTemplateId = this.matData.tradeTemplateId;
            this.isPreview = this.matData.isPreview;
            if (this.tradeTemplateFormJson) {
                this.updateComponents();
            }
        }
    }

    ngOnInit() {

    }

     

    upsertTradeTemplate() {
        this.isAddInProgress = true;
        var addTemplateModel = new TradeTemplateModel();
        addTemplateModel = this.templateForm.value;
        addTemplateModel.tradeTemplateFormJson = JSON.stringify(this.tradeTemplateFormJson);
        addTemplateModel.timeStamp = this.timeStamp;
        addTemplateModel.tradeTemplateId = this.tradeTemplateId;
        addTemplateModel.formBgColor = this.templateForm.value.formBgColor;
        var formKeys = [];
        formUtils.eachComponent(this.formOutput.components, function (component) {
            formKeys.push({ key: component.key, label: component.label, type: component.type });
        }, false);
        addTemplateModel.formKeys = JSON.stringify(formKeys);
        this.billingService.upsertTradeTemplate(addTemplateModel).subscribe((response: any) => {
            this.isAddInProgress = false;
            if (response.success) {
                this.closeMatDialog.emit(true);
                if (this.currentDialog) {
                    this.currentDialog.close();
                    this.currentDialog.close({ success: true });
                }
                else if (this.tradeTemplateDialog) this.tradeTemplateDialog.close();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message)
            }
        })
    }

    updateComponents() {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (this.tradeTemplateFormJson.components) {
            let components = this.tradeTemplateFormJson.components;
            console.log(components);
            if (components && components.length > 0) {
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
            this.formOutput.components = updatedNewComponents;
            var inputFormJson = this.formOutput;
            if(this.isPreview) {
                inputFormJson = this.getDisableObjects(inputFormJson, 'key', '', true, ['']);
            }
           
            this.formOutput = inputFormJson;
            this.cdRef.detectChanges();
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
                    obj['disabled'] = true;
            }
            else if (i != key && !list.includes(obj[key])) {
                
            }
        }
        return obj;
    }

    onChange(event) {
        if (event.form != undefined) { this.tradeTemplateFormJson = event.form };
    }

    onNoClick(): void {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
        }
        else if (this.tradeTemplateDialog) this.tradeTemplateDialog.close();
    }

    initializeForm() {
        this.templateForm = new FormGroup({
            tradeTemplateName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            templateTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            formBgColor: new FormControl(null)
        })
    }

    changeFormView(event) {
        this.isFormView = false;
        let index = this.templateTypes.findIndex((x) => x.templateTypeId.toLowerCase() == event);
        if (index > -1) {
            if(this.templateTypes[index].formJson)
            {
                let json = this.templateTypes[index].formJson;
                this.tradeTemplateFormJson = JSON.parse(json);
                this.getDropDown(JSON.parse(json))
            }
        }
        this.isFormView = true;
        if (this.tradeTemplateFormJson) {
            this.updateComponents();
        }
    }

    onChangeColor(value){
        this.templateForm.get('formBgColor').setValue(value);
        this.formBgColor = value;
    }

    getDropDown(contractTemplateFormJson) {
        var inputFormJson = contractTemplateFormJson;
        inputFormJson = this.getObjects(inputFormJson, 'key', 'commodity2', true, ['commodity2', 'portofLoadingCountryC1', 'portofLoadingCountryT1', 'portofDischargeCountryT1', 'portofDischargeCountryC1']);
        this.tradeTemplateFormJson = inputFormJson;
    }

    getDisableObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getDisableObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj['disabled'] = newVal;
            }
            else if (i != key && !list.includes(obj[key])) {
                obj['disabled'] = true;
            }
        }
        return obj;
    }

    getObjects(obj, key, val, newVal, list) {
        this.currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val, newValue, list));
            } else if (i == key && (obj[key] == val || list.includes(obj[key]))) {
                obj['lazyLoad'] = false
                obj['widget'] = 'choicesjs'
                obj['selectValues'] = 'data';
                if(document.location.hostname == 'localhost'){
                    const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224' : document.location.origin + '/backend';
                    var url = obj['data'].url.substring(obj['data'].url.indexOf("d/") + 1);
                    // console.log(url);
                    obj['data'].url = APIEndpoint + url;
                    // console.log(APIEndpoint + url);
                
                }
               
                obj['data'].headers = [
                    { key: 'Content-Type', value: 'application/json' },
                    { key: 'Authorization', value: 'Bearer ' + this.currentUser }
                ]
                obj['dataSrc'] = 'url';
            }

        }
        return obj;
    }
}