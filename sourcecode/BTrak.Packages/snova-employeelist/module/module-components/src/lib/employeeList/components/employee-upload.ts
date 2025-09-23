import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { State } from '@progress/kendo-data-query';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { SoftLabelConfigurationModel } from '../../employeeList/models/softLabels-model';
import { State as hrmState } from "../../employeeList/store/reducers/index";
import * as hrManagementModuleReducer from "../../employeeList/store/reducers/index";
import { EmployeeListService } from '../services/employee-list.service';
import './../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'employee-uploadPopup',
  templateUrl: './employee-uploadPopup.template.html',
})

export class EmployeeUploadPopupComponent implements OnInit {

  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  employeeListDataDetails: any = [];
  employeeList: any = [];
  isUploading: boolean = false;
  isUploadEnable: boolean = true;
  public pageSize = 10;
  public skip = 0;
  public gridView: GridDataResult;
  state: State = {
    skip: 0,
    take: 99999999,
  };

  constructor(@Inject(MAT_DIALOG_DATA) private data: any
    , private toastr: ToastrService, private employeeService: EmployeeListService
    , public dialogRef: MatDialogRef<EmployeeUploadPopupComponent>, private store: Store<hrmState>
  ) {
    this.employeeListDataDetails = data.uploadedData;
    this.employeeList = this.employeeListDataDetails.filter(item => item.isEmployeeValid);
    if (this.employeeList && this.employeeList.length > 0) {
      this.isUploadEnable = false;
    } else {
      this.isUploadEnable = true;
    }
    this.loadItems();
  }

  ngOnInit() {
    this.getSoftLabels();
  }

  closeDialog() {
    this.dialogRef.close({ success: null });
  }

  UploadEmployeeList() {
    if (this.isUploading) {
      return
    }
    else
      this.isUploading = true;
    this.employeeList = this.employeeListDataDetails.filter(item => item.isEmployeeValid);

    this.employeeService.employeeUpload(this.employeeList).subscribe((response: any) => {

      this.closeDialog();
      if (response.data) {
        this.toastr.info("Uploaded data will be inserted in background.", "Please refresh the page after some time.");
      }
      this.isUploading = false;
    },
      function (error) {
        this.toastr.error("Upload failed.", "Check your data format.");
        this.closeDialog();
        this.isUploading = false;
      });
  }

  getSoftLabels() {
    this.softLabels$ = this.store.pipe(select(hrManagementModuleReducer.getSoftLabelsAll));
    this.softLabels$.subscribe((x) => this.softLabels = x);
  }

  pageChange(event: PageChangeEvent): void {

    this.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.employeeListDataDetails.slice(this.skip, this.skip + this.pageSize),
      total: this.employeeListDataDetails.length
    };
  }
}