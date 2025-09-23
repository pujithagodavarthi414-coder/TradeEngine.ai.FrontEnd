import { ChangeDetectorRef, Component, Inject, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { State, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import { ProjectService } from '../services/projects.service';
import { ProjectSearchCriteriaInputModel } from '../models/ProjectSearchCriteriaInputModel';
import { ProjectSearchResult } from '../models/ProjectSearchResult';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'app-testrail-page-qaproductivitypopup',
    templateUrl: 'qaproductivitypopup.page.template.html',
})

export class QaProductivityPopUp extends CustomAppBaseComponent implements OnInit {
    @Output() closeParentDialog = new EventEmitter<boolean>();

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.userStoryData = this.matData != null && this.matData != undefined ? this.matData.resData : [];
            this.userStoryData = orderBy(this.userStoryData, this.sortBy)
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.loadItems();
        }
    }

    userStoryData: any = [];
    public gridView: GridDataResult;
    public pageSize = 10;
    validationMessage: string;
    public skip = 0;
    private data: any = [];
    accessTestRepo: Boolean = false;
    accessViewProject: Boolean = false;
    state: State = {
        skip: 0,
        take: 99999999,
    };
    projectSearchResults$: Observable<ProjectSearchResult[]>;
    projectSearchResults: any;
    softLabels: SoftLabelConfigurationModel[];
    public sortBy: SortDescriptor[] = [{
        field: 'projectName',
        dir: 'asc'
    }];
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(@Inject(MAT_DIALOG_DATA) private dataResult: any, public dialogRef: MatDialogRef<QaProductivityPopUp>, private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router, private store: Store<State>, private projectService: ProjectService,) {

        super();
        // this.userStoryData = dataResult != null && dataResult != undefined ? dataResult.resData : [];
        // this.userStoryData = orderBy(this.userStoryData, this.sortBy)
        this.getAllProjects();
    }

    ngOnInit(): void {

        super.ngOnInit();
        this.getSoftLabels();

        // this.canAccess_feature_ViewTestrepoReports$.subscribe((x) => {
        //     this.accessTestRepo = x;
        // });

        // this.canAccess_feature_ViewProjects$.subscribe((y) => {
        //     this.accessViewProject = y;
        // })

        // const projectSearchResult = new ProjectSearchCriteriaInputModel();
        // projectSearchResult.isArchived = false;
        // this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));

        // this.projectSearchResults$ = this.store.pipe(
        //     select(projectModuleReducer.getProjectsAll)
        // );

        // this.projectSearchResults$.subscribe((result) => {
        //     this.projectSearchResults = result;
        // });
    }

    getAllProjects() {
        const projectSearchResult = new ProjectSearchCriteriaInputModel();
        projectSearchResult.isArchived = false;
        // this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
        this.projectService.searchProjects(projectSearchResult).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data) {
                    this.projectSearchResults = response.data;
                }
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.projectSearchResults = [];
                this.toastr.error(this.validationMessage);
            }
        })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    navigateToTestrail(rowData, navigationType) {

        if (rowData != null && rowData != undefined) {
            
            this.closeParentDialog.emit(true);

            //this.dialogRef.close({ success: null });

            if (this.canAccess_feature_ViewTestrepoReports && this.canAccess_feature_ViewProjects && (this.projectSearchResults.filter(item => item.projectId == rowData.projectId).length > 0)) {

                if (navigationType == 'projectName')
                    this.router.navigate(["projects/projectstatus/" + rowData.projectId + "/active-goals"]);

                else if (navigationType == 'scenario')
                    this.router.navigate(["projects/projectstatus/" + rowData.projectId + "/scenarios"]);

                else if (navigationType == 'testruns')
                    this.router.navigate(["projects/projectstatus/" + rowData.projectId + "/runs"]);

                else if (navigationType == 'versions')
                    this.router.navigate(["projects/projectstatus/" + rowData.projectId + "/versions"]);

                else if (navigationType == 'reports')
                    this.router.navigate(["projects/projectstatus/" + rowData.projectId + "/test-reports"]);

            }

            else
                this.toastr.warning("You don't have permission to access this feature.");
        }
    }

    pageChange(event: PageChangeEvent): void {

        this.skip = event.skip;
        this.loadItems();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sortBy = sort;
        this.pageSize = 10;
        this.skip = 0;
        this.loadItems();
    }

    private loadItems(): void {

        if (this.sortBy != undefined) {
            this.sortBy[0].dir = this.sortBy[0].dir == undefined ? "asc" : this.sortBy[0].dir;
        }
        var orderByData = orderBy(this.userStoryData, this.sortBy);

        var data = orderByData.slice(this.skip, this.skip + this.pageSize);

        this.gridView = {
            data: data,
            total: orderByData.length
        };
    }

    closeDialog() {
        this.currentDialog.close();
        //this.dialogRef.close({ success: null });
    }

}