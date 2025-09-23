import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State,SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { AuditService } from "../services/audits.service";
import { DataStateChangeEvent ,PageChangeEvent } from "@progress/kendo-angular-grid";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { SubmittedAuditPreviewComponent } from "./submitted-audit-details-preview.component";
import { AuditDetailsModel, AuditComplainceInputModel } from "../models/audit-details.model";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: 'app-fm-component-audit-details',
    templateUrl: `audits-details-app.component.html`
})

export class AuditDetailsComponent extends CustomAppBaseComponent implements OnInit {
    state: State = {
        skip: 0,
        take: 10,
    };
    submittedAudits: any;
    @ViewChild('DrillDownDialog') DrillDownDialog: TemplateRef<any>;
    isAnyOperationIsInprogress: boolean = false;
    auditsList: any;
    sortDirection: boolean;
    sortBy: string;
    fromDate: Date = new Date();
    toDate: Date = new Date();
    roleFeaturesIsInProgress$: Observable<boolean>;
    public sort: SortDescriptor[] = [{
        field: 'branchName',
        dir: 'asc'
      }];
      softLabels: SoftLabelConfigurationModel[];
    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>,
        private toastr: ToastrService, private auditService: AuditService, public dialog: MatDialog, ) { super(); 
            this.getSoftLabelConfigurations();
        }
      
        getSoftLabelConfigurations() {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }

    ngOnInit() {
        super.ngOnInit();
        // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
        this.oneMonthBack();
        this.searchSubmittedAudits();
    }

    searchSubmittedAudits() {
        this.isAnyOperationIsInprogress = true;
        let auditInputModel = new AuditComplainceInputModel();
        auditInputModel.dateFrom = this.fromDate;
        auditInputModel.dateTo = this.toDate;
        this.auditService.getSubmittedAudits(auditInputModel).subscribe((response: any) => {
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
    //     }
    //     this.searchSubmittedAudits();
    // }

    selectedRow(e) {
        const data = e.dataItem;
        let dialogId = "submit-preview";
        const dialogRef = this.dialog.open(this.DrillDownDialog, {
            width: "45%",
            height: "60%",
            hasBackdrop: true,
            panelClass: 'company-registration-container',
            direction: "ltr",
            id: dialogId,
            data: { data: data, formPhysicalId: dialogId, dialogId: dialogId, },
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
            auditData.submittedAudits = element.length;
            auditData.branchName = details.branchName;
            auditData.branchId = details.branchId;
            auditData.auditDetails = element;
            auditDetails.push(auditData);
        });
        return auditDetails;
    }

    oneMonthBack() {
        const day = this.fromDate.getDate();
        const month = 0 + (this.fromDate.getMonth() - 0);
        const year = this.fromDate.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        console.log(this.fromDate);
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
        this.searchSubmittedAudits();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.searchSubmittedAudits();
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
