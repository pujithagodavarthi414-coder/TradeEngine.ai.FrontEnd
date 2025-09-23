import { ChangeDetectorRef, Component, Inject, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { State, orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { LoadProjectsTriggered } from "../store/actions/project.actions";
import * as projectModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { ProjectSearchResult } from '../models/project-search-result.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';

@Component({
    selector: 'app-profile-component-drilldownuserstoryPopup',
    templateUrl: 'drilldown-userstoryPopup.template.html',
})

export class DrillDownUserStoryPopupComponent extends CustomAppBaseComponent implements OnInit {

    @Input("excelDrillDownLoading") 
    set _excelDrillDownLoading(excelDrillDownLoading) {
        this.excelDrillDownLoading = excelDrillDownLoading;
    };

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.userStoryData = this.matData != null && this.matData != undefined ? this.matData.data : [];
            this.isGrpIndex = this.matData != null && this.matData != undefined ? this.matData.isGrpIndex : false;
            this.isFromEmployeeIndex = this.matData.isFromEmployeeIndex;
            if (this.isGrpIndex) {
                this.defaultSort();
            }
            this.userStoryData = orderBy(this.userStoryData, this.sortBy)
            this.loadItems(this.userStoryData);
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    @Output() closeParentDialog = new EventEmitter<boolean>();
    @Output() exportExcel = new EventEmitter();

    softLabels: SoftLabelConfigurationModel[];
    userStoryData: any = [];
    isGrpIndex: boolean = false;
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private data: any = [];
    accessViewStores: Boolean = false;
    accessViewProject: Boolean = false;
    accessGoals: Boolean = false;
    state: State = {
        skip: 0,
        take: 99999999,
    };
    sortDirection: boolean;
    projectSearchResults$: Observable<ProjectSearchResult[]>;
    projectSearchResults: any;
    public sortBy: SortDescriptor[] = [{
        field: 'userStoryName',
        dir: 'asc'
    }];
    searchText: string = null;
    searchIsActive: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    excelDrillDownLoading: boolean;
    isFromEmployeeIndex: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) private dataResult: any,
        public dialogRef: MatDialogRef<DrillDownUserStoryPopupComponent>,
        private toastr: ToastrService,
        private router: Router, private store: Store<State>,
        public dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
        super();
        // this.userStoryData = dataResult != null && dataResult != undefined ? dataResult.data : [];
        // this.isGrpIndex = dataResult != null && dataResult != undefined ? dataResult.isGrpIndex : false;
        // if (this.isGrpIndex) {
        //     this.defaultSort();
        // }
        // this.userStoryData = orderBy(this.userStoryData, this.sortBy)
        // this.loadItems(this.userStoryData);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSoftLabels();
        this.accessViewProject = this.canAccess_feature_ViewProjects;
        this.accessGoals = this.canAccess_feature_AllGoals;
        const projectSearchResult = new ProjectSearchCriteriaInputModel();
        projectSearchResult.isArchived = false;
        this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
        this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll)
        );
        this.projectSearchResults$.subscribe((result) => {
            this.projectSearchResults = result;
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    navigateToUserStoriesPage(rowData) {

        if (rowData != null && rowData != undefined && rowData.dataItem != null && rowData.dataItem != undefined) {

            this.currentDialog.close();

            this.closeParentDialog.emit(true);
            //this.dialogRef.close({ success: null });

            if (this.accessViewProject && (this.projectSearchResults.filter(item => item.projectId == rowData.dataItem.projectId).length > 0)) {
                if (rowData.dataItem.sprintId == null)
                    this.router.navigate(["projects/workitem", rowData.dataItem.userStoryId]);
                else
                    this.router.navigate(["projects/sprint-workitem", rowData.dataItem.userStoryId]);
            }
            else
                this.toastr.warning("You don't have permission to access this feature.");
        }
    }

    pageChange(event: PageChangeEvent): void {

        this.skip = event.skip;
        this.loadItems(this.userStoryData);
    }

    private loadItems(userStoryData): void {

        if (this.sortBy != undefined) {
            this.sortBy[0].dir = this.sortBy[0].dir == undefined ? "asc" : this.sortBy[0].dir;
        }
        else
            this.defaultSort();

        var orderByData = orderBy(userStoryData, this.sortBy);

        var data = orderByData.slice(this.skip, this.skip + this.pageSize);

        this.gridView = {
            data: data,
            total: userStoryData.length
        };
    }

    closeDialog() {
        this.currentDialog.close();
        //this.dialogRef.close({ success: null });
    }

    navigateToGoalPage(rowData) {

        if (rowData != null && rowData != undefined && rowData.dataItem != null && rowData.dataItem != undefined) {
            this.currentDialog.close();
            this.dialogRef.close({ success: null });

            if (this.accessGoals && this.accessViewProject && (this.projectSearchResults.filter(item => item.projectId == rowData.dataItem.projectId).length > 0))
                this.router.navigate(["projects/goal", rowData.dataItem.goalId]);
            else
                this.toastr.warning("You don't have permission to access this feature.");
        }
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sortBy = sort;
        this.pageSize = 10;
        this.skip = 0;
        this.loadItems(this.userStoryData);
    }

    private defaultSort() {
        var fieldName = 'userStoryName';
        if (this.isGrpIndex)
            fieldName = "goalName";
        else
            fieldName = "";
        this.sortBy = [{
            field: fieldName,
            dir: 'asc'
        }];
    }

    searchRecords() {
        if (this.searchText) {
            this.searchIsActive = true;
        } else {
            this.searchIsActive = false;
        }
        if (this.searchText && this.searchText.trim().length <= 0) { return; }
        this.searchText = this.searchText.trim().toLowerCase();
        var searchData = [];
        if (!this.isGrpIndex) {
            searchData = this.userStoryData.filter(x => {
                return (
                    ((x.userStoryName != undefined && x.userStoryName != null) ? ((x.userStoryName.toLowerCase()).indexOf(this.searchText) > -1) : false)
                    || ((x.userStoryUniqueName != undefined && x.userStoryUniqueName != null) ? ((x.userStoryUniqueName.toLowerCase()).indexOf(this.searchText) > -1) : false)
                    || ((x.goalName != undefined && x.goalName != null) ? ((x.goalName.toLowerCase()).indexOf(this.searchText) > -1) : false)
                    || ((x.sprintName != undefined && x.sprintName != null) ? ((x.sprintName.toLowerCase()).indexOf(this.searchText) > - 1) : false)
                    || ((x.projectName != undefined && x.projectName != null) ? ((x.projectName.toLowerCase()).indexOf(this.searchText) > -1) : false)
                    || ((x.estimatedTime != undefined && x.estimatedTime != null) ? ((x.estimatedTime.toLowerCase()).indexOf(this.searchText) > -1) : false));
            });
        }
        if (this.isGrpIndex) {
            searchData = this.userStoryData.filter(x => {
                return (
                    ((x.goalName != undefined && x.goalName != null) ? (x.goalName.toLowerCase()).indexOf(this.searchText) > -1 : false)
                    || ((x.goalGrpTotal != undefined && x.goalGrpTotal != null) ? (x.goalGrpTotal.toString().indexOf(this.searchText) > -1) : false));
            });
        }

        this.pageSize = 10;
        this.skip = 0;
        this.loadItems(searchData);
    }
    closeSearch() {
        this.searchText = "";
        this.searchIsActive = false;
        this.loadItems(this.userStoryData);
    }

    exportToExcel() {
        this.exportExcel.emit();
    }
}