import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { LocationManagement } from "../../models/location-management";
import { LocationManagementService } from "../../services/location-management.service";
import { LocationActionTypes, CreateLocationCompleted, LoadLocationsTriggered, CreateLocationFailed, CreateLocationTriggered, LoadLocationsCompleted, LocationExceptionHandled, DeleteLocationsCompleted, GetLocationsByIdTriggered, GetLocationsByIdCompleted, GetLocationsByIdFailed, UpdateLocationsById, LoadLocationsFailed } from "../actions/location.actions";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class LocationEffects {
  LocationSearchResult: LocationManagement;
  toastrMessage: string;

  @Effect()
  loadLocations$: Observable<Action> = this.actions$.pipe(
    ofType<LoadLocationsTriggered>(LocationActionTypes.LoadLocationsTriggered),
    switchMap(searchAction => {
      this.LocationSearchResult = searchAction.locationSearchResult;
      return this.locationManagementService
        .getAllLocationManagementList(searchAction.locationSearchResult)
        .pipe(map((seatingLocations: any) =>{
          if (seatingLocations.success === true) {
            return new LoadLocationsCompleted(seatingLocations.data);
          } else {
            return new LoadLocationsFailed(seatingLocations.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new LocationExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertLocation$: Observable<Action> = this.actions$.pipe(
    ofType<CreateLocationTriggered>(LocationActionTypes.CreateLocationTriggered),
    switchMap(locationTriggeredAction => {
      if (locationTriggeredAction.location.seatingId === null || locationTriggeredAction.location.seatingId === '' || locationTriggeredAction.location.seatingId === undefined) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.LocationWithSeatCode) + " " + locationTriggeredAction.location.seatCode + " " +  this.translateService.instant(ConstantVariables.SuccessMessageForLocationCreated);
      } else if (
        locationTriggeredAction.location.seatingId !== undefined &&
        locationTriggeredAction.location.isArchived === true
      ) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.LocationWithSeatCode) + " " + locationTriggeredAction.location.seatCode + " " + this.translateService.instant(ConstantVariables.SuccessMessageForLocationArchived);
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.LocationWithSeatCode) + " " + locationTriggeredAction.location.seatCode + " " + this.translateService.instant(ConstantVariables.SuccessMessageForLocationUpdated);
      }
      return this.locationManagementService
        .upsertLocation(locationTriggeredAction.location)
        .pipe(
          map((seatingId: any) => {
            if (seatingId.success === true) {
              return new CreateLocationCompleted(seatingId.data);
            } else {
              return new CreateLocationFailed(seatingId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new LocationExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertLocationSuccessfulAndLoadLocations$: Observable<Action> = this.actions$.pipe(
    ofType<CreateLocationCompleted>(LocationActionTypes.CreateLocationCompleted),
    pipe(map(() => {
        return new LoadLocationsTriggered(this.LocationSearchResult);
      }),
    )
  );

  @Effect()
  upsertLocationSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateLocationCompleted>(LocationActionTypes.CreateLocationCompleted),
    pipe(map(() =>new SnackbarOpen({
          message: this.toastrMessage, // TODO: Change to proper toast message
          action: this.translateService.instant(ConstantVariables.success)
        })
      )
    )
  );

  @Effect()
  deleteLocationsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteLocationsCompleted>(LocationActionTypes.DeleteLocationsCompleted),
    pipe(map(() =>new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  deleteLocationsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteLocationsCompleted>(LocationActionTypes.DeleteLocationsCompleted),
    pipe(map(() => {
        return new LoadLocationsTriggered(this.LocationSearchResult);
      })
    )
  );

  @Effect()
  getLocationsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetLocationsByIdTriggered>(LocationActionTypes.GetLocationsByIdTriggered),
    switchMap(searchAction => {
      let LocationsSearchModel = new LocationManagement();
      LocationsSearchModel.seatingId = searchAction.locationId;
      return this.locationManagementService
        .searchLocation(LocationsSearchModel)
        .pipe(map((result: any) => {
          if (result.success === true) {
            return new GetLocationsByIdCompleted(result.data);
          } else {
            return new GetLocationsByIdFailed(
              result.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new LocationExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertLocationsByIdSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetLocationsByIdCompleted>(LocationActionTypes.GetLocationsByIdCompleted),
    switchMap(searchAction => {
      return of(new UpdateLocationsById({
        LocationsUpdate: {
          id: searchAction.Location.seatingId,
          changes: searchAction.Location
        }
      }))
    })
  );

  @Effect()
  showValidationMessagesForLoadLocationsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<LoadLocationsFailed>(LocationActionTypes.LoadLocationsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );
  
  @Effect()
  showValidationMessagesForLocationManagement$: Observable<Action> = this.actions$.pipe(
    ofType<CreateLocationFailed>(LocationActionTypes.CreateLocationFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForLocationsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<GetLocationsByIdFailed>(LocationActionTypes.GetLocationsByIdFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  LocationExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<LocationExceptionHandled>(LocationActionTypes.LocationExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private locationManagementService: LocationManagementService,
    private translateService: TranslateService,
    private cookieService: CookieService
    ) {
      const browserLang: string = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      this.translateService.use(browserLang);
   }
}