import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeListModel } from '../../models/employee-model';
import { EmployeeListActionTypes, LoadEmployeeListItemsTriggered,
   EmployeeListExceptionHandled, CreateEmployeeListItemTriggered, CreateEmployeeListItemCompleted, CreateEmployeeListItemFailed,
    GetEmployeeListDetailsByIdTriggered, GetEmployeeListDetailsByIdCompleted, RefreshEmployeeListDetailsList,
     LoadEmployeeListItemsDetailsFailed, LoadAllEmployeeDetailsListItemsTriggered, LoadAllEmployeeDetailsListItemsCompleted, RecruitmentLoadEmployeeListItemsCompleted } from '../actions/employee-list.action';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';
import { RecruitmentService } from '../../services/recruitment.service';

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
      return this.recruitmentService
        .getAllEmployees(searchAction.employeeListSearchResult)
        .pipe(map((employeeList: any) => {
          if (employeeList.success === true) {
            if (employeeList.data.length > 0) {
              this.totalCount = employeeList.data[0].totalCount;
            }
            return new RecruitmentLoadEmployeeListItemsCompleted(employeeList.data);
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
      return this.recruitmentService
        .getAllEmployeesDetails(searchAction.employeeListSearchResult)
        .pipe(map((employeeList: any) => {
          if (employeeList.success === true) {
            if (employeeList.data.length > 0) {
              this.totalCount = employeeList.data[0].totalCount; }
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
      if (employeeListItemTriggeredAction.employee.employeeId === null
         || employeeListItemTriggeredAction.employee.employeeId === ''
         || employeeListItemTriggeredAction.employee.employeeId === undefined) {
        this.isNewEmployee = true;
      } else if (
        employeeListItemTriggeredAction.employee.employeeId !== undefined &&
        employeeListItemTriggeredAction.employee.isArchived === true
      ) {
        this.isNewEmployee = false;
      } else {
        this.isNewEmployee = false;
      }
      return this.recruitmentService
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
  getEmployeeListDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeListDetailsByIdTriggered>(EmployeeListActionTypes.GetEmployeeListDetailsByIdTriggered),
    switchMap(searchAction => {
      return this.recruitmentService
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
      return of(new RefreshEmployeeListDetailsList(searchAction.employee));
    })
  );

  @Effect()
  showValidationMessagesForLoadEmployeeListDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeListItemsDetailsFailed>(EmployeeListActionTypes.LoadEmployeeListItemsDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      );
    })
  );

  @Effect()
  showValidationMessagesForEmployeeItem$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeListItemFailed>(EmployeeListActionTypes.CreateEmployeeListItemFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      );
    })
  );

  @Effect()
  EmployeeListExceptionHandledForEmployeeList$: Observable<Action> = this.actions$.pipe(
    ofType<EmployeeListExceptionHandled>(EmployeeListActionTypes.EmployeeListExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      );
    })
  );


  constructor(
    private actions$: Actions,
    private recruitmentService: RecruitmentService,
    private translateService: TranslateService
  ) { }
}
