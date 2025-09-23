import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { delay, map, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Store, select } from "@ngrx/store";
import { State } from "../reducers";
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';
import { ShowExceptionMessages, ShowValidationMessages, ValidationActionTypes } from '../../dependencies/project-store/actions/notification-validator.action';
import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';

@Injectable()
export class NotificationValidatorEffects {
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabel: SoftLabelConfigurationModel[];

  @Effect({ dispatch: false })
  showException: Observable<any> = this.actions
    .ofType<ShowExceptionMessages>(ValidationActionTypes.ShowExceptionMessages)
    .pipe(
      map((action: ShowExceptionMessages) => action.payload),
      tap(payload => {
        if (payload != null && payload.message != null) {
          if ((typeof (payload.message)) === 'string') {
            if (payload.message.indexOf('401').valueOf() < 0)
              this.toastr.error("", payload.message)
          }

          if ((typeof (payload.message)) === 'object') {
            if (payload.message.status != 401)
              this.toastr.error("", payload.message.message)
          }
        }
      }
      ),
    );

  @Effect({ dispatch: false })
  showValidation: Observable<any> = this.actions
    .ofType<ShowValidationMessages>(ValidationActionTypes.ShowValidationMessages)
    .pipe(
      map((action: ShowValidationMessages) => action.payload.validationMessages),
      tap(validationMessages => {
        if (validationMessages != null) {
          validationMessages.forEach(value => {
            let message = this.softLabelPipe.transform(value.message, this.softLabel);
            this.toastr.error("", message)
          });
        }
      }
      ),
    );

  constructor(private actions: Actions, private toastr: ToastrService, private store: Store<State>,
    private softLabelPipe: SoftLabelPipe) {
    //  this.softLabels$ = this.store.pipe(select(commonModuleReducers.getSoftLabelsAll));

    // this.softLabels$.subscribe(x => this.softLabel = x);
  }
}