import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
// import { tap, takeUntil } from "rxjs/operators";
import { Subject, Observable } from 'rxjs';
// import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
import { MatOption } from '@angular/material/core';
import { ToastrService } from "ngx-toastr";
import cronstrue from 'cronstrue';

import "../../globaldependencies/helpers/fontawesome-icons";

// import * as auditModuleReducer from "../store/reducers/index";
// import { State } from "../store/reducers/index";

// import { SoftLabelConfigurationModel } from "app/common/models/softLabels-model";
// import { softLabelsActionTypes } from "app/common/store/actions/soft-labels.actions";

// import * as commonModuleReducers from "../../../common/store/reducers/index";
// import { AuditReport } from '../models/audit-report.model';
// import { AuditConduct } from '../models/audit-conduct.model';
// import { LoadAuditConductListTriggered } from '../store/actions/conducts.actions';
// import { AuditReportActionTypes, LoadReportTriggered } from '../store/actions/audit-report.actions';
import { AuditCompliance } from '../models/audit-compliance.model';
import { AuditService } from '../services/audits.service';
import { QuestionHistoryModel } from '../models/question-history.model';
import { AssetService } from '../dependencies/services/assets.service';
import { Branch } from '../dependencies/models/branch';
import { UserModel } from '../dependencies/models/user';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ActivatedRoute, Router } from '@angular/router';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';

@Component({
    selector: 'audit-overall-activity',
    templateUrl: './audit-overall-activity.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AudiOverallActivityComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("allAuditSelected") private allAuditSelected: MatOption;
    @ViewChild("allUserSelected") private allUserSelected: MatOption;
    @ViewChild("allBranchSelected") private allBranchSelected: MatOption;

    public ngDestroyed$ = new Subject();

    selectAudit: FormGroup;
    selectUser: FormGroup;
    selectBranch: FormGroup;

    softLabels: SoftLabelConfigurationModel[];

    projectId: string;

    auditList = [];
    branchList = [];
    userList = [];
    activityList = [];

    pageSize: number = 25;
    pageNumber: number = 1;
    pageIndex: number = 0;
    activityListCount: number = 0;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];

    selectedAuditIds: string;
    selectedUserIds: string;
    selectedBranchIds: string;
    selectedAudit: string;
    selectedUser: string;
    selectedBranch: string;
    validationMessage: string;
    dateFrom: Date;
    dateTo: Date;
    maxDate = new Date();
    isIncludeAction: boolean = false;
    isIncludeActionText: string;
    filterAuditNames: string;
    filterUserNames: string;
    filterBranchNames: string;


    anyOperationInProgress: boolean = false;
    isFromDashboard: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private actionUpdates$: Actions, private toastr: ToastrService, private routes: Router, private route: ActivatedRoute, private auditService: AuditService, private assetService: AssetService, private cdRef: ChangeDetectorRef) {
        super();

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }

        this.initializeFilters();
        this.getAuditList();
        this.getBranchList();
        this.getUserList();
        this.getAuditOverallActivity();
        this.getSoftLabelConfigurations();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    changeDeadline(from, to) {
        if (from > to)
            this.dateTo = null;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
    }

    changeToDeadline() {
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
    }

    closeDateFromFilter() {
        this.dateFrom = null;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
    }

    closeDateToFilter() {
        this.dateTo = null;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
    }

    getAuditList() {
        let auditModel = new AuditCompliance();
        auditModel.projectId = this.projectId;
        auditModel.isArchived = false;
        this.auditService.searchAuditCompliances(auditModel).subscribe((response: any) => {
            this.auditList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getBranchList() {
        let branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.assetService.getBranchList(branchSearchResult).subscribe((response: any) => {
            this.branchList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getUserList() {
        let userModel = new UserModel();
        userModel.pageSize = 200;
        this.auditService.searchUsers(userModel).subscribe((response: any) => {
            this.userList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getAuditOverallActivity() {
        let auditModel = new QuestionHistoryModel();
        auditModel.auditIds = this.selectedAuditIds;
        auditModel.userIds = this.selectedUserIds;
        auditModel.branchIds = this.selectedBranchIds;
        auditModel.dateFrom = this.dateFrom;
        auditModel.dateTo = this.dateTo;
        auditModel.pageSize = this.pageSize;
        auditModel.pageNumber = this.pageNumber;
        auditModel.isActionInculde = this.isIncludeAction;
        auditModel.projectId = this.projectId;
        this.anyOperationInProgress = true;
        this.auditService.getAuditOverallActivity(auditModel).subscribe((result: any) => {
            if (result.success) {
                this.anyOperationInProgress = false;
                if (result.data && result.data.length > 0) {
                    this.activityList = result.data;
                    this.activityListCount = this.activityList[0].totalCount;
                }
                else {
                    this.activityList = [];
                    this.activityListCount = 0;
                }
                this.cdRef.markForCheck();
            }
            else {
                this.anyOperationInProgress = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    getMyActivity(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumber = 1;
            this.pageIndex = 0;
        }
        else {
            this.pageNumber = pageEvent.pageIndex + 1;
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.getAuditOverallActivity();
    }

    getActivitylistByAudit() {
        const selectedTypes = this.selectAudit.value.auditId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedAuditIds = selectedTypes.toString();
        let audits = this.auditList;
        const auditList = _.filter(audits, function (audit) {
            return selectedTypes.toString().includes(audit.auditId);
        })
        let auditNames = auditList.map((x) => x.auditName);
        this.selectedAudit = auditNames.toString();
        this.filterAuditNames = this.filterAuditNames == "all" ? "all" : this.selectedAudit;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;

        this.getAuditOverallActivity();
        this.cdRef.markForCheck();
    }

    toggleAllAuditSelection() {
        if (this.allAuditSelected.selected) {
            this.selectAudit.controls.auditId.patchValue([
                ...this.auditList.map((item) => item.auditId),
                0
            ]);
            this.filterAuditNames = "all";
        }
        else {
            this.selectAudit.controls.auditId.patchValue([]);
            this.filterAuditNames = null;
        }
        this.getActivitylistByAudit();
    }

    toggleAuditSelectionPerOne() {
        if (this.allAuditSelected.selected) {
            this.allAuditSelected.deselect();
            this.filterAuditNames = null;
            return false;
        }
        if (this.selectAudit.controls.auditId.value.length === this.auditList.length) {
            this.allAuditSelected.select();
            this.filterAuditNames = "all";
        }
    }

    getActivitylistByUser() {
        const selectedTypes = this.selectUser.value.userId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedUserIds = selectedTypes.toString();
        let users = this.userList;
        const userList = _.filter(users, function (user) {
            return selectedTypes.toString().includes(user.id);
        })
        let userNames = userList.map((x) => x.fullName);
        this.selectedUser = userNames.toString();
        this.filterUserNames = this.filterUserNames == "all" ? "all" : this.selectedUser;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
        this.cdRef.markForCheck();
    }

    toggleAllUserSelection() {
        if (this.allUserSelected.selected) {
            this.selectUser.controls.userId.patchValue([
                ...this.userList.map((item) => item.id),
                0
            ]);
            this.filterUserNames = "all";
        }
        else {
            this.selectUser.controls.userId.patchValue([]);
            this.filterUserNames = null;
        }
        this.getActivitylistByUser();
    }

    toggleUserSelectionPerOne() {
        if (this.allUserSelected.selected) {
            this.allUserSelected.deselect();
            this.filterUserNames = null;
            return false;
        }
        if (this.selectUser.controls.userId.value.length === this.userList.length) {
            this.allUserSelected.select();
            this.filterUserNames = "all";
        }
    }

    getActivitylistByBranch() {
        const selectedTypes = this.selectBranch.value.branchId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedBranchIds = selectedTypes.toString();
        let branches = this.branchList;
        const branchList = _.filter(branches, function (branch) {
            return selectedTypes.toString().includes(branch.branchId);
        })
        let branchNames = branchList.map((x) => x.branchName);
        this.selectedBranch = branchNames.toString();
        this.filterBranchNames = this.filterBranchNames == "all" ? "all" : this.selectedBranch;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
        this.cdRef.markForCheck();
    }

    toggleAllBranchSelection() {
        if (this.allBranchSelected.selected) {
            this.selectBranch.controls.branchId.patchValue([
                ...this.branchList.map((item) => item.branchId),
                0
            ]);
            this.filterBranchNames = "all";
        }
        else {
            this.selectBranch.controls.branchId.patchValue([]);
            this.filterBranchNames = null;
        }
        this.getActivitylistByBranch();
    }

    toggleBranchSelectionPerOne() {
        if (this.allBranchSelected.selected) {
            this.allBranchSelected.deselect();
            this.filterBranchNames = null;
            return false;
        }
        if (this.selectBranch.controls.branchId.value.length === this.branchList.length) {
            this.allBranchSelected.select();
            this.filterBranchNames = "all";
        }
    }

    constructCron(value) {
        return cronstrue.toString(value);
    }

    initializeFilters() {
        this.selectAudit = this.formBuilder.group({ auditId: new FormControl("", []) });
        this.selectUser = this.formBuilder.group({ userId: new FormControl("", []) });
        this.selectBranch = this.formBuilder.group({ branchId: new FormControl("", []) });
    }

    resetAllFilters() {
        this.selectAudit.reset();
        this.selectUser.reset();
        this.selectBranch.reset();
        this.selectedAuditIds = null;
        this.selectedUserIds = null;
        this.selectedBranchIds = null;
        this.selectedAudit = null;
        this.selectedBranch = null;
        this.selectedUser = null;
        this.filterAuditNames = null;
        this.filterUserNames = null;
        this.filterBranchNames = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.isIncludeAction = false;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 100;
        this.getAuditOverallActivity();
        this.cdRef.markForCheck();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    getGoalAcTivity() {
        this.isIncludeActionText = this.isIncludeAction == true ? "Yes" : "No";
        this.getAuditOverallActivity();
    }

    filter() {
        if (this.filterAuditNames || this.filterUserNames || this.filterBranchNames || this.dateFrom || this.dateTo || this.isIncludeAction) {
            return true;
        } else {
            return false;
        }
    }

    closeAuditChip() {
        this.filterAuditNames = null;
        this.selectedAuditIds = null;
        this.selectedAudit = null;
        this.selectAudit.reset();
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }

    closeBranchChip() {
        this.filterBranchNames = null;
        this.selectedBranchIds = null;
        this.selectBranch.reset();
        this.selectedBranch = null;
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }

    closeUserChip() {
        this.filterUserNames = null;
        this.selectedUserIds = null;
        this.selectUser.reset();
        this.selectedUser = null;
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }

    closeDateFromChip() {
        this.dateFrom = null;
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }

    closeDateToChip() {
        this.dateTo = null;
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }

    closeActionInclude() {
        this.isIncludeAction = false;
        this.cdRef.markForCheck();
        this.getAuditOverallActivity();
    }
}