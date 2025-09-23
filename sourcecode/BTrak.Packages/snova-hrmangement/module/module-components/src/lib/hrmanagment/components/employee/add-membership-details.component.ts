import { Component, Output, EventEmitter, Input, ViewChild } from "@angular/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";

import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { MembershipModel } from "../../models/membership-model";
import { Currency } from '../../models/currency';
import { EmployeeMembershipDetailsModel } from "../../models/employee-membership-details-model";
import { SubscriptionPaidByOptionsModel } from "../../models/subscription-paid-by-options-model";

import * as hrManagementModuleReducer from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import * as fileReducer from '@snovasys/snova-file-uploader';

import { CreateEmployeeMembershipDetailsTriggered, EmployeeMembershipDetailsActionTypes } from "../../store/actions/employee-Membership-details.action";
import { LoadSubscriptionPaidByOptionsTriggered } from "../../store/actions/subscription-paid-by-options.actions";
import { LoadMembershipTriggered } from "../../store/actions/membership.action";
import { LoadCurrencyTriggered } from '../../store/actions/currency.actions';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-membership-details",
    templateUrl: "add-membership-details.component.html"
})

export class AddMembershipDetailsComponent extends CustomAppBaseComponent {

    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editMembershipDetailsData")
    set editMembershipDetailsData(data: EmployeeMembershipDetailsModel) {
        this.membershipDetailsForm();
        if (!data) {
            this.validity = false;
            this.checked = false;
            this.employeeMembershipDetails = null;
            this.employeeMembershipDetailsId = null;
        } else {
            this.employeeMembershipDetails = data;
            this.employeeMembershipDetailsId = data.employeeMembershipId;
            if (data.subscriptionId || data.subscriptionAmount || data.currencyName) {
                this.checked = true;
            } else {
                this.checked = false;
            }
            if (data.renewalDate) {
                this.validity = true;
            } else {
                this.validity = false;
            }
            this.employeeMembershipDetailsForm.patchValue(data);
            this.startDate();
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeMembershipDetailsForm: FormGroup;

    membership: EmployeeMembershipDetailsModel;
    employeeMembershipDetails: EmployeeMembershipDetailsModel;

    permission: boolean = false;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    selectedMembershipLevelId: string = "";
    selectedSubscriptionPaidByOptionsId: string = "";
    selectedMembershipId: string = "";
    selectedCurrencyId: string = "";
    employeeId: string;
    employeeMembershipDetailsId: string = "";
    commenceDate: boolean = true;
    checked = false;
    validity = false;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.MembershipReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    isToUploadFiles: boolean = false;

    selectSubscriptionPaidByOptionsListData$: Observable<SubscriptionPaidByOptionsModel[]>;
    selectMembershipListData$: Observable<MembershipModel[]>;
    currencyList$: Observable<Currency[]>
    upsertEmployeeMembershipDetailsInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted),
                tap(() => {
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeMembershipDetailsIdOfUpsertMembershipDetails)).subscribe(result => {
                        this.employeeMembershipDetailsId = result;
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
        // this.canAccess_feature_AddOrUpdateEmployeeMemberships$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeMemberships = result;
        // })
        if ((this.canAccess_feature_AddOrUpdateEmployeeMemberships && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getSubscriptionPaidByOptions();
            this.getMembership();
            this.getCurrencyList();
        }
    }

    getSubscriptionPaidByOptions() {
        const subscriptionPaidByOptionsModel = new SubscriptionPaidByOptionsModel();
        subscriptionPaidByOptionsModel.isArchived = false;
        this.store.dispatch(new LoadSubscriptionPaidByOptionsTriggered(subscriptionPaidByOptionsModel));
        this.selectSubscriptionPaidByOptionsListData$ = this.store.pipe(select(hrManagementModuleReducer.getSubscriptionPaidByOptionsAll));
    }

    searchBySubscriptionPaidByOptions(subscriptionPaidById) {
        this.selectedSubscriptionPaidByOptionsId = subscriptionPaidById;
    }

    getMembership() {
        const membershipModel = new MembershipModel();
        membershipModel.isArchived = false;
        this.store.dispatch(new LoadMembershipTriggered(membershipModel));
        this.selectMembershipListData$ = this.store.pipe(select(hrManagementModuleReducer.getMembershipAll));
    }

    searchByMembership(membershipId) {
        this.selectedMembershipId = membershipId;
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
        this.membershipDetailsForm();
        this.closePopover();
    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeMembershipDetailsId && this.employeeMembershipDetails) {
            if (this.employeeMembershipDetails.subscriptionId || this.employeeMembershipDetails.subscriptionAmount || this.employeeMembershipDetails.currencyName) {
                this.checked = true;
            } else {
                this.checked = false;
            }
            if (this.employeeMembershipDetails.renewalDate) {
                this.validity = true;
            } else {
                this.validity = false;
            }
            this.employeeMembershipDetailsForm.patchValue(this.employeeMembershipDetails);
            this.startDate();
        } else {
            this.membershipDetailsForm();
        }
        this.closePopup.emit("");
    }

    membershipDetailsForm() {
        this.employeeMembershipDetailsForm = new FormGroup({
            subscriptionId: new FormControl("",
                Validators.compose([

                ])
            ),
            membershipId: new FormControl("",
                Validators.compose([

                ])
            ),
            currencyId: new FormControl("",
                Validators.compose([
                ])
            ),
            subscriptionAmount: new FormControl("",
                Validators.compose([
                    Validators.min(0)
                ])
            ),
            commenceDate: new FormControl("",
                Validators.compose([
                ])
            ),
            renewalDate: new FormControl("",
                Validators.compose([

                ])
            ),
            nameOfTheCertificate: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)

                ])
            ),
            issueCertifyingAuthority: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)

                ])
            ),
            expiryDate: new FormControl("",
                Validators.compose([

                ])
            ),
            paid: new FormControl(this.checked,
                Validators.compose([

                ])
            ),
            validity: new FormControl(this.validity,
                Validators.compose([

                ])
            )
        });
        this.endDateBool = true;
    }

    startDate() {
        if (this.employeeMembershipDetailsForm.value.commenceDate) {
            this.minDateForEndDate = this.employeeMembershipDetailsForm.value.commenceDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeMembershipDetailsForm.controls["renewalDate"].setValue("");
        }
    }

    visibility() {
        if (!this.checked) {
            this.employeeMembershipDetailsForm.controls["subscriptionId"].setValue("");
            this.employeeMembershipDetailsForm.controls["currencyId"].setValue("");
            this.employeeMembershipDetailsForm.controls["subscriptionAmount"].setValue("");
        }
        if (!this.validity) {
            this.employeeMembershipDetailsForm.controls["renewalDate"].setValue("");
        }
    }

    saveEmployeeMembershipDetails() {
        this.isToUploadFiles = false;
        let employeeMembershipDetails = new EmployeeMembershipDetailsModel();
        employeeMembershipDetails = this.employeeMembershipDetailsForm.value;
        employeeMembershipDetails.employeeId = this.employeeId;
        employeeMembershipDetails.isArchived = false;
        if (this.employeeMembershipDetailsId) {
            employeeMembershipDetails.employeeMembershipId = this.employeeMembershipDetails.employeeMembershipId;
            employeeMembershipDetails.timeStamp = this.employeeMembershipDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeMembershipDetailsTriggered(employeeMembershipDetails));
        this.upsertEmployeeMembershipDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeMembershipDetailLoading))
    }
}
