import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetManagementService } from '../../services/timesheet-managemet.service';
import { FeedbackTypeInputModel } from '../../models/feedback-type-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-feedback-type',
    templateUrl: `feedback-type.component.html`
})

export class FeedbackTypeComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertFeedbackTypePopUp") upsertFeedbackTypePopover;
    @ViewChildren("deleteFeedbackTypePopUp") deleteFeedbackTypePopover;

   
    isAnyOperationIsInprogress: boolean = false;
    feedbackTypeInputModel: FeedbackTypeInputModel;
    isArchived: boolean = false;
    feedbackTypes: any;
    feedbackTypeForm: FormGroup;
    //formDirective: FormGroupDirective;
    validationMessage: string;
    isFiltersVisible: boolean;
    feedbackTypeId: string;
    isThereAnError: boolean = false;
    timeStamp: any;
    temp: any;
    searchText: string;
    feedbackTypeName: string;
    isFeedbackTypeArchived: boolean = false;
    edit:boolean=false;
    feedBackTimeEdit:string;
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllFeedbackTypes();
    }

    constructor(private translateService: TranslateService,private snackbar:MatSnackBar,private timeSheetService: TimeSheetManagementService,private cdRef: ChangeDetectorRef) { super();
        
         }

    createFeedbackTypePopupOpen(upsertFeedbackTypePopUp) {
        upsertFeedbackTypePopUp.openPopover();
        this.feedBackTimeEdit=this.translateService.instant('FEEDBACKTYPE.ADD');
    }

    deleteFeedbackTypePopUpOpen(row, deleteFeedbackTypePopUp) {
        this.feedbackTypeId = row.feedbackTypeId;
        this.feedbackTypeName = row.feedbackTypeName;
        this.timeStamp = row.timeStamp;
        deleteFeedbackTypePopUp.openPopover();
    }

    getAllFeedbackTypes() {
        this.isAnyOperationIsInprogress = true;

        var feedbackTypeInputModel = new FeedbackTypeInputModel();
        feedbackTypeInputModel.isArchived = this.isArchived;

        this.timeSheetService.getFeedBackType(feedbackTypeInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.feedbackTypes = response.data;
                this.temp = this.feedbackTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError=true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    upsertFeedbackType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.feedbackTypeInputModel = this.feedbackTypeForm.value;
        this.feedbackTypeInputModel.feedbackTypeName = this.feedbackTypeInputModel.feedbackTypeName.trim();
        this.feedbackTypeInputModel.feedbackTypeId = this.feedbackTypeId;
        this.feedbackTypeInputModel.timeStamp = this.timeStamp;

        this.timeSheetService.upsertFeedBackType(this.feedbackTypeInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertFeedbackTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllFeedbackTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteFeedback() {
        this.isAnyOperationIsInprogress = true;

        this.feedbackTypeInputModel = new FeedbackTypeInputModel();
        this.feedbackTypeInputModel.feedbackTypeId = this.feedbackTypeId;
        this.feedbackTypeInputModel.feedbackTypeName = this.feedbackTypeName;
        this.feedbackTypeInputModel.timeStamp = this.timeStamp;
        this.feedbackTypeInputModel.isArchived = !this.isArchived;

        this.timeSheetService.upsertFeedBackType(this.feedbackTypeInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteFeedbackTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllFeedbackTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeUpsertFeedbackTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertFeedbackTypePopover.forEach((p) => p.closePopover());
    }

    closeDeleteFeedbackTypeDialog() {
        this.isThereAnError = false;
        this.deleteFeedbackTypePopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    editFeedbackTypePopupOpen(row, upsertFeedbackTypePopUp) {
        this.feedbackTypeId = row.feedbackTypeId;
        this.feedbackTypeForm.patchValue(row);
        this.timeStamp = row.timeStamp;
        this.edit=true;
        this.feedBackTimeEdit=this.translateService.instant('FEEDBACKTYPE.EDIT');
        upsertFeedbackTypePopUp.openPopover();
    }

    clearForm() {
        this.feedbackTypeName = null;
        this.feedbackTypeId = null;
        this.feedbackTypeInputModel = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp=null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.feedbackTypeForm = new FormGroup({
            feedbackTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(feedbackType => feedbackType.feedbackTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.feedbackTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

}
