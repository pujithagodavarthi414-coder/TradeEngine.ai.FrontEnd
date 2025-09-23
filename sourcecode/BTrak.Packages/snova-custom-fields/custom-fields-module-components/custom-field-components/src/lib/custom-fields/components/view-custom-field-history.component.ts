import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { CustomFieldHistoryModel } from '../models/custom-field-history.model';


@Component({
    selector: "app-custom-history-view",
    templateUrl: "./view-custom-field-history.component.html"
})

export class ViewCustomFormHistoryComponent implements OnInit {
    @Input('customHistory')
    set _customHistory(data: CustomFieldHistoryModel) {
        this.customHistory = data;
        if (this.customHistory.formJson) {
            let formObject = JSON.parse(this.customHistory.formJson);
            this.formatFormJson(formObject);
        }
    }
    customHistory: CustomFieldHistoryModel;
    formObject: any;
    formData = { data: {} };
    ngOnInit(){
      
    }

    constructor(private cdRef: ChangeDetectorRef) {
        if(document.querySelector(".formio-loader-wrapper") as HTMLElement) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }

    formatFormJson(formObject) {
        let updatedNewComponents = [];
        if (formObject && formObject.length > 0) {
            formObject.forEach((comp) => {
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
        this.formObject = {};
        this.formObject.components = updatedNewComponents;
        if (this.customHistory.newValue) {
            this.formData.data = JSON.parse(this.customHistory.newValue);
        } else {
            this.formData.data = {};
        }
        if(document.querySelector(".formio-loader-wrapper") as HTMLElement) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
        this.cdRef.detectChanges();
    }

}