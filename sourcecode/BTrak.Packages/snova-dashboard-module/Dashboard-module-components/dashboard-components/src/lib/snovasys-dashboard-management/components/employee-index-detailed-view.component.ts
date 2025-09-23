import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import '../../globaldependencies/helpers/fontawesome-icons';
import { State as KendoState } from '@progress/kendo-data-query';
import { Router } from "@angular/router";
import { ProductivityDashboardModel } from "../models/productivityDashboardModel";
import { ToastrService } from "ngx-toastr";
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";


@Component({
    selector: "app-dashboard-component-employeeIndexDetailedView",
    templateUrl: `employee-index-detailed-view.component.html`
})

export class EmployeeIndexDetailedViewComponent {
    @Output() closePopUp = new EventEmitter<any>();
    @Output() visibilityChange = new EventEmitter<any>();
    @Output() dataStateChanged = new EventEmitter<any>();
    @Output() excelDrillDown = new EventEmitter<any>();
    @Output() excelDownload = new EventEmitter<any>();
    @ViewChild("drillDownUserStoryPopupComponent", { static: true }) drillDownUserStoryPopupComponent: TemplateRef<any>;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let indexData = data[0];
            this.state = {
                skip: 0,
                take: 20,
            };
            this.currentDialogId = data[0].dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.employeeIndex = indexData.employeeIndex;
            this.columns = indexData.columns;
            this.type = indexData.type;
            this.selectedDate = indexData.selectedDate;
        }
    }

    @Input("employeeIndex")
    set _employeeIndex(data: any) {
        this.employeeIndex = data;
    }
    
    
    @Input("excelDrillDownLoading")
    set _excelDrillDownLoading(data: any) {
        this.excelDrillDownLoading = data;
    }

    @Input("anyOperationInProgress")
    set _anyOperationInProgress(data: any) {
        this.anyOperationInProgress = data;
    }

    @Input("excelLoading")
    set _excelLoading(data: any) {
        this.excelLoading = data;
    }

    currentDialog: any;
    currentDialogId: any;
    employeeIndex: any;

    columns = [];

    state: KendoState = {
        skip: 0,
        take: 20,
    };

    isDailogOpened: boolean = false;
    selectedDate: any;
    projectId: string;
    type: string;
    validationMessage: string;
    anyOperationInProgress: boolean = false;
    excelDrillDownLoading: boolean = false;
    excelLoading: boolean = false;

    constructor(public dialog: MatDialog, private router: Router, private toaster: ToastrService,
        private cdRef: ChangeDetectorRef, private productivityService: ProductivityDashboardService,) { }

    ngAfterViewInit() {
        (document.querySelector('.mat-dialog-padding') as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    onClose() {
        this.currentDialog.close();
    }

    checkVisibility(fieldName) {
        let index = this.columns.findIndex(x => x.field == fieldName);
        if (index != -1) {
            return this.columns[index].hidden;
        }
        else {
            return false;
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.dataStateChanged.emit(state);
    }

    goToProfile(userId) {
        this.router.navigateByUrl("dashboard/profile/" + userId);
        this.closePopUp.emit(true);
    }

    onVisibilityChange(event) {
        this.visibilityChange.emit(event);
    }

    openUserStoriesDailog(row, indexType) {
        let dialogId = "app-profile-component-drilldownuserstoryPopup";
        if (this.isDailogOpened)
            return;
        const productivityDashboard = new ProductivityDashboardModel();
        productivityDashboard.type = this.type;
        productivityDashboard.selectedDate = this.selectedDate;
        productivityDashboard.indexType = indexType;

        productivityDashboard.ownerUserId = row.userId;
        productivityDashboard.projectId = this.projectId ? this.projectId : null;
        this.productivityService.getProductivityIndexUserStoriesForDevelopers(productivityDashboard).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                let data = responseData.data;
                let dialog = this.dialog;
                let isGrpIndex = indexType == 'GrpIndex';
                if (!this.isDailogOpened) {
                    const dialogRef = dialog.open(this.drillDownUserStoryPopupComponent, {
                        width: "90%",
                        direction: 'ltr',
                        data: { data: data, isGrpIndex: isGrpIndex, formPhysicalId: dialogId, isFromEmployeeIndex: true },
                        disableClose: true,
                        id: dialogId
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                        // if (result.success) {

                        // }
                        this.isDailogOpened = false;
                    });
                    this.isDailogOpened = true;
                }
            }
            this.anyOperationInProgress = false;
            this.cdRef.detectChanges();
        });
    }

    closeCurrentDialog() {
        this.closePopUp.emit(true);
    }

    exportDrillDownExcel() {
        this.excelDrillDown.emit(true);
    }

    exportToExcel(){
        this.excelDownload.emit(true);
    }
}