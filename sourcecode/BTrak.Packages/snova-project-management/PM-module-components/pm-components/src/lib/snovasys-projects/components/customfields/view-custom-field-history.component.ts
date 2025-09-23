import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { CustomFieldHistoryModel } from '../../models/custom-field-history.model';


@Component({
    selector: "app-custom-field-history-view",
    templateUrl: "./view-custom-field-history.component.html"
})

export class ViewCustomFieldHistoryComponent implements OnInit {
    @Input('customHistory')
    set _customHistory(data: CustomFieldHistoryModel) {
        this.customHistory = data;
        if (this.customHistory.formJson) {
            this.formObject = JSON.parse(this.customHistory.formJson);
            this.cdRef.detectChanges();
        }
        if (this.customHistory.newValue) {
            if (this.customHistory.newValue.includes('{')) {
                this.formData.data = JSON.parse(this.customHistory.newValue);
            }
            else {
                this.formData.data = {};
            }
            this.cdRef.detectChanges();
        } else {
            this.formData.data = {};
            this.cdRef.detectChanges();
        }
        if (document.querySelector(".formio-loader-wrapper") as HTMLElement) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }
    customHistory: CustomFieldHistoryModel;
    formObject: any;
    formData = { data: {} };
    ngOnInit() {

    }

    constructor(private cdRef: ChangeDetectorRef) { }

}