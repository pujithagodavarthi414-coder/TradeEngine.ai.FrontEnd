import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { EducationModel } from '../../models/hr-models/education-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-education',
    templateUrl: `educationlevel.component.html`

})

export class EducationlevelComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("educationPopup") upsertEducationPopover;
    @ViewChildren("deleteeducationPopup") deleteeducationPopup;


    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    education: EducationModel[];
    isThereAnError: boolean = false;
    validationMessage: string;
    educationLevelId: string;
    educationLevelName: string;
    educationModel: EducationModel;
    timeStamp: any;
    temp: any;
    educationForm: FormGroup;
    isEducationArchived: boolean;
    isFiltersVisible: boolean;
    searchText: string;
    educations:string;

    constructor(private translateService: TranslateService,private cdref:ChangeDetectorRef,
         private hrManagement: HRManagementService, private snackbar: MatSnackBar) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getEducation();
    }

    getEducation() {
        this.isAnyOperationIsInprogress = true;
        var educationModel = new EducationModel();
        educationModel.isArchived = this.isArchived;
        this.hrManagement.getEducation(educationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.education = response.data;
                this.temp = this.education;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    createEducation(educationPopup) {
        educationPopup.openPopover();
        this.educations=this.translateService.instant('EDUCATIONLEVEL.ADDEDUCATIONLEVELTITLE');
    }

    closeUpsertEducationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEducationPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.educationLevelId = null;
        this.validationMessage = null;
        this.educationLevelName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.educationModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.educationForm = new FormGroup({
            educationLevelName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    upsertEducation(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let education = new EducationModel();
        education = this.educationForm.value;
        education.educationLevelName =  education.educationLevelName.trim();
        education.educationLevelId = this.educationLevelId;

        education.timeStamp = this.timeStamp;

        this.hrManagement.upsertEducation(education).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertEducationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getEducation();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }
    editEducation(rowDetails, educationPopup) {
        this.educationForm.patchValue(rowDetails);
        this.educationLevelId = rowDetails.educationLevelId;
        educationPopup.openPopover();
        this.educations=this.translateService.instant('EDUCATIONLEVEL.EDITEDUCATION');
        this.timeStamp = rowDetails.timeStamp;
    }

    deleteEducationPopUpOpen(row, deleteeducationPopup) {
        this.educationLevelId = row.educationLevelId;
        this.educationLevelName = row.educationLevelName;
        this.timeStamp = row.timeStamp;
        this.isEducationArchived = !this.isArchived;
        deleteeducationPopup.openPopover();
    }


    deleteEducation() {
        this.isAnyOperationIsInprogress = true;
        let educationModel = new EducationModel();
        educationModel.educationLevelId = this.educationLevelId;
        educationModel.educationLevelName = this.educationLevelName;
        educationModel.timeStamp = this.timeStamp;
        educationModel.isArchived = this.isEducationArchived;

        this.hrManagement.upsertEducation(educationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteeducationPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getEducation();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    closeDeleteEducationPopup() {
        this.clearForm();
        this.deleteeducationPopup.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(educationLevel => educationLevel.educationLevelName.toLowerCase().indexOf(this.searchText) > -1);
        this.education = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}