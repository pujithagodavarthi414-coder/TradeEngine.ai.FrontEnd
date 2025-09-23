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
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-component-audit-priority-view",
  templateUrl: "audit-pripority-view.component.html",
})

export class AuditPriorityViewComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChildren("editPriorityPopUp") editPriorityPopover;
  @ViewChildren("deleteCategoryPopover") deleteCategorysPopover;
  deleteCategoryDetails: any;
  priorities: any;
  validationMessage: string;
  upsertInProgress: boolean = false;
  priorityForm: FormGroup;
  isArchived: boolean = false;
  deleteOperationIsInprogress: boolean = false;
  searchText: string;
  priorityData: any;
  temp: any;
  public sort: SortDescriptor[] = [{
    field: 'priorityName',
    dir: 'asc'
}];
  isEdit: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  editPText: string = "Edit priority";
  addPText: string = "Add priority";
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
    let auditImpact = new AuditPriorityModel();
    auditImpact.isArchive = this.isArchived;
    this.auditService.getAuditPriority(auditImpact).subscribe((result: any) => {
      if (result.success) {
        this.priorities = result.data;
        this.temp = result.data;
        this.cdRef.detectChanges();
      }
      else {
        this.priorities = [];
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
  let categoryModel = new AuditPriorityModel();
  categoryModel = Object.assign({}, this.deleteCategoryDetails);
  categoryModel.isArchive = value;
  this.auditService.upsertAuditPriority(categoryModel).subscribe((result: any) => {
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
    this.priorityForm = new FormGroup({
      priorityName: new FormControl(null,
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      description: new FormControl(null,
        Validators.compose([Validators.maxLength(250)
        ])
      ),

    })
  }
  upsertPriority() {
    this.upsertInProgress = true;
    let auditPriorityModel = new AuditPriorityModel()
    if (this.isEdit == true) {
      auditPriorityModel = this.priorityData;
    }
    auditPriorityModel.priorityName = this.priorityForm.controls["priorityName"].value;
    auditPriorityModel.description = this.priorityForm.controls["description"].value;
    this.auditService.upsertAuditPriority(auditPriorityModel).subscribe((result: any) => {
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
    this.upsertInProgress = false;
    this.isEdit = false;
  }

  editPriority(data, priorityPopup) {
    this.isEdit = true;
    this.priorityData = data;
    priorityPopup.openPopover();
    this.priorityForm.patchValue(data);
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }
    const temp = this.temp.filter((p => (p.priorityName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.priorities = temp;
  }

  closeSearch() {
    this.searchText = "";
    const temp = this.temp.filter((p => (p.priorityName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.priorities = temp;
  }

  closePopup() {
    this.editPriorityPopover.forEach((p) => p.closePopover());
  }

  openAddPopover(priorityPopup) {
    this.isEdit = false;
    priorityPopup.openPopover();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.priorities =  orderBy(this.priorities, this.sort)
}
}
