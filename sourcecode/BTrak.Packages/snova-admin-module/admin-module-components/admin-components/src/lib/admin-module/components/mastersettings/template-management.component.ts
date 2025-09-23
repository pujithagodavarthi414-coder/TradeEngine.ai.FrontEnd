import { Component, ViewChildren, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HtmlTemplateModel } from '../../models/htmltemplate-type-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ENTER, COMMA } from "@angular/cdk/keycodes";

@Component({
    selector: 'app-fm-component-template-management',
    templateUrl: `template-management.component.html`

})

export class TemplatesComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("formDirective") formDirective;
    @ViewChild("formDirectiveCopy") formDirectiveCopy;
    @ViewChildren("htmlTemplatePopup") upsertHtmlTemplatePopover;
    @ViewChildren("configureTemplatePopup") configureTemplatePopover;
    @ViewChildren("deleteHtmlTemplatePopup") deletehtmltemplatePopup;
    @ViewChildren("htmlTemplateCopyPopup") htmlTemplateCopyPopup;

    isAnyOperationIsInprogress: boolean = true;
    isHtmlTemplateArchived: boolean = false;
    isArchived: boolean = false;
    htmlTemplateModel: HtmlTemplateModel[];
    validationMessage: string;
    isFiltersVisible: boolean = false;
    isThereAnError: boolean;
    htmlTemplateForm: FormGroup;
    count = 0;
    isRoleBased: boolean = false;
    isNone: boolean = true;
    isMailBased: boolean = false;
    isConfigurable: boolean = false;
    toMailsList: any[] = [];
    toMail: string;
    rolesDropDown: any[];
    selectable: boolean = true;
    removable = true;
    roleIds: any[];
    configureTemplateForm: FormGroup;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    htmlTemplateFormDetails: FormGroup;
    timeStamp: any;
    temp: HtmlTemplateModel[];
    searchText: string;
    htmlTemplateId: string;
    htmlTemplateName: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    htmltemplatedata: HtmlTemplateModel[];
    htmlTemplateEdit: string;
    htmlTemplate: string;
    htmlTemplateCopy: string;
    isAnyOperationIsInprogressCopy: boolean;


    constructor(
        private masterDataManagementService: MasterDataManagementService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.GetAllRoles();
        this.clearFormDetails();
        this.gethtmltemplate();
    }

    GetAllRoles() {
        this.masterDataManagementService.GetallRoles()
            .subscribe((responseData: any) => {
                console.log(responseData);
                this.rolesDropDown = responseData.data;
                this.roleIds = this.rolesDropDown.map(x => x.roleId);
            });
    }

    gethtmltemplate() {
        this.isAnyOperationIsInprogress = true;
        var htmlTemplateModel = new HtmlTemplateModel();
        htmlTemplateModel.isArchived = this.isArchived;
        this.masterDataManagementService.getHtmlTemplate(htmlTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success == true) {
                this.htmltemplatedata = response.data;
                this.temp = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    clearFormDetails() {
        this.htmlTemplateFormDetails = new FormGroup({
            htmlTemplateName: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            ),
        });
    }

    gethtmltemplatecopy(row, formDirective) {
        this.htmlTemplateCopy = row.htmlTemplate;
        formDirective.openPopover();
    }

    createHtmlTemplate(htmlTemplatePopup) {
        htmlTemplatePopup.openPopover();
        this.htmlTemplateEdit = this.translateService.instant('HTMLTEMPLATE.ADDHTMLTEMPLATETITLE');
    }

    editHtmlTemplate(row, htmlTemplatePopup) {
        this.htmlTemplateForm.patchValue(row);
        this.htmlTemplateId = row.htmlTemplateId;
        this.isConfigurable = row.isConfigurable;
        htmlTemplatePopup.openPopover();
        this.htmlTemplateEdit = this.translateService.instant('HTMLTEMPLATE.EDITHTMLTEMPLATE');
        this.timeStamp = row.timeStamp;
    }

    configureTemplate(row, configureTemplatePopup) {
        this.clearForm();
        this.isRoleBased = row.isRoleBased;
        this.isMailBased = row.isMailBased;
        this.isNone = !row.isRoleBased && !row.isMailBased ? true : false;
        this.isConfigurable = row.isConfigurable;
        this.htmlTemplateForm.patchValue(row);
        this.htmlTemplateId = row.htmlTemplateId;
        this.timeStamp = row.timeStamp;
        this.toMailsList = this.isMailBased ? row.mailUrls : [];
        const type = this.isMailBased ? "1" : this.isRoleBased ? "0" : "2";
        this.configureTemplateForm = new FormGroup({
            configurationType: new FormControl(type,
                Validators.compose([
                    Validators.required
                ])
            ),
            selectedRoleIds: new FormControl(row.selectedRoleIds,
                Validators.compose([
                    Validators.required
                ])
            )
        });
        if(this.isMailBased || this.isNone) {
            this.configureTemplateForm.controls["selectedRoleIds"].clearValidators();
            this.configureTemplateForm.get("selectedRoleIds").updateValueAndValidity();
        }
        configureTemplatePopup.openPopover();
    }

    onChange(mrChange: MatRadioChange) {
        if (mrChange.value == 0) {
            this.isRoleBased = true;
            this.isMailBased = false;
            this.isNone = false;
            this.configureTemplateForm.controls["selectedRoleIds"].setValidators([Validators.required]);
            this.configureTemplateForm.get("selectedRoleIds").updateValueAndValidity();
        } else if (mrChange.value == 1) {
            this.toMailsList = [];
            this.isRoleBased = false;
            this.isMailBased = true;
            this.isNone = false;
            this.configureTemplateForm.controls["selectedRoleIds"].clearValidators();
            this.configureTemplateForm.get("selectedRoleIds").updateValueAndValidity();
        } else if (mrChange.value == 2) {
            this.toMailsList = [];
            this.isRoleBased = false;
            this.isNone = true;
            this.isMailBased = false;
            this.configureTemplateForm.controls["selectedRoleIds"].clearValidators();
            this.configureTemplateForm.get("selectedRoleIds").updateValueAndValidity();
        }
        this.toMailsList = [];
        this.configureTemplateForm.get("selectedRoleIds").patchValue([]);
        this.configureTemplateForm.get("selectedRoleIds").markAsUntouched();
        this.cdRef.detectChanges();
    }

    checkIsConfigurationDisabled() {
        if (!this.isAnyOperationIsInprogress && ((this.isRoleBased || this.isMailBased) && (this.configureTemplateForm.valid) && (!this.isMailBased || (this.isMailBased && this.toMailsList.length > 0))) || this.isNone) {
            return false;
        } else {
            return true;
        }
    }

    closeUpsertConfigurationPopup() {
        this.clearForm();
        this.configureTemplatePopover.forEach(p => p.closePopover());
    }

    disabledButton(enteredText, tags) {
        if (tags && (enteredText === "Enter" || enteredText === "Comma")) {
            this.count = 1;
        } else {
            if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                this.count = 0;
            } else {
                this.count = 1;
            }
        }
    }

    addToMailIds(event: MatChipInputEvent) {
        const inputTags = event.input;
        const userStoryTags = event.value.trim();
        if (userStoryTags != null && userStoryTags != "") {
            let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            if (regexpEmail.test(userStoryTags)) {
                this.toMailsList.push(userStoryTags);
                this.count++;
            } else {
                this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
            }
        }
        if (inputTags) {
            inputTags.value = " ";
        }
    }

    removeToMailId(toMail) {
        const index = this.toMailsList.indexOf(toMail);
        if (index >= 0) {
            this.toMailsList.splice(index, 1);
        }
        if (this.toMailsList.length === 0) {
            this.count = 1;
        }
    }

    clearForm() {
        this.htmlTemplateId = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
        this.htmlTemplateName = null;
        this.htmlTemplateModel = null;
        this.searchText = null;
        this.toMail = null;
        this.isConfigurable = false;
        this.isRoleBased = false;
        this.isNone = true;
        this.isMailBased = false;
        this.toMailsList = [];
        this.count = 0;
        this.htmlTemplateForm = new FormGroup({
            htmlTemplateName: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            ),
            htmlTemplate: new FormControl(null, [])
        });
        this.configureTemplateForm = new FormGroup({
            configurationType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            selectedRoleIds: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        });
    }

    upsertHtmlTemplateCopy() {
        this.isAnyOperationIsInprogressCopy = true;
        let htmlTemplateModel = new HtmlTemplateModel();
        htmlTemplateModel = this.htmlTemplateFormDetails.value;
        htmlTemplateModel.htmlTemplate = this.htmlTemplateCopy;
        this.masterDataManagementService.upsertHtmlTemplate(htmlTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogressCopy = false;
            if (response.success == true) {
                this.closeUpsertHtmlTemplateCopyPopup();
                this.gethtmltemplate();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    closeUpsertHtmlTemplateCopyPopup() {
        this.clearFormDetails();
        this.htmlTemplateCopy = null;
        this.formDirectiveCopy.resetForm();
        this.htmlTemplateCopyPopup.forEach((p) => p.closePopover());
    }

    upsertHtmlTemplate() {
        this.isAnyOperationIsInprogress = true;
        let htmlTemplateModel = new HtmlTemplateModel();
        htmlTemplateModel = this.htmlTemplateForm.value;
        htmlTemplateModel.htmlTemplateName = htmlTemplateModel.htmlTemplateName.trim();
        htmlTemplateModel.htmlTemplate = htmlTemplateModel.htmlTemplate.trim();
        htmlTemplateModel.isRoleBased = this.isRoleBased;
        htmlTemplateModel.isConfigurable = this.isConfigurable;
        htmlTemplateModel.isMailBased = this.isMailBased;
        htmlTemplateModel.selectedRoleIds = this.configureTemplateForm.get("selectedRoleIds").value;
        htmlTemplateModel.mailUrls = this.toMailsList;
        if (this.htmlTemplateId) {
            htmlTemplateModel.htmlTemplateId = this.htmlTemplateId;
            htmlTemplateModel.timeStamp = this.timeStamp;
        }
        this.masterDataManagementService.upsertHtmlTemplate(htmlTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success == true) {
                this.closeupsertHtmlTemplatePopup();
                this.closeUpsertConfigurationPopup();
                this.gethtmltemplate();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    closeupsertHtmlTemplatePopup() {
        this.clearForm();
        this.upsertHtmlTemplatePopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteHtmlTemplatePopupOpen(row, deletehtmltemplatePopup) {
        this.htmlTemplateId = row.htmlTemplateId;
        this.htmlTemplateName = row.htmlTemplateName;
        this.htmlTemplate = row.htmlTemplate;
        this.timeStamp = row.timeStamp;
        this.isHtmlTemplateArchived = !this.isArchived;
        deletehtmltemplatePopup.openPopover();
    }

    closeHtmlTemplatePopup() {
        this.htmlTemplateId = null;
        this.htmlTemplateName = null;
        this.htmlTemplate = null;
        this.timeStamp = null;
        this.isHtmlTemplateArchived = null;
        this.deletehtmltemplatePopup.forEach((p) => p.closePopover());
    }

    deleteHtmlTemplate() {
        this.isAnyOperationIsInprogress = true;
        let htmlTemplateModel = new HtmlTemplateModel();
        htmlTemplateModel.htmlTemplateId = this.htmlTemplateId;
        htmlTemplateModel.htmlTemplateName = this.htmlTemplateName;
        htmlTemplateModel.htmlTemplate = this.htmlTemplate;
        htmlTemplateModel.timeStamp = this.timeStamp;
        htmlTemplateModel.isArchived = this.isHtmlTemplateArchived;
        this.masterDataManagementService.upsertHtmlTemplate(htmlTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success == true) {
                this.closeHtmlTemplatePopup();
                this.gethtmltemplate();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
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

        const temp = this.temp.filter((htmltemplate => (htmltemplate.htmlTemplateName.toLowerCase().indexOf(this.searchText) > -1) || (htmltemplate.htmlTemplate.toLowerCase().indexOf(this.searchText) > -1)));
        this.htmltemplatedata = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
