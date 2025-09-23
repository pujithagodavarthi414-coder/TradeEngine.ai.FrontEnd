import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { ProjectTypeService } from "../../services/project-type.service";
import {
  LoadProjectTypesCompleted,
  ProjectTypeActionTypes
} from "../actions/project-types.actions";
import { Action, select, Store } from "@ngrx/store";
import { State } from "../reducers/index";
import * as projectReducers from "../reducers/index";
import { ProjectType } from "../../models/projectType";

@Injectable()
export class ProjectTypeEffects {
  constructor(
    private actions$: Actions,
    private projectTypeService: ProjectTypeService,
    private store$: Store<State>
  ) {}

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType(ProjectTypeActionTypes.LoadProjectTypesTriggered),
    withLatestFrom(this.store$.pipe(select(projectReducers.getProjectTypesAll))),
    switchMap(([_, projectType]) => {
        var projectTypes = new ProjectType();
        projectTypes.isArchived = false;
        return this.projectTypeService.GetAllProjectTypes(projectTypes).pipe(
          map((projectTypes: any) => {
            //TODO: PLEASE GET RID OF ANY
            return new LoadProjectTypesCompleted(projectTypes.data);
          })
        );    
    })
  );
}
