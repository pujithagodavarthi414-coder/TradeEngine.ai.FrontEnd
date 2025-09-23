import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { RecruitmentService } from '../services/recruitment.service';
import { SourceUpsertModel } from '../models/sourceUpsertModel';
import { ToastrService } from 'ngx-toastr';
import * as $_ from 'jquery';
const $ = $_;
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-am-component-source',
    templateUrl: `source.component.html`
})

export class StatusComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren('upsertSourcePopUp') upsertSourcePopover;
    @ViewChildren('deleteSourcePopup') deleteSourcePopover;
    @Input('dashboardFilters')
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input('fromRoute')
    set _fromRoute(data: boolean) {
        if (data || data === false) {
            this.isFromRoute = data; } else {
            this.isFromRoute = true; }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = true;
    isArchived = false;
    sources: SourceUpsertModel[];
    validationMessage: string;
    isFiltersVisible = false;
    isThereAnError: boolean;
    sourceForm: FormGroup;
    isFromRoute = false;
    isReferenceNumberNeeded = false;
    timeStamp: any;
    temp: any;
    searchText: string;
    sourceId: string;
    name: string;
    loading = false;
    sourceTitle: string;

    constructor(
        private recruitmentService: RecruitmentService, private cdRef: ChangeDetectorRef,
        private translateService: TranslateService, private toastr: ToastrService) {
        super();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSources();
    }

    getSources() {
        this.isAnyOperationIsInprogress = true;
        const sourceModel = new SourceUpsertModel();
        sourceModel.isArchived = this.isArchived;
        this.recruitmentService.getSources(sourceModel).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                this.clearForm();
                this.sources = response.data;
                this.temp = this.sources;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    createSource(upsertSourcePopUp) {
        upsertSourcePopUp.openPopover();
        this.sourceTitle = this.translateService.instant('SOURCES.ADDSOURCETITLE');
    }

    closeUpsertSourcePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertSourcePopover.forEach((p) => p.closePopover());
    }

    editSource(row, upsertSourcePopUp) {
        this.sourceForm.patchValue(row);
        this.sourceId = row.sourceId;
        this.name = row.name;
        this.timeStamp = row.timeStamp;
        this.sourceTitle = this.translateService.instant('SOURCES.EDITSOURCETITLE');
        upsertSourcePopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    upsertSource(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let source = new SourceUpsertModel();
        source = this.sourceForm.value;
        source.name = source.name.toString().trim();
        source.isReferenceNumberNeeded = source.isReferenceNumberNeeded;
        source.sourceId = this.sourceId;
        source.timeStamp = this.timeStamp;

        this.recruitmentService.upsertSource(source).subscribe((response: any) => {
            if (response.success === true) {
                this.clearForm();
                formDirective.resetForm();
                this.upsertSourcePopover.forEach((p) => p.closePopover());
                this.getSources();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.name = null;
        this.sourceId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isReferenceNumberNeeded = false;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.sourceForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            isReferenceNumberNeeded: new FormControl('',
                Validators.compose([

                ])
            )
        });
    }

    deleteSourcePopupOpen(row, deleteSourcePopup) {
        this.sourceId = row.sourceId;
        this.name = row.name;
        this.isReferenceNumberNeeded = row.isReferenceNumberNeeded;
        this.timeStamp = row.timeStamp;
        deleteSourcePopup.openPopover();
    }

    closeDeleteSourcePopup() {
        this.clearForm();
        this.deleteSourcePopover.forEach((p) => p.closePopover());
    }

    deleteSource() {
        this.isAnyOperationIsInprogress = true;
        const sourceInputModel = new SourceUpsertModel();
        sourceInputModel.sourceId = this.sourceId;
        sourceInputModel.name = this.name;
        sourceInputModel.isReferenceNumberNeeded = this.isReferenceNumberNeeded;
        sourceInputModel.timeStamp = this.timeStamp;
        sourceInputModel.isArchived = !this.isArchived;
        this.recruitmentService.upsertSource(sourceInputModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteSourcePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getSources();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = '';
        }
        const temp = this.temp.filter(source => (source.name.toLowerCase().indexOf(this.searchText) > -1)
         || (source.isReferenceNumberNeeded.toString().indexOf(this.searchText) > -1));

        this.sources = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
    closeUpsertSourcePopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertSourcePopover.forEach((p) => p.closePopover());
    }

    fitContent(optionalParameters?: any) {
        try {
            if (optionalParameters) {
                let parentElementSelector = '';
                let minHeight = '';
                if (optionalParameters['popupView'.toString()]) {
                    parentElementSelector = optionalParameters['popupViewSelector'.toString()];
                    minHeight = `calc(90vh - 200px)`;
                } else if (optionalParameters['gridsterView'.toString()]) {
                    parentElementSelector = optionalParameters['gridsterViewSelector'.toString()];
                    minHeight = `${$(parentElementSelector).height() - 40}px`;
                } else if (optionalParameters['individualPageView'.toString()]) {
                    parentElementSelector = optionalParameters['individualPageSelector'.toString()];
                    minHeight = `calc(100vh - 85px)`;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

}
