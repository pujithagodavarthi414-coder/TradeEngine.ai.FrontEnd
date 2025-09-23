import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { WebHookModel } from '../../models/hr-models/webhook-model';

@Component({
    selector: 'app-fm-component-webhook',
    templateUrl: `webhook.component.html`
})

export class WebHookComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("webhookPopup") upsertWebHookPopover;
    @ViewChildren("deleteWebHookPopup") deletewebhookPopup;

    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isThereAnError: boolean;
    validationMessage: any;
    webHookId: any;
    webhookForm: FormGroup;
    webhookModel: WebHookModel;
    timeStamp: any;
    webhook: WebHookModel[];
    isFiltersVisible: boolean;
    webHookName: string;
    temp: any;
    searchText: string;
    isWebHookArchived: boolean;
    webhookEdit: string;
    webHookUrl: string;

    constructor(
        private translateService: TranslateService, public hrManagement: HRManagementService
        , private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
            super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getwebhook();
    }

    getwebhook() {
        this.isAnyOperationIsInprogress = true;
        var webhookModel = new WebHookModel();
        webhookModel.isArchived = this.isArchived;

        this.hrManagement.getwebhook(webhookModel).subscribe((response: any) => {
            if (response.success == true) {
                this.webhook = response.data;
                this.temp = this.webhook;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    createWebHook(webhookPopup) {
        webhookPopup.openPopover();
        this.webhookEdit = this.translateService.instant('WEBHOOK.ADDWEBHOOKTITLE');
    }

    editWebHook(row, webhookPopup) {
        this.webhookForm.patchValue(row);
        this.webHookId = row.webHookId;
        webhookPopup.openPopover();
        this.webhookEdit = this.translateService.instant('WEBHOOK.EDITWEBHOOK');
        this.timeStamp = row.timeStamp;
    }

    clearForm() {
        this.webHookId = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
        this.webHookName = null;
        this.webHookUrl = null;
        this.webhookModel = null;
        this.searchText = null;
        this.webhookForm = new FormGroup({
            webHookName: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(50)
                ])
            ),
            webHookUrl: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    upsertWebHook(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let webhook = new WebHookModel();
        webhook = this.webhookForm.value;
        webhook.webHookName = webhook.webHookName.trim();
        webhook.webHookUrl = webhook.webHookUrl.trim();
        if (this.webHookId) {
            webhook.webHookId = this.webHookId;
            webhook.timeStamp = this.timeStamp;
        }
        this.hrManagement.upsertWebHook(webhook).subscribe((response: any) => {
            if (response.success == true) {
                this.closeupsertWebHookPopup(formDirective);
                this.getwebhook();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    closeupsertWebHookPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertWebHookPopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteWebHookPopupOpen(row, deletewebhookPopup) {
        this.webHookId = row.webHookId;
        this.webHookName = row.webHookName;
        this.webHookUrl = row.webHookUrl;
        this.timeStamp = row.timeStamp;
        this.isWebHookArchived = !this.isArchived;
        deletewebhookPopup.openPopover();
    }

    closeWebHookPopup() {
        this.clearForm();
        this.deletewebhookPopup.forEach((p) => p.closePopover());
    }

    deleteWebHook() {
        this.isAnyOperationIsInprogress = true;

        let webhookModel = new WebHookModel();
        webhookModel.webHookId = this.webHookId;
        webhookModel.webHookName = this.webHookName;
        webhookModel.webHookUrl = this.webHookUrl;
        webhookModel.timeStamp = this.timeStamp;
        webhookModel.isArchived = this.isWebHookArchived;

        this.hrManagement.upsertWebHook(webhookModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeWebHookPopup();
                this.getwebhook();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((webhook => (webhook.webHookName.toLowerCase().indexOf(this.searchText) > -1) || (webhook.webHookUrl.toLowerCase().indexOf(this.searchText) > -1)));
        this.webhook = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    validateUrl(value) {
        var expression = "[-a-zA-Z0-9@:%_\/+.~#?&=]{2,256}\.[a-z]{2,4}(\/[-a-zA-Z0-9@:%_\+.~#?&=]*)?";
        var regex = new RegExp(expression);
        if (value.match(regex)) {
            return true;
        } else {
            return false;
        }
    }

    navigateToPage(url) {
        if (!url.includes("http")) {
            url = 'http://' + url;
        }
        window.open(url, '_blank');
    }
}
