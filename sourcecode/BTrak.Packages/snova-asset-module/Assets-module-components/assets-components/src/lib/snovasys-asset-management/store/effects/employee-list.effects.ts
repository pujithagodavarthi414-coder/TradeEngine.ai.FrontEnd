import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { EmployeeListModel } from "../../models/employee-model";
import { EmployeeListActionTypes, LoadEmployeeListItemsTriggered, LoadEmployeeListItemsCompleted, EmployeeListExceptionHandled, CreateEmployeeListItemTriggered, CreateEmployeeListItemCompleted, CreateEmployeeListItemFailed, GetEmployeeListDetailsByIdTriggered, GetEmployeeListDetailsByIdCompleted, UpdateEmployeeListDetailsById, RefreshEmployeeListDetailsList, LoadEmployeeListItemsDetailsFailed, LoadAllEmployeeDetailsListItemsTriggered, LoadAllEmployeeDetailsListItemsCompleted } from "../actions/employee-list.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';
import { AssetService } from '../../services/assets.service';

@Injectable()
export class EmployeeListEffects {
  isNewEmployee: boolean;
  employeeItemSearchResult: EmployeeListModel;
  toastrMessage: string;
  totalCount: number;
  employeeListDetailsData: EmployeeListModel;

  @Effect()
  loadEmployeeList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeListItemsTriggered>(EmployeeListActionTypes.LoadEmployeeListItemsTriggered),
    switchMap(searchAction => {
      this.employeeItemSearchResult = searchAction.employeeListSearchResult;
      return this.assetService
        .getAllEmployees(searchAction.employeeListSearchResult)
        .pipe(map((employeeList: any) => {
          if (employeeList.success === true) {
            if(employeeList.data.length > 0)
              this.totalCount = employeeList.data[0].totalCount;
            return new LoadEmployeeListItemsCompleted(employeeList.data);
        } else {
            return new LoadEmployeeListItemsDetailsFailed(
              employeeList.apiResponseMessages
            );
        }
    }),
        catchError(error => {
            return of(new EmployeeListExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  loadAllEmployeeList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAllEmployeeDetailsListItemsTriggered>(EmployeeListActionTypes.LoadAllEmployeeDetailsListItemsTriggered),
    switchMap(searchAction => {
      this.employeeItemSearchResult = searchAction.employeeListSearchResult;
      return this.assetService
        .getAllEmployeesDetails(searchAction.employeeListSearchResult)
        .pipe(map((employeeList: any) => {
          if (employeeList.success === true) {
            if(employeeList.data.length > 0)
              this.totalCount = employeeList.data[0].totalCount;
            return new LoadAllEmployeeDetailsListItemsCompleted(employeeList.data);
        } else {
            return new LoadEmployeeListItemsDetailsFailed(
              employeeList.apiResponseMessages
            );
        }
    }),
        catchError(error => {
            return of(new EmployeeListExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeItem$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeListItemTriggered>(EmployeeListActionTypes.CreateEmployeeListItemTriggered),
    switchMap(employeeListItemTriggeredAction => {
      if (employeeListItemTriggeredAction.employee.employeeId === null || employeeListItemTriggeredAction.employee.employeeId === '' || employeeListItemTriggeredAction.employee.employeeId === undefined) {
        this.isNewEmployee = true;
        this.toastrMessage =this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForCreated);
      }
      else if (
        employeeListItemTriggeredAction.employee.employeeId !== undefined &&
        employeeListItemTriggeredAction.employee.isArchived === true
      ) {
        this.isNewEmployee = false;
        this.toastrMessage =this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForArchived);
      } else {
        this.isNewEmployee = false;
        this.toastrMessage =this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
      }
      return this.assetService
        .upsertEmployees(employeeListItemTriggeredAction.employee)
        .pipe(
          map((employeeId: any) => {
            if (employeeId.success === true) {
              return new CreateEmployeeListItemCompleted(employeeId.data);
            } else {
              return new CreateEmployeeListItemFailed(employeeId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new EmployeeListExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeelistSuccessfulAndLoadEmployeelist$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeListItemCompleted>(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
    switchMap(searchAction => {
        return of(new LoadEmployeeListItemsTriggered(this.employeeItemSearchResult));
    })
  );

  @Effect()
  upsertEmployeeListItemSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeListItemCompleted>(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  getEmployeeListDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeListDetailsByIdTriggered>(EmployeeListActionTypes.GetEmployeeListDetailsByIdTriggered),
    switchMap(searchAction => {
      return this.assetService
        .getEmployeeById(searchAction.employeeId)
        .pipe(map((employeeListDetailsData: any) => {
          if (employeeListDetailsData.success === true) {
            return new GetEmployeeListDetailsByIdCompleted(employeeListDetailsData.data);
          } else {
            return new CreateEmployeeListItemFailed(
              employeeListDetailsData.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new EmployeeListExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  refreshEmployeeList$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeListDetailsByIdCompleted>(EmployeeListActionTypes.GetEmployeeListDetailsByIdCompleted),
    switchMap(searchAction => {
      return of(new RefreshEmployeeListDetailsList(searchAction.employee))
    })
  );

  @Effect()
  showValidationMessagesForLoadEmployeeListDetails$: Observable<Action> = this.actions$.pipe(
      ofType<LoadEmployeeListItemsDetailsFailed>(EmployeeListActionTypes.LoadEmployeeListItemsDetailsFailed),
      switchMap(searchAction => {
          return of(new ShowValidationMessages({
              validationMessages: searchAction.validationMessages,
          })
          )
      })
  );

  @Effect()
  showValidationMessagesForEmployeeItem$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeListItemFailed>(EmployeeListActionTypes.CreateEmployeeListItemFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  EmployeeListExceptionHandledForEmployeeList$: Observable<Action> = this.actions$.pipe(
    ofType<EmployeeListExceptionHandled>(EmployeeListActionTypes.EmployeeListExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );


  constructor(
    private actions$: Actions,
    private assetService: AssetService,
    private translateService: TranslateService
  ) { }
}