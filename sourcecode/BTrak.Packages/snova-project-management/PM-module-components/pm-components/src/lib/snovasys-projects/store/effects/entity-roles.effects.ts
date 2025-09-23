// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action, select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  EntityRoleActions,
  EntityRoleActionTypes,
  LoadEntityRolesCompleted,
  LoadEntityRolesTriggered
} from "../actions/entity-roles.actions";
import { State } from "../reducers/index";
import * as projectReducers from "../reducers/index";
import { RoleService } from '../../services/role.service';

@Injectable()
export class EntityRoleEffects {

  @Effect()
  loadEntityRoles$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEntityRolesTriggered>(EntityRoleActionTypes.LoadEntityRolesTriggered),
    switchMap(() => {
      return this.roleService.getEntityRole().pipe(
        // tslint:disable-next-line: no-shadowed-variable
        map((entityRoles: any) => {
          // TODO: PLEASE GET RID OF ANY
          return new LoadEntityRolesCompleted(entityRoles.data);
        })
      );
     
    })
   );
  constructor(private actions$: Actions, private roleService: RoleService, private store$: Store<State>) {}
}
