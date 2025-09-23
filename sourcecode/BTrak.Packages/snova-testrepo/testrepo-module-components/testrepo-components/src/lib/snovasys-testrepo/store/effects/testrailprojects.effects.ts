import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  TestRailProjectsActionTypes,
  LoadProjectsTriggered,
  LoadProjectsCompleted,
  LoadProjectRelatedCountsTriggered,
  LoadProjectRelatedCountsCompleted
} from '../actions/testrailprojects.actions';

import { TestRailService } from '../../services/testrail.service';
import { ProjectList } from '../../models/projectlist';
import { SnackbarOpen } from '../actions/snackbar.actions';

@Injectable()
export class ProjectEffects {
  projectsList: ProjectList;

  constructor(private actions$: Actions, private testRailService: TestRailService) { }

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProjectsTriggered>(TestRailProjectsActionTypes.LoadProjectsTriggered),
    switchMap(getAction => {
      return this.testRailService.GetProjects(getAction.getTestrailProjectsInputModel).pipe(
        map((projects: any) => new LoadProjectsCompleted(projects.data)),
      );
    })
  );

  @Effect()
  loadProjectRelatedDatas$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProjectRelatedCountsTriggered>(TestRailProjectsActionTypes.LoadProjectRelatedCountsTriggered),
    switchMap(getAction => {
      return this.testRailService.GetProjectRelatedData(getAction.projectId).pipe(
        map((projects: any) => new LoadProjectRelatedCountsCompleted(projects.data)),
      );
    })
  );
}