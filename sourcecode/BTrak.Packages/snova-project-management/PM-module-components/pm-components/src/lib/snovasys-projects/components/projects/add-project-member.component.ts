// tslint:disable-next-line: ordered-imports
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
// tslint:disable-next-line: ordered-imports
import { MatMenuTrigger } from "@angular/material/menu";
import { MatOption } from "@angular/material/core";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil } from "rxjs/operators";
import { tap } from "rxjs/operators";
import * as _ from "underscore";
import { ProjectMember } from "../../models/projectMember";
// tslint:disable-next-line: ordered-imports
import { User } from "../../models/user";
// tslint:disable-next-line: ordered-imports
import { LoadEntityRolesTriggered } from "../../store/actions/entity-roles.actions";
// tslint:disable-next-line: ordered-imports
import { CreateProjectMemberTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
// tslint:disable-next-line: ordered-imports
import { LoadUsersTriggered, UserActionTypes } from "../../store/actions/users.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { EntityRoleModel } from '../../models/entity-role-model';

@Component({
  selector: "app-pm-component-add-projectmember",
  templateUrl: "add-project-member.component.html"
})
export class AddProjectMemberComponent implements OnInit {

  @Input("projectId")
  set projectId(projectId: string) {
    this._projectId = projectId;
  }
  @Input("clearProjectForm")
  set _clearProjectForm(clearProjectForm: boolean) {
    this.clearProjectForm = clearProjectForm;
    this.clearProjectMemberForm();
  }
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("allRolesSelected") private allRolesSelected: MatOption;
  @Output() closePopup = new EventEmitter<string>();
  @Output() getProjectMembersCount = new EventEmitter<string>();

  allUsers$: Observable<User[]>;
  projectMembers$: Observable<ProjectMember[]>;
  projectMemberData: ProjectMember;
  allRoles$: Observable<EntityRoleModel[]>;
  anyOperationInProgress$: Observable<boolean>;
  projectMembers: ProjectMember[];
  UsersList: User[];
  loadprojectMember: boolean;
  private _projectId: string;
  clearProjectForm: boolean;
  projectMemberForm: FormGroup;
  selectedMember: string;
  selectedRoles: string;
  allProjectRoles: any[];
  public ngDestroyed$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private actionUpdates$: Actions
  ) {
    this.store.dispatch(new LoadEntityRolesTriggered());
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.CreateProjectMembersCompleted),
        tap(() => {
          this.closedialog();
          this.getProjectMembersCount.emit("");
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.DeleteProjectMembersCompleted),
        tap(() => {
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserActionTypes.LoadUsersCompleted),
        tap(() => {
          this.allUsers$ = this.store.pipe(select(projectModuleReducer.getUsersAll));
          this.allUsers$.subscribe((user) => (this.UsersList = user));
        })
      )
      .subscribe();

  }

  ngOnInit(): void {
    this.clearProjectMemberForm();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.CreateProjectMembersLoading)
    );

    this.store.dispatch(new LoadUsersTriggered());
    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducer.getProjectMembersAll)
    );
    this.projectMembers$.subscribe((members) => (this.projectMembers = members));
    this.store.dispatch(new LoadEntityRolesTriggered());
    this.allRoles$ = this.store.pipe(select(projectModuleReducer.getEntityRolesAll));
    this.allRoles$.subscribe((roleIds)=>(this.allProjectRoles = roleIds));
  }

  clearProjectMemberForm() {
    this.selectedMember = null;
    this.selectedRoles = null;
    this.projectMemberForm = this.fb.group({
      roleIds: new FormControl("", [Validators.required]),
      userIds: new FormControl("", [Validators.required])
    });
  }

  addNewMember() {
    this.loadprojectMember = true;
  }

  toggleGoalStatusPerOne(all) {
    const allUsers = this.UsersList;
    const memberIds = this.projectMembers.map((item) => item.projectMember.id);
    // tslint:disable-next-line: only-arrow-functions
    this.UsersList = _.filter(allUsers, function(s) {
      return !memberIds.includes(s.id);
    });
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.projectMemberForm.controls.userIds.value.length ===
      this.UsersList.length
    ) {
      this.allSelected.select();
    }

  }

  toggleAllGoalStatusSelection() {
    if (this.allSelected.selected) {
      const memberIds = this.projectMembers.map((item) => item.projectMember.id);
      const allUsers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      this.UsersList = _.filter(allUsers, function(s) {
        return !memberIds.includes(s.id);
      });
      if (this.UsersList.length === 0) {
        this.projectMemberForm.controls.userIds.patchValue([]);
      } else {
        this.projectMemberForm.controls.userIds.patchValue([
          ...this.UsersList.map((item) => item.id),
          0
        ]);
      }

    } else {
      this.projectMemberForm.controls.userIds.patchValue([]);
    }
    this.getSelectedMembers();
  }

  getSelectedMembers() {
    const component = this.projectMemberForm.value.userIds;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const usersList = this.UsersList;
    // tslint:disable-next-line: only-arrow-functions
    const selectedUsersList = _.filter(usersList, function(user) {
      return component.toString().includes(user.id);
    })
    const userNames = selectedUsersList.map((x) => x.fullName);
    this.selectedMember = userNames.toString();
  }

  SaveProjectMember(projectMemberData) {
    if (projectMemberData === undefined || projectMemberData == null) {
      this.projectMemberData = this.projectMemberForm.value;
      this.projectMemberData.roleIds = this.projectMemberForm.controls['roleIds'].value;      
      this.projectMemberData.projectId = this._projectId;
    } else {
      this.projectMemberData = projectMemberData;
    }
    this.store.dispatch(
      new CreateProjectMemberTriggered(this.projectMemberData)
    );
  }

  compareSelecteddaysFn(shiftOptionsList: any, selectedDay: any) {
    if (shiftOptionsList === selectedDay) {
        return true;
    } else {
        return false;
    }
}

toggleAllRolesSelected() {
  if (this.allRolesSelected.selected) {
    this.projectMemberForm.controls['roleIds'].patchValue([
      0,...this.allProjectRoles.map(item => item.entityRoleId)
    ]);      
  } else {
      this.projectMemberForm.controls['roleIds'].patchValue([]);
  }
  this.getSelectedRoles();
}

getSelectedRoles() {
  const component = this.projectMemberForm.value.roleIds;
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
  if (this.projectMemberForm.controls['roleIds'].value.length === this.allProjectRoles.length)
      this.allRolesSelected.select();
}



  closedialog() {
    this.formGroupDirective.resetForm();
    this.closePopup.emit("");
    this.clearProjectMemberForm();
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
