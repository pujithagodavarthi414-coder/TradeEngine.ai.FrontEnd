import { Component, OnInit, Input, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, combineLatest } from "rxjs";
import { tap, takeUntil, map } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

import { Page } from '../../models/Page';
import { TranslateService } from "@ngx-translate/core";
import { RelationshipDetailsModel } from "../../models/relationship-details-model";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeEmergencyContactDetails } from "../../models/employee-emergency-contact-details-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { LoadRelationshipDetailsTriggered } from "../../store/actions/relationship-details.actions";
import { CreateEmergencyDetailsTriggered, LoadEmergencyDetailsTriggered, EmergencyDetailsActionTypes } from "../../store/actions/emergency-details.actions";
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-hr-component-add-emergency-contacts",
  templateUrl: "add-emergency-contacts.component.html"
})
export class AddEmergencyContactsComponent extends CustomAppBaseComponent {
  @ViewChildren("emergencyContactDetailsPopup") emergencyContactDetailsPopups;
  @ViewChildren("deleteEmergencyContactPopover") deleteEmergencyContactPopovers;

  @Input("selectedEmployeeId")
  set selectedEmployeeId(data: string) {
    if (data != null && data !== undefined && this.employeeId !== data) {
      this.employeeId = data;
      this.getEmergencyContactDetailsList();
    }
  }

  @Input("isPermission")
  set isPermission(data: boolean) {
    this.permission = data;
  }

  emergencyContactModel: EmployeeEmergencyContactDetails;
  emergencyContactData: EmployeeEmergencyContactDetails;
  EmergencyContactDetailsSearchResult: EmployeeDetailsSearchModel;
  emergencyContactDetailsData: EmployeeEmergencyContactDetails;

  emergencyContactsForm: FormGroup;
  formId: FormGroupDirective;

  permission: boolean = false;
  searchText: string = "";
  employeeId: string;
  sortBy: string;
  dataItem: any;
  sortDirection: boolean;
  page = new Page();
  timeStamp: any;
  emergencyContactId: string;
  employeeEmergencyContactId: string;

  moduleTypeId = 1;
  referenceTypeId = ConstantVariables.EmergencyContactsReferenceTypeId;
  selectedStoreId: null;
  selectedParentFolderId: null;
  isFileExist: boolean;

  emergencyContactDetailsDataLoading$: Observable<boolean>
  emergencyContactDetailsList$: Observable<EmployeeEmergencyContactDetails[]>;
  relationshipDetailsList$: Observable<RelationshipDetailsModel[]>;
  upsertEmployeeEmergencyDetailsInProgress$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  popOverOpen: boolean = false;
  isToUploadFiles: boolean = false;

  public ngDestroyed$ = new Subject();

  // tslint:disable-next-line: max-line-length
  constructor(private dialog: MatDialog,
    private actionUpdates$: Actions, private store: Store<State>, private translateService: TranslateService,
    private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,) {
    super();
    this.clearEmergencyContactsForm();
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getAllRelationshipDetails();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(EmergencyDetailsActionTypes.LoadEmergencyDetailsCompleted),
        tap(() => {
          this.emergencyContactDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmergencyContactDetailsAll));
          this.emergencyContactDetailsList$.subscribe(result => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          })
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted),
        tap(() => {
          this.store.pipe(select(hrManagementModuleReducer.createdEmergencyId)).subscribe(result => {
            this.emergencyContactId = result;
          });
          this.isToUploadFiles = true;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(EmergencyDetailsActionTypes.DeleteEmergencyContactDetailsCompleted),
        tap(() => {
          this.deleteEmergencyContactPopovers.forEach((p) => p.closePopover());
          this.emergencyContactId = "";
          this.timeStamp = "";
        })
      )
      .subscribe();

    const upsertingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.createFileLoading));
    const uploadingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.getFileUploadLoading));

    this.anyOperationInProgress$ = combineLatest(
      uploadingFilesInProgress$,
      upsertingFilesInProgress$
    ).pipe(map(
      ([
        uploadingFilesInProgress,
        upsertingFilesInProgress
      ]) =>
        uploadingFilesInProgress ||
        upsertingFilesInProgress
    ));
  }

  ngOnInit() {
    super.ngOnInit();

    this.emergencyContactDetailsDataLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmergencyContactDetailsLoading));

    // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
    //   this.canAccess_feature_CanEditOtherEmployeeDetails = result;
    // })
    // this.canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails$.subscribe(result => {
    //   this.canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails = result;
    // })
    if ((this.canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
      this.getAllRelationshipDetails();
    }
    this.clearEmergencyContactsForm();

    if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
      this.getEmployees();
  }

  getEmployees() {
    const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
      if (result.success === true) {
        this.employeeId = result.data.employeeId;
        this.getEmergencyContactDetailsList();
      }
    });
  }

  getAllRelationshipDetails() {
    const RelationshipDetailsResult = new RelationshipDetailsModel();
    RelationshipDetailsResult.isArchived = false;
    this.store.dispatch(new LoadRelationshipDetailsTriggered(RelationshipDetailsResult));
    this.relationshipDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getRelationshipDetailsAll));
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) {
        return;
      }
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getEmergencyContactDetailsList();
  }

  closeSearch() {
    this.searchText = "";
    this.getEmergencyContactDetailsList();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getEmergencyContactDetailsList()
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === "asc") {
      this.sortDirection = true;
    } else {
      this.sortDirection = false;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getEmergencyContactDetailsList()
  }

  closeFilePopup() {
    this.formId.resetForm();
    this.emergencyContactDetailsPopups.forEach((p) => p.closePopover());
    this.clearEmergencyContactsForm();
    this.emergencyContactId = null;
    this.timeStamp = "";
  }

  clearEmergencyContactsForm() {
    this.timeStamp = "";
    this.emergencyContactId = null;
    this.emergencyContactsForm = new FormGroup({
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
      relationshipId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      homeTelephone: new FormControl("", [
        Validators.maxLength(20)
      ]),
      mobileNo: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20)
        ])
      ),
      workTelephone: new FormControl("", [
        Validators.maxLength(20)
      ])
    })
  }

  getEmergencyContactId(emergencyContactModel, deleteEmergencyContactPopover) {
    this.emergencyContactModel = emergencyContactModel;
    this.timeStamp = emergencyContactModel.timeStamp;
    this.emergencyContactId = emergencyContactModel.emergencyContactId;
    deleteEmergencyContactPopover.openPopover();
  }

  EditEmergencyContactDetails(dataItem, emergencyContactDetailsPopup) {
    this.popOverOpen = false;
    this.cdRef.detectChanges();
    this.popOverOpen = true;
    this.isToUploadFiles = false;
    this.cdRef.detectChanges();
    this.emergencyContactId = dataItem.emergencyContactId;
    this.timeStamp = dataItem.timeStamp;
    this.emergencyContactsForm = new FormGroup({
      firstName: new FormControl(dataItem.firstName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(800)
        ])
      ),
      lastName: new FormControl(dataItem.lastName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(800)
        ])
      ),
      relationshipId: new FormControl(dataItem.relationshipId,
        Validators.compose([
          Validators.required
        ])
      ),
      homeTelephone: new FormControl(dataItem.homeTelephone, [
      ]),
      mobileNo: new FormControl(dataItem.mobileNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ])
      ),
      workTelephone: new FormControl(dataItem.workTelephone, [
      ])
    })
    emergencyContactDetailsPopup.openPopover();
  }

  cancelDeleteEmergencyPopup() {
    this.emergencyContactModel = new EmployeeEmergencyContactDetails();
    this.timeStamp = "";
    this.emergencyContactId = "";
    this.deleteEmergencyContactPopovers.forEach((p) => p.closePopover());
  }

  deleteEmergencyDetail() {
    this.emergencyContactData = new EmployeeEmergencyContactDetails();
    this.emergencyContactData.emergencyContactId = this.emergencyContactId;
    this.emergencyContactData.firstName = this.emergencyContactModel.firstName;
    this.emergencyContactData.relationshipId = this.emergencyContactModel.relationshipId;
    this.emergencyContactData.homeTelephone = this.emergencyContactModel.homeTelephone;
    this.emergencyContactData.mobileNo = this.emergencyContactModel.mobileNo;
    this.emergencyContactData.workTelephone = this.emergencyContactModel.workTelephone;
    this.emergencyContactData.isArchived = true;
    this.emergencyContactData.employeeId = this.employeeId;
    this.emergencyContactData.isEmergencyContact = true;
    this.emergencyContactData.isDependentContact = false;
    this.emergencyContactData.timeStamp = this.emergencyContactModel.timeStamp;
    this.store.dispatch(new CreateEmergencyDetailsTriggered(this.emergencyContactData));
  }

  getEmergencyContactDetailsList() {
    const emergencyDetailsResult = new EmployeeDetailsSearchModel();
    emergencyDetailsResult.employeeId = this.employeeId;
    emergencyDetailsResult.employeeDetailType = "EmergencyContactDetails";
    emergencyDetailsResult.isArchived = false;
    emergencyDetailsResult.sortBy = this.sortBy;
    emergencyDetailsResult.searchText = this.searchText;
    emergencyDetailsResult.sortDirectionAsc = this.sortDirection;
    emergencyDetailsResult.pageNumber = this.page.pageNumber + 1;
    emergencyDetailsResult.pageSize = this.page.size;
    this.store.dispatch(new LoadEmergencyDetailsTriggered(emergencyDetailsResult));

  }

  closeEmergencyDetailsForm(formDirective: FormGroupDirective) {
    this.popOverOpen = false;
    this.clearEmergencyContactsForm();
    formDirective.resetForm();
    this.emergencyContactDetailsPopups.forEach((p) => p.closePopover());
  }

  saveEmergencyDetails(formDirective: FormGroupDirective) {
    let emergencyContactDetailsData = new EmployeeEmergencyContactDetails();
    emergencyContactDetailsData = this.emergencyContactsForm.value;
    emergencyContactDetailsData.employeeId = this.employeeId;
    emergencyContactDetailsData.isEmergencyContact = true;
    emergencyContactDetailsData.isDependentContact = false;
    emergencyContactDetailsData.isArchived = false;
    if (this.emergencyContactId) {
      emergencyContactDetailsData.emergencyContactId = this.emergencyContactId;
      emergencyContactDetailsData.timeStamp = this.timeStamp;
    }
    this.store.dispatch(new CreateEmergencyDetailsTriggered(emergencyContactDetailsData));
    this.upsertEmployeeEmergencyDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmergencyContactDetailsLoading));
    this.formId = formDirective
  }

  addEmergencyContactDetails(addEmergencyContactDetailsPopup) {
    this.popOverOpen = false;
    this.cdRef.detectChanges();
    this.isToUploadFiles = false;
    this.popOverOpen = true;
    addEmergencyContactDetailsPopup.openPopover();
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  openCustomForm() {
    const formsDialog = this.dialog.open(CustomFormsComponent, {
      height: '62%',
      width: '60%',
      hasBackdrop: true,
      direction: "ltr",
      data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, isButtonVisible: true, referenceTypeId: ConstantVariables.EmergencyContactsReferenceTypeId, customFieldComponent: null },
      disableClose: true,
      panelClass: 'custom-modal-box'
    });
    formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
      this.dialog.closeAll();
    });
  }
}
