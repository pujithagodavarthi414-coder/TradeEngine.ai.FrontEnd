import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import {
  LoadMemberProjectsCompleted,
  ProjectMembersActionTypes,
  LoadMemberProjectsTriggered,
  CreateProjectMemberTriggered,
  CreateProjectMemberFailed,
  CreateProjectMemberCompleted,
  ProjectMembersExceptionHandled,
  DeleteProjectMembersTriggered,
  DeleteProjectMembersCompleted,
  DeleteProjectMembersFailed,
  LoadProjectMembersFailed,
  GetProjectMemberByIdTriggered,
  GetProjectMemberByIdCompleted,
  GetProjectMemberByIdFailed,
  UpdateProjectMemberList,
  GetNewProjectMembersList,
  RefreshProjectMembersList
} from "../actions/project-members.actions";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ProjectMemberService } from "../../services/project-member.service";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { ProjectMember } from "../../models/projectMember";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { ArchiveUnArchiveGoalCompleted } from '../actions/goal.actions';

@Injectable()
export class ProjectMemberEffects {
  toastrMessage: string;
  projectId: string;
  isNewMember:boolean;
  projectMemberId:string;
  projectMember:ProjectMember;
  projectMemberIds:string[];
  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType<LoadMemberProjectsTriggered>(
      ProjectMembersActionTypes.LoadProjectMembersTriggered
    ),
    switchMap(loadMemberProjectsTriggered => {
      return this.projectMemberService
        .getAllProjectMembers(loadMemberProjectsTriggered.projectId)
        .pipe(
          map((projectMembers: any) => {
            if(projectMembers.success){
              this.projectId = loadMemberProjectsTriggered.projectId;
              return new LoadMemberProjectsCompleted(projectMembers.data);
            }
           else{
            return new LoadProjectMembersFailed(
              projectMembers.apiResponseMessages
            );
           }
          }),
          catchError(err => {
            return of(new ProjectMembersExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertProjectMember$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProjectMemberTriggered>(
      ProjectMembersActionTypes.CreateProjectMembersTriggered
    ),
    switchMap(projectTriggeredAction => {
      if (
        projectTriggeredAction.projectMember.projectMemberId === undefined ||
        projectTriggeredAction.projectMember.projectMemberId === null ||
        projectTriggeredAction.projectMember.projectMemberId === ""
      ) {
        this.isNewMember = true;
        this.projectMemberId = null;
        this.toastrMessage = this.translateService.instant('MEMBER.PROJECTMEMBERCREATEDSUCCESSFULLY');
        
      } else {
        this.isNewMember = false;
        this.projectMemberId = projectTriggeredAction.projectMember.projectMemberId;
        this.toastrMessage =  this.translateService.instant('MEMBER.PROJECTMEMBERUPDATEDSUCCESSFULLY');
      }
      //this.projectId = projectTriggeredAction.projectMember.projectId;
      return this.projectMemberService
        .upsertProjectMember(projectTriggeredAction.projectMember)
        .pipe(
          map((projectId: any) => {
            if (projectId.success === true) {
             this.projectMemberIds = projectId.data;
              return new CreateProjectMemberCompleted(projectId);
            } else {
              return new CreateProjectMemberFailed(
                projectId.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new ProjectMembersExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  deleteProjectMember$:Observable<Action> = this.actions$.pipe(
    ofType<DeleteProjectMembersTriggered>(
      ProjectMembersActionTypes.DeleteProjectMembersTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectMemberService
        .deleteProjectMember(projectTriggeredAction.projectMember)
        .pipe(
          map((projectMember: any) => {
            if (projectMember.success === true) {
              if(projectMember.data.textMessage){
                  this.toastr.warning('',projectMember.data.textMessage);
              }
              this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForProjectMemberDeletion)
              return new DeleteProjectMembersCompleted(projectTriggeredAction.projectMember.userId);
            } else {
              return new DeleteProjectMembersFailed(
                projectMember.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new ProjectMembersExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  upsertProjectMemberSuccessfulAndLoadProjectMembers$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectMemberCompleted>(
      ProjectMembersActionTypes.CreateProjectMembersCompleted
    ),
    pipe(
      map(() => {
        if(this.isNewMember){
          var projectMember = new ProjectMember();
          projectMember.projectId = this.projectId;
          projectMember.projectMemberIds = this.projectMemberIds;
          return new GetNewProjectMembersList(projectMember);
        }
        else{
          if(this.projectMemberId && this.projectId) {
            return new GetProjectMemberByIdTriggered(this.projectMemberId,this.projectId);
          } else {
            return new ArchiveUnArchiveGoalCompleted();
          }
         
        }
      })
    )
  );

  @Effect()
  loadProjectsMembers$: Observable<Action> = this.actions$.pipe(
    ofType<GetNewProjectMembersList>(
      ProjectMembersActionTypes.GetNewProjectMembersList
    ),
    switchMap(loadMemberProjectsTriggered => {
      return this.projectMemberService
        .getProjectMembers(loadMemberProjectsTriggered.projectMember)
        .pipe(
          map((projectMembers: any) => {
            if(projectMembers.success){
              return new RefreshProjectMembersList(projectMembers.data);
            }
           else{
            return new LoadProjectMembersFailed(
              projectMembers.apiResponseMessages
            );
           }
          }),
          catchError(err => {
            return of(new ProjectMembersExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getProjectMemberById$:Observable<Action> = this.actions$.pipe(
    ofType<GetProjectMemberByIdTriggered>(
      ProjectMembersActionTypes.GetProjectMemberByIdTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectMemberService
        .getProjectMemberById(projectTriggeredAction.projectMemberId,projectTriggeredAction.projectId)
        .pipe(
          map((projectId: any) => {
            if (projectId.success === true) {
              this.projectMember = projectId.data;
              return new GetProjectMemberByIdCompleted(projectId.data);
            } else {
              return new GetProjectMemberByIdFailed(
                projectId.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new ProjectMembersExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getProjectMemberByIdSuccessfulAndLoadProjectMembers$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetProjectMemberByIdCompleted>(
      ProjectMembersActionTypes.GetProjectMemberByIdCompleted
    ),
    pipe(
      map(() => {
       
          return new UpdateProjectMemberList({
            projectMemberUpdate: {
              id: this.projectMember.id,
              changes: this.projectMember
            }
          });
        
      })
    )
  );


  
  @Effect()
  showValidationMessagesForProjectMembers$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateProjectMemberFailed>(
      ProjectMembersActionTypes.CreateProjectMembersFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForProjectMembersLoad$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadProjectMembersFailed>(
      ProjectMembersActionTypes.LoadProjectMembersFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  
  @Effect()
  showValidationMessagesForDeleteProjectMembers$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<DeleteProjectMembersFailed>(
      ProjectMembersActionTypes.DeleteProjectMembersFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  ProjectMembersExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectMembersExceptionHandled>(
      ProjectMembersActionTypes.ProjectMembersExceptionHandled
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
    private projectMemberService: ProjectMemberService,
    private translateService: TranslateService,
    private toastr: ToastrService
  ) {}
}
