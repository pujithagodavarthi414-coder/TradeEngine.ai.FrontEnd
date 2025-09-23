import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { RelationshipDetailsModel } from "../../models/relationship-details-model";
import { EmployeeDependentContactModel } from "../../models/employee-dependent-contact-model";

import { State } from "../../store/reducers";
import * as hrManagementModuleReducer from "../../store/reducers";

import { LoadRelationshipDetailsTriggered } from "../../store/actions/relationship-details.actions";
import { CreateEmployeeDependentDetailsTriggered, EmployeeDependentDetailsActionTypes } from "../../store/actions/employee-dependent-details.actions";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-dependent-details",
    templateUrl: "add-dependent-details.component.html"
})

export class AddDependentDetailsComponent extends CustomAppBaseComponent {
    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editDependencyDetailsData")
    set editDependencyDetailsData(data: EmployeeDependentContactModel) {
        if (!data) {
            this.employeeDependentDetails = null;
            this.employeeDependentDetailsId = null;
            this.initializeEmployeeDependencyDetailsForm();
        } else {
            this.employeeDependentDetails = data;
            this.employeeDependentDetailsId = data.employeeDependentId;
            this.employeeDependentDetailsForm.patchValue(data);
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeDependentDetailsForm: FormGroup;
    formId: FormGroupDirective;

    employeeDependentDetails: EmployeeDependentContactModel;

    employeeId: string = "";
    permission: boolean = false;
    employeeDependentDetailsId: string = "";

    relationshipDetailsList$: Observable<RelationshipDetailsModel[]>
    upsertEmployeeDependentDetailsInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    moduleTypeId = 1;

    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsCompleted),
                tap(() => {
                    this.initializeEmployeeDependencyDetailsForm();
                    this.closePopover(this.formId);
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeEmployeeDependencyDetailsForm();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeDependentContactDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeDependentContactDetails = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeeDependentContactDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getAllRelationshipDetails();
        }
    }

    getAllRelationshipDetails() {
        const RelationshipDetailsResult = new RelationshipDetailsModel();
        RelationshipDetailsResult.isArchived = false;
        this.store.dispatch(new LoadRelationshipDetailsTriggered(RelationshipDetailsResult));
        this.relationshipDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getRelationshipDetailsAll));
    }

    closePopover(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.employeeDependentDetailsId) {
            this.employeeDependentDetailsForm.patchValue(this.employeeDependentDetails);
        } else {
            this.initializeEmployeeDependencyDetailsForm();
        }
        this.closePopup.emit("");
    }

    initializeEmployeeDependencyDetailsForm() {
        this.employeeDependentDetailsForm = new FormGroup({
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
            mobileNo: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            )
        });
    }

    saveEmployeeDependentDetails(formDirective: FormGroupDirective) {
        let employeeDependentDetails = new EmployeeDependentContactModel();
        employeeDependentDetails = this.employeeDependentDetailsForm.value;
        employeeDependentDetails.employeeId = this.employeeId;
        employeeDependentDetails.isEmergencyContact = false;
        employeeDependentDetails.isDependentContact = true;
        employeeDependentDetails.isArchived = false;
        if (this.employeeDependentDetailsId) {
            employeeDependentDetails.emergencyContactId = this.employeeDependentDetails.employeeDependentId;
            employeeDependentDetails.timeStamp = this.employeeDependentDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeDependentDetailsTriggered(employeeDependentDetails));
        this.upsertEmployeeDependentDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeDependentDetailLoading));
        this.formId = formDirective;
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
