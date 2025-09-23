import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { Guid } from "guid-typescript";
import { BudgetModel, SampleBudgetModel } from "../../../models/budget-model";
import * as _ from 'underscore';
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatMenuTrigger } from "@angular/material/menu";
import { LivesManagementService } from "../../../services/lives-management.service";
import { ProgramModel } from "../../../models/programs-model";
import { BudgetAndInvestmentsInputModel } from "../../../models/budegt-investment.model";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-budget-table-view',
    templateUrl: './budget-table-view.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class BugetTableViewComponent implements OnInit {
    @Input("selectedTab")
    set _selectedTab(data: string) {
        this.selectedTab = data;
        this.submittedResult = null;
        this.budgetList = [];
        this.temp = [];
        this.getBudgetList();

    }
    @ViewChildren("archiveBudgetPopup") archiveBudgetPopUps;
    @ViewChild("menuTrigger") trigger: MatMenuTrigger;
    @ViewChild("AddBudgetDialogComponent") budgetDetailDialog: TemplateRef<any>;
    budgetListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    temp: BudgetModel[] = [];
    budgetList: BudgetModel[] = [];
    selectedTab: string;
    submittedResult: any;
    budgetId: any;
    isFilterVisible: boolean = false;
    isArchived: boolean;
    selectedItem: any;
    programId: any;
    isArchiveInprogress: boolean;
    isAnyOperationInprogress: boolean;
    isClientOperationInprogress: boolean;
    programDetails: any;
    clientsList: any = [];
    showFilter: any;
    constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef, private toastr: ToastrService, private route: ActivatedRoute
        , private livesService: LivesManagementService) {
        this.route.params.subscribe((routeParams => {
            if (routeParams.id) {
              this.programId = routeParams.id;
              this.getPrograms();
            }
          }))
    }

    ngOnInit() {
        this.getClients();
    }

    getBudgetList() {
        this.isAnyOperationInprogress = true;
        var program = new ProgramModel();
        program.programId = this.programId;
        program.isArchived = this.isArchived;
        this.livesService.getBudgetAndInvestments(program).subscribe((respone: any) => {
            if(respone.success) {
                this.temp = respone.data;
                this.budgetList = respone.data;
                this.budgetListData = {
                    data: this.budgetList,
                    total: this.budgetList.length > 0 ? this.budgetList.length : 0,
                };
            } else {
                this.temp = [];
                this.budgetList = [];
                this.budgetListData = {
                    data: this.budgetList,
                    total: this.budgetList.length > 0 ? this.budgetList.length : 0,
                };
                if(respone.apiResponseMessages.length > 0){
                    this.toastr.error(respone.apiResponseMessages[0].message);
                }
            }
            this.isAnyOperationInprogress = false;
        });
    }

    filterClick() {
        this.isFilterVisible = !this.isFilterVisible;
    }

    archive() {
        this.isArchived = !this.isArchived;
        this.getBudgetList();
    }

    selectedRow(event) {

    }

    dataStateChange(event) {

    }

    openBudgetDialog() {
        let dialogId = "app-dialog-budget";
        const dialogRef = this.dialog.open(this.budgetDetailDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                programId: this.programId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getBudgetList();
                // this.toastr.success("", "Budget detail added");
            } else if (result.formData) {
                // this.submittedResult = result;
                this.getBudgetList();
                this.toastr.success("", "Budget detail added");
            }
            this.submittedResult = null;
        });
    }

    editBudgetPoup() {
        this.budgetId = this.selectedItem.dataSetId;
        let dialogId = "app-dialog-budget";
        const dialogRef = this.dialog.open(this.budgetDetailDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                formData: this.selectedItem.formData,
                budgetId: this.selectedItem.dataSetId,
                programId: this.programId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getBudgetList();
                // this.toastr.success("", "Budget detail updated");
            } 
            this.submittedResult = null;
        });
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
        this.isArchiveInprogress = true;
        var budgetAndInvestmentsInput = new BudgetAndInvestmentsInputModel();
        budgetAndInvestmentsInput.formData = this.selectedItem.formData;
        budgetAndInvestmentsInput.dataSourceId = this.selectedItem.dataSourceId;
        budgetAndInvestmentsInput.dataSetId = this.selectedItem.dataSetId;
        budgetAndInvestmentsInput.programId = this.programId;
        budgetAndInvestmentsInput.template = "BudgetAndInvestments";
        budgetAndInvestmentsInput.isArchived = !this.isArchived ? true : false;
        this.livesService.upsertBudgetAndInvestments(budgetAndInvestmentsInput).subscribe((respone: any) => {
            this.isArchiveInprogress = false;
            if(respone.success) {
                if(!this.isArchived) {
                    this.toastr.success("", "Budget detail archived");
                } else {
                    this.toastr.success("", "Budget detail unarchived");
                }
                this.cancelPopUp();
                this.getBudgetList();
            } else {
                if(respone.apiResponseMessages.length > 0){
                    this.toastr.error(respone.apiResponseMessages[0].message);
                }
            }
        });
    }

    getPrograms() {
        var programModel = new ProgramModel();
        programModel.dataSetId = this.programId;
        this.livesService.getPrograms(programModel).subscribe((response: any) => {
          if(response.success) {
            this.programDetails = response.data[0];
          } else {
            
          }
        });
    }

    getClients() {
        this.isClientOperationInprogress = true;
        this.livesService.getLivesClientList().subscribe((response: any) => {
            this.isClientOperationInprogress = false;
            if(response.success) {
                this.clientsList = response.data;
            } else {
                this.clientsList = [];
            }
        })
    }

    bindStakeHolderName(id) {
        if(this.clientsList.length > 0) {
            var client = this.clientsList.filter(x => x.clientId.toLowerCase() == id.toLowerCase());
            if(client.length > 0) {
                return client[0].fullName;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
}