import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from "@ngx-translate/core";
import { ClientSearchInputModel } from '../../models/client-search-input.model';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';
import { AppBaseComponent } from '../componentbase';
import { CountryModel } from '../../models/country-model';
import { ConstantVariables } from '../../constants/constant-variables';
import { FileUploadService } from '../../services/fileUpload.service';
import { HRManagementService } from '../../services/hr-management.service';
import { RoleModel } from '../../models/role-model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { KycConfigurationModel } from '../../models/clientKyc.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeadSubmissionDialogComponent } from '../lead-templates/lead-submission-dialog.component';
import { LeadTemplate } from '../../models/lead-template.model';
import { LegalEntityModel } from '../../models/legal-entity.model';
import { TimeZoneModel } from '../../models/time-zone';

@Component({
  selector: 'app-newclient',
  templateUrl: './newclient.component.html'
})
export class NewclientComponent extends AppBaseComponent implements OnInit {
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
  @ViewChild("formio") formio: any;
  @ViewChildren("kycSubmissionPopup") kycSubmissionPopup;

  clientForm: FormGroup;
  secondaryForm: FormGroup;
  receiptsFormData = new FormData();
  selectedFiles: File[];
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress: boolean;
  public basicForm = { components: [] };
  formJson: any;
  formData = { data: {} };
  validationMessage: string;
  isThereAnError: boolean;
  countrys: CountryModel[] = [];
  pagetype: string = "Add New client";
  secondaryContactDetailsList: any[];
  selectedContactId: number;
  secondaryContactLength: any;
  isdeletedisable: boolean = false;
  selectedClientId: any;
  clientAddressId: string;
  selectedClientDetails: any;
  disabled: boolean = false;
  formtype: string = 'addclient';
  isEdit: boolean;
  isDelete: boolean;
  isSave: boolean = true;
  isCancel: boolean;
  selectedSecondaryid: any;
  error: boolean;
  issecondaryform: boolean;
  isclientform: boolean = true;
  isclientview: boolean;
  clientimageUrl: string;
  isShowMore: boolean;
  selectedClientDetailsMore: any[];
  timeStamp: any;
  clientAddressTimeStamp: any;
  message: string;
  selectedRoleIds: string[];
  selectedRoleNames: string;
  selectedSecondaryNames: string;
  selected: any;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png']
  clientTypeList: any;
  kycDocumentlist: any;

  rolesList: RoleModel[];
  @ViewChild("allSelected") private allSelected: MatOption;
  isFromEdit: boolean = null;
  leadSubmissionDetails: any;
  isEditForm: boolean = true;
  Progress: boolean = false;
  selectedClientType: string;
  creditLimit: number;
  getFilesByReferenceId: boolean = true;
  moduleTypeId = 17;
  isToUploadFiles: boolean = false;
  selectedParentFolderId: null;
  selectedStoreId: null;
  isFileExist: boolean;
  referenceTypeId = ConstantVariables.MasterContractReferenceTypeId;
  selectedClientTypeName: string;
  legalEntityList: LegalEntityModel[] = [];
  timeZoneList: any[] = [];
  kycLoadingForm: boolean = false;
  formBgColor: string = null;

  constructor(private BillingDashboardService: BillingDashboardService, private activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private router: Router, private fileUploadService: FileUploadService, private countryService: HRManagementService, private toaster: ToastrService,
    private snackbar: MatSnackBar, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private softLabelPipe: SoftLabelPipe,
    public dialogRef: MatDialogRef<NewclientComponent>) {

    super();

  }
  ngOnInit() {
    super.ngOnInit();
    this.clearclientForm();
    this.clientForm.controls["isKycSybmissionMailSent"].setValue(false);
    this.getSoftLabels();
    this.getCountrys();
    this.getAllTimeZones();
    this.getRoles();
    this.getfromurlparams();
    this.getclientTypeList();
    this.getAllLegalEntitys();
    this.isEdit = false;
    this.clientimageUrl = null;
    // this.bindFormData();
    this.BillingDashboardService.currentMessage.subscribe(message => this.message = message);
    if (this.message != null && this.message != "default message") {
      this.selectedClientId = this.message;
      this.isEdit = true;
      this.BillingDashboardService.changeMessage(null);
      this.editClient();

    }

    this.secondaryForm = new FormGroup({
      firstName: new FormControl("",
        Validators.compose([
          Validators.maxLength(50),
          Validators.required,

        ])
      ),
      lastName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),

      email: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          Validators.maxLength(50)
        ])
      ),
      mobileNo: new FormControl("",
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      file: new FormControl(null, [
      ]),
      roleId: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    });
    if (document.querySelector != null && document.querySelector != undefined && document.querySelector(".formio-loader-wrapper") != null && document.querySelector(".formio-loader-wrapper") != undefined && (document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
      (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
    }
  }

  ngAfterViewInit() {
    if ((document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
      (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
    }
  }

  getAllLegalEntitys() {
    let legalEntity = new LegalEntityModel();
    legalEntity.isArchived = false;
    this.BillingDashboardService.getAllLegalEntities(legalEntity)
      .subscribe((responseData: any) => {
        this.legalEntityList = responseData.data;
        this.cdRef.detectChanges();
      });
  }

  getRoles() {
    var companyModel = new RoleModel();
    companyModel.isArchived = false;
    this.BillingDashboardService.getRoles(companyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.rolesList = response.data;
        this.cdRef.detectChanges()
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    if (this.softLabels && this.softLabels.length > 0) {
      this.cdRef.markForCheck();
    }
  }

  getfromurlparams() {
    this.activatedRoute.params.subscribe(routeParams => {
      this.selectedClientId = routeParams.id;
      if (routeParams.id) {

        this.isclientview = true;
        this.isclientform = false;

        this.disabled = false;
        this.viewClientDetails();
        this.getSecondaryContactDetails();
      }
    })
  }

  viewClientDetails() {
    let clientDetails = new ClientSearchInputModel();
    clientDetails.clientId = this.selectedClientId;
    this.clientimageUrl = null;
    this.BillingDashboardService.getClients(clientDetails)
      .subscribe((responseData: any) => {
        this.selectedClientDetails = responseData.data[0];
        this.leadSubmissionDetails = responseData.data[0].leadSubmissionsDetails;
        this.selectedClientId = this.selectedClientDetails.clientId;
        this.clientimageUrl = this.selectedClientDetails.profileImage;
        this.formJson = this.selectedClientDetails.formJson ? JSON.parse(this.selectedClientDetails.formJson) : Object.assign({}, this.basicForm);
        this.formData.data = this.selectedClientDetails.kycFormData ? JSON.parse(this.selectedClientDetails.kycFormData) : { data: {} };

        if (this.isFromEdit == null) {
          this.isFromEdit = true;

        }
        this.getKycDocumentType();
      });
  }
  // bindFormData() {
  //   let clientDetails = new ClientSearchInputModel();
  //   clientDetails.clientId = this.selectedClientId;
  //   this.clientimageUrl = null;
  //   this.BillingDashboardService.getClients(clientDetails)
  //     .subscribe((responseData: any) => {
  //       this.selectedClientDetails = responseData.data[0];
  //       this.formJson = JSON.parse(this.selectedClientDetails.formJson);
  //       this.formData.data = JSON.parse(this.selectedClientDetails.kycFormData);
  //       this.cdRef.detectChanges();

  //     });
  // }
  editClientDetails() {
    let clientDetails = new ClientSearchInputModel();
    clientDetails.clientId = this.selectedClientId;
    this.BillingDashboardService.getClients(clientDetails)
      .subscribe((responseData: any) => {
        this.selectedClientDetails = responseData.data[0];
        this.selectedClientType = this.selectedClientDetails.clientTypeName;
        this.clientAddressId = this.selectedClientDetails.clientAddressId;
        this.clientAddressTimeStamp = this.selectedClientDetails.clientAddressTimeStamp;
        this.timeStamp = this.selectedClientDetails.timeStamp;
        this.clientimageUrl = this.selectedClientDetails.profileImage;
        this.creditLimit = this.selectedClientDetails.creditLimit;
        this.clientForm.patchValue(this.selectedClientDetails);
        const roleids = this.clientForm.value.roleId;
        if (this.clientForm.value.kycExpiryDays == 0) {
          this.clientForm.controls["kycExpiryDays"].setValue(null);
        }
        this.isFromEdit = !this.isFromEdit;
        if (roleids.length == this.rolesList.length) {
          this.clientForm.controls.roleId.patchValue([
            ...this.rolesList.map((item) => item.roleId),
            0
          ]);
        }
        this.cdRef.detectChanges()
        this.getRoleslistByUserId();
      });
  }

  clearclientForm() {
    this.clientForm = new FormGroup({
      firstName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      lastName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      companyName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      email: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.email
        ])
      ),
      mobileNo: new FormControl("",
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      street: new FormControl("", [
        Validators.maxLength(50)
      ]),
      countryId: new FormControl("", [Validators.required]),
      timeZoneId: new FormControl("", [Validators.required]),
      city: new FormControl("", [
        Validators.maxLength(50)
      ]
      ),
      state: new FormControl("", [
        Validators.maxLength(50)
      ]
      ),
      note: new FormControl("", [
        Validators.maxLength(300)
      ]
      ),
      companyWebsite: new FormControl("", Validators.compose([
        Validators.maxLength(50),
        , Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ])
      ),
      zipcode: new FormControl("",
        Validators.compose([
          Validators.maxLength(10)
        ])
      ),
      creditLimit: new FormControl("",
        Validators.compose([
          Validators.maxLength(10)
        ])
      ),
      file: new FormControl(null, [
      ]),
      clientId: new FormControl(null, [
      ]),
      clientAddressId: new FormControl(null, [
      ]),
      clientAddressTimeStamp: new FormControl(null, [
      ]),
      timeStamp: new FormControl(null, [
      ]),
      clientType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      kycDocument: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      roleId: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      availableCreditLimit: new FormControl(null,
        Validators.compose([
        ])
      ),
      addressLine1: new FormControl(null,
        Validators.compose([
          Validators.maxLength(500)
        ])
      ),
      addressLine2: new FormControl(null,
        Validators.compose([
          Validators.maxLength(500)
        ])
      ),
      panNumber: new FormControl(null,
        Validators.compose([
          Validators.maxLength(13)
        ])
      ),
      businessEmail: new FormControl(null,
        Validators.compose([
          Validators.maxLength(50),
          Validators.email
        ])
      ),
      businessNumber: new FormControl(null,
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      eximCode: new FormControl(null,
        Validators.compose([
        ])
      ),
      gstNumber: new FormControl(null,
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      legalEntityId: new FormControl(null,
        Validators.compose([
        ])
      ),
      kycExpiryDays: new FormControl(null,
        Validators.compose([
          Validators.min(1),
          Validators.max(730)
        ])
      ),
      isKycSybmissionMailSent: new FormControl(null,
        Validators.compose([
        ])
      ),
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      this.validationMessage = "Only numbers are allowed in bug order";
      this.isThereAnError = true;
      return false;
    }
    this.isThereAnError = false;
    return true;
  }
  onFilesAdded(files: File[]) {
    this.selectedFiles = files;
  }
  resetFiles() {
    this.selectedFiles = null;
    this.removeUploadedFile();
  }

  upsertClient() {
    this.anyOperationInProgress = true;
    if (this.formtype == "addclient") {
      this.clientForm.value.profileImage = this.clientimageUrl;
      this.clientForm.value.clientId = null;
      this.clientForm.value.timeStamp = null;
      this.BillingDashboardService.addClient(this.clientForm.value).subscribe((result: any) => {
        if (result) {
          this.anyOperationInProgress = false;
          this.kycSubmissionPopup.forEach((p) => p.closePopover());
          if (result.success == false) {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
            this.anyOperationInProgress = false;
          }
          else if (result.success == true) {
            this.selectedClientId = result.data;
            this.isEdit = true;
            this.isSave = false;
            this.isclientview = true;
            this.isclientform = false;
            this.isFromEdit = true;
            this.snackbar.open(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.CLIENTCREATEDSUCCESSFULLY), this.softLabels), "Success", {
              duration: 3000
            });
            this.clearclientForm();
            this.anyOperationInProgress = false;
            if (this.router.url.search('addclient') != -1) {
              this.viewClientDetails();
            }
            else {
              this.getfromurlparams();
            }
          }
        }
      },
        error => {
          this.toaster.error(error.message);
          this.anyOperationInProgress = false;
        })
    }
    else if (this.formtype == "editclient") {
      this.clientForm.value.profileImage = this.clientimageUrl;
      this.clientForm.value.clientId = this.selectedClientId;
      this.clientForm.value.clientAddressId = this.clientAddressId;
      this.clientForm.value.clientType = this.clientForm.get("clientType").value;
      this.clientForm.value.kycDocument = this.clientForm.get("kycDocument").value;
      this.clientForm.value.clientAddressTimeStamp = this.clientAddressTimeStamp;
      this.clientForm.value.timeStamp = this.timeStamp;
      if (this.clientForm.get("creditLimit").value < this.creditLimit) {
        this.toaster.error(this.translateService.instant("CLIENTSETTINGS.CREDITLIMITCANNOTBEDECREASED"));
        this.anyOperationInProgress = false;
        return
      }
      else if (this.creditLimit != this.clientForm.get("creditLimit").value) {
        let creditLimit = this.clientForm.get("creditLimit").value - this.creditLimit;
        this.clientForm.value.availableCreditLimit = this.clientForm.get("availableCreditLimit").value + creditLimit;
      }
      this.BillingDashboardService.addClient(this.clientForm.value).subscribe((result: any) => {
        if (result) {
          this.isdeletedisable = false;
          this.anyOperationInProgress = false;

          if (result.success == false) {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
          }
          else if (result.success == true) {
            this.isclientform = false;
            this.isclientview = true;
            this.isFromEdit = false;
            this.snackbar.open(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.CLIENTDETAILSUPDATEDSUCCESSFULLY), this.softLabels), this.translateService.instant(ConstantVariables.success), {
              duration: 3000
            });
            this.anyOperationInProgress = false;

            this.viewClientDetails();
            // else {
            //   this.getfromurlparams();
            // }
          }
        }
      })
    }
    else if (this.formtype == "addsecondary") {

    }
    this.pagetype = "Edit client details";
  }
  deleteSeccontactDetails(data) {
    this.selectedSecondaryid = data.id;
  }
  deleteSecondarycontactDetails() {
    this.BillingDashboardService.deleteSecondaryContactDetails(this.selectedSecondaryid)
      .subscribe((responseData: any) => {
        this.getSecondaryContactDetails();
        if (this.router.url.search('addclient') != -1) {
          this.getLatestClientdetails();
        }
        else {
          this.getfromurlparams();
        }
      });
  }
  getCountrys() {
    let countryModel = new CountryModel();
    this.countryService.getCountries(countryModel).subscribe((response: any) => {
      this.anyOperationInProgress = false;
      this.countrys = response.data;
    })
  }
  getAllTimeZones() {
    let timeZoneModel = new TimeZoneModel();
    timeZoneModel.isArchived = false;
    this.countryService.getAllTimeZones(timeZoneModel).subscribe((response: any) => {
      this.anyOperationInProgress = false;
      this.timeZoneList = response.data;
    })
  }
  addSecondaryscontact() {
    if (this.selectedClientId) {
      this.formtype = "addsecondary";
      this.pagetype = "Enter Secondary Contact Details";
      this.issecondaryform = true;
      this.isclientform = false;
      this.isclientview = false;
      this.isEdit = false;
      this.isSave = true;
      this.imageUrl = null;
      // this.formGroupDirective.resetForm();
      this.secondaryForm.reset();
      this.cdRef.detectChanges();
    }
  }
  getSecondaryContactDetails(type?) {

    this.BillingDashboardService.getSecondaryContactDetails(this.selectedClientId)
      .subscribe((responseData: any) => {
        if (responseData.data != null) {
          if (type == "more")
            this.secondaryContactDetailsList = responseData.data;
          else {
            this.secondaryContactLength = responseData.data;
            this.secondaryContactDetailsList = responseData.data.slice(0, 1);
          }
        }
        else {
          this.secondaryContactDetailsList = [];
        }

      },
        error => {
          this.toaster.error(error.message);
        });
  }
  editSecondarycontactDetails(data) {
    this.disabled = false;
    this.formtype = "updatesecondary";
    this.pagetype = "Update Secondary Contact Details";
    this.imageUrl = data.profileImage;
    this.isclientview = false;
    this.isclientform = false;
    this.issecondaryform = true;
    this.secondaryForm.enable();
    this.secondaryForm.patchValue(data);
    this.selectedContactId = data.clientSecondaryContactId;
    this.timeStamp = data.timeStamp;
    this.isdeletedisable = true;
    this.isEdit = false;
    this.isSave = true;
    const secondaryRoles = this.secondaryForm.value.roleId;
    if (secondaryRoles.length == this.rolesList.length) {
      this.secondaryForm.controls.roleId.patchValue([
        ...this.rolesList.map((item) => item.roleId),
        0
      ]);
    }
    this.getSecondaryRoleslistByUserId();
  }
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = '';
  editFile: boolean = true;
  removeUpload: boolean = false;
  clientuploadEventHandler(files: FileList) {
    //this.anyOperationInProgress = true;
    var file = files.item(0);
    var fileName = file.name;
    var fileExtension = fileName.split('.');
    if (this.fileTypes.includes(file.type)) {
      var moduleTypeId = 4;
      var formData = new FormData();
      formData.append("file", file);
      formData.append("isFromProfileImage", 'true');
      this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
        if (response.data) {
          this.clientimageUrl = response.data[0].filePath;
          //this.anyOperationInProgress = false;
        }
        else {
          this.error = true;
          this.validationMessage = response.apiResponseMessages;
        }
      })
    }
    else {
      this.toaster.error("Please select images with extension .jpg, .png, .jpeg");
    }
  }
  // Function to remove uploaded file
  clientremoveUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.clientimageUrl = null;
    this.editFile = true;
    this.removeUpload = false;
    this.clientForm.patchValue({
      file: [null]
    });
  }

  uploadEventHandler(files: FileList) {
    //this.anyOperationInProgress = true;
    var file = files.item(0);
    var fileName = file.name;
    var fileExtension = fileName.split('.');
    if (this.fileTypes.includes(file.type)) {
      var moduleTypeId = 4;
      var formData = new FormData();
      formData.append("file", file);
      this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
        if (response.data) {
          this.imageUrl = response.data[0].filePath;
          //this.anyOperationInProgress = false;
        }
        else {
          this.error = true;
          this.validationMessage = response.apiResponseMessages;
        }
      })
    }
    else {
      this.toaster.error("Please select images with extension .jpg, .png, .jpeg");
    }
  }
  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = '';
    this.clientimageUrl = null;
    this.editFile = true;
    this.removeUpload = false;
    this.clientForm.patchValue({
      file: [null]
    });
  }
  reset() {
    if (this.formtype == 'addclient') {
      this.resetFiles();
      this.isFromEdit = null;
    }
    else {
      this.isclientform = false;
      this.isclientview = true;
      this.isFromEdit = !this.isFromEdit;
    }

  }

  editform() {
    this.clientForm.enable();
    if (this.router.url.search('addclient') != -1) {
      this.getLatestClientdetails();
    }
    else {
      this.getfromurlparams();
    }
    this.isEdit = false;
    this.isSave = true;
  }

  cancel() {
    this.isSave = true;
    this.isCancel = true;
  }

  getLatestClientdetails() {

  }

  deleteclients() {
    if (this.router.url.search('addclient') != -1) {
      this.getLatestClientdetails();
    }
    else {
      this.getfromurlparams();
    }
    this.BillingDashboardService.deleteClient(this.selectedClientId)
      .subscribe((responseData: any) => {
        this.router.navigate(['billingmanagement/clients']);
      });
  }

  upsertSecondaryContact() {
    if (this.formtype == "addsecondary") {
      this.anyOperationInProgress = true;
      this.secondaryForm.value.clientId = this.selectedClientId;
      this.secondaryForm.value.surName = this.clientForm.value.lastName;
      this.secondaryForm.value.profileImage = this.imageUrl;
      this.BillingDashboardService.addSecondaryContact(this.secondaryForm.value).subscribe((result: any) => {
        if (result) {
          this.anyOperationInProgress = false;
          if (result.success == false) {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
          }
          else if (result.success == true) {
            this.snackbar.open(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.SECONDARYCONTACTDETAILSADDEDSUCCESSFULLY), this.softLabels), this.translateService.instant(ConstantVariables.success), {
              duration: 300
            });
            this.isEdit = true;
            this.isSave = false;
            this.anyOperationInProgress = false;
            this.imageUrl = null;
            this.isclientform = false;
            this.issecondaryform = false;
            this.isclientview = true;
            this.viewClientDetails();
            this.getSecondaryContactDetails();
            if (this.isShowMore == true) {
              this.isShowMore = false;
            }
          }
        }
      })
    }
    else if (this.formtype == "updatesecondary") {
      this.anyOperationInProgress = true;
      this.secondaryForm.value.clientSecondaryContactId = this.selectedContactId;
      this.secondaryForm.value.profileImage = this.imageUrl;
      this.secondaryForm.value.clientId = this.selectedClientId;
      this.secondaryForm.value.timeStamp = this.timeStamp;
      this.BillingDashboardService.updateSecondaryContactDetails(this.secondaryForm.value).subscribe((result: any) => {
        if (result) {
          this.isdeletedisable = false;
          this.anyOperationInProgress = false;

          if (result.success == false) {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toaster.error(this.validationMessage);
          }
          else if (result.success == true) {
            this.snackbar.open(this.translateService.instant(ConstantVariables.SECONDARYCONTACTDETAILSUPDATEDSUCCESSFULLY), "Success", {
              duration: 3000
            });
            this.secondaryForm.reset();
            this.anyOperationInProgress = false;
            this.isclientform = false;
            this.issecondaryform = false;
            this.isclientview = true;
            this.viewClientDetails();
            this.getSecondaryContactDetails();
            if (this.isShowMore == true) {
              this.isShowMore = false;
            }
          }
        }
      })
    }

  }

  resetsecondary() {
    this.issecondaryform = false;
    this.isclientform = false;
    this.isclientview = true;
    this.formtype = null;
    this.viewClientDetails();

  }

  editClient() {
    this.formtype = 'editclient';
    this.isFromEdit = !this.isFromEdit;
    this.isclientview = false;
    this.isclientform = true;
    this.issecondaryform = false;
    this.editClientDetails();
  }

  showMore() {
    this.isShowMore = !this.isShowMore
    if (this.isShowMore == false) {
      this.getSecondaryContactDetails('less');
    }
    else {
      this.getSecondaryContactDetails('more');
    }
  }

  goToClients() {
    window.history.go(-1)
    //this.router.navigate(['billingmanagement/clients']);
  }

  toggleAllRolesSelected() {
    if (this.allSelected.selected) {
      this.clientForm.controls.roleId.patchValue([
        ...this.rolesList.map((item) => item.roleId),
        0
      ]);

    } else {
      this.clientForm.controls.roleId.patchValue([]);
    }
    this.getRoleslistByUserId();
  }

  toggleRolePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.clientForm.controls.roleId.value.length ===
      this.rolesList.length
    ) {
      this.allSelected.select();
    }
  }

  getRoleslistByUserId() {
    const roleids = this.clientForm.value.roleId;
    const index = roleids.indexOf(0);
    if (index > -1) {
      roleids.splice(index, 1);
    }
    this.selectedRoleIds = roleids;
    var rolesList = this.rolesList;
    if (roleids && rolesList && rolesList.length > 0) {
      var roles = _.filter(rolesList, function (status) {
        return roleids.toString().includes(status.roleId);
      })
      this.selectedRoleNames = roles.map(x => x.roleName).toString();
    }
  }

  toggleSecondaryAllRolesSelected() {
    if (this.allSelected.selected) {
      this.secondaryForm.controls.roleId.patchValue([
        ...this.rolesList.map((item) => item.roleId),
        0
      ]);

    } else {
      this.secondaryForm.controls.roleId.patchValue([]);
    }
    this.getSecondaryRoleslistByUserId();
  }

  toggleSecondaryRolePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.secondaryForm.controls.roleId.value.length ===
      this.rolesList.length
    ) {
      this.allSelected.select();
    }
  }

  getSecondaryRoleslistByUserId() {
    const roleids = this.secondaryForm.value.roleId;
    const index = roleids.indexOf(0);
    if (index > -1) {
      roleids.splice(index, 1);
    }
    this.selectedRoleIds = roleids;
    var rolesList = this.rolesList;
    if (roleids && rolesList && rolesList.length > 0) {
      var roles = _.filter(rolesList, function (status) {
        return roleids.toString().includes(status.roleId);
      })
      this.selectedSecondaryNames = roles.map(x => x.roleName).toString();
    }
  }

  getclientTypeList() {
    this.BillingDashboardService.getClientType()
      .subscribe((responseData: any) => {
        this.clientTypeList = responseData.data;
      });
  }
  getKycDocumentType() {
    var kycConfig = new KycConfigurationModel();
    kycConfig.clientTypeId = this.clientForm.get("clientType").value;
    kycConfig.legalEntityTypeId = this.clientForm.get("legalEntityId").value;
    this.BillingDashboardService.GetClientKycConfiguration(kycConfig)
      .subscribe((responseData: any) => {
        this.kycDocumentlist = responseData.data;
        if (this.selectedClientDetails && this.selectedClientDetails.kycDocument != null && this.selectedClientDetails.kycDocument != undefined && this.selectedClientDetails.kycDocument) {
          const kyc = this.kycDocumentlist.find(element => element.clientKycId === this.selectedClientDetails.kycDocument);
          this.formBgColor = kyc.formBgColor;
          if (kyc === null || kyc === undefined) {
            this.clientForm.controls["kycDocument"].reset();
          } else if (this.selectedClientDetails.kycDocument === kyc.clientKycId) {
            this.clientForm.controls["kycDocument"].setValue(this.selectedClientDetails.kycDocument);
          }
        }
      });
  }

  getClientTypeName(event) {
    if (event) {
      this.selectedClientTypeName = event.source.selected._element.nativeElement.innerText.trim();
    }
  }

  getKycDocument() {
    var kycConfig = new KycConfigurationModel();
    kycConfig.clientTypeId = this.clientForm.get("clientType").value;
    kycConfig.legalEntityTypeId = this.clientForm.get("legalEntityId").value;
    kycConfig.clientKycId = this.clientForm.get("kycDocument").value;
    this.BillingDashboardService.GetClientKycConfiguration(kycConfig)
      .subscribe((responseData: any) => {
        var data = responseData.data;
        // this.formJson = data[0].formJson ? JSON.parse(data[0].formJson) : Object.assign({}, this.basicForm);
        // this.formData.data = this.formData.data;
      });
  }

  openDialog(value): void {
    let template = new LeadTemplate();
    template.formJson = value.formJson
    value['creditLimit'] = this.selectedClientDetails.creditLimit;
    value['isClientKyc'] = this.selectedClientDetails.isClientKyc;
    const dialogRef = this.dialog.open(LeadSubmissionDialogComponent, {
      minWidth: "80vw",
      height: "90vh",
      disableClose: true,
      data: { template: template, rowData: value, readOnly: true }
    });
    dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
      // if (isReloadRequired.success == true) {
      //   this.refreshEmit.emit();
      // }
      // this.menuTrigger.closeMenu();
    });
  }
  showForm() {
    this.isEditForm = false
  }
  saveform() {
    this.Progress = true;
    const performanceConfig = new KycConfigurationModel();
    performanceConfig.clientKycId = this.clientForm.get("kycDocument").value;
    performanceConfig.formData = JSON.stringify(this.formData.data);
    performanceConfig.isArchived = false;
    performanceConfig.timeStamp = this.timeStamp;
    performanceConfig.clientId = this.selectedClientId;
    this.BillingDashboardService.UpsertClientKycConfiguration(performanceConfig).subscribe((result: any) => {
      this.Progress = false;
      if (result.success === true) {
        this.isEditForm = true;
        this.isToUploadFiles = true;
        this.viewClientDetails();
        // this.dialogRef.close();
        this.onNoClick();

        // this.bindFormData();
      }
      else {
        this.Progress = false;
      }
    })
  }

  onSubmit(event) {
    this.formData.data = this.formio.formio.data;
    this.saveform();
  }
  onChange(event) {
    if (event.form != undefined) { this.formJson = event.form };
  }
  onNoClick() {
    this.dialogRef.close();
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  kycConfirmation(kycSubmissionPopup) {
    if (this.formtype == "addclient") {
      kycSubmissionPopup.openPopover();
    }
    else {
      this.upsertClient();
    }
  }

  upsertKycSubmission() {
    this.clientForm.controls["isKycSybmissionMailSent"].setValue(true);
    this.upsertClient();
  }
  closeKycPopup() {
    this.kycSubmissionPopup.forEach((p) => p.closePopover());
    this.upsertClient();
  }

  updateClient() {
    let client = this.selectedClientDetails;
    client['isVerified'] = true
    this.kycLoadingForm = true;
    this.BillingDashboardService.addClient(client).subscribe((result: any) => {
      if (result.success == true) {
        this.kycLoadingForm = false;
        this.toaster.success("KYC form verified successfully");
        this.editClientDetails();
      }
      else {
        this.kycLoadingForm = false;
        this.toaster.error(result.apiResponseMessages[0].message);
      }
    })
  }
}



