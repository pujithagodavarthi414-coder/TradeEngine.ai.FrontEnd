import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap, map } from 'rxjs/operators';


import { EmployeeContractModel } from '../../models/employee-contract-model';
import { ContractTypeSearchModel } from '../../models/contract-type-search-model';
import { ContractModel } from '../../models/contract-model';
import { Currency } from '../../models/currency';

import { State } from '../../store/reducers/index';
import * as hrManagementModuleReducer from '../../store/reducers/index';
import * as fileReducer from '@snovasys/snova-file-uploader';

import { LoadContractTypeTriggered } from '../../store/actions/contract-type.actions';
import { LoadCurrencyTriggered } from '../../store/actions/currency.actions';
import { EmployeeContractDetailsActionTypes, CreateEmployeeContractDetailsTriggered } from '../../store/actions/employee-contract-details.actions';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-contract-details",
    templateUrl: "add-contract-details.component.html"
})

export class AddContractDetailsComponent extends CustomAppBaseComponent {
    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editContractDetailsData")
    set editContractDetailsData(data: EmployeeContractModel) {
        this.initializeEmployeeContractDetailsForm();
        if (!data) {
            this.employeeContractDetails = null;
            this.employeeContractDetailsId = null;
        } else {
            this.employeeContractDetails = data;
            this.employeeContractDetailsId = data.employmentContractId;
            this.employeeContractDetailsForm.patchValue(data);
            this.startDate();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeContractDetailsForm: FormGroup;
    formId: FormGroupDirective;

    employeeContractDetails: EmployeeContractModel;

    employeeId: string = "";
    employeeContractDetailsId: string = "";
    minDateForEndDate = new Date();
    minDate = new Date(1753, 0, 1);
    endDateBool: boolean = true;
    selectedCurrencyId: string = "";
    permission: boolean = false;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.ContractReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;

    upsertEmployeeContractDetailsInProgress$: Observable<boolean>;
    contractTypeDetailsList$: Observable<ContractModel[]>;
    currencyList$: Observable<Currency[]>
    anyOperationInProgress$: Observable<boolean>;
    employeeContractDetailsId$: Observable<string>;
    toUploadFiles: boolean = false;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted)).subscribe(x => {
                    let contractId;
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeContractDetailsId)).subscribe(result => {
                        contractId = result;
                    });
                    this.employeeContractDetailsId = contractId;
                    this.toUploadFiles = true;
                    this.cdRef.detectChanges();
                });

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
        if ((this.canAccess_feature_AddOrUpdateEmploymentContract && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getContractTypeDetails();
            this.getCurrencyList();
        }
    }

    getContractTypeDetails() {
        const contractTypeSearchModel = new ContractTypeSearchModel();
        contractTypeSearchModel.isArchived = false;
        this.store.dispatch(new LoadContractTypeTriggered(contractTypeSearchModel));
        this.contractTypeDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getContractTypeAll));
    }

    getCurrencyList() {
        this.store.dispatch(new LoadCurrencyTriggered());
        this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
    }

    searchByCurrency(currencyId) {
        this.selectedCurrencyId = currencyId;
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.initializeEmployeeContractDetailsForm();
        this.closePopover(this.formId);
    }

    closePopover(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.employeeContractDetailsId && this.employeeContractDetails) {
            this.employeeContractDetailsForm.patchValue(this.employeeContractDetails);
            this.startDate();
        } else {
            this.initializeEmployeeContractDetailsForm();
        }
        this.closePopup.emit("");
    }

    initializeEmployeeContractDetailsForm() {
        this.employeeContractDetailsForm = new FormGroup({
            contractTypeId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            contractedHours: new FormControl("",
                Validators.compose([
                    Validators.maxLength(9)
                ])
            ),
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                ])
            ),
            holidayOrThisYear: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            holidayOrFullEntitlement: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            // hourlyRate: new FormControl("",
            //     Validators.compose([
            //         Validators.maxLength(5)
            //     ])
            // ),
            // currencyId: new FormControl("", [
            // ])
        });
        this.endDateBool = true;
    }

    saveEmployeeContractDetails(formDirective: FormGroupDirective) {
        this.toUploadFiles = false;
        let employeeContractDetails = new EmployeeContractModel();
        employeeContractDetails = this.employeeContractDetailsForm.value;
        employeeContractDetails.employeeId = this.employeeId;
        employeeContractDetails.isArchived = false;
        if (this.employeeContractDetailsId) {
            employeeContractDetails.employmentContractId = this.employeeContractDetails.employmentContractId;
            employeeContractDetails.timeStamp = this.employeeContractDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeContractDetailsTriggered(employeeContractDetails));
        this.upsertEmployeeContractDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeContractDetailLoading));
        this.formId = formDirective;
    }

    startDate() {
        if (this.employeeContractDetailsForm.value.startDate) {
            this.minDateForEndDate = this.employeeContractDetailsForm.value.startDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeContractDetailsForm.controls["endDate"].setValue("");
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
