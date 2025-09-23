import { Component, Output, EventEmitter, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

import { EmployeeEducationLevelsModel } from "../../models/employee-education-levels-model";
import { EmployeeEducationDetailsModel } from "../../models/employee-education-details-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { CreateEmployeeEducationDetailsTriggered, EmployeeEducationDetailsActionTypes } from "../../store/actions/employee-education-details.action";
import { LoadEmployeeEducationLevelsTriggered } from "../../store/actions/employee-education-levels-details.action";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-education-details",
    templateUrl: "add-education-details.component.html",
})

export class AddEducationDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editEducationDetailsData")
    set editEducationDetailsData(data: EmployeeEducationDetailsModel) {
        this.educationDetailsForm();
        if (!data) {
            this.employeeEducationDetails = null;
            this.employeeEducationDetailsId = null;
            this.startDateFn();
        } else {
            this.employeeEducationDetails = data;
            this.employeeEducationDetailsId = data.employeeEducationDetailId;
            this.employeeEducationDetailsForm.patchValue(data);
            this.startDateFn();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeEducationDetailsForm: FormGroup;

    Education: EmployeeEducationDetailsModel;
    employeeEducationDetails: EmployeeEducationDetailsModel;

    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    permission: boolean = false;
    selectedEducationLevelId: string = "";
    employeeId: string;
    employeeEducationDetailsId: string = "";
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.EducationReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    isToUploadFiles: boolean = false;
    anyOperationInProgress$: Observable<boolean>;

    selectEducationLevelsListData$: Observable<EmployeeEducationLevelsModel[]>;
    upsertEmployeeEducationDetailsInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeEducationDetailsIdOfUpsertEducationDetails)).subscribe(result => {
                        this.employeeEducationDetailsId = result;
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
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeEducationDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeEducationDetails = result;
        // })
        // if ((this.canAccess_feature_AddOrUpdateEmployeeEducationDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
        // }
        this.getLevels();
    }

    getLevels() {
        const employeeEducationLevelsModel = new EmployeeEducationLevelsModel();
        employeeEducationLevelsModel.isArchived = false;
        this.store.dispatch(new LoadEmployeeEducationLevelsTriggered(employeeEducationLevelsModel));
        this.selectEducationLevelsListData$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeEducationLevelsAll));
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.educationDetailsForm();
        this.closePopover();
    }

    searchByLevel(educationLevelId) {
        this.selectedEducationLevelId = educationLevelId;
    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeEducationDetailsId && this.employeeEducationDetails) {
            this.employeeEducationDetailsForm.patchValue(this.employeeEducationDetails);
            this.startDateFn();
        } else {
            this.educationDetailsForm();
        }
        this.closePopup.emit("");
    }

    educationDetailsForm() {
        this.employeeEducationDetailsForm = new FormGroup({
            institute: new FormControl("",
                Validators.compose([
                    Validators.maxLength(150)
                ])
            ),
            majorSpecialization: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800),
                    Validators.required
                ])
            ),
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            gpaOrScore: new FormControl("",
                Validators.compose([
                    Validators.maxLength(18),
                    Validators.required,
                    Validators.min(1)
                ])
            ),
            educationLevelId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            )
        });
        this.endDateBool = true;
    }

    startDateFn() {
        if (this.employeeEducationDetailsForm.value.startDate) {
            this.minDateForEndDate = this.employeeEducationDetailsForm.value.startDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeEducationDetailsForm.controls["endDate"].setValue("");
        }
        this.cdRef.detectChanges();
    }

    saveEmployeeEducationDetails() {
        this.isToUploadFiles = false;
        let employeeEducationDetails = new EmployeeEducationDetailsModel();
        employeeEducationDetails = this.employeeEducationDetailsForm.value;
        employeeEducationDetails.employeeId = this.employeeId;
        employeeEducationDetails.isArchived = false;
        if (this.employeeEducationDetailsId) {
            employeeEducationDetails.employeeEducationDetailId = this.employeeEducationDetails.employeeEducationDetailId;
            employeeEducationDetails.timeStamp = this.employeeEducationDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeEducationDetailsTriggered(employeeEducationDetails));
        this.upsertEmployeeEducationDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeEducationDetailLoading))
    }
}
