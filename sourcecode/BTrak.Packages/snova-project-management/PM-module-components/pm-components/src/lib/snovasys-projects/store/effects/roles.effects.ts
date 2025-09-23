import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { RoleService } from "../../services/role.service";
import {
  RoleActionTypes,
  LoadRolesTriggered,
  LoadRolesCompleted
} from "../actions/roles.actions";
import { State } from "../reducers/index";
import * as projectReducers from "../reducers/index";

@Injectable()
export class RoleEffects {
  constructor(private actions$: Actions, private roleService: RoleService,private store$: Store<State>) {}

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRolesTriggered>(RoleActionTypes.LoadRolesTriggered),
    withLatestFrom(this.store$.pipe(select(projectReducers.getRolesAll))),
    switchMap(([_, role]) => {
      
      return this.roleService.GetAllRoles().pipe(
        map((roles: any) => {
          //TODO: PLEASE GET RID OF ANY
          return new LoadRolesCompleted(roles.data);
        })
      );
     
    })
  );
}
