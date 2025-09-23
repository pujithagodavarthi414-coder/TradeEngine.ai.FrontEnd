import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditImpactModel } from '../models/audit-impact.module';
import { AuditPriorityModel } from '../models/audit-priority.module';
import { AuditService } from '../services/audits.service';
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';

@Component({
  selector: "app-component-audit-impact-view",
  templateUrl: "audit-impact-view.component.html",
})

export class AuditImpactViewComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChildren("editImpactPopUp") editImpactPopover;
  @ViewChildren("deleteCategoryPopover") deleteCategorysPopover;
  impacts: any;
  validationMessage: string;
  upsertInProgress: boolean = false;
  impactForm: FormGroup;
  searchText: string;
  isEdit: boolean = false;
  priorityData: any;
  temp: any;
  deleteCategoryDetails: any;
  isArchived: boolean = false;
  deleteOperationIsInprogress: boolean = false;
  public sort: SortDescriptor[] = [{
    field: 'impactName',
    dir: 'asc'
}];
softLabels: SoftLabelConfigurationModel[];
editImpactText: string = "Edit impact";
addImpactText: string = "Add impact";

  constructor(private toaster: ToastrService, private cdRef: ChangeDetectorRef, private auditService: AuditService, private softLabelsPipe: SoftLabelPipe) {
    super();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAuditImpacts();
    this.clearForm();
  }

  getAuditImpacts() {
    let auditImpact = new AuditImpactModel();
    auditImpact.isArchive = this.isArchived;
    this.auditService.getAuditImpact(auditImpact).subscribe((result: any) => {
      if (result.success) {
        this.impacts = result.data;
        this.temp = result.data;
        this.cdRef.detectChanges();
      }
      else {
        this.impacts = [];
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.cdRef.markForCheck();
      }
    })
  }

  changeArchiveCategory(value) {
    this.isArchived = value;
    this.cdRef.markForCheck();
    this.getAuditImpacts();
}

deleteCategoryItem(data, deletePopover) {
  this.deleteCategoryDetails = data;
  deletePopover.openPopover();
  this.cdRef.markForCheck();
}

removeCategoryAtIndex(value) {
  this.deleteOperationIsInprogress = true;
  let categoryModel = new AuditImpactModel();
  categoryModel = Object.assign({}, this.deleteCategoryDetails);
  categoryModel.isArchive = value;
  this.auditService.upsertAuditImpact(categoryModel).subscribe((result: any) => {
      if (result.success) {
          this.deleteCategoryDetails = null;
          this.deleteOperationIsInprogress = false;
          this.getAuditImpacts();
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


  clearForm() {
    this.impactForm = new FormGroup({
      impactName: new FormControl(null,
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      description: new FormControl(null,
        Validators.compose([ Validators.maxLength(250)
        ])
      ),

    })
  }
  upsertImpact() {
    this.upsertInProgress = true;
    let auditImpactModel = new AuditImpactModel()
    if (this.isEdit == true) {
      auditImpactModel = this.priorityData;
    }
    auditImpactModel.impactName = this.impactForm.controls["impactName"].value;
    auditImpactModel.description = this.impactForm.controls["description"].value;
    this.auditService.upsertAuditImpact(auditImpactModel).subscribe((result: any) => {
      var id = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.clearForm();
        this.getAuditImpacts();
        this.closePopup();
      }
    })
    this.closePopup();
    this.upsertInProgress = false;
    this.isEdit = false;
  }

  editImpact(data, impactPopup) {
    this.isEdit = true;
    this.priorityData = data;
    impactPopup.openPopover();
    this.impactForm.patchValue(data);
  }
  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }
    const values = this.temp.filter((p => (p.impactName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.impacts = values;
  }

  closeSearch() {
    this.searchText = "";
    const values = this.temp.filter((p => (p.impactName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.impacts = values;
  }

  closePopup() {
    this.editImpactPopover.forEach((p) => p.closePopover());
  }

  openAddPopover(priorityPopup) {
    this.isEdit = false;
    priorityPopup.openPopover();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.impacts =  orderBy(this.impacts, this.sort)
}
}
