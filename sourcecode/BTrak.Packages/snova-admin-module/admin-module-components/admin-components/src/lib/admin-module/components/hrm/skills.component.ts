import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SkillsModel } from '../../models/hr-models/skills-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-skills",
    templateUrl: `skills.components.html`

})

export class SkillsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertSkillsPopup") upsertSkillsPopover;
    @ViewChildren("deleteskillsPopup") deleteskillsPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    skills: SkillsModel[];
    isThereAnError = false;
    validationMessage: string;
    isFiltersVisible: boolean;
    skillsForm: FormGroup;
    skillId: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    skillName: string;
    skillsModel: SkillsModel;
    isSkillsArchived: boolean;
    skillEdit: string;

    constructor(
        private translateService: TranslateService,
        private hrManagement: HRManagementService,
        private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSkills();
    }

    getSkills() {
        this.isAnyOperationIsInprogress = true;
        const skillsModel = new SkillsModel();
        skillsModel.isArchived = this.isArchived;
        this.hrManagement.getSkills(skillsModel).subscribe((response: any) => {
            if (response.success === true) {
                this.skills = response.data;
                this.temp = this.skills;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    createSkills(skillsPopup) {
        skillsPopup.openPopover();
        this.skillEdit = this.translateService.instant("SKILLS.ADDSKILLS");
    }

    editSkills(row, skillsPopup) {
        this.skillsForm.patchValue(row);
        this.skillId = row.skillId;
        skillsPopup.openPopover();
        this.skillEdit = this.translateService.instant("SKILLS.EDITSKILLS");
        this.timeStamp = row.timeStamp;
    }

    closeUpsertSkillsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertSkillsPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.skillId = null;
        this.validationMessage = null;
        this.skillName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.skillsModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.skillsForm = new FormGroup({
            skillName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeDeleteSkillsPopup() {
        this.clearForm();
        this.deleteskillsPopup.forEach((p) => p.closePopover());
    }

    upsertSkills(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let skills = new SkillsModel();
        skills = this.skillsForm.value;
        skills.skillName = skills.skillName.trim();
        skills.skillId = this.skillId;
        skills.timeStamp = this.timeStamp;
        this.hrManagement.upsertSkills(skills).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertSkillsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getSkills();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteSkillsPopUpOpen(row, deleteskillsPopup) {
        this.skillId = row.skillId;
        this.skillName = row.skillName;
        this.timeStamp = row.timeStamp;
        this.isSkillsArchived = !this.isArchived;
        deleteskillsPopup.openPopover();
    }

    deleteSkills() {
        this.isAnyOperationIsInprogress = true;
        const skills = new SkillsModel();
        skills.skillId = this.skillId;
        skills.skillName = this.skillName;
        skills.timeStamp = this.timeStamp;
        skills.isArchived = this.isSkillsArchived;
        this.hrManagement.upsertSkills(skills).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteskillsPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getSkills();
            } else {
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
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((skill) => skill.skillName.toLowerCase().indexOf(this.searchText) > -1);
        this.skills = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
