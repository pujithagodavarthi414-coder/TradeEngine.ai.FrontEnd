import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { CompanysettingsModel } from '../../models/company-model';
import { ProjectManagementService } from '../../services/project-management.service';
import { BugPriorityModel } from '../../models/projects/bug-priority-model';
import { BugPriorityDropDownData } from '../../models/projects/bugPriorityDropDown';
import { ConstantVariables } from '../../helpers/constant-variables';
import { TranslateService } from '@ngx-translate/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective  | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }

@Component({
    selector: 'app-fm-component-bug-priority',
    templateUrl: `bug-priority.component.html`

})

export class BugPriorityComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertBugPriorityPopUp") upsertBugPriorityPopover;
    @ViewChildren("archiveBugPriorityPopUp") archiveBugPriorityPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    companySettingsModel$: any[];
    dashboardFilters: DashboardFilterModel;
    bugPriorityForm: FormGroup;
    bugPriorityModel: BugPriorityModel;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean = false;
    isThereAnError: boolean;
    isBugBoardEnable: boolean = true;
    bugpriorities: BugPriorityModel[];
    toastr: any;
    isArchived: boolean = false;
    bugPriorityId: string;
    validationMessage: string;
    priorityName: string;
    description: string;
    searchText: string;
    timeStamp: any;
    temp: any;
    order: number;
    public color = "";
    icon: string;
    canAccess_feature_ManageBugPriority: Boolean;

    constructor(private projectsService: ProjectManagementService, private masterDataService: MasterDataManagementService,
    translateService: TranslateService,
    private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef,) {
        super();
        
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllCompanySettings();
        this.clearForm();
        this.getAllBugPriorities();
        // this.canAccess_feature_ManageBugPriority$.subscribe((x)=>{
        //     this.canAccess_feature_ManageBugPriority = x;
        //     if( this.canAccess_feature_ManageBugPriority) {
        //         this.getAllBugPriorities();
        //     }
        //   })
    }

    getAllCompanySettings() {
        let companySettingsModel: any[] = [];
        this.masterDataService.getAllCompanySettings(new CompanysettingsModel()).subscribe((result: any) => {
            let companySettingsModel = result.data;
            if (companySettingsModel.length > 0) {
                let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
                if (companyResult.length > 0) {
                    this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
                }
            }
        });
    }

    getAllBugPriorities() {
        this.isAnyOperationIsInprogress = true;
        var data = new BugPriorityDropDownData();
        data.isArchived = this.isArchived;
        this.projectsService.GetAllBugPriporities(data).subscribe((response: any) => {
            if (response.success == true) {
                this.bugpriorities = response.data;
                this.temp = this.bugpriorities;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            this.validationMessage = "Only numbers are allowed in bug order";
            this.isThereAnError = true;
            return false;
        }
        this.isThereAnError = false;
        return true;

    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    editBugPriority(row, upsertBugPriorityPopUp) {
        this.bugPriorityForm.controls["priorityName"].disable();
        this.bugPriorityForm.patchValue(row);
        this.bugPriorityId = row.bugPriorityId;
        this.icon = row.icon;
        this.order = row.order;
        this.priorityName = row.priorityName;
        this.timeStamp = row.timeStamp;
        upsertBugPriorityPopUp.openPopover();
    }

    createBugPriority(upsertBugPriorityPopUp) {
        upsertBugPriorityPopUp.openPopover();
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.bugPriorityId = null;
        this.priorityName = null;
        this.color = null;
        this.order = null;
        this.icon = null;
        this.description = null;
        this.searchText = null;
        this.timeStamp = null;
        this.bugPriorityForm = new FormGroup({
            priorityName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            color: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
        })
    }
    matcher = new MyErrorStateMatcher();

    closeUpsertBugPriorityPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertBugPriorityPopover.forEach((p) => p.closePopover());
    }

    upsertBugPriority(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.bugPriorityModel = this.bugPriorityForm.value;
        this.bugPriorityModel.BugPriorityId = this.bugPriorityId;
        this.bugPriorityModel.icon = this.icon;
        this.bugPriorityModel.Order = this.order;
        this.bugPriorityModel.PriorityName = this.priorityName;
        this.bugPriorityModel.timeStamp = this.timeStamp;

        this.projectsService.upsertBugPriority(this.bugPriorityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertBugPriorityPopover.forEach((p) => p.closePopover());
                formDirective.resetForm();
                this.clearForm();
                this.getAllBugPriorities();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    archiveBugPriority(row, archiveBugPriorityPopUp) {
        this.bugPriorityId = row.bugPriorityId;
        this.priorityName = row.priorityName;
        this.color = row.color;
        this.order = row.order;
        this.description = row.description;
        this.timeStamp = row.timeStamp;
        archiveBugPriorityPopUp.openPopover();
    }

    closeArchiveBugPriorityTypeDialog() {
        this.clearForm();
        this.archiveBugPriorityPopover.forEach((p) => p.closePopover());
    }

    deleteBugPriorityType() {
        this.isAnyOperationIsInprogress = true;

        this.bugPriorityModel = new BugPriorityModel();
        this.bugPriorityModel.BugPriorityId = this.bugPriorityId;
        this.bugPriorityModel.PriorityName = this.priorityName;
        this.bugPriorityModel.Color = this.color;
        this.bugPriorityModel.Order = this.order;
        this.bugPriorityModel.Description = this.description;
        this.bugPriorityModel.timeStamp = this.timeStamp;
        this.bugPriorityModel.IsArchived = !this.isArchived;

        this.projectsService.upsertBugPriority(this.bugPriorityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.archiveBugPriorityPopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllBugPriorities();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
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

        const temp = this.temp.filter(bugPriority => (bugPriority.priorityName.toLowerCase().indexOf(this.searchText) > -1)
            || (bugPriority.order.toString().indexOf(this.searchText) > -1) || (bugPriority.description.toLowerCase().indexOf(this.searchText) > -1));

        this.bugpriorities = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}