import { Component, OnInit, Inject, ViewChild, HostListener, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CompanyModel } from '../../models/company-model';
import { CommonService } from '../../services/common-used.service';

@Component({
  selector: "app-company-information-component",
  templateUrl: "./company-information.html"
})

export class CompanyInformationComponent implements OnInit {

  selectedTab: string;
  selectedTabIndex: number;
  companyDetails: any;
  companyId: any;
  company: any;
  isAnyOperationIsInprogress: boolean = false;
  isFromRoute: boolean = false;
  isCompanyname: boolean;
  isVat: boolean;
  isPrimaryAdd: boolean;
  vat: any;
  primaryAdd: string;
  companyName: string;
  editVat: boolean = false;
  show: boolean;
  validationMsg: string;
  showErorr: boolean;
  isEditAddress: boolean = false;
  primaryCompanyAddress: any;
  exportDataLoading: boolean = false;
  isProgress: boolean = false;
  isCompanyEdit: boolean = true;
  isCompanyAddEdit: boolean = false;
  isCompanyVatEdit: boolean;
  idFromEdit: boolean;
  isFromEdit: boolean;
  isvatFromEdit: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdRef: ChangeDetectorRef, private cookieService: CookieService, private commonService: CommonService, private toastr: ToastrService,) {

  }

  ngOnInit() {
    this.companyDetails = this.cookieService.get(LocalStorageProperties.CompanyId);
    this.companyId = this.companyDetails;
    this.companyName = "";
    this.vat = "";
    this.primaryCompanyAddress = "";
    this.getCompanyById();
  }
  getCompanyById() {
    this.commonService.getCompanyById(this.companyId).subscribe((response: any) => {
      this.company = response.data;
      this.isCompanyname
      this.companyName = this.company.companyName;
      this.vat = this.company.vat;
      this.primaryCompanyAddress = this.company.primaryCompanyAddress = null ? '' : this.company.primaryCompanyAddress;
      this.isVat = this.vat != null ? true : false;
      this.isVat = this.vat == '' ? false : true;
      this.isPrimaryAdd = this.company.primaryCompanyAddress != null ? true : false;
      this.isPrimaryAdd = this.company.primaryCompanyAddress == '' ? false : true;
      this.isFromEdit = !this.isPrimaryAdd;
      this.isvatFromEdit = !this.isVat;
    });
    this.cdRef.detectChanges();
  }

  getCompany() {
    this.commonService.getCompanyById(this.companyId).subscribe((response: any) => {
      this.company = response.data;
      this.companyName = this.company.companyName;
      this.vat = this.company.vat;
      this.primaryCompanyAddress = this.company.primaryCompanyAddress = null ? '' : this.company.primaryCompanyAddress;

    });
    this.cdRef.detectChanges();
  }
  getCompanyAdd() {
    this.commonService.getCompanyById(this.companyId).subscribe((response: any) => {
      this.company = response.data;
      this.companyName = this.company.companyName;
      this.vat = this.company.vat;
      if(this.primaryCompanyAddress){
        this.isPrimaryAdd=true;
      }
      this.primaryCompanyAddress = this.company.primaryCompanyAddress = null ? '' : this.company.primaryCompanyAddress;

    });
    this.cdRef.detectChanges();
  }
  getCompanyVat() {
    this.commonService.getCompanyById(this.companyId).subscribe((response: any) => {
      this.company = response.data;
      this.companyName = this.company.companyName;
      this.vat = this.company.vat;
      if(this.vat){
        this.isVat=true;
      }
      this.primaryCompanyAddress = this.company.primaryCompanyAddress = null ? '' : this.company.primaryCompanyAddress;

    });
    this.cdRef.detectChanges();
  }
  addvat() {
    this.editVat = true;
    this.isvatFromEdit = false;
    this.isVat = false;
    this.vat = this.vat;
    this.isCompanyVatEdit = true;
  }
  Editvat() {
    this.isvatFromEdit = true;
    this.isvatFromEdit = false;
    this.isCompanyVatEdit = true;
    this.vat = this.vat;
    this.isVat = false;
    this.editVat = true;
  }
  cancelCompanyVat() {
    this.isCompanyVatEdit = false;
    this.isvatFromEdit = false;
    this.editVat = false;
    this.getCompanyById();
  }
  Save() {
    this.exportDataLoading = true;
    this.isProgress = true;
    const companyModel = new CompanyModel();
    companyModel.vAT = this.vat;
    companyModel.primaryAddress = this.primaryCompanyAddress;
    companyModel.companyName = this.companyName;
    companyModel.companyId = this.companyId;
    companyModel.key = "true";
    this.commonService.updateCompanyDetails(companyModel).subscribe((response: any) => {
      var res = response.data;
      this.exportDataLoading = false;
      this.isProgress = false;
      if (res == 'CompanyNameWithThisNameAlreadyExists') {
        this.showErorr = true;
        this.show = false;
        this.validationMsg = "Company name is already exists";
       // this.toastr.error(this.validationMsg );
        this.cdRef.detectChanges();
        this.isCompanyname = true;
        this.isCompanyEdit = false;
      }
      else if (res == 'CompanyNameShouldNotBeNull') {
        this.showErorr = true;
        this.isCompanyname = true;
        this.isCompanyEdit = false;
        this.show = false;
        this.validationMsg = "Company name should be null";
      //  this.toastr.error(this.validationMsg );
        this.cdRef.detectChanges();
        this.isCompanyname = true;
      } else {
        this.isCompanyname = false;
        this.isCompanyEdit = true;
        this.showErorr = false;
        this.toastr.success("Saved!")
        this.getCompany();
        this.cdRef.detectChanges();
      }
    });
  }
  Savevat() {
    if(this.vat){
    this.exportDataLoading = true;
    this.isProgress = true;
    const companyModel = new CompanyModel();
    this.editVat = false;
    companyModel.vAT = this.vat;
    companyModel.primaryAddress = this.primaryCompanyAddress;
    companyModel.companyName = this.companyName;
    companyModel.companyId = this.companyId;
    companyModel.key = "true";
    this.commonService.updateCompanyDetails(companyModel).subscribe((response: any) => {
      this.isCompanyVatEdit = false;
      this.toastr.success("Saved!");
      this.isVat = false;
      this.getCompanyVat();
      this.cdRef.detectChanges();

    });
  }
  }
  Saveadd() {
    if(this.primaryCompanyAddress){
    this.exportDataLoading = true;
    this.isProgress = true;
    const companyModel = new CompanyModel();
    this.isEditAddress = false;
    companyModel.vAT = this.vat;
    companyModel.primaryAddress = this.primaryCompanyAddress;
    companyModel.companyName = this.companyName;
    companyModel.companyId = this.companyId;
    companyModel.key = "true";
    this.commonService.updateCompanyDetails(companyModel).subscribe((response: any) => {
      this.isCompanyAddEdit = false;
      this.toastr.success("Saved!")
      this.isPrimaryAdd = false;
      this.getCompanyAdd();
      this.cdRef.detectChanges();

    });
  }
  }
  cancelCompany() {
    this.isCompanyEdit = true;
    this.isCompanyname = false;
  }
  addAddress() {

    this.isPrimaryAdd = false;
    this.isCompanyAddEdit = true;
    this.isFromEdit = false;
    this.isEditAddress = true;
    this.primaryCompanyAddress = this.primaryCompanyAddress;
  }
  editAddress() {
    this.isFromEdit = false;
    this.isPrimaryAdd = false;
    this.isCompanyAddEdit = true;
    this.isEditAddress = true;
    this.primaryCompanyAddress = this.primaryCompanyAddress;
  }
  cancel() {

  }
  cancelCompanyadd() {
    this.isCompanyAddEdit = false;
    this.isEditAddress = false;
    this.getCompanyById();

  }
  editCompany() {
    this.isCompanyname = true;
    this.isCompanyEdit = false;
    this.companyName = this.companyName;
    this.show = false;
    this.cdRef.detectChanges();
  }

  companynameclick() {
    if (this.companyName != null && this.companyName != '') {
      this.companyName = this.companyName;
      this.show = false;
      this.showErorr = false;
      this.exportDataLoading = false;
    }
    else {
      this.exportDataLoading = true;
      this.show = true;
      this.showErorr = true;
    }
  }
  @HostListener('document:mouseover', ['$event'])
  mouseover(event) {
    if (event.target.matches('.editor-div')) {
      this.companynameclick();
    }
  }
}
