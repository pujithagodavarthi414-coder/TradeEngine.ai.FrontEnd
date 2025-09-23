import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import {
  LoadFeatureProjectsCompleted,
  ProjectFeaturesActionTypes,
  LoadFeatureProjectsTriggered,
  CreateProjectFeatureTriggered,
  CreateProjectFeatureCompleted,
  CreateProjectFeatureFailed,
  ProjectFeaturesExceptionHandled,
  GetProjectFeatureByIdTriggered,
  GetProjectFeatureByIdCompleted,
  RefreshProjectFeaturesList,
  UpdateProjectFeature,
  GetProjectFeatureByIdFailed,
  ArchiveProjectFeatureTriggered,
  ArchiveProjectFeatureCompleted,
  ArchiveProjectFeatureFailed
} from "../actions/project-features.actions";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ProjectFeatureService } from "../../services/projectFeature.service";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ProjectFeature } from "../../models/projectFeature";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";

import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class ProjectFeatureEffects {
  projectFeature: ProjectFeature;
  projectFeatureId: string;
  toastrMessage: string;
  isNewProjectFeature:boolean;

  @Effect()
  loadProjectsFeature$: Observable<Action> = this.actions$.pipe(
    ofType<LoadFeatureProjectsTriggered>(
      ProjectFeaturesActionTypes.LoadProjectFeaturesTriggered
    ),
    switchMap(loadFeatureProjectsTriggered => {
      this.projectFeature = loadFeatureProjectsTriggered.projectFeature;
      return this.projectFeatureService
        .GetAllProjectFeatures(loadFeatureProjectsTriggered.projectFeature)
        .pipe(
          map((projectFeatures: any) => {
            if(projectFeatures.success){
              return new LoadFeatureProjectsCompleted(projectFeatures.data);
            }
            else{
              return new CreateProjectFeatureFailed(projectFeatures.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectFeaturesExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertProjectFeature$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProjectFeatureTriggered>(
      ProjectFeaturesActionTypes.CreateProjectFeaturesTriggered
    ),
    switchMap(projectTriggeredAction => {
      if (
        projectTriggeredAction.projectFeature.projectFeatureId === undefined ||
        projectTriggeredAction.projectFeature.projectFeatureId === null ||
        projectTriggeredAction.projectFeature.projectFeatureId === ""
      ) {
        this.isNewProjectFeature = true;
        this.toastrMessage =
          projectTriggeredAction.projectFeature.projectFeatureName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForProjectFeatureCreate);
      } else {
        this.isNewProjectFeature = false;
        this.toastrMessage =
          projectTriggeredAction.projectFeature.projectFeatureName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForProjectFeatureUpdate);
      }
      return this.projectFeatureService
        .UpsertProjectFeature(projectTriggeredAction.projectFeature)
        .pipe(
          map((projectFeature: any) => {
            if (projectFeature.success === true) {
              this.projectFeatureId = projectFeature.data;
              return new CreateProjectFeatureCompleted(projectFeature.data);
            } else {
              return new CreateProjectFeatureFailed(
                projectFeature.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new ProjectFeaturesExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertProjectFeaturesSuccessfulAndLoadProjectFeatureById$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectFeatureCompleted>(
      ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted
    ),
    pipe(
      map(() => {
        return new GetProjectFeatureByIdTriggered(this.projectFeatureId);
      })
    )
  );

  @Effect()
  getProjectFeatureByIdTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<GetProjectFeatureByIdTriggered>(
      ProjectFeaturesActionTypes.GetProjectFeatureByIdTriggered
    ),
    switchMap(loadFeatureProjectsTriggered => {
      return this.projectFeatureService
        .getProjectFeatureById(loadFeatureProjectsTriggered.projectFeatureId)
        .pipe(
          map((projectFeatures: any) => {
            if(projectFeatures.success){
              this.projectFeature = projectFeatures.data;
              return new GetProjectFeatureByIdCompleted(projectFeatures.data);
            }
            else{
              return new GetProjectFeatureByIdFailed(projectFeatures.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectFeaturesExceptionHandled(err));
          })
        );
    })
  );

  
  @Effect()
  getProjectFeatureByIdSuccessfulAndLoadProjectFeatures$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetProjectFeatureByIdCompleted>(
      ProjectFeaturesActionTypes.GetProjectFeatureByIdCompleted
    ),
    pipe(
      map(() => {
        if(this.isNewProjectFeature){
            return new RefreshProjectFeaturesList(this.projectFeature)
        }
        else{
          return new UpdateProjectFeature({
            projectFeatureUpdate: {
              id: this.projectFeature.projectFeatureId,
              changes: this.projectFeature
            }
          });
        }
      })
    )
  );

  @Effect()
  upsertProjectFeatureSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProjectFeatureCompleted>(
      ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted
    ),
    map(
      () =>
        new SnackbarOpen({
          message: this.toastrMessage, // TODO: Change to proper toast message
          action: this.translateService.instant(ConstantVariables.success)
        })
    )
  );

  @Effect()
  archiveProjectFeatureTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveProjectFeatureTriggered>(
      ProjectFeaturesActionTypes.ArchiveProjectFeatureTriggered
    ),
    switchMap(loadFeatureProjectsTriggered => {
       if(loadFeatureProjectsTriggered.projectFeature.IsDelete){
         this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForProjectFeatureDelete);
       }
       else{
         this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForProjectFeatureUnArchive)
       }
      return this.projectFeatureService
        .UpsertProjectFeature(loadFeatureProjectsTriggered.projectFeature)
        .pipe(
          map((projectFeatures: any) => {
            if(projectFeatures.success){
              this.projectFeature = projectFeatures.data;
              return new ArchiveProjectFeatureCompleted(projectFeatures.data);
            }
            else{
              return new ArchiveProjectFeatureFailed(projectFeatures.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectFeaturesExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForProjectFeature$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectFeatureFailed>(
      ProjectFeaturesActionTypes.CreateProjectFeaturesFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForProjectFeatureById$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetProjectFeatureByIdFailed>(
      ProjectFeaturesActionTypes.GetProjectFeatureByIdFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveProjectFeature$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveProjectFeatureFailed>(
      ProjectFeaturesActionTypes.ArchiveProjectFeatureFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  ProjectFeaturesExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectFeaturesExceptionHandled>(
      ProjectFeaturesActionTypes.ProjectFeaturesExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private projectFeatureService: ProjectFeatureService,
    private translateService: TranslateService
  ) {}
}
