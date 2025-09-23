import { Component, OnInit, Inject, ChangeDetectorRef, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: 'app-fm-component-submitted-audit-preview',
    templateUrl: `submitted-audit-details-preview.component.html`
})

export class SubmittedAuditPreviewComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.currentDialogId = data[0].formPhysicalId;
            this.auditDetails = data[0].data;
            this.auditsList = this.auditDetails.auditDetails;
            this.auditsList.forEach(element => {
                element.status = element.isCompleted ? "submitted" : "Pending";
            });
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    auditDetails: any;
    auditDetailsData: any;
    auditsList: any;
    isAnyOperationIsInprogress: boolean = true;
    state: State = {
        skip: 0,
        take: 10,
    };
    public sort: SortDescriptor[] = [{
        field: 'branchName',
        dir: 'asc'
    }];
    softLabels: SoftLabelConfigurationModel[];
    currentDialog: any;
    currentDialogId: any;

    constructor(public dialogRef: MatDialogRef<SubmittedAuditPreviewComponent>, public dialog: MatDialog,
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
        this.state = event;
        this.auditDetailsData = {
            data: this.auditsList.slice(this.state.skip, this.state.skip + this.state.take),
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
    }
}
