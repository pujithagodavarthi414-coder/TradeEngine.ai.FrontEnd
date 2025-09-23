import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, combineLatest } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

import { LicenceTypesModel } from "../../models/licence-types-model";
import { EmployeeLicenceDetailsModel } from "../../models/employee-licence-details-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { LoadLicenceTypeTriggered } from "../../store/actions/licence-types.actions";
import { CreateEmployeeLicenceDetailsTriggered, EmployeeLicenceDetailsActionTypes } from "../../store/actions/employee-licence-details.actions";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-licence-details",
    templateUrl: "add-licence-details.component.html"
})

export class AddLicenceDetailsComponent extends CustomAppBaseComponent {
    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editLicenceDetailsData")
    set editLicenceDetailsData(data: EmployeeLicenceDetailsModel) {
        this.initializeEmployeeLicenceDetailsForm();
        if (!data) {
            this.employeeLicenceDetails = null;
            this.employeeLicenceDetailsId = null;
        } else {
            this.employeeLicenceDetails = data;
            this.employeeLicenceDetailsId = data.employeeLicenceDetailId;
            this.employeeLicenceDetailsForm.patchValue(data);
            this.startDate();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeLicenceDetailsForm: FormGroup;
    formId: FormGroupDirective;

    employeeLicenceDetails: EmployeeLicenceDetailsModel;

    isFileExist: boolean;
    permission: boolean = false;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    employeeId: string = "";
    employeeLicenceDetailsId: string = "";
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.LicenceReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isToUploadFiles: boolean = false;

    licenceTypesList$: Observable<LicenceTypesModel[]>
    upsertEmployeeLicenceDetailsInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeLicenceDetailsIdOfUpsertLicenceDetails)).subscribe(result => {
                        this.employeeLicenceDetailsId = result;
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
        // this.canAccess_feature_AddOrUpdateEmployeeLicenceDetails$.subscribe((result: Boolean) => {
        //     this.canAccess_feature_AddOrUpdateEmployeeLicenceDetails = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeeIdentificationDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getLicenceTypes();
        }
    }

    getLicenceTypes() {
        const licenceTypesSearchModel = new LicenceTypesModel();
        licenceTypesSearchModel.isArchived = false;
        this.store.dispatch(new LoadLicenceTypeTriggered(licenceTypesSearchModel));
        this.licenceTypesList$ = this.store.pipe(select(hrManagementModuleReducer.getLicenceTypeAll))
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.initializeEmployeeLicenceDetailsForm();
        this.closePopover(this.formId);
    }

    closePopover(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        // if (this.employeeLicenceDetailsId) {
        //     this.employeeLicenceDetailsForm.patchValue(this.employeeLicenceDetails);
        //     this.startDate();
        // }
        // else
        this.initializeEmployeeLicenceDetailsForm();
        this.closePopup.emit("");
    }

    initializeEmployeeLicenceDetailsForm() {
        this.employeeLicenceDetailsForm = new FormGroup({
            licenceIssuedDate: new FormControl("",
                Validators.compose([
                ])
            ),
            licenceTypeId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            licenceNumber: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ),
            licenceExpiryDate: new FormControl("",
                Validators.compose([
                ])
            )
        });
        this.endDateBool = true;
    }

    saveEmployeeLicenceDetails(formDirective: FormGroupDirective) {
        this.isToUploadFiles = false;
        this.formId = formDirective;
        let employeeLicenceDetails = new EmployeeLicenceDetailsModel();
        employeeLicenceDetails = this.employeeLicenceDetailsForm.value;
        employeeLicenceDetails.employeeId = this.employeeId;
        employeeLicenceDetails.isArchived = false;
        if (this.employeeLicenceDetailsId) {
            employeeLicenceDetails.employeeLicenceDetailId = this.employeeLicenceDetails.employeeLicenceDetailId;
            employeeLicenceDetails.timeStamp = this.employeeLicenceDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeLicenceDetailsTriggered(employeeLicenceDetails));
        this.upsertEmployeeLicenceDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeLicenceDetailLoading));
    }

    startDate() {
        if (this.employeeLicenceDetailsForm.value.licenceIssuedDate) {
            this.minDateForEndDate = this.employeeLicenceDetailsForm.value.licenceIssuedDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeLicenceDetailsForm.controls["licenceExpiryDate"].setValue("");
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
