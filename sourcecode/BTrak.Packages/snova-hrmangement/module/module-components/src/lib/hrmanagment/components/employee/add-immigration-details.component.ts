import { Component, Output, EventEmitter, Input } from "@angular/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";
import { MatRadioChange } from "@angular/material/radio";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { CountryModel } from "../../models/countries-model";
import { EmployeeImmigrationDetailsModel } from "../../models/employee-immigration-details-model";

import { LoadCountryListItemsTriggered } from "../../store/actions/countries.actions";

import * as hrManagementModuleReducer from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { CreateEmployeeImmigrationDetailsTriggered, EmployeeImmigrationDetailsActionTypes } from "../../store/actions/employee-immigration-details.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-immigration-details",
    templateUrl: "add-immigration-details.component.html"
})

export class AddImmigrationDetailsComponent extends CustomAppBaseComponent {
    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editImmigrationDetailsData")
    set editImmigrationDetailsData(data: EmployeeImmigrationDetailsModel) {
        this.immigrationDetailsForm();
        if (!data) {
            this.documents = "";
            this.employeeImmigrationDetails = null;
            this.employeeImmigrationDetailsId = null;
            this.startDate();
        } else {
            this.document = "";
            this.employeeImmigrationDetails = data;
            this.employeeImmigrationDetailsId = data.employeeImmigrationId;
            this.employeeImmigrationDetailsForm.patchValue(data);
            this.documents = data.document;
            this.document = data.document;
            this.startDate();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();
    @Output() change: EventEmitter<MatRadioChange>;

    employeeImmigrationDetailsForm: FormGroup;
    formId: FormGroupDirective;

    immigration: EmployeeImmigrationDetailsModel;
    employeeImmigrationDetails: EmployeeImmigrationDetailsModel;

    // canAccess_feature_CanEditOtherEmployeeDetails: Boolean;
    // canAccess_feature_AddOrUpdateEmployeeImmigration: Boolean;

    permission: boolean = false;
    document: string;
    expiryDates: boolean = true;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    minDateForExpiryDate = new Date();
    selectedCountryId: string = "";
    employeeId: string;
    employeeImmigrationDetailsId: string = "";
    public documents: string;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.ImmigrationReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    isToUploadFiles: boolean = false;

    selectCountryListData$: Observable<CountryModel[]>;
    upsertEmployeeImmigrationDetailsInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeImmigrationDetailsIdOfUpsertImmigrationDetails)).subscribe(result => {
                        this.employeeImmigrationDetailsId = result;
                    });
                    this.isToUploadFiles = true;
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
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe((result: Boolean) => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeImmigration$.subscribe((result: Boolean) => {
        //     this.canAccess_feature_AddOrUpdateEmployeeImmigration = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeeImmigration && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getCountries();
        }
    }

    getCountries() {
        const countrySearchModel = new CountryModel();
        countrySearchModel.isArchived = false;
        this.store.dispatch(new LoadCountryListItemsTriggered(countrySearchModel));
        this.selectCountryListData$ = this.store.pipe(select(hrManagementModuleReducer.getCountryAll));
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.immigrationDetailsForm();
        this.closePopover(this.formId);
    }

    onChange(mrChange: MatRadioChange) {
        this.document = mrChange.value;
    }

    searchByCountry(countryId) {
        this.selectedCountryId = countryId;
    }

    closePopover(formDirective: FormGroupDirective) {
        // if (this.employeeImmigrationDetailsId) {
        //     this.documents = this.employeeImmigrationDetails.document;
        //     this.employeeImmigrationDetailsForm.patchValue(this.employeeImmigrationDetails);
        //     this.startDate();
        // } else {
        //     this.documents = "";
        //     this.immigrationDetailsForm();
        // }
        this.documents = "";
        this.immigrationDetailsForm();
        formDirective.resetForm();
        this.closePopup.emit("");
    }

    immigrationDetailsForm() {
        this.employeeImmigrationDetailsForm = new FormGroup({
            "documents": new FormControl(this.documents,
                Validators.compose([
                    Validators.required
                ])
            ),
            documentNumber: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            issuedDate: new FormControl("",
                Validators.compose([

                ])
            ),
            expiryDate: new FormControl("",
                Validators.compose([
                ])
            ),
            eligibleStatus: new FormControl("",
                Validators.compose([
                    Validators.maxLength(100)
                ])
            ),
            countryId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            eligibleReviewDate: new FormControl("",
                Validators.compose([

                ])
            ),
            comments: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)
                ])
            )
        });
        this.endDateBool = true;
    }

    saveEmployeeImmigrationDetails(formDirective: FormGroupDirective) {
        this.isToUploadFiles = false;
        let employeeImmigrationDetails = new EmployeeImmigrationDetailsModel();
        employeeImmigrationDetails = this.employeeImmigrationDetailsForm.value;
        employeeImmigrationDetails.employeeId = this.employeeId;
        employeeImmigrationDetails.document = this.document;
        employeeImmigrationDetails.isArchived = false;
        if (this.employeeImmigrationDetailsId) {
            employeeImmigrationDetails.employeeImmigrationId = this.employeeImmigrationDetails.employeeImmigrationId;
            employeeImmigrationDetails.timeStamp = this.employeeImmigrationDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeImmigrationDetailsTriggered(employeeImmigrationDetails));
        this.upsertEmployeeImmigrationDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeImmigrationDetailLoading));
        this.formId = formDirective;
    }

    startDate() {
        if (this.employeeImmigrationDetailsForm.value.issuedDate) {
            this.minDateForEndDate = this.employeeImmigrationDetailsForm.value.issuedDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeImmigrationDetailsForm.controls["expiryDate"].setValue("");
        }
    }
}
