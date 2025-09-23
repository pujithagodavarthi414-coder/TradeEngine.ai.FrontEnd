import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { LanguageModel } from '../../models/hr-models/language-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-language",
    templateUrl: `language.component.html`

})

export class LanguagesComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertLanguagePopup") upsertLanguagePopup;
    @ViewChildren("deletelanguagePopup") deletelanguagePopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    validationMessage: string;
    isThereAnError = false;
    temp: any;
    languages: LanguageModel[];
    timeStamp: any;
    searchText: string;
    languageName: string;
    languageId: string;
    languageModel: LanguageModel;
    languageForm: FormGroup;
    isFiltersVisible: boolean;
    isLanguageArchived: boolean;
    language: string;

    constructor(
        private translateService: TranslateService,
        private hrManagement: HRManagementService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getLanguage();
    }

    getLanguage() {
        this.isAnyOperationIsInprogress = true;
        const languageModel = new LanguageModel();
        languageModel.isArchived = this.isArchived;
        this.hrManagement.getLanguage(languageModel).subscribe((response: any) => {
            if (response.success === true) {
                this.languages = response.data;
                this.temp = this.languages;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.languageId = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.languageModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.languageForm = new FormGroup({
            languageName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    createLanguagePopupOpen(languagePopup) {
        languagePopup.openPopover();
        this.language = this.translateService.instant("LANGUAGE.ADDLANGUAGETITLE");
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(((language) => (language.languageName.toLowerCase().indexOf(this.searchText) > -1)));
        this.languages = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    upsertLanguage(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let languageModel = new LanguageModel();
        languageModel = this.languageForm.value;
        languageModel.languageName = languageModel.languageName.trim();
        languageModel.languageId = this.languageId;
        languageModel.timeStamp = this.timeStamp;
        this.hrManagement.upsertLanguage(languageModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertLanguagePopup.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getLanguage();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    editLanguagePopupOpen(row, upsertLanguagePopup) {
        this.languageForm.patchValue(row);
        this.languageId = row.languageId;
        this.timeStamp = row.timeStamp;
        this.language = this.translateService.instant("LANGUAGE.EDITLANGUAGE");
        upsertLanguagePopup.openPopover();
    }

    closeUpsertLanguagePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLanguagePopup.forEach((p) => p.closePopover());
    }

    deleteLanguagePopUpOpen(row, deletelanguagePopup) {
        this.languageId = row.languageId;
        this.languageName = row.languageName;
        this.timeStamp = row.timeStamp;
        this.isLanguageArchived = !this.isArchived;
        deletelanguagePopup.openPopover();
    }

    deleteLanguage() {
        this.isAnyOperationIsInprogress = true;
        const languageModel = new LanguageModel();
        languageModel.languageId = this.languageId;
        languageModel.languageName = this.languageName;
        languageModel.timeStamp = this.timeStamp;
        languageModel.isArchived = this.isLanguageArchived;
        this.hrManagement.upsertLanguage(languageModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletelanguagePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getLanguage();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeleteLanguagePopup() {
        this.clearForm();
        this.deletelanguagePopup.forEach((p) => p.closePopover());
    }
}
