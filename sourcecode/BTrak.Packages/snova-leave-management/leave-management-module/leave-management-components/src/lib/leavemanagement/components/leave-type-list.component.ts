import { Component, OnInit, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog,MatDialogConfig } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NewLeaveTypePageComponent } from '../containers/new-leave-type.page';

import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { LeaveFrequencyTypeModel } from "../models/leave-frequency-type-model";
import { State } from "../store/reducers/index";

import { LoadLeaveTypesTriggered, LeaveTypeActionTypes, UpdateLeaveTypeTriggered } from "../store/actions/leave-types.actions";
import * as leaveManagementModuleReducers from "../store/reducers/index";

import { LeaveFrequencyTypeSearchInputModel } from "../models/leave-type-search-model";
import { ofType, Actions } from "@ngrx/effects";
import { LeaveTypeInputModel } from "../models/leave-type-input-model";
import { AppBaseComponent } from "../../globaldependencies/components/componentbase";
import { Page } from "../models/Page";

@Component({
    selector: "app-fm-component-leave-type-list",
    templateUrl: `leave-types-list.component.html`
})

export class LeaveTypesListComponent extends AppBaseComponent implements OnInit {

    @ViewChildren("deleteLeaveLeaveTypePopUp") deleteLeaveLeaveTypePopOver;

    searchText: string;
    leaveTypes: any;
    leaveTypes$: Observable<LeaveFrequencyTypeModel[]>;
    isLeaveTypesLoadingInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress: boolean;
    ngDestroyed$ = new Subject();
    page = new Page();
    sortBy: string;
    sortDirection: boolean;
    dialogValue: string;
    leaveTypeId: string;
    permission: any;
    leaveType: LeaveFrequencyTypeModel;
    validationMessage: string;
    upsertLeaveTypeInProgress$: Observable<boolean>;
    isArchived: boolean = false;

    constructor(private store: Store<State>, public dialog: MatDialog,private routes: Router, private actionUpdates$: Actions) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.LoadLeaveTypesCompleted),
                tap(() => {
                    this.leaveTypes$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesAll));
                    this.leaveTypes$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                    });
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.UpdateLeaveTypeCompleted),
                tap(() => {
                    this.getLeaveTypesList();
                    this.closeDeleteLeaveTypeDialog();
                    this.validationMessage = null;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.UpdateLeaveTypeFailed),
                tap(() => {
                    let validationMessage$ =
                        this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveTypeByIdFailed));
                    validationMessage$.subscribe((result: any) => {
                        console.log(result);
                        this.validationMessage = result[0].message;
                        // this.validationMessage = result.apiResponseMessage[0].message;
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.page.size = 30;
        this.page.pageNumber = 1;
        this.getLeaveTypesList();
    }

    getLeaveTypesList() {
        const leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        leaveTypeSearchModel.pageNumber = this.page.pageNumber;
        leaveTypeSearchModel.pageSize = this.page.size;
        leaveTypeSearchModel.searchText = this.searchText;
        leaveTypeSearchModel.sortBy = this.sortBy;
        leaveTypeSearchModel.sortDirectionAsc = this.sortDirection;
        leaveTypeSearchModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadLeaveTypesTriggered(leaveTypeSearchModel));
        this.isLeaveTypesLoadingInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesLoading));
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getLeaveTypesList();
    }

    deleteLeaveTypePopUpOpen(row, deleteLeaveLeaveTypePopUp) {
        this.leaveType = new LeaveFrequencyTypeModel();
        this.leaveType.leaveTypeId = row.leaveTypeId;
        this.leaveType.timeStamp = row.timeStamp;
        this.leaveType.leaveTypeName = row.leaveTypeName;
        this.leaveType.leaveTypeShortName = row.leaveTypeShortName;
        this.leaveType.masterLeaveTypeId = row.masterLeaveTypeId;
        this.leaveType.leaveTypeColor = row.leaveTypeColor;
        this.leaveType.isArchived = !this.isArchived;
        deleteLeaveLeaveTypePopUp.openPopover();
    }

    deleteLeaveType() {
        var leaveTypeInputModel = new LeaveTypeInputModel();
        leaveTypeInputModel = this.leaveType;
        this.store.dispatch(new UpdateLeaveTypeTriggered(leaveTypeInputModel));
        this.upsertLeaveTypeInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveTypeByIdLoading));
    }

    closeDeleteLeaveTypeDialog() {
        this.deleteLeaveLeaveTypePopOver.forEach((p) => p.closePopover());
        this.validationMessage = null;
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === "asc") {
            this.sortDirection = true;
        } else {
            this.sortDirection = false;
        }
        this.page.size = 30;
        this.page.pageNumber = 1;
        this.getLeaveTypesList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) { return; }
        }
        this.page.size = 30;
        this.page.pageNumber = 1;
        this.getLeaveTypesList()
    }

    clearSearchText() {
        this.searchText = null;
        this.page.size = 30;
        this.page.pageNumber = 1;
        this.getLeaveTypesList()
    }
    createleavetype() {
       /* const dialogConfig= new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
         dialogConfig.minWidth = "80vw";
        dialogConfig.minHeight = "10vh";
        this.dialog.open(NewLeaveTypePageComponent,dialogConfig);*/
       
       const dialogRef = this.dialog.open(NewLeaveTypePageComponent, {
        disableClose:true,
        autoFocus: true,
          minWidth: "60vw",
          minHeight: "50vh",
         
          data: {}
       });
       dialogRef.afterClosed().subscribe(result => {
        this.getLeaveTypesList();
        });
      //dialogRef.componentInstance.closeMatDialog.subscribe((app) => { this.selectedApps = app; this.selectedAppForListView = app; this.cdRef.detectChanges(); });
       // dialogRef.componentInstance.dashboardSelect.subscribe((workspaceId) => {
      //    if (workspaceId) {
       //     this.selectedMatTab(null, workspaceId, false);
      //    }
     //   });
      }
      
   onSelect(row) {
    const dialogRef = this.dialog.open(NewLeaveTypePageComponent, {
        disableClose:true,
        autoFocus: true,
        minWidth: "60vw",
        minHeight: "50vh",
        data: {data: row.leaveTypeId, type: "frequency"}
     });
     dialogRef.afterClosed().subscribe(result => {
        this.getLeaveTypesList();
      });

    /*const dialogConfig= new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
     dialogConfig.minWidth = "80vw";
    dialogConfig.minHeight = "10vh";
    this.dialog.open(NewLeaveTypePageComponent,dialogConfig);*/
    }
}
