// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, ChangeDetectorRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatOption } from "@angular/material/core";
// tslint:disable-next-line: ordered-imports
import { Router } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { Observable, Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { takeUntil } from "rxjs/operators";
import { tap } from "rxjs/operators";

// tslint:disable-next-line: ordered-imports
import { Project } from "../../models/project";
import { ProjectMember } from "../../models/projectMember";
import { LoadEntityRolesTriggered } from "../../store/actions/entity-roles.actions";
// tslint:disable-next-line: ordered-imports
import { CreateProjectMemberTriggered, DeleteProjectMembersTriggered, LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { ProjectSummaryTriggered } from "../../store/actions/project-summary.action";
// tslint:disable-next-line: ordered-imports
import { EditProjectTriggered, ProjectActionTypes } from "../../store/actions/project.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import * as _ from "underscore";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleModel } from '../../models/entity-role-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-component-members",
  templateUrl: "members.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .project-members-height {
      height: calc(100vh - 165px);
    }
  `]
})
export class MembersComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("projectId")
  set _projectId(projectId: string) {
    this.projectId = projectId;
    this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
    this.store.dispatch(new EditProjectTriggered(this.projectId));
  }

  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("addMemberPopover") addMemberPopUp: SatPopover;
  @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
  @ViewChild("updateRolePopover") editMemberPopUp: SatPopover;
  @ViewChild("projectMemberPopover")projectMemberPopUp: SatPopover;
  @ViewChildren("membersEditPopup") editMemberComponentPopovers;
  @ViewChildren("deleteMemberComponentPopover") deleteMemberComponentPopovers;
  @Output() getProjectMembersCount = new EventEmitter<string>();
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  anyOperationInProgress$: Observable<boolean>;
  membersOperationInProgress$: Observable<boolean>;
  allRoles$: Observable<EntityRoleModel[]>;
  projectMembers$: Observable<ProjectMember[]>;
  project$: Observable<Project>;
  softLabels: SoftLabelConfigurationModel[];
  projectMembers: ProjectMember[];
  membersCount$: Observable<number>;
  loadprojectMember: boolean;
  clearProjectForm = false;
  MembersLoop = Array;
  membersLoaderNumber = 8;
  projectLabel: string;
  projectMemberEditForm: FormGroup;
  projectMember: ProjectMember;
  projectMemberModel: ProjectMember;
  clearProjectMemberForm: boolean;
  project: Project;
  projectMemberData: ProjectMember;
  searchText: string;
  allProjectRoles: any[];
  projectMemberId: string;
  isProjectResponsiblePerson: boolean;
  isCurrentlyLoggedUser: boolean;
  public ngDestroyed$ = new Subject();
  selectedRoles: string
  projectId: string;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private actionUpdates$: Actions,
    private cookieService: CookieService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.store.dispatch(new LoadEntityRolesTriggered());
    this.getSoftLabels();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.CreateProjectMembersCompleted),
        tap(() => {
          this.closeEditMemberdialog();
          this.formGroupDirective.resetForm();
          this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.DeleteProjectMembersCompleted),
        tap(() => {
          this.closeDeleteMemberdialog();
          if (this.isCurrentlyLoggedUser) {
            this.router.navigate([
              "projects/allprojects"
            ]);
          } else {
            this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.EditProjectsCompleted),
        tap(() => {
          this.project$ = this.store.select(projectModuleReducer.EditProjectById)
          this.project$.subscribe((project) => this.project = project);
        })
      )
      .subscribe();

    // this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(softLabelsActionTypes.GetsoftLabelsCompleted),
    //     tap(() => {
    //       this.getSoftLabels();
    //     })
    //   )
    //   .subscribe();
  }

  ngOnInit() {
    // TODO: Pipe on multiple selects, we should be able to add other validation messages
    super.ngOnInit();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.CreateProjectMembersLoading)
    );
    this.membersOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.getProjectMembersLoading)
    );
    this.allRoles$ = this.store.pipe(select(projectModuleReducer.getEntityRolesAll));
    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducer.getProjectMembersAll)
    );
    this.membersCount$ = this.store.pipe(select(projectModuleReducer.getProjectMemberCount));
    this.allRoles$.subscribe((roles) => (this.allProjectRoles = roles));
    this.clearEditForm();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  compareSelectedRolesFn(roles: any, selectedroles: any) {
    if (roles === selectedroles) {
      return true;
    } else {
      return false;
    }
  }

  clearEditForm() {
    this.selectedRoles = null;
    this.projectMemberEditForm = this.fb.group({
      roles: new FormControl([], [Validators.required])
    });
  }

  closeSearch() {
    this.searchText = "";
  }

  UpdateRole(member, editPopOver) {
    let roleIds = [];
    if (member.allRoleIds != null) {
      if (member.allRoleIds.length === this.allProjectRoles.length) {
        roleIds.push(0);
      }
      member.roleIds.split(',').forEach(element => {
        roleIds.push(element);
      });
    }
    if (member.allRoleNames != null) {
      this.selectedRoles = member.allRoleNames.toString();
    }
    //this.projectMemberEditForm.controls['roles'].patchValue(roleIds);    
    this.projectMember = member;
    this.projectMemberEditForm = this.fb.group({
      roles: new FormControl(roleIds, [Validators.required])
    });
    editPopOver.openPopover();
  }

  UpdateProjectMember() {
    const array = [];
    array.push(this.projectMember.projectMember.id);
    this.projectMemberData = this.projectMemberEditForm.value;
    this.projectMemberData.userId = this.projectMember.projectMember.id;
    this.projectMemberData.userIds = array;
    this.projectMemberData.timestamp = this.projectMember.timestamp;
    this.projectMemberData.projectId = this.projectId;
    this.projectMemberData.projectMemberId = this.projectMember.id;
    this.projectMemberData.roleIds = this.projectMemberEditForm.value.roles;
    if (this.projectMemberData.roleIds != null) {
      var index = this.projectMemberData.roleIds.indexOf(0);
      if (index > -1) {
        this.projectMemberData.roleIds.slice(index, 1);
      }
    }
    this.store.dispatch(
      new CreateProjectMemberTriggered(this.projectMemberData)
    );
  }

  closeEditMemberdialog() {
    this.editMemberComponentPopovers.forEach((p) => p.closePopover());

  }

  closeDeleteMemberdialog() {
    this.deleteMemberComponentPopovers.forEach((p) => p.closePopover());

  }

  deleteProjectMember(projectMember, deleteMemberComponentPopover) {
    if (this.project.projectResponsiblePersonId === projectMember.projectMember.id) {
      this.isProjectResponsiblePerson = true;
    } else {
      this.isProjectResponsiblePerson = false;
    }

    if (projectMember.projectMember.id === this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
      this.isCurrentlyLoggedUser = true;
    } else {
      this.isCurrentlyLoggedUser = false;
    }
    const projectMemberModel = new ProjectMember();
    projectMemberModel.projectId = projectMember.projectId;
    projectMemberModel.userId = projectMember.projectMember.id;
    this.projectMemberModel = projectMemberModel;
    deleteMemberComponentPopover.openPopover();

  }
  compareSelecteddaysFn(shiftOptionsList: any, selectedDay: any) {
    // this.selectedRoles = selectedDay ; 
    if (shiftOptionsList === selectedDay) {
      return true;
    } else {
      return false;
    }
  }

  toggleAllRolesSelected() {
    if (!this.allRolesSelected.selected) {
      this.projectMemberEditForm.controls['roles'].patchValue([]);

    } else {
      this.projectMemberEditForm.controls['roles'].patchValue([
        ...this.allProjectRoles.map(item => item.entityRoleId), 0
      ]);
    }
    this.getSelectedRoles();
  }

  getSelectedRoles() {
    const component = this.projectMemberEditForm.value.roles;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const rolesList = this.allProjectRoles;
    const selectedUsersList = _.filter(rolesList, function (role: any) {
      return component.toString().includes(role.entityRoleId);
    })
    const roleNames = selectedUsersList.map((x) => x.entityRoleName);
    this.selectedRoles = roleNames.toString();
  }

  toggleUserPerOne() {
    if (this.allRolesSelected.selected) {
      this.allRolesSelected.deselect();
      return false;
    }
    if (this.projectMemberEditForm.controls['roles'].value.length === this.allProjectRoles.length) {
      this.allRolesSelected.select();
    }
    this.getSelectedRoles();
  }

  deleteMember() {
    this.store.dispatch(new DeleteProjectMembersTriggered(this.projectMemberModel));
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  deleteMemberPopoverClose(){
    
    this.deleteMemberComponentPopovers.forEach((p) => p.closePopover());
  }

  createProjectMember() {
    this.loadprojectMember = true;
    this.clearProjectMemberForm = !this.clearProjectMemberForm;
    this.projectMemberPopUp.open();
  }

  closeProjectMemberDialog() {
    this.projectMemberPopUp.close();
  }

  selectedMember(id){
    this.router.navigate(["dashboard/profile", id, "overview"]);
  }
}
