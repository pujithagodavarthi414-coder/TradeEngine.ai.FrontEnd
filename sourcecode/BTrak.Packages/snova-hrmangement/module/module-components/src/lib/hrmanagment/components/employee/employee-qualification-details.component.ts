import { Component, Input } from '@angular/core';

// import { EmployeeWorkExperienceDetailsModel } from '../../models/employee-work-experience-details-model';
// import { EmployeeEducationDetailsModel } from '../../models/employee-education-details-model';
// import { EmployeeLanguageDetailsModel } from '../../models/employee-language-details-model';
// import { EmployeeSkillDetailsModel } from '../../models/employee-skill-details-model';


import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import '../../../globaldependencies/helpers/fontawesome-icons';


@Component({
    selector: 'app-hr-component-employee-qualification-details',
    templateUrl: 'employee-qualification-details.component.html',
})

export class EmployeeQualificationDetailsComponent extends CustomAppBaseComponent {
    // @ViewChildren("upsertWorkExperienceDetailsPopover") upsertWorkExperienceDetailsPopover;
    // @ViewChildren("upsertLanguageDetailsPopover") upsertLanguageDetailsPopover;
    // @ViewChildren("upsertSkillDetailsPopover") upsertSkillDetailsPopover;
    // @ViewChildren("editEducationDetailsPopover") editEducationDetailsPopover;

    @Input() isPermission: boolean;
    // isWorkExperience: boolean;
    // isEducation: boolean;
    // isLanguage: boolean;
    // isSkill: boolean;

    @Input() selectedEmployeeId: string;
    moduleTypeId = 1;

    // editWorkExperienceDetailsData: EmployeeWorkExperienceDetailsModel;
    // editEducationDetailsData: EmployeeEducationDetailsModel;
    // editLanguageDetailsData: EmployeeLanguageDetailsModel;
    // editSkillDetailsData: EmployeeSkillDetailsModel;

    constructor(private dialog: MatDialog) {
        super();
        // this.isWorkExperience = false;
        // this.isEducation = false;
        // this.isLanguage = false;
        // this.isSkill = false;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    // addWorkExperienceDetail(upsertWorkExperienceDetailsPopup) {
    //     this.isWorkExperience = true;
    //     this.editWorkExperienceDetailsData = null;
    //     upsertWorkExperienceDetailsPopup.openPopover();
    // }

    // closeWorkExperienceDetailsPopover() {
    //     this.upsertWorkExperienceDetailsPopover.forEach((p) => p.closePopover());
    //     this.isWorkExperience = false;
    // }

    // addEducationDetail(editEducationDetailsPopover) {
    //     this.isEducation = true;
    //     this.editEducationDetailsData = null;
    //     editEducationDetailsPopover.openPopover();
    // }

    // closeUpsertEducationDetailsPopover() {
    //     this.editEducationDetailsPopover.forEach((p) => p.closePopover());
    //     this.isEducation = false;
    // }

    // addLanguageDetails(upsertLanguageDetailsPopover) {
    //     this.isLanguage = true;
    //     this.editLanguageDetailsData = null;
    //     upsertLanguageDetailsPopover.openPopover();
    // }

    // closeLanguageDetailsPopover() {
    //     this.upsertLanguageDetailsPopover.forEach((p) => p.closePopover());
    //     this.isLanguage = false;
    // }

    // addSkillDetails(upsertSkillDetailsPopover) {
    //     this.isSkill = true;
    //     this.editSkillDetailsData = null;
    //     upsertSkillDetailsPopover.openPopover();
    // }

    // closeSkillDetailsPopover() {
    //     this.upsertSkillDetailsPopover.forEach((p) => p.closePopover());
    //     this.isSkill = false;
    // }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.selectedEmployeeId, referenceTypeId: ConstantVariables.WorkexperienceReferenceTypeId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }
}