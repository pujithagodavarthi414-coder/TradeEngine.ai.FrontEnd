import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import {
  ProjectActionTypes,
  LoadProjectsCompleted,
  CreateProjectTriggered,
  CreateProjectCompleted,
  LoadProjectsTriggered,
  EditProjectTriggered,
  EditProjectCompleted,
  CreateProjectFailed,
  ArchiveProjectTriggered,
  ArchiveProjectCompleted,
  ArchiveProjectFailed,
  ProjectExceptionHandled,
  GetProjectByIdTriggered,
  GetProjectByIdCompleted,
  RefreshProjectsList,
  ProjectCompletedWithInPlaceUpdate,
  EditProjectsFailed,
  LoadProjectsFailed,
  ProjectEditTriggered,
  ProjectEditCompleted,
  ProjectEditFailed
} from "../actions/project.actions";
import { Action, State } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ProjectService } from "../../services/projects.service";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { Project } from "../../models/project";
import { ProjectsModule } from "../../projects.module";
import { TranslateService } from "@ngx-translate/core";
import { Store, select } from "@ngrx/store";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Injectable()
export class ProjectEffects {
  ProjectSearchResult: ProjectSearchCriteriaInputModel;
  isArchived: boolean;
  toastrMessage: string;
  projectId: string;
  project: Project;
  isNewProject: boolean;
  projectLabel: string;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabel: SoftLabelConfigurationModel[];

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProjectsTriggered>(ProjectActionTypes.LoadProjectsTriggered),
    switchMap(searchAction => {
      {
        this.ProjectSearchResult = searchAction.projectsSearchResult;
        return this.projectService
          .searchProjects(searchAction.projectsSearchResult)
          .pipe(
            map((projects: any) => {
              if (projects.success) {
                return new LoadProjectsCompleted(projects.data)
              }
              else {
                return new LoadProjectsFailed(projects.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new ProjectExceptionHandled(err));
            })
          );
      }
    })
  );

  @Effect()
  EditProjectById$: Observable<Action> = this.actions$.pipe(
    ofType<EditProjectTriggered>(ProjectActionTypes.EditProjectTriggered),
    switchMap(searchAction => {
      return this.projectService.GetProjectById(searchAction.projectId).pipe(
        map((projects: any) => {
          if (projects.success === true) {
            this.projectId = projects.data;
            return new EditProjectCompleted(projects.data);
          } else {
            return new EditProjectsFailed(projects.apiResponseMessages);
          }
        }),
        catchError(err => {
          return of(new ProjectExceptionHandled(err));
        })
      );
    })
  );


  @Effect()
  ProjectEditById$: Observable<Action> = this.actions$.pipe(
    ofType<ProjectEditTriggered>(ProjectActionTypes.ProjectEditTriggered),
    switchMap(searchAction => {
      return this.projectService.GetProjectById(searchAction.projectId).pipe(
        map((projects: any) => {
          if (projects.success === true) {
            this.projectId = projects.data;
            return new ProjectEditCompleted(projects.data);
          } else {
            return new ProjectEditFailed(projects.apiResponseMessages);
          }
        }),
        catchError(err => {
          return of(new ProjectExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  upsertProject$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProjectTriggered>(ProjectActionTypes.CreateProjectTriggered),
    switchMap(projectTriggeredAction => {
      if (
        projectTriggeredAction.project.projectId === undefined ||
        projectTriggeredAction.project.projectId === null ||
        projectTriggeredAction.project.projectId === ""
      ) {
        this.isNewProject = true;
        this.toastrMessage =
          projectTriggeredAction.project.projectName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForProjectCreate);
        this.toastrMessage = this.softLabelPipe.transform(this.toastrMessage, this.softLabel);
      } else {
        this.isNewProject = false;
        this.toastrMessage =
          projectTriggeredAction.project.projectName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForProjectUpdate);
        this.toastrMessage = this.softLabelPipe.transform(this.toastrMessage, this.softLabel);
      }

      return this.projectService
        .upsertProject(projectTriggeredAction.project)
        .pipe(
          map((projects: any) => {
            if (projects.success === true) {
              this.projectId = projects.data;
              return new CreateProjectCompleted(projects);
            } else {
              return new CreateProjectFailed(projects.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archiveProject$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveProjectTriggered>(ProjectActionTypes.ArchiveProjectTriggered),
    switchMap(projectTriggeredAction => {
      if (projectTriggeredAction.archivedProject.isArchive === true) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForProjectArchive)
        this.toastrMessage = this.softLabelPipe.transform(this.toastrMessage, this.softLabel);
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForProjectUnArchive)
        this.toastrMessage = this.softLabelPipe.transform(this.toastrMessage, this.softLabel);
      }
      return this.projectService
        .archiveProject(projectTriggeredAction.archivedProject)
        .pipe(
          map((projectId: any) => {
            if (projectId.success === true) {
              return new ArchiveProjectCompleted(projectTriggeredAction.archivedProject.projectId);
            } else {
              return new ArchiveProjectFailed(projectId.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  upsertProjectSuccessfulAndLoadProjects$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectCompleted>(ProjectActionTypes.CreateProjectCompleted),
    pipe(
      map(() => {
        return new GetProjectByIdTriggered(this.projectId);
      })
    )
  );



  @Effect()
  upsertProjectSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProjectCompleted>(ProjectActionTypes.CreateProjectCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success),
            config: {
              panelClass: "toaster-alignment"
            }
          })
      )
    )
  );


  @Effect()
  getProjectById$: Observable<Action> = this.actions$.pipe(
    ofType<GetProjectByIdTriggered>(
      ProjectActionTypes.GetProjectByIdTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectService
        .GetProjectById(projectTriggeredAction.projectId)
        .pipe(
          map((project: any) => {
            if (project.success === true) {
              this.project = project.data;
              return new GetProjectByIdCompleted(project.data);
            } else {
              return new CreateProjectFailed(project.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ProjectExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  updateProjectSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetProjectByIdCompleted>(
      ProjectActionTypes.GetProjectByIdCompleted
    ),
    pipe(
      map(() => {
        if (this.isNewProject) {
          return new RefreshProjectsList(this.project);
        } else {
          return new ProjectCompletedWithInPlaceUpdate({
            projectUpdate: {
              id: this.project.projectId,
              changes: this.project
            }
          });
        }

      })
    )
  );


  @Effect()
  upsertProjectArchiveSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveProjectCompleted>(ProjectActionTypes.ArchiveProjectCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success),
            config: {
              panelClass: "toaster-alignment"
            }
          })
      )
    )
  );


  @Effect()
  showValidationMessagesForProject$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectFailed>(
      ProjectActionTypes.CreateProjectFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEditProject$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<EditProjectsFailed>(
      ProjectActionTypes.EditProjectsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForProjectEdit$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectEditFailed>(
      ProjectActionTypes.ProjectEditFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveProject$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveProjectFailed>(
      ProjectActionTypes.ArchiveProjectFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForProjectList$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadProjectsFailed>(
      ProjectActionTypes.LoadProjectsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  ProjectExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectExceptionHandled>(
      ProjectActionTypes.ProjectExceptionHandled
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
    private projectService: ProjectService,
    private translateService: TranslateService,
    private softLabelPipe: SoftLabelPipe
  ) {
      this.softLabel = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }
}
