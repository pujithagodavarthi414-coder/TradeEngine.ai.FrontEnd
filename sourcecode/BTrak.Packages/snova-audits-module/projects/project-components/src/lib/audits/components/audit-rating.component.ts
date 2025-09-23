import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditRating } from '../models/audit-rating.model';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';

import { AuditService } from '../services/audits.service';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "audit-rating",
    templateUrl: "audit-rating.component.html",
})

export class AuditRatingComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("editRatingPopUp") editRatingPopover;
    @ViewChildren("deleteRatingPopover") deleteRatingsPopover;

    auditRatings = [];
    tempData = [];

    deleteRatingDetails: any;

    validationMessage: string;
    anyOperationIsInprogress: boolean = false;
    upsertInProgress: boolean = false;

    auditRatingForm: FormGroup;

    searchText: string;
    isEdit: boolean = false;
    isArchived: boolean = false;
    deleteOperationIsInprogress: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private toaster: ToastrService, private cdRef: ChangeDetectorRef, private auditService: AuditService,private softLabelsPipe: SoftLabelPipe) {
        super();

        this.clearForm();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAuditRatings();
    }

    getAuditRatings() {
        this.anyOperationIsInprogress = true;
        this.closeSearch();
        let rating = new AuditRating();
        rating.isArchived = this.isArchived;
        this.auditService.getAuditRatings(rating).subscribe((result: any) => {
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    this.auditRatings = result.data;
                    this.anyOperationIsInprogress = false;
                    this.tempData = JSON.parse(JSON.stringify(result.data));
                    this.cdRef.detectChanges();
                }
                else {
                    this.auditRatings = [];
                    this.anyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                }
            }
            else {
                this.auditRatings = [];
                this.anyOperationIsInprogress = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        })
    }

    clearForm() {
        this.auditRatingForm = new FormGroup({
            auditRatingId: new FormControl(null, []),
            auditRatingName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(50)])),
            isArchived: new FormControl(false, []),
            timeStamp: new FormControl(null, [])
        })
    }

    upsertAuditRating() {
        this.upsertInProgress = true;
        let ratingModel = new AuditRating();
        ratingModel = this.auditRatingForm.value;
        this.auditService.upsertAuditRating(ratingModel).subscribe((result: any) => {
            if (result.success) {
                this.upsertInProgress = false;
                this.closePopup();
                this.clearForm();
                this.getAuditRatings();
                this.cdRef.markForCheck();
            }
            else {
                this.upsertInProgress = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.cdRef.detectChanges();
            }
        })
    }

    changeArchiveRating(value) {
        this.isArchived = value;
        this.cdRef.markForCheck();
        this.getAuditRatings();
    }

    editAuditRating(data, ratingPopup) {
        this.isEdit = true;
        this.clearForm();
        this.auditRatingForm.patchValue(data);
        this.cdRef.markForCheck();
        ratingPopup.openPopover();
    }

    searchByInput(value: any) {
        if (value && value.trim() != '') {
            this.searchText = value.toLowerCase();
            this.tempData = [];
            for (let i = 0; i < this.auditRatings.length; i++) {
                if (this.auditRatings[i].auditRatingName.toLowerCase().indexOf(this.searchText) != -1) {
                    this.tempData.push(this.auditRatings[i]);
                }
            }
            this.cdRef.detectChanges();
        }
        else {
            this.searchText = null;
            this.tempData = [];
            this.tempData.push(...this.auditRatings);
            this.cdRef.detectChanges();
        }
    }

    deleteRatingItem(data, deletePopover) {
        this.deleteRatingDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeRatingAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let ratingModel = new AuditRating();
        ratingModel = Object.assign({}, this.deleteRatingDetails);
        ratingModel.isArchived = value;
        this.auditService.upsertAuditRating(ratingModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteRatingDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getAuditRatings();
                this.closeDeleteRatingDialog();
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.deleteOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    closeDeleteRatingDialog() {
        this.deleteRatingDetails = null;
        this.deleteRatingsPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }

    closeSearch() {
        this.searchText = null;
        this.tempData = [];
        this.tempData.push(...this.auditRatings);
        this.cdRef.detectChanges();
    }

    closePopup() {
        this.isEdit = false;
        this.editRatingPopover.forEach((p) => p.closePopover());
        this.auditRatingForm.reset();
        this.cdRef.markForCheck();
    }

    openAddPopover(ratingPopup) {
        this.isEdit = false;
        this.clearForm();
        this.cdRef.markForCheck();
        ratingPopup.openPopover();
    }
}