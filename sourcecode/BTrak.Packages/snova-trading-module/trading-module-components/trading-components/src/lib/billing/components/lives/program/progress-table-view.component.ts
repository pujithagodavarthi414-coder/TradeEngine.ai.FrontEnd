import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { Guid } from "guid-typescript";
import { ProgressModel, SampleProgressModel } from "../../../models/progress-model";
import * as _ from "underscore";
import { MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
@Component({
    selector: 'app-progress-table-view',
    templateUrl: './progress-table-view.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class ProgressTableViewComponent implements OnInit {
    @ViewChildren("archiveBudgetPopup") archiveBudgetPopUps;
    @ViewChild("menuTrigger") trigger: MatMenuTrigger;
    @ViewChild("AddProgressDialogComponent") progressDetailDialog: TemplateRef<any>;
    @ViewChild("fileInput") fileInput: ElementRef;
    @Input("selectedTab")
    set _selectedTab(data: string) {
        this.selectedTab = data;
        this.submittedResult = null;
        this.progressList = [];
        this.temp = [];
        this.getProgressList();

    }

    progressListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    temp: ProgressModel[] = [];
    progressList: ProgressModel[] = [];
    selectedTab: string;
    submittedResult: any;
    progressId: any;
    isFilterVisible: boolean = true;
    isArchived: boolean;
    kpiName: string;
    selectedItem: any;
    constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
    }

    ngOnInit() {

    }

    getProgressList() {
        this.temp = SampleProgressModel;
        if (this.submittedResult) {
            var model = new ProgressModel();
            model.programId = Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68');
            model.programName = 'SMILE PROGRAM';
            model.progressId = Guid.create();
            model.phase = 'Phase 1';
            model.kpi = this.kpiName;
            model.dateFrom = this.submittedResult.formData.from;
            model.dateTo = this.submittedResult.formData.to;
            model.sHFCount = this.submittedResult.formData.numberOfIndependentShFsCertified;
            model.formData = this.submittedResult.formData;
            model.order = this.progressList.length > 0 ? this.progressList.length + 1 : 1;
            model.isArchived = false;
            this.progressList.push(model);
            SampleProgressModel.push(model);
        }
        else {
            let progressListData = SampleProgressModel;
            if (!this.isArchived) {
                progressListData = progressListData.filter(function (data) {
                    return data.isArchived == false
                })
                this.progressList = progressListData;
                this.temp = progressListData;

            } else {
                progressListData = progressListData.filter(function (data) {
                    return data.isArchived == true
                })
                this.progressList = progressListData;
                this.temp = progressListData;
            }
        }
        this.progressList = _.uniq(this.progressList);
        let progressList = this.progressList;
        progressList = progressList.sort((asc, desc) => {
            return desc.order - asc.order
        })
        this.progressList = progressList;
        this.progressListData = {
            data: this.progressList,
            total: this.progressList.length > 0 ? this.progressList.length : 0,
        }
    }

    filterClick() {
        this.isFilterVisible = !this.isFilterVisible;
    }

    archive() {
        this.isArchived = !this.isArchived;
        this.getProgressList();
    }

    selectedRow(event) {

    }

    dataStateChange(event) {

    }

    openProgressDialog() {
        this.progressId = Guid.create();
        let dialogId = "app-kpi-dialog";
        const dialogRef = this.dialog.open(this.progressDetailDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                progressId: this.progressId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {

            } else if (result.formData) {
                this.submittedResult = result;
                this.kpiName = result.kpiName;
                this.getProgressList();
                this.toastr.success("", 'Progress added');
            }
            this.submittedResult = null;
        });
    }

    uploadEventHandler(file, event) {

    }

    openOptionsMenu(dataItem) {
        this.selectedItem = dataItem;
    }

    closePopup() {
        this.trigger.closeMenu();
    }

    archivePopUpOpen(popup) {
        popup.openPopover();
    }

    cancelPopUp() {
        this.archiveBudgetPopUps.forEach((p) => p.closePopover());
    }

    deleteBudget() {
        let progressList = this.progressList
        let updatedNewValidations = [];
        let id = this.selectedItem.progressId.value
        let filteredList = _.filter(progressList, function (item) {
            return item.progressId.value == id;
        })
        let index = this.progressList.indexOf(filteredList[0]);
        if (index > -1) {
            filteredList[0].isArchived = this.isArchived ? false : true;
            this.progressList[index] = filteredList[0];
            this.cancelPopUp();
            let index1 = SampleProgressModel.indexOf(filteredList[0]);
            if (index1 > -1) {
                SampleProgressModel[index1] = filteredList[0];
            }
            this.getProgressList();
        }
    }

    editProgressPoup() {
        this.progressId = this.selectedItem.progressId;
        let dialogId = "app-kpi-dialog";
        const dialogRef = this.dialog.open(this.progressDetailDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                progressId: this.progressId,
                formData: this.selectedItem.formData,
                kpi: this.selectedItem.kpi
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {

            } else if (result.formData) {
                let id = this.progressId.value
                let progressList = this.progressList;
                let filteredList = _.filter(progressList, function (item) {
                    return item.progressId.value == id;
                })
                if (filteredList.length > 0) {
                    let index = this.progressList.indexOf(filteredList[0]);
                    if (index > -1) {
                        filteredList[0].formData = result.formData;
                        filteredList[0].dateFrom = result.formData.from;
                        filteredList[0].dateTo = result.formData.to;
                        filteredList[0].sHFCount = result.formData.numberOfIndependentShFsCertified;
                        this.progressList[index] = filteredList[0];
                        let index1 = SampleProgressModel.indexOf(filteredList[0]);
                        if (index1 > -1) {
                            SampleProgressModel[index1] = filteredList[0];
                        }
                        this.cdRef.detectChanges();
                        this.toastr.success("", "Progress updated");
                    }
                }
            }
        });
    }
}