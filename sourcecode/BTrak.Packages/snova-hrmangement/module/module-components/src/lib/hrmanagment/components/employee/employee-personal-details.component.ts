import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil, map } from 'rxjs/operators';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { GenderSearchModel } from '../../models/gender-search-model';
import { NationalitiesSearchModel } from '../../models/nationalities-search-model';
import { MaritalStatusesSearchModel } from '../../models/marital-statuses-search-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';
import { EmployeePersonalDetailsModel } from '../../models/employee-personal-details-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { MaritalStatusesModel } from '../../models/marital-statuses-model';
import { GenderModel } from '../../models/gender-model';
import { NationalityModel } from '../../models/nationality-model';
import { CompanysettingsModel } from '../../models/company-model';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from '../../store/reducers/index';
import * as fileReducer from '@snovasys/snova-file-uploader';

import { LoadGendersTriggered } from '../../store/actions/gender.actions';
import { LoadNationalitiesTriggered } from '../../store/actions/nationalities.actions';
import { LoadMaritalStatusesTriggered } from '../../store/actions/marital-statuses.actions';
import { GetEmployeeDetailsByIdTriggered, CreateEmployeePersonalDetailsTriggered, EmployeePersonalDetailsActionTypes } from '../../store/actions/employee-personal-details.actions';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import { HRManagementService } from '../../services/hr-management.service';
import { EmployeeService } from '../../services/employee-service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
const $ = $_;

@Component({
    selector: 'app-hr-component-employee-personal-details',
    templateUrl: 'employee-personal-details.component.html'
})

export class UpsertEmployeePersonalDetailsComponent extends CustomAppBaseComponent {
    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeePersonalDetails();
        }
    }
    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeePersonalDetailsForm: FormGroup;

    selectedEmployeeData: EmployeePersonalDetailsModel;

    permission: boolean = false;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    isView: boolean = true;
    isForm: boolean = false;
    isData: boolean = true;
    maritalStatus: boolean = false;
    userId : string;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.PersonalDetailsReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    employeeId: string;

    selectedEmployeeData$: Observable<EmployeePersonalDetailsModel>;
    upsertEmployeePersonalDetailsInProgress$: Observable<boolean>;
    gendersList$: Observable<GenderModel[]>;
    maritalStatusesList$: Observable<MaritalStatusesModel[]>;
    nationalitiesList$: Observable<NationalityModel[]>;
    operationInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    UserId: string;
    isMACApplicable: boolean = false;
    isToUploadFiles: boolean = false;
    employeePersonalReferenceId: string;

    constructor(private dialog: MatDialog,
        private actionUpdates$: Actions, private store: Store<State>, private cookieService: CookieService, private hrManagementService: HRManagementService,
        private cdRef: ChangeDetectorRef, private employeeService: EmployeeService, private routes : Router) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdCompleted),
                tap(() => {
                    this.selectedEmployeeData$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeePersonalDetailsDataById));
                    this.selectedEmployeeData$.subscribe((result) => {
                        if (result) {
                            this.selectedEmployeeData = result[0];
                            if (this.selectedEmployeeData.marriageDate || this.selectedEmployeeData.maritalStatus == 'Married') {
                                this.maritalStatus = true;
                            }
                            this.employeePersonalDetailsForm.patchValue(this.selectedEmployeeData);
                            this.isData = false;
                            this.employeePersonalReferenceId = this.selectedEmployeeData.employeeId
                        }
                        else {
                            this.isData = false;
                        }
                        this.cdRef.markForCheck();
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeePersonalDetailsIdRecentlyUpserted)).subscribe(result => {
                        this.employeePersonalReferenceId = result;
                    });
                    this.isToUploadFiles = true;
                    //this.closeFilePopup();
                })
            )
            .subscribe();

        // if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
        //     this.getEmployees();

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

        this.getAllCompanySettings();

        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();

        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeePersonalDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeePersonalDetails = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeePersonalDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getAllGenders();
            this.getAllMaritalStatuses();
            this.getAllNationalities();

        }
        this.initializeEmployeePersonalDetailsForm();
        this.operationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeePersonalDetailsLoading));
    }

    getEmployees() {

        let userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        let routeUserId;
        if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
            routeUserId = this.routes.url.split("/")[3];
        }
        if(routeUserId && routeUserId != userId){
            userId = routeUserId;
        }
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeePersonalDetails();
            }
        });
    }

    getAllCompanySettings() {

        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.employeeService.getAllCompanySettings(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {

                let companyResult = response.data.filter(item => item.key == "ConsiderMACAddressInEmployeeScreen");
                this.isMACApplicable = companyResult[0].value == "1" ? true : false;
            }
        });
    }

    getEmployeePersonalDetails() {
        let employeePersonalDetails = new EmployeeDetailsSearchModel();
        employeePersonalDetails.employeeId = this.employeeId;
        this.store.dispatch(new GetEmployeeDetailsByIdTriggered(employeePersonalDetails));
    }

    enableDisableForm() {
        this.isToUploadFiles = false;
        this.isForm = true;
        this.isView = false;
    }

    getAllGenders() {
        const genderSearchModel = new GenderSearchModel();
        genderSearchModel.isArchived = false;
        this.store.dispatch(new LoadGendersTriggered(genderSearchModel));
        this.gendersList$ = this.store.pipe(select(hrManagementModuleReducer.getGenderAll));
    }

    getAllMaritalStatuses() {
        const maritalStatusesSearchModel = new MaritalStatusesSearchModel();
        maritalStatusesSearchModel.isArchived = false;
        this.store.dispatch(new LoadMaritalStatusesTriggered(maritalStatusesSearchModel));
        this.maritalStatusesList$ = this.store.pipe(select(hrManagementModuleReducer.getMaritalStatusesAll));

    }

    getAllNationalities() {
        const nationalitiesSearchModel = new NationalitiesSearchModel();
        nationalitiesSearchModel.isArchived = false;
        this.store.dispatch(new LoadNationalitiesTriggered(nationalitiesSearchModel));
        this.nationalitiesList$ = this.store.pipe(select(hrManagementModuleReducer.getNationalitiesAll));
    }

    initializeEmployeePersonalDetailsForm() {
        this.employeePersonalDetailsForm = new FormGroup({
            firstName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            surName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            email: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")
                ])
            ),
            // macAddress: new FormControl("",
            //     Validators.compose([
            //         Validators.maxLength(12),
            //         Validators.pattern(/^[A-Za-z0-9]+$/)
            //     ])
            // ),
            dateOfBirth: new FormControl("", [
            ]),
            genderId: new FormControl("", [
            ]),
            maritalStatusId: new FormControl("", [
            ]),
            marriageDate: new FormControl("", [
            ]),
            nationalityId: new FormControl("", [
            ])
        });
    }

    saveEmployeePersonalDetails() {
        let employeePersonalDetails = new EmployeePersonalDetailsModel();
        employeePersonalDetails = this.employeePersonalDetailsForm.value;
        employeePersonalDetails.employeeId = this.selectedEmployeeData.employeeId;
        employeePersonalDetails.timeStamp = this.selectedEmployeeData.timeStamp;
        employeePersonalDetails.userId = this.selectedEmployeeData.userId;
        employeePersonalDetails.taxCode = this.selectedEmployeeData.taxCode;
        employeePersonalDetails.roleIds = this.selectedEmployeeData.roleId;
        employeePersonalDetails.isActive = this.selectedEmployeeData.isActive;
        employeePersonalDetails.registeredDateTime = this.selectedEmployeeData.registeredDateTime;
        employeePersonalDetails.isActiveOnMobile = this.selectedEmployeeData.isActiveOnMobile;
        employeePersonalDetails.mobileNo = this.selectedEmployeeData.mobileNo;
        employeePersonalDetails.employeeNumber = this.selectedEmployeeData.employeeNumber;
        employeePersonalDetails.isArchived = this.selectedEmployeeData.isArchived;
        employeePersonalDetails.currencyId = this.selectedEmployeeData.currencyId;
        employeePersonalDetails.timeZoneId = this.selectedEmployeeData.timeZoneId;
        this.store.dispatch(new CreateEmployeePersonalDetailsTriggered(employeePersonalDetails));
        this.upsertEmployeePersonalDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeePersonalDetailLoading))
    }

    resetPersonalDetails() {
        this.employeePersonalDetailsForm.patchValue(this.selectedEmployeeData);
        this.closeFilePopup();
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.isForm = false;
        this.isView = true;
    }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: "62%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            data: {
                moduleTypeId: this.moduleTypeId, referenceId: this.selectedEmployeeData.employeeId,
                referenceTypeId: ConstantVariables.PersonalDetailsReferenceTypeId, customFieldComponent: null, isButtonVisible: true
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });

    }

    maritalStatusChange(event) {
        if (event.source.selected._element.nativeElement.innerText.trim() == "Married") {
            this.maritalStatus = true;
        }
        else {
            this.maritalStatus = false;
            this.employeePersonalDetailsForm.get('marriageDate').setValue(null);
        }
    }

    fitContent(optionalParameters: any) {
        if(optionalParameters['gridsterView']) {
            $(optionalParameters['gridsterViewSelector'] + ' #personal-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    other() {

    }
}