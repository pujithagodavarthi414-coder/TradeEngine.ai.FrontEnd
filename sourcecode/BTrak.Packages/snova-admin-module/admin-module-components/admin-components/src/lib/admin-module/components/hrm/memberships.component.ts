import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { MembershipModel } from '../../models/hr-models/membership-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-memberships",
    templateUrl: `memberships.component.html`
})

export class MembershipComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteMembershipPopUp") deleteMembershipPopUp;
    @ViewChildren("upsertMembershipPopUp") upsertMembershipPopUp;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    memberships: MembershipModel[];
    validationMessage: string;
    membershipId: string;
    membershipName: string;
    searchText: string;
    temp: any;
    membershipModel: MembershipModel;
    membership: string;
    timeStamp: any;

    membershipForm: FormGroup;

    constructor(
        public hrManagementService: HRManagementService, private translateService: TranslateService,
        private snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllMemberships();
    }

    getAllMemberships() {
        this.isAnyOperationIsInprogress = true;
        const membershipModel = new MembershipModel();
        membershipModel.isArchived = this.isArchived;
        this.hrManagementService.getMemberships(membershipModel).subscribe((response: any) => {
            if (response.success === true) {
                this.memberships = response.data;
                this.temp = this.memberships;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createMembershipPopupOpen(upsertMembershipPopUp) {
        upsertMembershipPopUp.openPopover();
        this.membership = this.translateService.instant("MEMBERSHIPS.ADDMEMBERSHIPTITLE");
    }

    editMembershipPopupOpen(row, upsertMembershipPopUp) {
        this.membershipForm.patchValue(row);
        this.membershipId = row.membershipId;
        this.timeStamp = row.timeStamp;
        this.membership = this.translateService.instant("MEMBERSHIPS.EDITMEMBERSHIPTITLE");
        upsertMembershipPopUp.openPopover();
    }

    deleteMembershipPopUpOpen(row, deleteMembershipPopUp) {
        this.membershipId = row.membershipId;
        this.membershipName = row.memberShipName;
        this.timeStamp = row.timeStamp;
        deleteMembershipPopUp.openPopover();
    }

    closeUpsertMembershipPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertMembershipPopUp.forEach((p) => p.closePopover());
    }

    closeDeleteMembershipDialog() {
        this.clearForm();
        this.deleteMembershipPopUp.forEach((p) => p.closePopover());
    }

    upsertMembership(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.membershipModel = this.membershipForm.value;
        this.membershipModel.memberShipName = this.membershipModel.memberShipName.trim();
        this.membershipModel.membershipId = this.membershipId;
        this.membershipModel.timeStamp = this.timeStamp;
        this.hrManagementService.upsertMembershipDetail(this.membershipModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertMembershipPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllMemberships();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteMembership() {
        this.isAnyOperationIsInprogress = true;
        this.membershipModel = new MembershipModel();
        this.membershipModel.membershipId = this.membershipId;
        this.membershipModel.memberShipName = this.membershipName;
        this.membershipModel.timeStamp = this.timeStamp;
        this.membershipModel.isArchived = !this.isArchived
        this.hrManagementService.upsertMembershipDetail(this.membershipModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteMembershipPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllMemberships();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.membershipId = null;
        this.membershipName = null;
        this.timeStamp = null;
        this.searchText = null;
        this.membershipForm = new FormGroup({
            memberShipName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((membership) => (membership.memberShipName.toLowerCase().indexOf(this.searchText) > -1)));
        this.memberships = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
