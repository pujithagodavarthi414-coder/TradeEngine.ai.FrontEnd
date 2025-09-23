import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypeInputModel } from '../../models/button-type-input-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetManagementService } from '../../services/timesheet-managemet.service';

@Component({
    selector: 'app-fm-component-button-type',
    templateUrl: `button-type.component.html`

})

export class ButtonTypeComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertButtonTypePopUp") upsertButtonTypePopover;

    isAnyOperationIsInprogress: boolean = false;
    toastr: any;
    timeStamp: any;
    buttonTypes: any;
    buttonTypeForm: FormGroup;
    isThereAnError: boolean = false;
    buttonTypeName: string;
    buttonTypeId: string;
    buttonCode: string;
    buttonType: ButtonTypeInputModel;
    validationMessage: string;
    temp: any;
    searchText: string;
    buttonTypeDetails: ButtonTypeInputModel;
    buttonFilter: any = { name: '' }
    buttonTypeEdit: string;

    constructor(private translateService: TranslateService, private timesheetService: TimeSheetManagementService, private snackbar: MatSnackBar,private cdRef: ChangeDetectorRef) { super();
        
         }

    ngOnInit(): void {
        this.clearForm();
        super.ngOnInit();
        this.getAllButtonTypes();
    }

    getAllButtonTypes() {
        this.isAnyOperationIsInprogress = true;
        this.buttonTypeDetails = new ButtonTypeInputModel();

        this.timesheetService.getButtonTypeDetails(this.buttonTypeDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.buttonTypes = response.data;
                this.temp = this.buttonTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });
    }

    closeUpsertButtonTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertButtonTypePopover.forEach((p) => p.closePopover());
    }

    createButtonTypePopupOpen(upsertButtonTypePopUp) {
        upsertButtonTypePopUp.openPopover();
        this.buttonTypeEdit = this.translateService.instant('BUTTONTYPE.ADDBUTTONTYPE');
    }

    editButtonTypePopupOpen(row, upsertButtonTypePopUp) {
        this.buttonTypeForm.patchValue(row);
        this.buttonTypeId = row.buttonTypeId;
        this.timeStamp = row.timeStamp;
        this.buttonTypeEdit = this.translateService.instant('BUTTONTYPE.EDITBUTTONTYPE');
        upsertButtonTypePopUp.openPopover();
    }

    upsertButtonType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.buttonType = this.buttonTypeForm.value;
        this.buttonType.buttonTypeName = this.buttonType.buttonTypeName.trim();
        this.buttonType.buttonTypeId = this.buttonTypeId;
        this.buttonType.timeStamp = this.timeStamp;

        this.timesheetService.upsertButtonType(this.buttonType).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertButtonTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllButtonTypes();
                formDirective.resetForm();
                this.isAnyOperationIsInprogress = false;
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    clearForm() {
        this.buttonTypeName = null;
        this.buttonTypeId = null;
        this.buttonType = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.buttonTypeForm = new FormGroup({
            buttonTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(12)
                ])
            ),
            shortName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(6)
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

        const temp = this.temp.filter(buttonTypes => buttonTypes.buttonTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.buttonTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
