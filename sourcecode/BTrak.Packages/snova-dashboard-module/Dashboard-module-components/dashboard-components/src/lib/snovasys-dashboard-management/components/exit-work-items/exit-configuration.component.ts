import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { State, orderBy } from "@progress/kendo-data-query";
import { ExitModel } from '../../models/exit.model';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { DashboardService } from '../../services/dashboard.service';
import * as commonModuleReducers from "../../store/reducers/index";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Component({
    selector: "app-exit-configuration",
    templateUrl: `exit-configuration.component.html`

})

export class ExitConfigurationComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Input() isForDialog = false;
    @ViewChildren("deleteExitPopUp") deleteExitPopover;
    @ViewChildren("upsertExitPopUp") upsertExitPopover;

    masterDataForm: FormGroup;
    isAnyOperationIsInprogress = false;
    exitId: string;
    isShow: boolean;
    isThereAnError = false;
    pagable = true;
    exitName: string;
    validationMessage: string;
    exitModel: ExitModel;
    filteredList: ExitModel[];
    ExitForm: FormGroup;
    loggedInUserId:string;
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
    roleFeaturesIsInProgress$: Observable<boolean>;
    Exittype: string;

    constructor(
        private store: Store<State>, private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService, private translateService: TranslateService,
        private cookieService: CookieService,) {
        super();
       this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);

    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllExits(); 
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    }

    getAllExits() {
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const exitModel = new ExitModel();
        exitModel.userId = this.loggedInUserId;
        this.dashboardService.getAllExitConfigurations(exitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = response.data;
                this.filteredList = response.data;
                this.exits = {
                    data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.temp.length
                }
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
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
            data:exitsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    deleteExitPopUpOpen(row, deleteExitPopUp) {
        this.exitId = row.exitId;
        this.exitName = row.exitName;
        this.isShow = row.isShow;
        deleteExitPopUp.openPopover();
    }

    closeDeleteExitPopUp() {
        this.clearForm();
        this.deleteExitPopover.forEach((p) => p.closePopover());
    }

    deleteExit() {
        this.isAnyOperationIsInprogress = true;
        this.exitModel = new ExitModel();
        this.exitModel.exitId = this.exitId;
        this.exitModel.isShow = this.isShow;
        this.exitModel.exitName = this.exitName;
        this.exitModel.isArchived = true;
        this.exitModel.userId = this.loggedInUserId;
        this.dashboardService.upsertExitConfiguration(this.exitModel).subscribe((response: any) => {
            console.log(response);
            if (response.success == true) {
                this.deleteExitPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllExits();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeUpsertExitPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertExitPopover.forEach((p) => p.closePopover());
    }

    cancelDeleteExit() {
        this.clearForm();
        this.deleteExitPopover.forEach((p) => p.closePopover());
    }

    editExitPopupOpen(row, upsertExitPopUp) {
        this.ExitForm.patchValue(row);
        this.exitId = row.exitId;
        this.Exittype = this.translateService.instant("EXIT.EDITEXITCONFIGURATION");
        this.isShow = row.isShow;
        upsertExitPopUp.openPopover();
    }

    createExitPopupOpen(upsertExitPopUp) {
        upsertExitPopUp.openPopover();
        this.Exittype = this.translateService.instant("EXIT.ADDEXITCONFIGURATION");
    }

    upsertExit(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.exitModel = this.ExitForm.value;
        this.exitModel.exitName = this.exitModel.exitName.trim();
        this.exitModel.isShow = this.isShow;
        this.exitModel.exitId = this.exitId;
        this.exitModel.userId = this.loggedInUserId;
        this.dashboardService.upsertExitConfiguration(this.exitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertExitPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllExits();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });
    }

    clearForm() {
        this.exitId = null;
        this.exitName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.exitModel = null;
        this.validationMessage = null;
        this.searchText = null;
        this.isShow = false;
        this.ExitForm = new FormGroup({
            exitName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            )
        })
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

    closeSearch() {
        this.filterByName(null);
    }
}
