import { I } from "@angular/cdk/keycodes";
import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor, State } from "@progress/kendo-data-query";
import { Guid } from "guid-typescript";
import { KPIModel } from "../../../models/kpi-model";
import { SampleKPIModel } from "../../../models/sample-kpi-model";
import * as _ from "underscore";
import { FormComponents } from "../../../models/form-model";
import { MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
import { LivesManagementService } from "../../../services/lives-management.service";
@Component({
    selector: 'app-kpi-view',
    templateUrl: './kpi-table.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class KpiTableViewComponent implements OnInit {
    @Input("selectedTab")
    set _selectedTab(data: string) {
        this.selectedTab = data;

    }
    @Input("programId")
    set _programId(data: string) {
        this.programId = data;
        this.getKPIData();
    }
    @ViewChildren("archiveBudgetPopup") archiveBudgetPopUps;
    @ViewChild("menuTrigger") trigger: MatMenuTrigger;
    @ViewChild("AddKpiDialogComponent") kpiConfigDialog: TemplateRef<any>;
    showFilter: any;
    kpiListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    temp: KPIModel[] = [];
    kpiList: KPIModel[] = [];
    isLoadingInProgress: boolean;
    selectedItem: any;
    formName: string;
    isArchived: boolean;
    programId: string;
    isFilterVisible: boolean = false;
    submittedResult: any
    kpiId: any;
    dataSetId: any;
    formData: any;
    isArchiveLoading: boolean;
    selectedTab: string;
    isButtonDisabled: boolean;
    isEdit: boolean;
    constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef, private toastr: ToastrService, private liveService: LivesManagementService) {
        this.formData = null;
        this.dataSetId = null;
    }

    ngOnInit() {

    }

    clearDialogData() {
        this.formData = null;
        let newKpiId = Guid.create().toString();
        this.dataSetId = newKpiId;
        this.formName = null;
        this.isEdit = null;
    }

    getKPIData() {
        var searchModel: any = {};
        searchModel.programId = this.programId;
        searchModel.isArchived = this.isArchived;
        this.isLoadingInProgress = true;
        this.liveService.getESGIndicators(searchModel).subscribe((response: any) => {
            this.isLoadingInProgress = false;
            if (response.success) {
                this.kpiList = response.data;
                this.kpiListData = {
                    data: this.kpiList,
                    total: this.kpiList.length > 0 ? this.kpiList.length : 0,
                }
            }
            if (this.kpiList && this.kpiList.length == 1) {
                this.isButtonDisabled = true;
            }
            else {
                this.isButtonDisabled = false;
            }
        })
    }

    filterClick() {
        this.isFilterVisible = !this.isFilterVisible;
    }

    archive() {
        this.isArchived = !this.isArchived;
        this.getKPIData();
    }

    selectedRow(event) {

    }

    dataStateChange(state) {
        this.state = state;
        let kpiList = this.kpiList;
        if (this.state.sort) {
            kpiList = orderBy(this.kpiList, this.state.sort);
        }
        this.kpiListData = {
            data: kpiList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.kpiList.length
        }
    }

    getBindingData(data) {
        if (data) {
            data = data.replace(",", "<br/>")
            return data;
        } else {
            return '';
        }
    }

    openkpiDialog() {
        let dialogId = "app-kpi-dialog";
        const dialogRef = this.dialog.open(this.kpiConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                formComponents: FormComponents,
                programId: this.programId,
                dataSetId: this.dataSetId,
                formData: this.formData,
                formName: this.formName,
                isEdit: this.isEdit

            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.formData = null;
                this.getKPIData();
            }
        });
    }

    openEditInvoicePoup() {
        this.dataSetId = this.selectedItem.id;
        this.formData = this.selectedItem.formData;
        this.formName = this.selectedItem.formName;
        this.isEdit = true;
        this.openkpiDialog();
    }


    openOptionsMenu(dataItem) {
        this.selectedItem = dataItem;
    }

    closePopup() {
        this.trigger.closeMenu();
    }

    cancelPopUp() {
        this.archiveBudgetPopUps.forEach((p) => p.closePopover());
    }

    archivePopUpOpen(popup) {
        popup.openPopover();
    }

    deleteKpi() {
        var archiveModel = this.selectedItem;
        archiveModel.isArchived = this.isArchived ? false : true;
        this.isArchiveLoading = true;
        this.liveService.upsertESGIndicators(archiveModel).subscribe((response: any) => {
            this.isArchiveLoading = false;
            if (response.success) {
                if (!this.isArchived) {
                    this.toastr.success('', 'KPI archived successfully');
                } else {
                    this.toastr.success('', 'KPI unarchived successfully')
                }
                this.cancelPopUp();
                this.getKPIData();
            }
            else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    getKpiNameDataBindingForFields(dataItem) {
        if (dataItem.formData) {
            if (dataItem.formName == 'Form 1') {
                return dataItem.formData.kpi01;
            }
            else if (dataItem.formName == 'Form 2') {
                return dataItem.formData.kpiNumber02;
            } else if (dataItem.formName == 'Form 3') {
                return dataItem.formData.kpiNumber03;
            }
        } else {
            return '';
        }
    }

    getTargetAreaDataBindingForFields(dataItem) {
        if (dataItem.formData) {
            if (dataItem.formName == 'Form 1') {
                return dataItem.formData.targetKpi01;
            }
            else if (dataItem.formName == 'Form 2') {
                return dataItem.formData.targetKpi02;
            } else if (dataItem.formName == 'Form 3') {
                return dataItem.formData.targetForKpi02;
            }
        } else {
            return '';
        }
    }

    getSDGDataBindingForFields(dataItem) {
        if (dataItem.formData) {
            if (dataItem.formName == 'Form 1') {
                if (dataItem.formData.applicableSdGs1) {
                    return dataItem.formData.applicableSdGs1.toString();
                }
                else {
                    return '';
                }
            }
            else if (dataItem.formName == 'Form 2') {
                if (dataItem.formData.applicableSdGsForKpi02) {
                    return dataItem.formData.applicableSdGsForKpi02.toString();
                }
                else {
                    return '';
                }
            } else if (dataItem.formName == 'Form 3') {
                if (dataItem.formData.applicableSdGsForKpi03) {
                    return dataItem.formData.applicableSdGsForKpi03.toString();
                }
                else {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    getESGDataBindingForFields(dataItem) {
        if (dataItem.formData) {
            if (dataItem.formName == 'Form 1') {
                if (dataItem.formData.applicableEsgIndicators) {
                    return dataItem.formData.applicableEsgIndicators.toString();
                }
                else {
                    return '';
                }
            }
            else if (dataItem.formName == 'Form 2') {
                if (dataItem.formData.applicableEsgIndicators1) {
                    return dataItem.formData.applicableEsgIndicators1.toString();
                }
                else {
                    return '';
                }
            } else if (dataItem.formName == 'Form 3') {
                if (dataItem.formData.applicableEsgIndicators2) {
                    return dataItem.formData.applicableEsgIndicators2.toString();
                }
                else {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    getDataBinding(data) {
        if (data && data.length > 0) {
            let taskString;
            data.forEach((taskKPI01) => {
                if (taskKPI01.taskForAchievingTargetKpi01) {
                    if(!taskString) {
                        taskString = taskKPI01.taskForAchievingTargetKpi01;
                    } else {
                        taskString = taskString + '<br/>' + taskKPI01.taskForAchievingTargetKpi01;
                    }
                    
                }
            })
            return taskString;
        }
    }

    getDataBindingForKPI02(data) {
        if (data && data.length > 0) {
            let taskString;
            data.forEach((taskKPI01) => {
                if (taskKPI01.taskForAchievingTargetKpi02) {
                    if(!taskString) {
                        taskString = taskKPI01.taskForAchievingTargetKpi02;
                    } else {
                        taskString = taskString + '<br/>' + taskKPI01.taskForAchievingTargetKpi02;
                    }
                    
                }
            })
            return taskString;
        }
    }

    getDataBindingForKPI03(data) {
        if (data && data.length > 0) {
            let taskString;
            data.forEach((taskKPI01) => {
                if (taskKPI01.taskForAchievingKpi03) {
                    if(!taskString) {
                        taskString = taskKPI01.taskForAchievingKpi03;
                    } else {
                        taskString = taskString + '<br/>' + taskKPI01.taskForAchievingKpi03;
                    }
                    
                }
            })
            return taskString;
        }
    }
}