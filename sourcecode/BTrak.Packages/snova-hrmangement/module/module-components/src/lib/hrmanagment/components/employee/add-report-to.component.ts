import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable, Subject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { EmployeeListModel } from "../../models/employee-model";
import { ReportToDetailsModel } from "../../models/report-to-details-model";
import { ReportingMethodSearchModel } from "../../models/repoting-method-search-model";
import { ReportingMethodDetailsModel } from "../../models/repoting-method-details-model";

import * as hrManagementModuleReducer from "../../store/reducers/index";

import { CreateReportToTriggered, ReportToActionTypes } from "../../store/actions/report-to.actions";
import { LoadEmployeeListItemsTriggered, EmployeeListActionTypes } from "../../store/actions/employee-list.action";
import { ReportingMethodDetailsActionTypes, LoadReportingMethodDetailsTriggered } from "../../store/actions/reporting-method.actions";
import { Router } from "@angular/router";
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";

@Component({
  selector: "app-hr-component-add-report-to",
  templateUrl: "add-report-to.component.html"
})

export class AddReportToComponent extends CustomAppBaseComponent {
  @Input("selectedEmployeeId")
  set selectedEmployeeId(data: string) {
    this.employeeId = data;
  }
  @Input("editReportToDetailsData")
  set editReportToDetailsData(data: ReportToDetailsModel) {
    if (!data) {
      this.reportTodetails = null;
      this.employeeReportToId = null;
      this.initializeReportToForm();
    } else {
      this.titleText = this.translateService.instant("REPORTTO.EDITREPORT");
      this.reportTodetails = data;
      this.employeeReportToId = data.employeeReportToId;
      this.getReportToUserName(data.reportToEmployeeId);
      this.reportingToForm.patchValue(data);
    }
  }
  @Input("isPermission")
  set isPermission(data: boolean) {
    this.permission = data;
  }
  @Output() closeReportPopup = new EventEmitter<string>();

  public show: boolean = false;

  reportingToForm: FormGroup;
  formId: FormGroupDirective;

  reportToModel: ReportToDetailsModel;
  reportToData: ReportToDetailsModel;
  reportTodetails: ReportToDetailsModel;
  reportingToDetailsList: EmployeeListModel[];
  softLabels: SoftLabelConfigurationModel[];

  permission: boolean = false;
  employeeId: string = "";
  comments: string;
  titleText: string;
  employeeReportToId: string = "";
  selectedReportToUserName: string = "";

  reportingToDetailsList$: Observable<EmployeeListModel[]>;
  reportingMethodDetailsList$: Observable<ReportingMethodDetailsModel[]>;
  upsertReportToDetailsInProgress$: Observable<boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  selectedUserId: string;

  public ngDestroyed$ = new Subject();

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private store: Store<State>, private actionUpdates$: Actions, private translateService: TranslateService,) {
    super();
    if (this.router.url.split("/")[3]) {
      this.selectedUserId = this.router.url.split("/")[3];
    }
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ReportToActionTypes.CreateReportToCompleted),
        tap(() => {
          this.initializeReportToForm();
          this.closePopover(this.formId);
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        ofType(EmployeeListActionTypes.LoadEmployeeListItemsCompleted),
        tap(() => {
          this.reportingToDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeAll), tap(result => {
            this.reportingToDetailsList = result
          }));
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        ofType(ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsCompleted),
        tap(() => {
          this.reportingMethodDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getReportingMethodDetailsAll))
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.  getSoftLabelConfigurations();
    this.initializeReportToForm();
    // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
    //   this.canAccess_feature_CanEditOtherEmployeeDetails = result;
    // })
    // this.canAccess_feature_AddOrUpdateEmployeeReportingToDetails$.subscribe(result => {
    //   this.canAccess_feature_AddOrUpdateEmployeeReportingToDetails = result;
    // })
    if ((this.canAccess_feature_AddOrUpdateEmployeeReportingToDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
      this.getAllEmployees();
      this.getReportingMethodDetails();
    }
  }

  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }

  closePopover(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    if (this.employeeReportToId) {
      this.getReportToUserName(this.reportTodetails.reportToEmployeeId);
      this.reportingToForm.patchValue(this.reportTodetails);
    } else {
      this.initializeReportToForm();
      this.selectedReportToUserName = "";
    }
    this.closeReportPopup.emit("");
  }

  getAllEmployees() {
    const employeeSearchResult = new EmployeeListModel();
    employeeSearchResult.isArchived = false;
    employeeSearchResult.sortDirectionAsc = true;
    employeeSearchResult.isReportTo = true;
    employeeSearchResult.isActive = true;
    this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeSearchResult));
  }

  getReportingMethodDetails() {
    const reportingMethodSearchResult = new ReportingMethodSearchModel();
    reportingMethodSearchResult.isArchived = false;
    this.store.dispatch(new LoadReportingMethodDetailsTriggered(reportingMethodSearchResult));
  }

  initializeReportToForm() {
    this.titleText = this.translateService.instant("REPORTTO.ADDREPORT");
    this.reportingToForm = new FormGroup({
      reportToEmployeeId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      reportingMethodId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      reportingFrom: new FormControl("", []
      ),
      comments: new FormControl("",
        Validators.compose([
          Validators.maxLength(500)
        ])
      )
    })
  }

  saveReportingToDetails(formDirective: FormGroupDirective) {
    let reportTodetails = new ReportToDetailsModel();
    reportTodetails = this.reportingToForm.value;
    reportTodetails.employeeId = this.employeeId;
    if (this.employeeReportToId) {
      reportTodetails.employeeReportToId = this.employeeReportToId;
      reportTodetails.timeStamp = this.reportTodetails.timeStamp;
    }
    this.store.dispatch(new CreateReportToTriggered(reportTodetails));
    this.upsertReportToDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createReportToLoading));
    this.formId = formDirective;
  }

  getReportToUserName(employeeId) {
    if (this.reportingToDetailsList && this.reportingToDetailsList.length > 0) {
      const employee = this.reportingToDetailsList.find(result => result.employeeId === employeeId);
      this.selectedReportToUserName = employee.userName;
    }
  }
}
