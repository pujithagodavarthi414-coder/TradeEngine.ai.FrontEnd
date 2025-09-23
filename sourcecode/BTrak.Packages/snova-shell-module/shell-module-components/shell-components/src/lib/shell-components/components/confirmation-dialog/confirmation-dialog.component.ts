import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { ClearDemoDataTriggred, AuthenticationActionTypes } from "../../store/actions/authentication.actions";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject, Observable } from "rxjs";
import * as sharedModuleReducers from '../../store/reducers/index';
import { GetAllMenuItemsTriggered } from "../../store/actions/menuitems.actions";
import { MenuCategories } from '../../constants/menu-categories';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { WorkspaceList } from '../../models/workspaceList';
import { CommonService } from '../../services/common-used.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { WINDOW } from '../../../globaldependencies/helpers/window.helper';

/** @dynamic */

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html"
})

export class ConfirmationDialogComponent implements OnInit {

  public ngDestroyed$ = new Subject();
  public demoDataDeletionLoading$: Observable<boolean>;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, private route: ActivatedRoute,
    private store: Store<State>, private actionUpdates$: Actions, private router: Router, private commonService: CommonService,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(WINDOW) private window: Window) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.ClearDemoDataCompleted),
        tap(() => {
          this.dialogRef.close({ delete: true });
          this.store.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
          this.GetWorkSpaces();
        })
      )
      .subscribe();
  }

  ngOnInit() { }

  Delete() {
    this.store.dispatch(new ClearDemoDataTriggred());
    this.demoDataDeletionLoading$ = this.store.pipe(select(sharedModuleReducers.getDemoRecordsDataDeletion));
  }

  CancelDelete() {
    this.dialogRef.close({ delete: false });
  }

  GetWorkSpaces(){
    var workspace = new WorkspaceList();
    workspace.workspaceId = "null";
    workspace.isHidden = false;
    this.commonService.GetWorkspaceList(workspace).subscribe((response: any) => {
      if(response.success) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        var workspaceId = response.data[0].workspaceId;
        this.cookieService.set("DefaultDashboard", workspaceId ? JSON.stringify(workspaceId) : null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      }
      if (this.router.url == "/dashboard-management") {
        window.location.pathname = "/hrmanagment/employeelist"
      } else {
        window.location.pathname = "/dashboard-management"
      }
    })
  }
}
