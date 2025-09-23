import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { RateTypeModel } from '../../models/hr-models/rate-type-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-rate-type',
    templateUrl: `rate-type.component.html`
    
})

export class RateTypeComponent extends CustomAppBaseComponent implements OnInit
{
    @ViewChildren("upsertRateTypePopUp") upsertRateTypePopover;
    @ViewChildren("deleteRateTypePopUp") deleteRateTypePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedTypes:boolean=false;
    isFiltersVisible:boolean;
    isThereAnError:boolean;
    isArchived:boolean;
    isRateTypeArchived:boolean;
    rateTypes:RateTypeModel[];
    validationMessage:string;
    rateTypeId:string;
    type:string;
    TypeName:string;
    searchText:string;
    temp:any;
    rateTypeForm:FormGroup;
    rateTypeModel:RateTypeModel;
    timeStamp:any;
    rateTypeEdit:string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllRateTypes();
    }

    constructor(private translateService: TranslateService,private hrManagementService:HRManagementService,private snackbar:MatSnackBar,private cdRef: ChangeDetectorRef){super();
        
        }

    getAllRateTypes() {
        this.isAnyOperationIsInprogress = true;

        var rateTypeModel = new RateTypeModel();
        rateTypeModel.isArchive = this.isArchivedTypes;

        this.hrManagementService.getRateTypes(rateTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTypes = response.data;
                this.temp=this.rateTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    editRateType(row,upsertRateTypePopUp)
    {
        this.rateTypeForm.patchValue(row);
        this.rateTypeId = row.rateTypeId;
        this.TypeName=row.type;
        this.timeStamp=row.timeStamp;
        this.rateTypeEdit=this.translateService.instant('RATETYPE.EDITRATETYPETITLE');
        upsertRateTypePopUp.openPopover();
    }

    createRateType(upsertRateTypePopUp)
    {
        upsertRateTypePopUp.openPopover();
        this.rateTypeEdit=this.translateService.instant('RATETYPE.ADDRATETYPETITLE');
    }

    closeUpsertRateTypePopup(formDirective: FormGroupDirective)
    {
        formDirective.resetForm();
        this.clearForm();
        this.upsertRateTypePopover.forEach((p) => p.closePopover());
    }

    deleteRateTypePopUpOpen(row,deleteRateTypePopUp)
    {
        this.rateTypeId = row.rateTypeId;
        this.TypeName = row.typeName;
        this.timeStamp=row.timeStamp;
        this.isRateTypeArchived = !row.isArchived;
        deleteRateTypePopUp.openPopover();
    }

    deleteRateType()
    {
        this.isAnyOperationIsInprogress = true;

        this.rateTypeModel = new RateTypeModel();
        this.rateTypeModel.rateTypeId = this.rateTypeId;
        this.rateTypeModel.typeName = this.TypeName;
        this.rateTypeModel.isArchive = this.isRateTypeArchived;
        this.rateTypeModel.timeStamp=this.timeStamp;

        this.hrManagementService.upsertRateType(this.rateTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteRateTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllRateTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeleteRateTypeDialog()
    {
        this.clearForm();
        this.deleteRateTypePopover.forEach((p) => p.closePopover());
    }

    upsertRateType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.rateTypeModel = this.rateTypeForm.value;
        this.rateTypeModel.typeName = this.rateTypeModel.typeName.toString().trim();
        this.rateTypeModel.rateTypeId = this.rateTypeId;
        this.rateTypeModel.timeStamp=this.timeStamp;

        this.hrManagementService.upsertRateType(this.rateTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertRateTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllRateTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.rateTypeId=null;
        this.timeStamp=null;
        this.type=null;
        this.isFiltersVisible=null;
        this.isThereAnError=false;
        this.validationMessage=null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.rateTypeForm = new FormGroup({
            typeName: new FormControl(null,
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
    
        const temp = this.temp.filter((rateType => (rateType.typeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.rateTypes = temp;
    }
    
    closeSearch() {
        this.filterByName(null);
    }
}
