import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { ActionCategory } from '../models/action-category.model';

import { AuditService } from '../services/audits.service';

@Component({
    selector: "action-category",
    templateUrl: "action-category.component.html",
})

export class ActionCategoryComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("editCategoryPopUp") editCategoryPopover;
    @ViewChildren("deleteCategoryPopover") deleteCategorysPopover;

    actionCategories = [];
    tempData = [];

    deleteCategoryDetails: any;

    validationMessage: string;
    anyOperationIsInprogress: boolean = false;
    upsertInProgress: boolean = false;

    actionCategoryForm: FormGroup;

    searchText: string;
    isEdit: boolean = false;
    isArchived: boolean = false;
    deleteOperationIsInprogress: boolean = false;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private toaster: ToastrService, private cdRef: ChangeDetectorRef, private auditService: AuditService, private softLabelsPipe: SoftLabelPipe) {
        super();

        this.clearForm();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
        this.getActionCategories();
    }

    getActionCategories() {
        this.anyOperationIsInprogress = true;
        this.closeSearch();
        let category = new ActionCategory();
        category.isArchived = this.isArchived;
        this.auditService.getActionCategories(category).subscribe((result: any) => {
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    this.actionCategories = result.data;
                    this.anyOperationIsInprogress = false;
                    this.tempData = JSON.parse(JSON.stringify(result.data));
                    this.cdRef.detectChanges();
                }
                else {
                    this.actionCategories = [];
                    this.anyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                }
            }
            else {
                this.actionCategories = [];
                this.anyOperationIsInprogress = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        })
    }

    clearForm() {
        this.actionCategoryForm = new FormGroup({
            actionCategoryId: new FormControl(null, []),
            actionCategoryName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(50)])),
            isArchived: new FormControl(false, []),
            timeStamp: new FormControl(null, [])
        })
    }

    upsertActionCategory() {
        this.upsertInProgress = true;
        let categoryModel = new ActionCategory();
        categoryModel = this.actionCategoryForm.value;
        this.auditService.upsertActionCategory(categoryModel).subscribe((result: any) => {
            if (result.success) {
                this.upsertInProgress = false;
                this.closePopup();
                this.clearForm();
                this.getActionCategories();
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

    changeArchiveCategory(value) {
        this.isArchived = value;
        this.cdRef.markForCheck();
        this.getActionCategories();
    }

    editActionCategory(data, categoryPopup) {
        this.isEdit = true;
        this.clearForm();
        this.actionCategoryForm.patchValue(data);
        this.cdRef.markForCheck();
        categoryPopup.openPopover();
    }

    searchByInput(value: any) {
        if (value && value.trim() != '') {
            this.searchText = value.toLowerCase();
            this.tempData = [];
            for (let i = 0; i < this.actionCategories.length; i++) {
                if (this.actionCategories[i].actionCategoryName.toLowerCase().indexOf(this.searchText) != -1) {
                    this.tempData.push(this.actionCategories[i]);
                }
            }
            this.cdRef.detectChanges();
        }
        else {
            this.searchText = null;
            this.tempData = [];
            this.tempData.push(...this.actionCategories);
            this.cdRef.detectChanges();
        }
    }

    deleteCategoryItem(data, deletePopover) {
        this.deleteCategoryDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeCategoryAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let categoryModel = new ActionCategory();
        categoryModel = Object.assign({}, this.deleteCategoryDetails);
        categoryModel.isArchived = value;
        this.auditService.upsertActionCategory(categoryModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteCategoryDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getActionCategories();
                this.closeDeleteCategoryDialog();
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

    closeDeleteCategoryDialog() {
        this.deleteCategoryDetails = null;
        this.deleteCategorysPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }

    closeSearch() {
        this.searchText = null;
        this.tempData = [];
        this.tempData.push(...this.actionCategories);
        this.cdRef.detectChanges();
    }

    closePopup() {
        this.isEdit = false;
        this.editCategoryPopover.forEach((p) => p.closePopover());
        this.actionCategoryForm.reset();
        this.cdRef.markForCheck();
    }

    openAddPopover(catgeoryPopup) {
        this.isEdit = false;
        this.clearForm();
        this.cdRef.markForCheck();
        catgeoryPopup.openPopover();
    }
}