import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ProjectList } from '../models/projectlist';

import { LoadProjectsTriggered, TestRailProjectsActionTypes } from "../store/actions/testrailprojects.actions";
import * as testRailModuleReducer from "../store/reducers/index";

import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { ConstantVariables } from '../constants/constant-variables';

@Component({
  selector: 'app-testrail-component-projectslist',
  templateUrl: './testrail-dashboard-projectslist.component.html',
  styles: [`
 
mat-list-item.p-0.mat-list-item.mat-3-line.ng-star-inserted{
  height:70px;
}
img.mat-list-avatar{
  width: 30px !important;
  height: 30px !important;
}
.testprojectsview a{
  font-size:12px;
}

.projectlist p {
  margin: 0px;
}
.projectlist .mat-list{
  padding-top:0 !important;
}
.projectlist .mat-progress-bar{
  height:10px;
  margin:25px 0;
}
`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestraildashboardprojectslistComponent extends CustomAppBaseComponent implements OnInit {
  projectsList$: Observable<ProjectList[]>;
  anyOperationInProgress$: Observable<boolean>;
  roleFeaturesIsInProgress$: Observable<boolean>;

  softLabels: SoftLabelConfigurationModel[];
  projectLabel: string;
  public ngDestroyed$ = new Subject();

  searchText: string;
  projectsCount: number = 0;
  isArchived: boolean = false;
  getTestrailProjectsModel = new ProjectList();
  constructor(private store: Store<State>, private actionUpdates$: Actions, private router: Router, private translateService: TranslateService, private toastr: ToastrService,
    private cdRef: ChangeDetectorRef, private softLabelPipe: SoftLabelPipe) {
    super();
    this.getSoftLabels();
    this.getTestrailProjectsModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadProjectsTriggered(this.getTestrailProjectsModel));
    this.projectsList$ = this.store.pipe(select(testRailModuleReducer.getProjectsAll));
    this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getProjectsDataLoading));
    // this.roleFeaturesIsInProgress$ = this.store.pipe(select(SharedState.getRoleFeaturesLoading));
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  closeSearch() {
    this.searchText = null;
  }

  getTestrailProjects() {
    this.searchText = null;
    this.getTestrailProjectsModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadProjectsTriggered(this.getTestrailProjectsModel));
  }

  navigateToTestSuites(projectId, index) {
    if (!this.isArchived) {
      this.router.navigateByUrl('testrepo/testrepoprojectview/' + projectId + '/' + index);
    }
    else {
      let message = this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ErrorMessageForOpeningArchivedProject), this.softLabels);
      this.toastr.warning(message);
    }
  }

  navigateToTestRuns(projectId, index) {
    if (!this.isArchived) {
      this.router.navigateByUrl('testrepo/testrepoprojectview/' + projectId + '/' + index);
    }
    else {
      let message = this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ErrorMessageForOpeningArchivedProject), this.softLabels);
      this.toastr.warning(message);
    }
  }

  navigateToMilestones(projectId, index) {
    if (!this.isArchived) {
      this.router.navigateByUrl('testrepo/testrepoprojectview/' + projectId + '/' + index);
    }
    else {
      let message = this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ErrorMessageForOpeningArchivedProject), this.softLabels);
      this.toastr.warning(message);
    }
  }

  navigateToReports(projectId, index) {
    if (!this.isArchived) {
      this.router.navigateByUrl('testrepo/testrepoprojectview/' + projectId + '/' + index);
    }
    else {
      let message = this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ErrorMessageForOpeningArchivedProject), this.softLabels);
      this.toastr.warning(message);
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}