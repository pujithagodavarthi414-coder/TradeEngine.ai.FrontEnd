import { Component, ViewChild, ChangeDetectorRef, Input } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { GridComponent, GridDataResult, DataStateChangeEvent} from "@progress/kendo-angular-grid";
import { FormControl } from "@angular/forms";
import { State } from "@progress/kendo-data-query";
import { PayRollService } from "../services/PayRollService";
import { TranslateService } from "@ngx-translate/core";
import { Moment } from "moment";
import * as moment_ from 'moment';
const moment = moment_;
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { EmployeeESIModel } from "../models/esi-of-employee.model";
import { ReasonData, InstructionData } from "../models/esi-reason";
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
    selector: 'app-esi-of-am-employee',
    templateUrl: `esi-of-an-employee.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class EsiOfAnEmployeeComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getESIDetails(null);
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getESIDetails(null);
        // }
        // if(filters && filters.monthDate){
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0]+'-01';
        //     this.getESIDetails(null);
        // }
    }
    @ViewChild("grid") public grid: GridComponent;
    @ViewChild("excelExport1") public excelExport1: any;
    @ViewChild("excelExport2") public excelExport2: any;
    @ViewChild("excelExport3") public excelExport3: any;
    isAnyOperationIsInProgress: boolean = false;
    isActiveEmployeesOnly: boolean;
    selectedEntity: string;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    fromDate: string;
    sortBy: string;
    sortDirection: boolean = true;
    pageable: boolean = false;
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    data: any;
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;
    gridData: GridDataResult;
    component: any;
    isOpen: boolean;
    employeeName: string;
    entityName: string;
    dateForFilter: string;
    reasonData: any = ReasonData;
    instructionData: any = InstructionData;

    constructor(private payRollService: PayRollService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private router: Router) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.getEntityDropDown();
        this.getESIDetails(null);
    }

    getESIDetails(isExcel) {
        this.isAnyOperationIsInProgress = true;
        this.cdRef.detectChanges();
        let employeeESIModel = new EmployeeESIModel();
        employeeESIModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        employeeESIModel.entityId = this.selectedEntity;
        employeeESIModel.userId = this.usersId;
        employeeESIModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        employeeESIModel.sortBy = this.sortBy;
        employeeESIModel.sortDirectionAsc = this.sortDirection;
        employeeESIModel.pageNumber = isExcel ? null : (this.state.skip / this.state.take) + 1;
        employeeESIModel.pageSize = isExcel ? null : this.state.take;
        employeeESIModel.searchText = this.searchText;
        this.payRollService.getESIDetailsOfEmployee(employeeESIModel).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
                this.gridData = {
                    data: this.data,
                    total: this.data.length > 0 ? this.data[0].totalRecordsCount : 0
                }
                this.cdRef.detectChanges();
                if (isExcel) {
                    this.excel();
                }
                let totalCount = response.data.length > 0 ? this.data[0].totalRecordsCount : 0;
                if (totalCount > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
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

    exportToExcel(): void {
        this.getESIDetails(true);
        this.state.take = this.data[0].TotalRecordsCount;
        this.cdRef.detectChanges();
    }

    excel() {
        Promise.all([this.excelExport1.workbookOptions(), this.excelExport2.workbookOptions(), this.excelExport3.workbookOptions()]).then((workbooks) => {
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[1].sheets);
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[2].sheets);
            this.excelExport1.save(workbooks[0]);
        });
        this.state.take = 20;
        this.getESIDetails(false);
    }

    getEntityDropDown() {
        let searchText = "";
        this.payRollService  .getEntityDropDown(searchText).subscribe((responseData: any) => {
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
        this.getESIDetails(null);
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
        this.getESIDetails(null);
    }


    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getESIDetails(null);
    }

    closeSearch() {
        this.searchText = null;
        this.getESIDetails(null);
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getESIDetails(null);
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getESIDetails(null);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getESIDetails(null);
    }
    filter() {
        if (this.searchText || this.dateForFilter || this.entityName || this.employeeName || this.isActiveEmployeesOnly) {
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

    resetAllFilters() {
        this.fromDate = null;
        this.usersId = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.date.patchValue(null);
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        this.getESIDetails(null);
    }
}