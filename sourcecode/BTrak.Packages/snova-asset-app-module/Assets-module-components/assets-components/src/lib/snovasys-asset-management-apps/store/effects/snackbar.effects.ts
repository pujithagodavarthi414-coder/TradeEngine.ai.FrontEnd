import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { delay, map, tap } from "rxjs/operators";
import {
  SnackbarActionTypes,
  SnackbarOpen,
  SnackbarClose
} from "../actions/snackbar.actions";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as assetModuelReducer from "../../store/reducers/index";
import { SoftLabelPipe } from '../../pipes/softlabel.pipe';

@Injectable()
export class SnackbarEffects {
  softLabels = [];

  @Effect({
    dispatch: false
  })
  closeSnackbar: Observable<any> = this.actions
    .ofType(SnackbarActionTypes.SnackbarClose)
    .pipe(tap(() => this.matSnackBar.dismiss()));

  @Effect()
  showSnackbar: Observable<any> = this.actions
    .ofType<SnackbarOpen>(SnackbarActionTypes.SnackbarOpen)
    .pipe(
      map((action: SnackbarOpen) => action.payload),
      tap(payload => {
        let softLabels$ = this.store$.pipe(select(assetModuelReducer.getSoftLabelsAll))
        softLabels$.subscribe(result => {
          this.softLabels = result;
        })
        let message = this.softLabelsPipe.transform(payload.message, this.softLabels);
        this.matSnackBar.open(message, payload.action, payload.config)
      }),
      delay(2000),
      map(() => new SnackbarClose())
    );

  constructor(private actions: Actions, private matSnackBar: MatSnackBar, private store$: Store<State>, private softLabelsPipe: SoftLabelPipe) { }
}
