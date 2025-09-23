import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, TemplateRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuditService } from "../services/audits.service";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { Observable } from "rxjs";
import { LoadBranchTriggered } from "../dependencies/assetmanagement-store/actions/branch.actions";
import * as assetModuleReducer from '../dependencies/assetmanagement-store/reducers/index';
import { AuditCompliance } from "../models/audit-compliance.model";
import { LoadAuditListTriggered, LoadAuditVersionListTriggered, LoadCopyAuditListTriggered } from "../store/actions/audits.actions";
import { tap } from "rxjs/operators";
import * as auditModuleReducer from "../store/reducers/index";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuditComplainceInputModel, AuditDetailsModel } from "../models/audit-details.model";
import { NonComplaintAuditPreviewComponent } from "./non-complaint-audit-details-preview.component";
import { Branch } from '../dependencies/models/branch';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { HRManagementService } from '../dependencies/services/hr-management.service';
import { HrBranchModel } from '../dependencies/models/hr-models/branch-model';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

@Component({
    selector: 'app-fm-component-audit-complaince',
    templateUrl: `audit-complaince-app.component.html`
})

export class AuditComplainceComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: any) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.oneMonthBack();
            this.getNonComplainceAudits();
        }
    }

    dashboardFilters: any;
    state: State = {
        skip: 0,
        take: 10,
    };
    @ViewChild('DrillDownDialog') DrillDownDialog: TemplateRef<any>;
    isAnyOperationIsInprogress: boolean = false;
    auditsList: any;
    sortDirection: boolean;
    sortBy: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    branchList: any;
    auditList$: Observable<AuditCompliance[]>;
    fromDate: Date = new Date();
    minToDate: any;
    maxfromDate: any;
    toDate: Date = new Date();
    filterForm: FormGroup;
    public sort: SortDescriptor[] = [{
        field: 'questionName',
        dir: 'asc'
    }];
    submittedAudits: any;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>,
        private toastr: ToastrService, private auditService: AuditService, private hRManagementService:HRManagementService, public dialog: MatDialog, private softLabelsPipe: SoftLabelPipe) { super(); 
            this.initializeFilterForm();
            this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

    ngOnInit() {
        super.ngOnInit();
        //this.initializeFilterForm();
        // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
        this.getBranches();
        this.loadAuditList();
        //this.oneMonthBack();
        //this.getNonComplainceAudits();
    }



    getBranches() {
        this.isAnyOperationIsInprogress = true;
        let branchModel = new HrBranchModel();
        this.hRManagementService.getBranches(branchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branchList = response.data;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getNonComplainceAudits() {
        this.isAnyOperationIsInprogress = true;
        let auditInputModel = new AuditComplainceInputModel();
        auditInputModel.dateFrom = this.fromDate;
        auditInputModel.dateTo = this.toDate;
        auditInputModel.branchId = this.filterForm.get('branchId').value;
        auditInputModel.auditId = this.filterForm.get('auditId').value;
        auditInputModel.projectId = this.dashboardFilters.projectId;       
        if(auditInputModel.auditId == null || auditInputModel.auditId == '') {
            auditInputModel.auditId = this.dashboardFilters.auditId;
        }
        this.auditService.getNonComplainceAudits(auditInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.submittedAudits = this.sortData(response.data);
                this.auditsList = {
                    data: this.submittedAudits,
                    total: response.data.length > 0 ? response.data.length : 0,
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    // dataStateChange(state: DataStateChangeEvent): void {
    //     this.state = state;
    //     if (this.state.sort[0]) {
    //         this.sortBy = this.state.sort[0].field;
    //         this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    //         // this.dataSorting();
    //     } else {
    //         this.getNonComplainceAudits();
    //     }
    // }

    public pageChange(event: PageChangeEvent): void {
        this.state = event;
        this.auditsList = {
            data: this.submittedAudits.slice(this.state.skip, this.state.skip + this.state.take),
            total: this.submittedAudits ? this.submittedAudits.length : 0
        };
    }

    selectedRow(e) {
        const data = e.dataItem;
        let dialogId = "audit-comp";
        const dialogRef = this.dialog.open(this.DrillDownDialog, {
            width: "45%",
            height: "60%",
            hasBackdrop: true,
            panelClass: 'company-registration-container',
            direction: "ltr",
            id: dialogId,
            data: { data, formPhysicalId: dialogId, dialogId: dialogId, },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(() => {

        });
    }

    // getBranchList() {
    //     const branchSearchResult = new Branch();
    //     branchSearchResult.isArchived = false;
    //     this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    //     this.branchList$ = this.store.pipe(select(assetModuleReducer.getBranchAll));
    // }

    loadAuditList() {
        let auditModel = new AuditCompliance();
        auditModel.isArchived = false;
        auditModel.projectId = this.dashboardFilters.projectId;
        auditModel.auditId = this.dashboardFilters.auditId;
        auditModel.isForFilter = true;
        this.store.dispatch(new LoadCopyAuditListTriggered(auditModel));
        this.auditList$ = this.store.pipe(select(auditModuleReducer.getAuditCopyList),
            tap(result => {
                if (result && result.length > 0) {
                    let auditsList = result;
                }
            }));
    }

    oneMonthBack() {
        const day = this.fromDate.getDate();
        const month = 0 + (this.fromDate.getMonth() - 0);
        const year = this.fromDate.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minToDate = this.fromDate;
        this.getNonComplainceAudits();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.maxfromDate = this.toDate;
        this.getNonComplainceAudits();
    }

    initializeFilterForm() {
        this.filterForm = new FormGroup({
            branchId: new FormControl(null, Validators.compose([])),
            auditId: new FormControl(null, Validators.compose([])),
            fromDate: new FormControl(null, Validators.compose([])),
            toDate: new FormControl(null, Validators.compose([])),
        })
    }

    sortData(data) {
        var auditDetails = [];
        data.forEach(element => {
            let auditData = new AuditDetailsModel();
            let details = element[0];
            auditData.nonComplaintAudits = element.length;
            auditData.branchName = details.branchName;
            auditData.branchId = details.branchId;
            auditData.questionName = details.questionName;
            auditData.auditName = details.auditName;
            auditData.auditDetails = element;
            let allQuestionsCount = element.length;
            let nonComplaintAudits = 0;
            let complaintAudits = 0;
            element.forEach(question => {
                if (question.questionOptionResult) {
                    complaintAudits = complaintAudits + 1;
                } else {
                    nonComplaintAudits = nonComplaintAudits + 1;
                }
            });
            auditData.complaincePercentage = Math.round((complaintAudits / allQuestionsCount) * 100);
            auditData.nonCompalincePercentage = Math.round((nonComplaintAudits / allQuestionsCount) * 100);
            auditDetails.push(auditData);
        });
        return auditDetails;
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.auditsList = {
            data: orderBy(this.auditsList.data, this.sort),
            total: this.submittedAudits ? this.submittedAudits.length : 0
        };
    }
}
