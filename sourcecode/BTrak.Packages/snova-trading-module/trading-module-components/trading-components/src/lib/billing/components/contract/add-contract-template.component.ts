import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { LocalStorageProperties } from "../../constants/localstorage-properties";
import { ContractTemplateModel } from "../../models/contract-template";
import { TemplateConfigModel } from "../../models/template-config-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import * as formUtils from 'formiojs/utils/formUtils.js';
import * as _ from "underscore";
import { filter } from "rxjs/operators";
@Component({
    selector: "add-contract-template-dialog",
    templateUrl: "./add-contract-template.component.html"
})

export class AddContractTemplateDialog implements OnInit {
    color: any;
    dropDownList: any;
    currentUser: any;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.templateTypes = this.matData.templateTypes;
            this.termsConditions = this.matData.termsConditions;
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            if (this.matData.row) {
                var contractTemplateFormJson = this.matData.row.fields.ContractTemplateJson ? JSON.parse(this.matData.row.fields.ContractTemplateJson) : Object.assign({}, this.basicForm);
                var inputFormJson = contractTemplateFormJson;
                // var inputFormJson = contractTemplateFormJson;
                // inputFormJson = this.getObjects(inputFormJson, 'key', 'selectCountry', true, ['selectCountry', 'sellerCountryCode', 'originCountry','brokerCountryCode','buyerCountryCode','chartererCountryCode']);

                this.getDropDown(contractTemplateFormJson)
                // inputFormJson = this.getObjects(inputFormJson, 'key', 'selectCountry', true, ['selectCountry', 'sellerCountryCode', 'selerCountryCode']);

                // this.contractTemplateFormJson = inputFormJson;

                this.contractTemplateName = this.matData.row.contractTemplateName;
                this.contractTemplateId = this.matData.row.contractTemplateId;
                this.contractTypeId = this.matData.row.fields.ContractTypeId;
                this.formBgColor = this.matData.row.formBgColor;
                this.termsAndConditionId = this.matData.row.fields.TermsAndConditionId;
                this.templateForm.controls['contractTemplateName'].setValue(this.contractTemplateName);
                this.templateForm.controls['contractTypeId'].setValue(this.contractTypeId);
                this.templateForm.controls['termsAndConditionId'].setValue(this.termsAndConditionId);
                this.templateForm.controls['formBgColor'].setValue(this.formBgColor)
            }
            else {
                this.contractTemplateFormJson = Object.assign({}, this.basicForm);

            }
            this.isPreview = this.matData.isPreview;
            if (this.contractTemplateFormJson) {
                this.updateComponents();
            }
        }
    }
    @Output() closeMatDialog = new EventEmitter<boolean>();
    contractTemplateFormJson: any;
    contractTemplateName: string;
    contractTemplateId: string;
    timeStamp: any;
    isAddInProgress: boolean;
    isPreview: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    public basicForm = { components: [] };
    contractTypeId: string;
    termsAndConditionId: string;
    templateForm: FormGroup;
    termsConditions: any;
    templateTypes: any;
    isFormView: boolean = true;
    formBgColor: string;
    formOutput: any;
    constructor(public contractTemplateDialog: MatDialogRef<AddContractTemplateDialog>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private billingService: BillingDashboardService, private cookieService: CookieService,
        private toastr: ToastrService, private cdRef : ChangeDetectorRef) {
        this.initializeForm();
        this.formOutput = { components: [] };
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
            this.contractTemplateFormJson = this.matData.contractTemplateFormJson ? JSON.parse(this.matData.contractTemplateFormJson) : Object.assign({}, this.basicForm);
            this.contractTemplateName = this.matData.contractTemplateName;
            this.timeStamp = this.matData.timeStamp;
            this.contractTemplateId = this.matData.contractTemplateId;
            this.isPreview = this.matData.isPreview;
            if (this.contractTemplateFormJson) {
                this.updateComponents();
            }
        }
    }

    ngOnInit() {

    }

    upsertContractTemplate() {
        this.isAddInProgress = true;
        var addTemplateModel = new ContractTemplateModel();
        addTemplateModel = this.templateForm.value;
        addTemplateModel.contractTemplateFormJson = JSON.stringify(this.contractTemplateFormJson);
        addTemplateModel.timeStamp = this.timeStamp;
        addTemplateModel.contractTemplateId = this.contractTemplateId;
        addTemplateModel.formBgColor = this.templateForm.value.formBgColor;
        var formKeys = [];
        formUtils.eachComponent(this.formOutput.components, function (component) {
            formKeys.push({ key: component.key, label: component.label, type: component.type });
        }, false);
        addTemplateModel.formKeys = JSON.stringify(formKeys);
        this.billingService.upsertContractTemplate(addTemplateModel).subscribe((response: any) => {
            this.isAddInProgress = false;
            if (response.success) {
                this.closeMatDialog.emit(true);
                if (this.currentDialog) {
                    this.currentDialog.close();
                    this.currentDialog.close({ success: true });
                }
                else if (this.contractTemplateDialog) this.contractTemplateDialog.close();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message)
            }
        })
    }

    onChange(event) {
        if (event.form != undefined) { this.contractTemplateFormJson = event.form };
        console.log(event.form);
    }

    onNoClick(): void {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
        }
        else if (this.contractTemplateDialog) this.contractTemplateDialog.close();
    }

    initializeForm() {
        this.templateForm = new FormGroup({
            contractTemplateName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            contractTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            termsAndConditionId: new FormControl(null,
                Validators.required),
            formBgColor: new FormControl(null)
        })
    }

    changeFormView(event) {
        this.isFormView = false;
        let index = this.templateTypes.findIndex((x) => x.contractTypeId.toLowerCase() == event);
        if (index > -1) {
            let json = this.templateTypes[index].formJson;
            this.contractTemplateFormJson = JSON.parse(json);
        }
        this.isFormView = true;
        if (this.contractTemplateFormJson) {
            this.updateComponents();
        }
        this.filterTermsAndConditions(event);
    }

    filterTermsAndConditions(event) {
       let termsAndConditions = this.termsConditions;
       let filteredList = _.filter(termsAndConditions, function(terms){
          return terms.contractTypeIds && terms.contractTypeIds.toString().includes(event)
       });
       if(filteredList.length > 0) {
           this.termsConditions = filteredList;
       }
       this.cdRef.detectChanges();
    }

    updateComponents() {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (this.contractTemplateFormJson.Components) {
            let components = this.contractTemplateFormJson.Components;
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
            else {
                inputFormJson = this.getUploadObjects(inputFormJson, 'type', 'myfileuploads', true, ['myfileuploads']);
                inputFormJson = this.getUploadObjects(inputFormJson, 'type', 'documentsRequired', true, ['documentsRequired']);
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

    getDropDown(contractTemplateFormJson) {

        var inputFormJson = contractTemplateFormJson;
        inputFormJson = this.getObjects(inputFormJson, 'key', 'selectCountry', true, ['commodityName', 'contractType', 'originLoadPort', 'selectCountry', 'sellerCountryCode', 'originCountry', 'brokerCountryCode', 'buyerCountryCode', 'chartererCountryCode', 'contractType', 'tolerance', 'sellerSignaturePlace', 'buyerSignaturePlace', 'priceCurrency', 'incoterms', 'idcPlaceOfIssue2', 'idcPlaceOfConfimation', 'placeOfArbitration', 'placeOfLitigation']);

        this.contractTemplateFormJson = inputFormJson;
        return this.dropDownList;

    }

    getObjects(obj, key, val, newVal, list) {
        var environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
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
        return obj;
    }

    onChangeColor(value) {
        this.templateForm.get('formBgColor').setValue(value);
        this.formBgColor = value;
    }
}