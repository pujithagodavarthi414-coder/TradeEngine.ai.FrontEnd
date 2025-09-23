import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { InductionWorItemDialogComponent } from "./induction-workitem-dialog.component";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { EmployeeListModel } from '../../models/employee-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EmployeeInductionModel } from '../../models/employee-induction.model';
import { EmployeeListService } from '../../services/employee-list.service';
import './../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-employee-induction",
    templateUrl: `employee-induction.component.html`

})

export class EmployeeInductionComponent extends CustomAppBaseComponent implements OnInit {
    isAnyOperationIsInprogress = false;
    inductionId: string;
    profileUserId: string;
    isShow: boolean;
    permission: boolean;
    filteredList: any[] = [];
    validationMessage: string;
    inductions: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    temp: any;
    searchText: string;
    loggedInUserId: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    employeeName: string;

    constructor(private cookieService: CookieService, private toastr: ToastrService,
        private store: Store<State>, private cdRef: ChangeDetectorRef, private routes: Router, private dialog: MatDialog,
        private employeeService: EmployeeListService) {
        super();
        if (this.routes.url.split("/")[3]) {
            this.profileUserId = this.routes.url.split("/")[3];
            this.loggedInUserId = this.routes.url.split("/")[3];
        } else {
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if (this.profileUserId &&
            this.profileUserId.toString().toLowerCase() ==
            this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) {
            this.permission = true;
        } else {
            this.permission = false;
        }
        this.getUserDetails();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllInductions();
    }

    getUserDetails() {
        const employeeModel = new EmployeeListModel();
        employeeModel.userId = this.loggedInUserId;
        this.employeeService.getAllEmployees(employeeModel).subscribe((result: any) => {
            if (result.success == true && result.data && result.data.length > 0) {
                this.employeeName = result.data[0].userName + " (" + result.data[0].employeeNumber + ")";
            } else {
                this.employeeName = null;
            }
        })
    }

    getAllInductions() {
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const inductionModel = new EmployeeInductionModel();
        inductionModel.userId = this.loggedInUserId;
        this.employeeService.GetEmployeeInductions(inductionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = response.data;
                this.filteredList = response.data;
                this.inductions = {
                    data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.temp.length
                }
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        let inductionsList = this.filteredList;
        if (this.state.sort) {
            inductionsList = orderBy(this.filteredList, this.state.sort);
        }
        this.inductions = {
            data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        this.filteredList = this.temp.filter((induction) => induction.inductionName.toLowerCase().indexOf(this.searchText) > -1);
        let inductionsList = this.filteredList;
        if (this.state.sort) {
            inductionsList = orderBy(this.filteredList, this.state.sort);
        }
        this.inductions = {
            data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    addInductionWork() {
        const dialogRef = this.dialog.open(InductionWorItemDialogComponent, {
            minWidth: "80vw",
            maxHeight: "80vh",
            disableClose: true,
            data: this.employeeName
        });
        dialogRef.componentInstance.closeMatDialog.subscribe(async (isReload: boolean) => {
            if (isReload) {
                await this.delay(100);
                this.getAllInductions();
            }
        });
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    closeSearch() {
        this.filterByName(null);
    }

    goToUserProfile(selectedUserId) {
        this.routes.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }
}
