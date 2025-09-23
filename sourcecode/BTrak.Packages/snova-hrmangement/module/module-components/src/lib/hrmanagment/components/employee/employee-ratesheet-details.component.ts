import { Component, Input, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Page } from "../../models/Page";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeRateSheetModel } from "../../models/employee-ratesheet-model";
import { LoadEmployeeRateSheetDetailsTriggered, UpdateEmployeeRateSheetDetailsTriggered, EmployeeRateSheetDetailsActionTypes } from "../../store/actions/employee-ratesheet-details.actions";
import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import { AddRateSheetDetailsComponent } from "./add-ratesheet-details.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-employee-ratesheet-details",
    templateUrl: "employee-ratesheet-details.component.html"
})

export class EmployeeRateSheetDetailsComponent extends CustomAppBaseComponent {
    @ViewChildren("deleteRateSheetPopUp") deleteRateSheetPopover;
    // @ViewChildren("editSalaryDetailsPopover") editSalaryDetailsPopover;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeRateSheetList();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    permission: boolean;
    employeeId: string;
    searchText = "";
    sortBy: string;
    ratesheet: any;
    isPermanent: boolean = false;
    sortDirection: boolean;
    page = new Page();
    employeeRateSheet: EmployeeRateSheetModel;

    employeeRateSheetDetailsLoading$: Observable<boolean>;
    employeeRateSheetDetailsList$: Observable<EmployeeRateSheetModel[]>;
    public ngDestroyed$ = new Subject();

    employeeRateSheetDetailsList: EmployeeRateSheetModel[];

    constructor(private store: Store<State>,
        // private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions, public dialogRef: MatDialogRef<AddRateSheetDetailsComponent>, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private cookieService: CookieService, private hrManagementService: HRManagementService) {
        super();
        this.page.size = 5;
        this.page.pageNumber = 0;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsCompleted),
                tap(() => {
                    this.employeeRateSheetDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeRateSheetDetailsAll));
                    this.employeeRateSheetDetailsList$.subscribe(result => {
                        if (result) {
                            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                            this.page.totalPages = this.page.totalElements / this.page.size;
                            this.ratesheet = result;
                            if (result.length >= 0) {
                                //this.isPermanentCheck(this.ratesheet);
                                this.isPermanent = this.ratesheet.length > 0 ? (this.ratesheet[0].isPermanent == true ? false : true) : true;
                            }
                        }
                        this.cdRef.markForCheck();
                    })

                })
            )
            .subscribe();
    }

    openDialog(event): void {

        let width: string;
        if (!event) {
            width = 'calc(100vw)'
        } else {
            width = '600px'
        }
        const dialogRef = this.dialog.open(AddRateSheetDetailsComponent, {
            height: 'auto',
            width: width,
            disableClose: true,
            data: { employeeId: this.employeeId, editRateSheetData: event, isPermission: this.permission }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        let res = this.ratesheet
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "") {
            this.getEmployees();
        }
    }

    getEmployees() {

        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getEmployeeRateSheetList();
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getEmployeeRateSheetList();
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
        this.page.pageNumber = 0;
        this.getEmployeeRateSheetList();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) { return; }
        }
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.getEmployeeRateSheetList();
    }

    closeSearch() {
        this.searchText = "";
        this.getEmployeeRateSheetList();
    }

    getEmployeeRateSheetList() {
        const rateSheetDetailsSearchResult = new EmployeeDetailsSearchModel();
        rateSheetDetailsSearchResult.sortBy = this.sortBy;
        rateSheetDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        rateSheetDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        rateSheetDetailsSearchResult.pageSize = this.page.size;
        rateSheetDetailsSearchResult.searchText = this.searchText;
        rateSheetDetailsSearchResult.employeeId = this.employeeId;
        rateSheetDetailsSearchResult.isArchived = false;
        rateSheetDetailsSearchResult.employeeDetailType = "RateSheetDetails";
        this.store.dispatch(new LoadEmployeeRateSheetDetailsTriggered(rateSheetDetailsSearchResult));
        this.employeeRateSheetDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeRateSheetDetailLoading));
        // this.cdRef.detectChanges();
    }

    getRateSheetDetailsId(event, deleteRateSheetDetailsPopover) {
        this.employeeRateSheet = event;
        deleteRateSheetDetailsPopover.openPopover();
    }

    deleteRateSheetDetail() {
        const employeeRateSheetDetails = new EmployeeRateSheetModel();
        employeeRateSheetDetails.employeeRateSheetId = this.employeeRateSheet.employeeRateSheetId;
        employeeRateSheetDetails.rateSheetId = this.employeeRateSheet.rateSheetId;
        employeeRateSheetDetails.rateSheetEmployeeId = this.employeeRateSheet.rateSheetEmployeeId;
        employeeRateSheetDetails.rateSheetCurrencyId = this.employeeRateSheet.rateSheetCurrencyId;
        employeeRateSheetDetails.rateSheetStartDate = this.employeeRateSheet.rateSheetStartDate;
        employeeRateSheetDetails.rateSheetEndDate = this.employeeRateSheet.rateSheetEndDate;
        employeeRateSheetDetails.rateSheetForId = this.employeeRateSheet.rateSheetForId;
        employeeRateSheetDetails.ratePerHour = this.employeeRateSheet.ratePerHour;
        employeeRateSheetDetails.ratePerHourMon = this.employeeRateSheet.ratePerHourMon;
        employeeRateSheetDetails.ratePerHourTue = this.employeeRateSheet.ratePerHourTue;
        employeeRateSheetDetails.ratePerHourWed = this.employeeRateSheet.ratePerHourWed;
        employeeRateSheetDetails.ratePerHourThu = this.employeeRateSheet.ratePerHourThu;
        employeeRateSheetDetails.ratePerHourFri = this.employeeRateSheet.ratePerHourFri;
        employeeRateSheetDetails.ratePerHourSat = this.employeeRateSheet.ratePerHourSat;
        employeeRateSheetDetails.ratePerHourSun = this.employeeRateSheet.ratePerHourSun;
        employeeRateSheetDetails.timeStamp = this.employeeRateSheet.timeStamp;
        employeeRateSheetDetails.isArchived = true;
        this.store.dispatch(new UpdateEmployeeRateSheetDetailsTriggered(employeeRateSheetDetails));
        this.deleteRateSheetPopover.forEach((p) => p.closePopover());
        // this.cdRef.detectChanges();
    }

    cancelRateSheetDetails() {
        this.employeeRateSheet = new EmployeeRateSheetModel();
        this.deleteRateSheetPopover.forEach((p) => p.closePopover());
    }

    addRateSheetDetail(editRateSheetDetailsPopover) {
        this.employeeRateSheet = null;
        editRateSheetDetailsPopover.openPopover();
    }
}
