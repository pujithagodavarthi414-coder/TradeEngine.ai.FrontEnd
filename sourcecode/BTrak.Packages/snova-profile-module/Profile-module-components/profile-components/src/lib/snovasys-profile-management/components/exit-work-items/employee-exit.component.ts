import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { EmployeeExitModel } from "../../models/employee-exit.model";
import { ExitWorItemDialogComponent } from "./exit-workitem-dialog.component";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EmployeeListModel } from '../../models/employee-list.model';
import * as commonModuleReducers from "../../store/reducers/index";
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';
import {SoftLabelPipe} from '../../pipes/soft-labels.pipe';
import {SoftLabelConfigurationModel} from '../../models/soft-labels.model';

@Component({
    selector: "app-employee-exit",
    templateUrl: `./employee-exit.component.html`

})

export class EmployeeExitComponent extends CustomAppBaseComponent implements OnInit {
    isAnyOperationIsInprogress = false;
    exitId: string;
    profileUserId: string;
    isShow: boolean;
    permission: boolean;
    filteredList: any[] = [];
    validationMessage: string;
    exits: GridDataResult = {
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
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    isHrModuleAccess : boolean = false;
    isProjectModuleAccess : boolean = false;
    isAssertModuleAccess : boolean = false;
    isTimeSheetModuleAccess : boolean = false;
    isDocumentModuleAccess : boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    constructor(
         private toastr: ToastrService,
        private store: Store<State>, private cdRef: ChangeDetectorRef, private cookieService: CookieService,private routes: Router, private dialog: MatDialog,
        private dashboardService: DashboardService,private route: ActivatedRoute, private translateService: TranslateService,private softLabel:SoftLabelPipe) {
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
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
        this.getUserDetails();
       //this.getAllExits();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getAllExits();
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#in-1',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.IN-1'), this.softLabels),
                    position: 'bottom'
                },
                {
                    element: '#in-2',
                    intro: this.translateService.instant('INTROTEXT.IN-2'),
                    position: 'left'
                },
            ]
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getUserDetails() {
        const employeeModel = new EmployeeListModel();
        employeeModel.userId = this.loggedInUserId;
        this.dashboardService.getAllEmployees(employeeModel).subscribe((result: any) => {
            if (result.success == true && result.data && result.data.length > 0) {
                this.employeeName = result.data[0].userName + " (" + result.data[0].employeeNumber + ")";
            } else {
                this.employeeName = null;
            }
        })
    }

    getAllExits() {
       
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const exitModel = new EmployeeExitModel();
        exitModel.userId = this.loggedInUserId;
    
        this.dashboardService.GetEmployeeExits(exitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = response.data;
                this.filteredList = response.data;
                this.exits = {
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
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        let exitsList = this.filteredList;
        if (this.state.sort) {
            exitsList = orderBy(this.filteredList, this.state.sort);
        }
        this.exits = {
            data: exitsList.slice(this.state.skip, this.state.take + this.state.skip),
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

        this.filteredList = this.temp.filter((exit) => exit.exitName.toLowerCase().indexOf(this.searchText) > -1);
        let exitsList = this.filteredList;
        if (this.state.sort) {
            exitsList = orderBy(this.filteredList, this.state.sort);
        }
        this.exits = {
            data: exitsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    addExitWork() {
        const dialogRef = this.dialog.open(ExitWorItemDialogComponent, {
            minWidth: "80vw",
            maxHeight: "80vh",
            disableClose: true,
            data: this.employeeName
        });
        dialogRef.componentInstance.closeMatDialog.subscribe(async (isReload: boolean) => {
            if (isReload) {
                await this.delay(100);
                this.getAllExits();
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
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.canAccess_feature_CanEditOtherEmployeeDetails && (this.isDocumentModuleAccess =userModules.filter(x =>
                x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/signature-inviations"], navigationExtras);
            }
            else if (this.canAccess_feature_AssignAssetsToEmployee && (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
          });
    }
}
