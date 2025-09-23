import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { LocalStorageProperties } from "../../../constants/localstorage-properties";
import { BudgetAndInvestmentsInputModel } from "../../../models/budegt-investment.model";
import { BudgetForm } from "../../../models/budget-form";
import { LivesManagementService } from "../../../services/lives-management.service";

@Component({
    selector: 'app-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AddBudgetDialogComponent implements OnInit {
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            let components = BudgetForm;
            components = this.updateComponents(components);
            this.form = { components: [] };
            this.form.components = components;
            let formJson = this.form;
            this.form = formJson;
            formJson = this.getDropdownObjects(this.form, 'type', 'select', true, ['select']);
            this.form = formJson;
            this.programId = this.matData.programId;
            if (this.matData.formData) {
                this.formData.data = this.matData.formData;
                this.dataSetId = this.matData.budgetId;
            }
        }

    }
    id: any;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    formData: any = { data: {} };
    form: any;
    dataSetId: any;
    programId: any;
    dateKeys: any = [];
    @Output() closeMatDialog = new EventEmitter<any>();
    constructor(public addKpiDialog: MatDialogRef<AddBudgetDialogComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any, private livesService: LivesManagementService, private toastr: ToastrService, private cookieService: CookieService) {
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
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
        var budgetAndInvestmentsInput = new BudgetAndInvestmentsInputModel();
        budgetAndInvestmentsInput.formData = this.formData.data;
        if (this.dateKeys.length > 0) {
            var unique = [...new Set(this.dateKeys)];
            unique.forEach((x: any) => {
                var value = budgetAndInvestmentsInput.formData[x];
                if (value.length > 0) {
                    var splitArray = value.split("T");
                    budgetAndInvestmentsInput.formData[x] = splitArray[0];
                }
            });
        }
        budgetAndInvestmentsInput.dataSourceId = "c69b155d-eecf-47d5-b22b-7a3e568e8dea";
        if (this.matData.formData) {
            budgetAndInvestmentsInput.dataSetId = this.dataSetId;
        }
        budgetAndInvestmentsInput.programId = this.programId;
        budgetAndInvestmentsInput.isArchived = null;
        budgetAndInvestmentsInput.template = "BudgetAndInvestments";
        this.livesService.upsertBudgetAndInvestments(budgetAndInvestmentsInput).subscribe((respone: any) => {
            if (respone.success) {
                if (this.matData.formData) {
                    this.toastr.success("", "Budget detail updated");
                } else {
                    this.toastr.success("", "Budget detail added");
                }
                this.currentDialog.close({ success: true });
            } else {
                if (respone.apiResponseMessages.length > 0) {
                    this.toastr.error(respone.apiResponseMessages[0].message);
                }
            }
        });
        // this.closeMatDialog.emit(this.formData.data);
        // if (this.currentDialog) {
        //     this.currentDialog.close();
        //     this.currentDialog.close({ formData: this.formData.data });
        // }
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
        return obj;
    }

    getDropdownObjects(obj, key, val, newVal, list) {
        var currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getDropdownObjects(obj[i], key, val, newValue, list));
            } else if (i == key && (obj[key] == val)) {
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
                        { key: 'Authorization', value: 'Bearer ' + currentUser }
                    ]
                    obj['dataSrc'] = 'url';
                }
            }

        }
        return obj;
    }
}