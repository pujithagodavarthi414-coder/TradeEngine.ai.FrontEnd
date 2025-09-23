import { Component, OnInit, Inject, ChangeDetectorRef, Input } from "@angular/core";
// import { AppBaseComponent } from "app/shared/components/componentbase";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

@Component({
    selector: 'app-fm-component-non-complaint-audit-preview',
    templateUrl: `non-complaint-audit-details-preview.component.html`
})

export class NonComplaintAuditPreviewComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.currentDialogId = data[0].formPhysicalId;
            this.auditDetails = data[0].data;
            this.auditsList = this.auditDetails.auditDetails;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    public pageSize = 10;
    public skip = 0;
    currentDialog: any;
    currentDialogId: any;
    auditDetails: any;
    auditDetailsData: any;
    auditsList: any;
    isAnyOperationIsInprogress: boolean = false;
    state: State = {
        skip: 0,
        take: 10,
    };
    public sort: SortDescriptor[] = [{
        field: 'branchName',
        dir: 'asc'
    }];
    softLabels: SoftLabelConfigurationModel[];
    constructor(public dialogRef: MatDialogRef<NonComplaintAuditPreviewComponent>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.isAnyOperationIsInprogress = true;
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    closeDetailsForm() {
        this.currentDialog.close();
    }

    navigateToConductPage(data) {
        this.currentDialog.close();
        let details = {
            conductId: data.auditConductId,
            isArchived: false
        };
        localStorage.setItem('ConductedAudit', JSON.stringify(details));
        // this.router.navigateByUrl('audits/auditsview/1');
        this.router.navigateByUrl('projects/projectstatus/' + data.projectId + '/conducts');
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.auditDetailsData = {
            data: this.auditsList.slice(this.skip, this.skip + this.pageSize),
            total: this.auditsList ? this.auditsList.length : 0
        };
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.auditDetailsData = {
            data: orderBy(this.auditDetailsData.data, this.sort),
            total: this.auditsList ? this.auditsList.length : 0
        };
    }

    ngOnInit() {
        super.ngOnInit();
        this.auditDetailsData = {
            data: this.auditsList,
            total: this.auditsList.length > 0 ? this.auditsList.length : 0,
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    }
}
