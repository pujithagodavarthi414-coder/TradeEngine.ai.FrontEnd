import { Component, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { PayRollService } from '../services/PayRollService';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MonthlyESIModel } from '../models/monthlyEsiModel';
import { process, aggregateBy, State } from '@progress/kendo-data-query';
import { GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { UserModel } from '../models/user';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-esi-monthly-statement',
    templateUrl: `esi-monthly-statement-component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class EsiMonthlyComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getAllESIDetails();
        // }
        // if (filters && filters.isActiveEmployeesOnly == "true") {
        //     this.isActiveEmployeesOnly = true;
        //     this.getAllESIDetails();
        // }
        // else {
        //     this.isActiveEmployeesOnly = null;
        //     this.getAllESIDetails();
        // }
        // if(filters && filters.monthDate){
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0]+'-01';
        //     this.getAllESIDetails();
        // }
    }
    @ViewChild("grid") public grid: GridComponent;
    isAnyOperationIsInProgress: boolean = false;
    fromDate: string;
    isOpen: boolean = true;
    toDate: Date;
    data: any;
    selectedEntity: string;
    isActiveEmployeesOnly: boolean;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    take: number = 20;
    gridData: any;
    public aggregates: any[] = [{ field: 'esiGross', aggregate: 'sum' }, { field: 'employeeContribusion', aggregate: 'sum' }, { field: 'employeerContribusion', aggregate: 'sum' }, { field: 'totalContribution', aggregate: 'sum' }];
    state: State = {
        skip: 0,
        take: 20,
        group: [{
            field: 'branchName',
            aggregates: this.aggregates
        }]
    };

    public group: any[] = [{
        field: 'branchName',
        aggregates: this.aggregates
    }];
    searchText: string;
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;
    public total: any;
    employeeName: string;
    entityName: string;
    dateForFilter: string;


    constructor(private payRollService: PayRollService,
        private translateService: TranslateService, private router: Router, private cdRef: ChangeDetectorRef, private toastr: ToastrService) { }

    ngOnInit() {
        this.getAllESIDetails();
        this.getEntityDropDown();
        this.getAllUsers();
    }
    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getAllESIDetails();
    }

    getAllESIDetails() {
        this.isAnyOperationIsInProgress = true;
        let monthlyESIModel = new MonthlyESIModel();
        monthlyESIModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        monthlyESIModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        monthlyESIModel.entityId = this.selectedEntity;
        monthlyESIModel.userId = this.usersId;
        monthlyESIModel.searchText = this.searchText;
        this.payRollService.getEsiMonthlyStatement(monthlyESIModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data.length > 0) {
                    this.total = aggregateBy(response.data, this.aggregates);
                    this.gridData = process(response.data, this.state);
                    this.data = response.data;
                }
                else {
                    this.data = null;
                }
                this.isAnyOperationIsInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInProgress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        if (state && state.group) {
            state.group.map(group => group.aggregates = this.aggregates);
        }
        this.state = state;
        this.gridData = process(this.data, this.state);
    }


    exportToExcel(): void {
        this.state.take = this.data.length;
        this.updateData();
        this.cdRef.detectChanges();
        this.grid.saveAsExcel();
        this.state.take = 20;
        this.updateData();
        this.cdRef.detectChanges();
    }

    updateData() {
        if (this.state && this.state.group) {
            this.state.group.map(group => group.aggregates = this.aggregates);
        }
        this.state = this.state;
        this.gridData = process(this.data, this.state);
    }

    getEntityDropDown() {
        let searchText = "";
        this.payRollService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
            else {
                this.entities = responseData.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isActive = true;
        this.payRollService.getAllUsers(userModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.employeeList = responseData.data;
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
        })
    }

    closeSearch() {
        this.searchText = null;
        this.getAllESIDetails();
    }

    entityValues(id, event) {
        if (id === '0') {
            this.selectedEntity = "";
            if (event == null) {
                this.entityName = null;
            }
            else {
                this.entityName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        else {
            this.selectedEntity = id;
            this.entityName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllESIDetails();
    }

    getEmployee(id, event) {
        if (id === '0') {
            this.usersId = "";
            if (event == null) {
                this.employeeName = null;
            }
            else {
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        else {
            this.usersId = id;
            this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllESIDetails();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value.toString();
        this.getAllESIDetails();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.getAllESIDetails();
    }
    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.fromDate = null;
        this.toDate = null;
        this.usersId = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.date.patchValue(null);
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        this.getAllESIDetails();
    }

    closeSearchFilter() {
        this.searchText = null;
        this.getAllESIDetails();
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getAllESIDetails();
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getAllESIDetails();
    }

    filter(){
        if(this.searchText || this. dateForFilter || this. entityName || this.employeeName || this.isActiveEmployeesOnly){
            return true;
        }
        else {
            return false;
        }
    }
    goToUserProfile(row) {
        if (row.isArchived) {
            this.toastr.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
        }
        else {
            this.router.navigate(["dashboard/profile", row.userId, "overview"]);
        }
    }
}