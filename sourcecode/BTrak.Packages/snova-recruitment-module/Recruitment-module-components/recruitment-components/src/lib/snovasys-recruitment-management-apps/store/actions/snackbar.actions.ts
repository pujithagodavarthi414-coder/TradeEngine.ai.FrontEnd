import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { Action } from '@ngrx/store';

export enum SnackbarActionTypes {
  SnackbarOpen = '[Snackbar] Open',
  SnackbarClose = '[Snackbar] Close'
}

export class SnackbarOpen implements Action {
  readonly type = SnackbarActionTypes.SnackbarOpen;

  constructor(
    public payload: {
      message: string;
      action?: string;
      config?: MatSnackBarConfig;
    }
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SnackbarClose implements Action {
  readonly type = SnackbarActionTypes.SnackbarClose;
}

export type SnackbarAction = SnackbarOpen | SnackbarClose;
