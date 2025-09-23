import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { RecruitmentService } from '../services/recruitment.service';
import { RatingTypeUpsertModel } from '../models/ratingTypeUpsertModel';
import { ToastrService } from 'ngx-toastr';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-am-component-rating-type',
    templateUrl: `rating-type.component.html`
})

export class RatingTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren('upsertRatingTypePopUp') upsertRatingTypePopover;
    @ViewChildren('deleteRatingTypePopup') deleteRatingTypePopover;
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
    value: string;
    isAnyOperationIsInprogress = true;
    isFromRoute = false;
    isArchived = false;
    ratingTypes: RatingTypeUpsertModel[];
    validationMessage: string;
    isFiltersVisible = false;
    isThereAnError: boolean;
    ratingTypeForm: FormGroup;
    timeStamp: any;
    temp: any;
    searchText: string;
    interviewRatingId: string;
    interviewRatingName: string;
    loading = false;
    ratingTypeTitle: string;

    constructor(
        private recruitmentService: RecruitmentService, private cdRef: ChangeDetectorRef,
        private translateService: TranslateService, private toastr: ToastrService) {
        super();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getRatingTypes();
    }

    getRatingTypes() {
        this.isAnyOperationIsInprogress = true;
        const ratingTypeModel = new RatingTypeUpsertModel();
        ratingTypeModel.isArchived = this.isArchived;
        this.recruitmentService.getRatingTypes(ratingTypeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                this.clearForm();
                this.ratingTypes = response.data;
                this.temp = this.ratingTypes;
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

    createRatingType(upsertRatingTypePopUp) {
        upsertRatingTypePopUp.openPopover();
        this.ratingTypeTitle = this.translateService.instant('RATINGTYPES.ADDRATINGTYPETITLE');
    }

    closeUpsertRatingTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();

        this.upsertRatingTypePopover.forEach((p) => p.closePopover());
    }

    editRatingType(row, upsertRatingTypePopUp) {
        this.ratingTypeForm.patchValue(row);
        this.interviewRatingId = row.interviewRatingId;
        this.interviewRatingName = row.interviewRatingName;
        this.value = row.value;
        this.timeStamp = row.timeStamp;
        this.ratingTypeTitle = this.translateService.instant('RATINGTYPES.EDITRATINGTYPETITLE');
        upsertRatingTypePopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    upsertRatingType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let ratingType = new RatingTypeUpsertModel();
        ratingType = this.ratingTypeForm.value;
        ratingType.interviewRatingName = ratingType.interviewRatingName.toString().trim();
        ratingType.Value = ratingType.Value;
        ratingType.interviewRatingId = this.interviewRatingId;
        ratingType.timeStamp = this.timeStamp;
        this.recruitmentService.upsertRatingType(ratingType).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                formDirective.resetForm();
                this.clearForm();
                this.upsertRatingTypePopover.forEach((p) => p.closePopover());
                this.getRatingTypes();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.interviewRatingName = null;
        this.interviewRatingId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.value = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.ratingTypeForm = new FormGroup({
            interviewRatingName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            value: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
        });
    }

    deleteRatingTypePopupOpen(row, deleteRatingTypePopup) {
        this.interviewRatingId = row.interviewRatingId;
        this.interviewRatingName = row.interviewRatingName;
        this.value = row.value;
        this.timeStamp = row.timeStamp;
        deleteRatingTypePopup.openPopover();
    }

    closeDeleteRatingTypePopup() {
        this.clearForm();
        this.deleteRatingTypePopover.forEach((p) => p.closePopover());
    }

    deleteRatingType() {
        this.isAnyOperationIsInprogress = true;
        const ratingTypeInputModel = new RatingTypeUpsertModel();
        ratingTypeInputModel.interviewRatingId = this.interviewRatingId;
        ratingTypeInputModel.interviewRatingName = this.interviewRatingName;
        ratingTypeInputModel.Value = this.value;
        ratingTypeInputModel.timeStamp = this.timeStamp;
        ratingTypeInputModel.isArchived = !this.isArchived;
        this.recruitmentService.upsertRatingType(ratingTypeInputModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteRatingTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getRatingTypes();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = '';
        }
        const temp = this.temp.filter(ratingType => (ratingType.interviewRatingName.toLowerCase().indexOf(this.searchText) > -1)
         || (ratingType.value.toString().indexOf(this.searchText) > -1));
        this.ratingTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
    closeUpsertRatingTypePopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertRatingTypePopover.forEach((p) => p.closePopover());
    }
}
