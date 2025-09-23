import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { AuditService } from "../services/audits.service";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent, PageChangeEvent } from "@progress/kendo-angular-grid";
import { AuditDetailsModel, AuditComplainceInputModel } from "../models/audit-details.model";
import { NonComplaintAuditPreviewComponent } from "./non-complaint-audit-details-preview.component";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: 'app-fm-component-audit-non-complaince',
    templateUrl: `audit-non-complaince-app.component.html`
})

export class AuditNonComplainceComponent extends CustomAppBaseComponent implements OnInit {
    state: State = {
        skip: 0,
        take: 10,
    };
    submittedAudits: any;
    @ViewChild('DrillDownDialog') DrillDownDialog: TemplateRef<any>;
    isAnyOperationIsInprogress: boolean = false;
    auditsList: any;
    sortDirection: boolean;
    fromDate: Date = new Date();
    toDate: Date = new Date();
    sortBy: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    public sort: SortDescriptor[] = [{
        field: 'questionName',
        dir: 'asc'
      }];
      softLabels: SoftLabelConfigurationModel[];
    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>,
        private toastr: ToastrService, private auditService: AuditService, public dialog: MatDialog, private softLabelsPipe: SoftLabelPipe) { super(); 
            this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

    ngOnInit() {
        super.ngOnInit();
        // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
        this.oneMonthBack();
        this.getNonComplainceAudits();
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

    getNonComplainceAudits() {
        this.isAnyOperationIsInprogress = true;
        let auditInputModel = new AuditComplainceInputModel();
        auditInputModel.dateFrom = this.fromDate;
        auditInputModel.dateTo = this.toDate;
        this.auditService.getNonComplainceAudits(auditInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.submittedAudits = this.sortData(response.data);
                this.auditsList = {
                    data: this.submittedAudits,
                    total: this.submittedAudits.length > 0 ? this.submittedAudits.length : 0,
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
    //     }
    //     this.getNonComplainceAudits();
    // }

    selectedRow(e) {
        const data = e.dataItem;
        let dialogId = "audit-non-comp";
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

    sortData(data) {
        var auditDetails = [];
        data.forEach(element => {
            let auditData = new AuditDetailsModel();
            let details = element[0];
            auditData.branchName = details.branchName;
            auditData.branchId = details.branchId;
            auditData.questionName = details.questionName;
            auditData.auditName = details.auditName;
            auditData.auditDetails = element;
            let nonComplaintAudits = 0;
            let complaintAudits = 0;
            element.forEach(question => {
                if (question.questionOptionResult) {
                    complaintAudits = complaintAudits + 1;
                } else {
                    nonComplaintAudits = nonComplaintAudits + 1;
                }
            });
            auditData.complaincePercentage = complaintAudits;
            auditData.nonComplaintAudits = nonComplaintAudits;
            if (nonComplaintAudits > 0 )
                auditDetails.push(auditData);
        });
        return auditDetails;
    }

    public pageChange(event: PageChangeEvent): void {
        this.state = event;
        this.auditsList = {
            data: this.submittedAudits.slice(this.state.skip, this.state.skip + this.state.take),
            total: this.submittedAudits ? this.submittedAudits.length : 0
        };
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.auditsList = {
            data: orderBy(this.auditsList.data, this.sort),
            total: this.submittedAudits ? this.submittedAudits.length : 0
        };
    }
}
