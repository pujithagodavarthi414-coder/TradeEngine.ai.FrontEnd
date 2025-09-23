import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditImpactModel, AuditRiskModel } from '../models/audit-impact.module';
import { AuditPriorityModel } from '../models/audit-priority.module';
import { AuditService } from '../services/audits.service';
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { Observable } from 'rxjs';

@Component({
  selector: "app-component-audit-risk-view",
  templateUrl: "audit-risk.component.html",
})

export class AuditRiskComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChildren("editRiskPopUp") editImpactPopover;
  @ViewChildren("deleteCategoryPopover") deleteCategorysPopover;
  deleteCategoryDetails: any;
  isArchived: boolean = false;
  deleteOperationIsInprogress: boolean = false;
  risks: any;
  validationMessage: string;
  upsertInProgress: boolean = false;
  riskForm: FormGroup;
  searchText: string;
  isEdit: boolean = false;
  priorityData: any;
  temp: any;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  public sort: SortDescriptor[] = [{
    field: 'riskName',
    dir: 'asc'
  }];
  editRText: string = "Edit risk";
  addRText: string = "Add risk";
  constructor(private toaster: ToastrService, private cdRef: ChangeDetectorRef, private auditService: AuditService, private softLabelsPipe: SoftLabelPipe) {
    super();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAuditRisks();
    this.clearForm();
  }

  getAuditRisks() {
    let auditRisk = new AuditRiskModel();
    auditRisk.isArchive = this.isArchived;
    this.auditService.getAuditRisk(auditRisk).subscribe((result: any) => {
      if (result.success) {
        this.risks = result.data;
        this.temp = result.data;
        this.cdRef.detectChanges();
      }
      else {
        this.risks = [];
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.cdRef.markForCheck();
      }
    })
  }

  changeArchiveCategory(value) {
    this.isArchived = value;
    this.cdRef.markForCheck();
    this.getAuditRisks();
  }

  deleteCategoryItem(data, deletePopover) {
    this.deleteCategoryDetails = data;
    deletePopover.openPopover();
    this.cdRef.markForCheck();
  }

  removeCategoryAtIndex(value) {
    this.deleteOperationIsInprogress = true;
    let categoryModel = new AuditRiskModel();
    categoryModel = Object.assign({}, this.deleteCategoryDetails);
    categoryModel.isArchive = value;
    this.auditService.upsertAuditRisk(categoryModel).subscribe((result: any) => {
      if (result.success) {
        this.deleteCategoryDetails = null;
        this.deleteOperationIsInprogress = false;
        this.getAuditRisks();
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
    this.riskForm = new FormGroup({
      riskName: new FormControl(null,
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      description: new FormControl(null,
        Validators.compose([Validators.maxLength(250)
        ])
      ),

    })
  }

  upsertRisk() {
    this.upsertInProgress = true;
    let auditRiskModel = new AuditRiskModel()
    if (this.isEdit == true) {
      auditRiskModel = this.priorityData;
    }
    auditRiskModel.riskName = this.riskForm.controls["riskName"].value;
    auditRiskModel.description = this.riskForm.controls["description"].value;
    this.auditService.upsertAuditRisk(auditRiskModel).subscribe((result: any) => {
      var id = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.clearForm();
        this.getAuditRisks();
        this.closePopup();
      }
    })
    this.closePopup();
    this.upsertInProgress = false;
    this.isEdit = false;
  }

  editImpact(data, riskPopup) {
    this.isEdit = true;
    this.priorityData = data;
    riskPopup.openPopover();
    this.riskForm.patchValue(data);
  }
  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }
    const values = this.temp.filter((p => (p.riskName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.risks = values;
  }

  closeSearch() {
    this.searchText = "";
    const values = this.temp.filter((p => (p.riskName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.risks = values;
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
    this.risks = orderBy(this.risks, this.sort)
  }

}
