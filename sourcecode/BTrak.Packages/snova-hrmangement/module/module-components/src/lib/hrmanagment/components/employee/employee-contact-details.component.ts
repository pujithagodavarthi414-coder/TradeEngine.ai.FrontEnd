import { Component, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Router } from "@angular/router";
import { State } from "../../store/reducers/index";
import { Observable, Subject } from "rxjs";

import { StatesModel } from "../../models/states";
import { CountryModel } from "../../models/countries-model";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeContactDetailsModel } from "../../models/employee-contact-details-model";

import * as hrManagementModuleReducer from "../../store/reducers/index";

import { LoadStatesListItemsTriggered } from "../../store/actions/states.action";
import { LoadCountryListItemsTriggered } from "../../store/actions/countries.actions";
import { CreateEmployeeContactDetailsTriggered, GetEmployeeContactDetailsTriggered, EmployeeContactDetailsActionTypes } from "../../store/actions/employee-contact-details.actions";
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormsComponent } from '@snovasys/snova-custom-fields';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-hr-component-employee-contact-details",
    templateUrl: "employee-contact-details.component.html"
})

export class EmployeeContactDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getContactDetails();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeeContactDetailsForm: FormGroup;

    employeeContactDetailsData: EmployeeContactDetailsModel;
    selectedEmployeeContactDetails: EmployeeContactDetailsModel;
    selectedEmployeeContactDetailsData: EmployeeContactDetailsModel;
    contactDetails: EmployeeContactDetailsModel[];
    countryListModel: CountryModel[];

    employeeId: string = "";
    selectedCountryId: string = "";
    selectedStateId: string = "";
    isThereAnError: boolean;
    isView: boolean = true;
    isForm: boolean = false;
    isData: boolean = true;
    permission: boolean = false;
    countryCode: string = "";
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.ContactDetailsReferenceTypeId;
    selectedEmployeeContactDetailsData$: Observable<EmployeeContactDetailsModel[]>;
    selectCountryListData$: Observable<CountryModel[]>;
    selectStatesListData$: Observable<StatesModel[]>;
    selectEmployeeContactDetailsData$: Observable<EmployeeContactDetailsModel[]>;
    upsertEmployeeContactDetailsInProgress$: Observable<boolean>;
    operationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>, private dialog: MatDialog, private routes: Router, private cdRef: ChangeDetectorRef,
        private cookieService: CookieService, private hrManagementService: HRManagementService, ) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsCompleted),
                tap(() => {
                    this.selectedEmployeeContactDetailsData$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeContactDetailsData));
                    this.selectedEmployeeContactDetailsData$.subscribe((result) => {
                        if (result != null && result != undefined && result.length > 0) {
                            this.selectedEmployeeContactDetailsData = result[0];
                        }
                    })
                    if (this.selectedEmployeeContactDetailsData) {
                        this.employeeContactDetailsForm.patchValue(this.selectedEmployeeContactDetailsData);
                        this.countryCode = this.selectedEmployeeContactDetailsData.countryCode;
                        this.isData = false;
                    }
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsCompleted),
                tap(() => {
                    this.isForm = false;
                    this.isView = true;
                })
            )
            .subscribe();

        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();

        if ((this.canAccess_feature_AddOrUpdateEmployeeContactDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getCountries();
            this.getStates();
        }
        this.operationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeContactDetailsLoading));
        this.initializeEmployeeContactDetailsForm();
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
                this.getContactDetails();
            }
        });
    }

    getContactDetails() {

        const employeeContactDetails = new EmployeeDetailsSearchModel();
        employeeContactDetails.employeeId = this.employeeId;
        employeeContactDetails.employeeDetailType = "ContactDetails";
        this.store.dispatch(new GetEmployeeContactDetailsTriggered(employeeContactDetails));
    }

    searchByCountry(countryId) {
        const designation = this.countryListModel.find(country => country.countryId === countryId);
        this.countryCode = designation.countryCode
    }

    searchByState(stateId) {
        this.selectedStateId = stateId;
    }

    getCountries() {
        const countrySearchModel = new CountryModel();
        countrySearchModel.isArchived = false;
        this.store.dispatch(new LoadCountryListItemsTriggered(countrySearchModel));
        this.selectCountryListData$ = this.store.pipe(select(hrManagementModuleReducer.getCountryAll), tap(result => {
            this.countryListModel = result;
        }));
    }

    getStates() {
        const statesSearchModel = new StatesModel();
        statesSearchModel.isArchived = false;
        this.store.dispatch(new LoadStatesListItemsTriggered(statesSearchModel));
        this.selectStatesListData$ = this.store.pipe(select(hrManagementModuleReducer.getStatesAll));
    }

    enableDisableForm() {
        this.isForm = true;
        this.isView = false;
    }

    initializeEmployeeContactDetailsForm() {
        this.employeeContactDetailsForm = new FormGroup({
            address1: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            address2: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            postalCode: new FormControl("",
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            homeTelephone: new FormControl("",
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            mobile: new FormControl("",
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            workTelephone: new FormControl("",
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            workEmail: new FormControl("",
                Validators.compose([
                    Validators.maxLength(200),
                    Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")
                ])
            ),
            otherEmail: new FormControl("",
                Validators.compose([
                    Validators.maxLength(200),
                    Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")
                ])
            ),
            countryId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            stateId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        this.isThereAnError = false;
        return true;
    }

    saveEmployeeContactDetails() {
        this.employeeContactDetailsData = this.employeeContactDetailsForm.value;
        this.employeeContactDetailsData.employeeId = this.employeeId;
        if (this.selectedEmployeeContactDetailsData) {
            this.employeeContactDetailsData.employeeContactDetailId = this.selectedEmployeeContactDetailsData.employeeContactDetailId;
            this.employeeContactDetailsData.timeStamp = this.selectedEmployeeContactDetailsData.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeContactDetailsTriggered(this.employeeContactDetailsData));
        this.selectEmployeeContactDetailsData$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeContactDetailsAll));
        this.upsertEmployeeContactDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeContactDetailsLoading));
    }

    close() {
        this.formDirective.resetForm();
        if (this.selectedEmployeeContactDetailsData) {
            this.employeeContactDetailsForm.patchValue(this.selectedEmployeeContactDetailsData);
            this.countryCode = this.selectedEmployeeContactDetailsData.countryCode;
        } else {
            this.employeeContactDetailsForm.reset();
            this.countryCode = "";
        }
        this.isForm = false;
        this.isView = true;
    }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.employeeId, isButtonVisible: true, referenceTypeId: ConstantVariables.ContactDetailsReferenceTypeId, customFieldComponent: null },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    fitContent(optionalParameters: any) {
        if(optionalParameters['gridsterView']) {
            $(optionalParameters['gridsterViewSelector'] + ' #contact-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
        }
    }
}
