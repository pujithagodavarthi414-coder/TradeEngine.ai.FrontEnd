import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { LoadUserstoryHistoryTriggered } from "../../store/actions/userstory-history.action";
import { UserStoryHistory } from '../../models/userstory-history.model';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { DatePipe } from "@angular/common";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-pm-component-userstory-history",
  templateUrl: "./userstory-history.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryHistoryComponent implements OnInit {
  userStoryId: string;
  @Input("userStoryId")
  set _userStoryId(data: string) {
    this.userStoryId = data;
    localStorage.setItem('userStoryId', this.userStoryId);
    this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStoryId));
  }
  userstoryHistory$: Observable<UserStoryHistory[]>;
  anyOperationInProgress$: Observable<boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  isLastSeenShow: boolean;
  userStoryInputData: any; 
  currentUserTimeZoneName: string;
  currentUserTimeZoneOffset: string;
  currentUserTimeZoneAbbr: string;

    constructor(private store: Store<State>,private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef) {
      this.getUserDetails();

  }

  getUserStoryHistory() {
    this.isLastSeenShow = !this.isLastSeenShow;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.getuserStoryHistoryLoading)
    );

    this.userstoryHistory$ = this.store.pipe(select(projectModuleReducers.getUserstoryHisoryAll));
    this.userstoryHistory$.subscribe((element) => {
      if (element && element.length > 0) {
        this.userStoryInputData = {
          dateFrom: this.datePipe.transform(element[0].createdDateTime, "yyyy-MM-dd"),
          dateTo: this.datePipe.transform(new Date(),"yyyy-MM-dd"),
          userStoryId: this.userStoryId
        }
      }
    })
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getUserDetails() {
    var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    this.currentUserTimeZoneName = userModel.currentTimeZoneName;
    this.currentUserTimeZoneOffset = userModel.currentTimeZoneOffset;
    this.currentUserTimeZoneAbbr = userModel.currentTimeZoneAbbr;
  }
}