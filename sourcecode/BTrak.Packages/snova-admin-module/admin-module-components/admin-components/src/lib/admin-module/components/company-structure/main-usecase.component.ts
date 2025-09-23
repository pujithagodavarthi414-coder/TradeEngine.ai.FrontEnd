import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CompanyManagementService } from '../../services/company-management.service';
import { MainUseCaseModel } from '../../models/mainUseCaseModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-main-usecase',
    templateUrl: `main-usecase.component.html`
})

export class MainUseCaseComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteMainUseCasePopUp") deleteMainUseCasePopover;
    @ViewChildren("upsertMainUseCasePopUp") upsertMainUseCasePopover;
    @ViewChildren("unarchiveMainUseCasePopUp") unarchiveMainUseCasePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isFiltersVisible: boolean;
    isArchivedTypes: boolean = false;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    mainUseCaseForm: FormGroup;
    mainUseCase: MainUseCaseModel;
    mainUseCaseName: string;
    mainUseCaseId: string;
    validationMessage: string;
    mainUseCaseTypes: MainUseCaseModel[];
    timeStamp: any;
    temp: any;
    searchText: string;
    mainUsecaseEdit: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllMainUseCaseTypes();
    }

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private companyManagementService: CompanyManagementService, private snackbar: MatSnackBar) {
        super();
        
        
    }

    getAllMainUseCaseTypes() {
        this.isAnyOperationIsInprogress = true;

        var MainUsecaseModel = new MainUseCaseModel();
        MainUsecaseModel.isArchived = this.isArchivedTypes;

        this.companyManagementService.getAllMainUseCaseTypes(MainUsecaseModel).subscribe((response: any) => {
            if (response.success == true) {
                this.mainUseCaseTypes = response.data;
                this.temp = this.mainUseCaseTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });


    }

    createMainUseCase(upsertMainUseCasePopUp) {
        upsertMainUseCasePopUp.openPopover();
        this.mainUsecaseEdit = this.translateService.instant('MAINUSECASE.ADDMAINUSECASE');
    }

    editMainUseCase(row, upsertMainUseCasePopUp) {
        this.clearForm();
        this.mainUseCaseForm.patchValue(row);
        this.mainUseCaseId = row.mainUseCaseId;
        this.mainUsecaseEdit = this.translateService.instant('MAINUSECASE.EDITMAINUSECASE');
        this.timeStamp = row.timeStamp;
        upsertMainUseCasePopUp.openPopover();
    }

    deleteMainUseCasePopUpOpen(row, deletemainUseCasePopUp) {
        this.clearForm();
        this.mainUseCaseId = row.mainUseCaseId;
        this.mainUseCaseName = row.mainUseCaseName;
        this.timeStamp = row.timeStamp;
        deletemainUseCasePopUp.openPopover();
    }

    unarchiveMainUseCasePopUpOpen(row, unarchivemainUseCasePopUp) {
        this.mainUseCaseId = row.mainUseCaseId;
        this.mainUseCaseName = row.mainUseCaseName;
        this.timeStamp = row.timeStamp;
        unarchivemainUseCasePopUp.openPopover();
    }

    closeUpsertMainUseCasePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertMainUseCasePopover.forEach((p) => p.closePopover());
    }

    closeDeleteMainUseCaseDialog() {
        this.clearForm();
        this.deleteMainUseCasePopover.forEach((p) => p.closePopover());
    }

    closeUnarchiveMainUseCaseDialog() {
        this.clearForm();
        this.unarchiveMainUseCasePopover.forEach((p) => p.closePopover());
    }

    upsertMainUseCase(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.mainUseCase = this.mainUseCaseForm.value;
        this.mainUseCase.mainUseCaseId = this.mainUseCaseId;
        this.mainUseCase.mainUseCaseName = this.mainUseCase.mainUseCaseName.trim();
        this.mainUseCase.timeStamp = this.timeStamp;

        this.companyManagementService.upsertMainUsecase(this.mainUseCase).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertMainUseCasePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllMainUseCaseTypes();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });

    }

    deleteMainUseCase() {
        this.isAnyOperationIsInprogress = true;
        this.mainUseCase = new MainUseCaseModel();
        this.mainUseCase.mainUseCaseId = this.mainUseCaseId;
        this.mainUseCase.timeStamp = this.timeStamp;
        this.mainUseCase.mainUseCaseName = this.mainUseCaseName;
        this.mainUseCase.isArchived = !this.isArchivedTypes;

        this.companyManagementService.upsertMainUsecase(this.mainUseCase).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteMainUseCasePopover.forEach((p) => p.closePopover());
                this.unarchiveMainUseCasePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllMainUseCaseTypes();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });

    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.mainUseCase = null;
        this.mainUseCaseId = null;
        this.isAnyOperationIsInprogress = false;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.mainUseCaseName = null;
        this.timeStamp = null;
        this.searchText = null;
        this.mainUseCaseForm = new FormGroup({
            mainUseCaseName: new FormControl(null,
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

        const temp = this.temp.filter(useCase => useCase.mainUseCaseName.toLowerCase().indexOf(this.searchText) > -1);
        this.mainUseCaseTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
