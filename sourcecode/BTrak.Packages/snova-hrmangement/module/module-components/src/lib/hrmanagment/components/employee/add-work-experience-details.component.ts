import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable, Subject, combineLatest } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil, map } from "rxjs/operators";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { DesignationModel } from '../../models/designations-model';
import { EmployeeWorkExperienceDetailsModel } from "../../models/employee-work-experience-details-model";

import * as hrManagementModuleReducer from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { LoadDesignationListItemsTriggered } from "../../store/actions/designation.action";
import { EmployeeWorkExperienceDetailsActionTypes, CreateEmployeeWorkExperienceDetailsTriggered } from "../../store/actions/employee-work-experience-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-work-experience-details",
    templateUrl: "add-work-experience-details.component.html"
})

export class AddWorkExperienceDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editWorkExperienceDetailsData")
    set editWorkExperienceDetailsData(data: EmployeeWorkExperienceDetailsModel) {
        this.initializeEmployeeWorkExperienceDetailsForm();
        if (!data) {
            this.employeeWorkExperienceDetails = null;
            this.employeeWorkExperienceId = null;
        } else {
            this.employeeWorkExperienceDetails = data;
            this.employeeWorkExperienceId = data.employeeWorkExperienceId;
            this.employeeWorkExperienceDetailsForm.patchValue(data);
            this.startDate();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeWorkExperienceDetailsForm: FormGroup;

    employeeWorkExperienceDetails: EmployeeWorkExperienceDetailsModel;


    permission: boolean = false;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    employeeId: string = "";
    employeeWorkExperienceId: string = "";
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.WorkexperienceReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    isToUploadFiles: boolean = false;

    designationDropDownListData$: Observable<DesignationModel[]>;
    employeeWorkExperienceDetailsLoading$: Observable<boolean>;
    upsertEmployeeWorkExperienceDetailsInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;
    employeeWorkExperienceId$: Observable<string>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.CreatedworkExperienceId)).subscribe(result => {
                        this.employeeWorkExperienceId = result;
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
        // this.canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails = result;
        // })
        // if ((this.canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails && this.permission) ||
        // this.canAccess_feature_CanEditOtherEmployeeDetails) {
        // }
        this.getDesignationList();
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        //this.initializeEmployeeWorkExperienceDetailsForm();
        this.closePopover();
    }

    getDesignationList() {
        const designationSearchModel = new DesignationModel();
        designationSearchModel.isArchived = false;
        this.store.dispatch(new LoadDesignationListItemsTriggered(designationSearchModel));
        this.designationDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationAll));
    }

    initializeEmployeeWorkExperienceDetailsForm() {
        this.employeeWorkExperienceDetailsForm = new FormGroup({
            company: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])
            ),
            designationId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            fromDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            toDate: new FormControl("",
                Validators.compose([
                    Validators.required
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

    saveEmployeeWorkExperienceDetails() {
        this.isToUploadFiles = false;
        let employeeWorkExperienceDetails = new EmployeeWorkExperienceDetailsModel();
        employeeWorkExperienceDetails = this.employeeWorkExperienceDetailsForm.value;
        employeeWorkExperienceDetails.employeeId = this.employeeId;
        employeeWorkExperienceDetails.isArchived = false;
        if (this.employeeWorkExperienceId) {
            employeeWorkExperienceDetails.employeeWorkExperienceId = this.employeeWorkExperienceDetails.employeeWorkExperienceId;
            employeeWorkExperienceDetails.timeStamp = this.employeeWorkExperienceDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeWorkExperienceDetailsTriggered(employeeWorkExperienceDetails));
        this.upsertEmployeeWorkExperienceDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeWorkExperienceDetailLoading));

    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeWorkExperienceId && this.employeeWorkExperienceDetails) {
            this.employeeWorkExperienceDetailsForm.patchValue(this.employeeWorkExperienceDetails);
            this.startDate();
        }
        else
            this.initializeEmployeeWorkExperienceDetailsForm();
        this.closePopup.emit("");
    }

    startDate() {
        if (this.employeeWorkExperienceDetailsForm.value.fromDate) {
            this.minDateForEndDate = this.employeeWorkExperienceDetailsForm.value.fromDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeWorkExperienceDetailsForm.controls["toDate"].setValue("");
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
