import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { State } from '@progress/kendo-data-query';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ProjectGoalsService } from "../../services/goals.service";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: 'workItem-uploadPopup',
    templateUrl: './work-item-uploadPopup.template.html',
})

export class WorkItemUploadPopupComponent implements OnInit {

    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    workItemListDataDetails: any = [];
    workItemList: any = [];
    isUploading : boolean = false;
    isBugFilters: boolean;
    isFromSprint : boolean =false;
    public pageSize = 10;
    public skip = 0;
    public gridView: GridDataResult;
    state: State = {
        skip: 0,
        take: 99999999,
    };

    constructor(private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) private data: any
        , private toastr: ToastrService
        , public dialogRef: MatDialogRef<WorkItemUploadPopupComponent>
        , private ProjectGoalsService: ProjectGoalsService
        
    ) {
        this.workItemListDataDetails = data.uploadedData;
        this.isBugFilters = data.isBugFilters;
        this.isFromSprint = data != null && data != undefined ? data.isFromSprint : false;
        this.workItemList = this.workItemListDataDetails.filter(item => item.isWorkitemValid);
        this.loadItems();

        setTimeout(function(){ 

            $("#style-1" + ' .k-grid-content').addClass('widget-scroll');
            $("#style-1" + ' .k-grid-content').height(350);

          }, 100);
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    closeDialog() {
        this.dialogRef.close({ success: null });
    }

    UploadWorkItemList() {
        if(this.isUploading){
            return
        }
        else
            this.isUploading = true;
        this.workItemList = this.workItemListDataDetails.filter(item => item.isWorkitemValid);

        this.ProjectGoalsService.workItemUpload(this.workItemList).subscribe((response: any) => {
            this.isUploading = false;
            this.closeDialog();
            if (response.data) {
                this.toastr.info("Uploaded data will be inserted in background.", "Please refresh the page after some time.");
            }
        },
            function (error) {
                this.toastr.error("Upload failed.", "Check your data format.");
                this.isUploading = false;
                this.closeDialog();
            });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
    pageChange(event: PageChangeEvent): void {

        this.skip = event.skip;
        this.loadItems();
    }
    
    private loadItems(): void {
        this.gridView = {
            data: this.workItemListDataDetails.slice(this.skip, this.skip + this.pageSize),
            total: this.workItemListDataDetails.length
        };
    }
}