import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { Guid } from "guid-typescript";
import { ProgressModel, SampleProgressModel } from "../../../models/progress-model";
import * as _ from "underscore";
import { MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
import { ProgramModel } from "../../../models/programs-model";
import { LivesManagementService } from "../../../services/lives-management.service";
@Component({
    selector: 'app-summary-table-view',
    templateUrl: './summary-table-view.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class SummaryTableViewComponent implements OnInit {
    @ViewChildren("archiveBudgetPopup") archiveBudgetPopUps;
    @ViewChild("menuTrigger") trigger: MatMenuTrigger;
    @ViewChild("AddProgressDialogComponent") progressDetailDialog: TemplateRef<any>;
    @ViewChild("fileInput") fileInput: ElementRef;

    programListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    anyOperationInProgress: boolean;
    temp: ProgramModel[] = [];
    programsList: ProgramModel[] = [];
    selectedTab: string;
    submittedResult: any;
    progressId: any;
    isFilterVisible: boolean = true;
    isArchived: boolean;
    kpiName: string;
    selectedItem: any;
    constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef, private toastr: ToastrService, private livesService: LivesManagementService) {
        this.submittedResult = null;
        this.programsList = [];
        this.temp = [];
        this.getProgramsList();
    }

    ngOnInit() {

    }

    getProgramsList() {
        this.anyOperationInProgress = true;
        let programModel = new ProgramModel();
        programModel.template = 'Programs';
        programModel.isArchived = this.isArchived;
        this.livesService.getPrograms(programModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data) {
                        this.programsList = responseData.data;
                        this.programListData = {
                            data: responseData.data,
                            total: responseData.data?.length > 0 ? responseData.data?.length : 0,
                        }
                        this.programsList.forEach(element => {
                            element.programData = JSON.parse(element.formData);
                        });
                    }
                    this.anyOperationInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.anyOperationInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    filterClick() {
        this.isFilterVisible = !this.isFilterVisible;
    }

    archive() {
        this.isArchived = !this.isArchived;
        this.getProgramsList();
    }

    dataStateChange(state) {
        this.state = state;
        let programsList = this.programsList;
        if (this.state.sort) {
            programsList = orderBy(this.programsList, this.state.sort);
        }
        this.programListData = {
            data: programsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.programsList.length
        }
    }

}