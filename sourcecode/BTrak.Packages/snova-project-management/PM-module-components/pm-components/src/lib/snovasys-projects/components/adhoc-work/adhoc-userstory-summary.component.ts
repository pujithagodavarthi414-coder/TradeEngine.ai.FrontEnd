import { DatePipe } from "@angular/common";
// tslint:disable-next-line:max-line-length
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatMenuTrigger } from "@angular/material/menu";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line:ordered-imports
import { WorkflowStatus } from "../../models/workflowStatus";
import { LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { UserStory } from "../../models/userStory";
import { LoadUserstoryHistoryTriggered } from "../../store/actions/userstory-history.action";
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { AdhocWorkStatusChangedTriggered, CreateAdhocWorkTriggered } from "../../store/actions/adhoc-work.action";
import { State } from "../../store/reducers/index";
import * as dashboardModuleReducers from "../../store/reducers/index"
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { Router } from "@angular/router";
import { ConstantVariables } from "../../../globalDependencies/constants/constant-variables";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
@Component({
  selector: "adhoc-userstory-summary",
  templateUrl: "adhoc-userstory-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUserStorySummaryComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;
  @ViewChild("parkUserStoryPopover") parkUserStoryPopUp: SatPopover;
  @ViewChildren("archivePopOver") archivePopUps;
  @Output() completeUserStory = new EventEmitter<any>();
  @Output() removeUserStory = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  CanAccess_Company_IsStartEnabled$: Observable<Boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  userStoryStatusChecked: boolean;
  currentUserStory: boolean;
  show: boolean;
  @Input("isEditFromProjects")
  set _isEditFromProjects(data: boolean) {
    if (data === false) {
      this.isEditFromProjects = false;
    } else {
      this.isEditFromProjects = true;
    }
  }
  autoLog: boolean;

  @Input("isLoading")
  set _isLoading(data: boolean) {
    if (data == false) {
      this.currentUserStory = false;
    }
  }

  userStory;
  @Input("userStory")
  set _userStory(data: UserStory) {
    if (data) {
      this.userStory = data;
      this.cdRef.detectChanges();
      this.autoLog = this.userStory.autoLog;
      this.workflowId = this.userStory.workFlowId;
      this.loadWorkflowStatus(this.userStory.workFlowId);
      if (this.userStory.tag) {
        this.userStoryInputTags = this.userStory.tag.split(",");
        this.cdRef.detectChanges();
      } else {
        this.userStoryInputTags = [];
      }
    }
  }

  @Input("isIncludeCompletedUserStories")
  set _isIncludeCompletedUserStories(data: boolean) {
    this.isIncludeCompletedUserStories = data;
    this.cdRef.detectChanges();
  }
  @ViewChild("userstoryTagsPopover") userStorytagsPopUp: SatPopover;
  @Output() selectUserStory = new EventEmitter<UserStory>();
  @Output() updateAutoLog = new EventEmitter<any>();
  workflowStatus$: Observable<WorkflowStatus[]>;
  workflowStatus: WorkflowStatus[];
  userStoryIsInProgress$: Observable<boolean>;
  profileImage: string;
  defaultProfileImage = "assets/images/faces/18.png";
  workflowId: string;
  isTagsPopUp: boolean;
  titleText: string;
  taskStatusOrder: number;
  selectedStatusId: string;
  validationMessage: string;
  uniqueNumberUrl: string;
  isInlineEdit: boolean;
  isInlineEditForEstimatedTime: boolean;
  isInlineEditForUserStoryStatus: boolean;
  isInlineEditForUserStoryOwner: boolean;
  isParked = true;
  isArchived = true;
  contextMenuPosition = { x: "0px", y: "0px" };
  selectedUserStoryId: string;
  isUserStorySelected: boolean;
  userStoryStatusId: string;
  isIncludeCompletedUserStories: boolean;
  isEditFromProjects = true;
  workItemInProgress = false;
  userStoryInputTags: string[] = [];
  public ngDestroyed$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private store: Store<State>,
    private datePipe: DatePipe,
    private adhocWorkService: AdhocWorkService,
    private toastr: ToastrService,
    private snackbar: MatSnackBar,
    private router: Router) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          this.workflowStatus$ = this.store.pipe(
            select(dashboardModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.workflowId })
          );
          this.workflowStatus$
            .subscribe((s) => (this.workflowStatus = s));
          if (this.userStory.userStoryStatusId.toLowerCase() === this.workflowStatus[0].userStoryStatusId.toLowerCase()) {
            this.userStoryStatusChecked = false;
          } else {
            this.userStoryStatusChecked = true;
          }
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
      
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.createAdhocUserStoryLoading));
    this.userStoryIsInProgress$ = this.store.pipe(
      select(dashboardModuleReducers.getUniqueUserStoryById)
    );
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  GetUserStory(userstory) {
    this.selectUserStory.emit(userstory);
  }

  saveDeadlineDate(inLineEditUserStoryPopup, isPermission) {
    if (isPermission != 'false') {
      this.titleText = this.translateService.instant("USERSTORY.EDITDEADLINEDATE");
      this.isInlineEdit = true;
      this.isInlineEditForEstimatedTime = false;
      this.isInlineEditForUserStoryStatus = false;
      this.isInlineEditForUserStoryOwner = false;
      inLineEditUserStoryPopup.openPopover();

    }
  }

  saveEstimatedTime(inLineEditUserStoryPopup, isPermission) {
    if (isPermission != 'false') {
      this.titleText = this.translateService.instant("USERSTORY.EDITESTIMATEDTIME");
      this.isInlineEdit = false;
      this.isInlineEditForEstimatedTime = true;
      this.isInlineEditForUserStoryStatus = false;
      this.isInlineEditForUserStoryOwner = false;
      inLineEditUserStoryPopup.openPopover();
    }
  }

  saveUserStoryStatus(inLineEditUserStoryPopup) {
    this.titleText = this.translateService.instant("USERSTORY.EDITUSERSTORYSTATUS");
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = true;
    this.isInlineEditForUserStoryOwner = false;
    inLineEditUserStoryPopup.openPopover();
  }

  saveAssignee(inLineEditUserStoryPopup, isPermission) {
    if (isPermission != 'false') {
      this.titleText = this.translateService.instant("USERSTORY.EDITUSERSTORYOWNER");
      this.isInlineEdit = false;
      this.isInlineEditForEstimatedTime = false;
      this.isInlineEditForUserStoryStatus = false;
      this.isInlineEditForUserStoryOwner = true;
      inLineEditUserStoryPopup.openPopover();
    }
  }

  getStableState(event) {
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = false;
    this.isInlineEditForUserStoryOwner = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
    this.workItemInProgress = false;
    this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStory.userStoryId));
    this.completeUserStory.emit(this.userStory.userStoryId);
  }

  getWorkItemsLoader(value) {
    this.workItemInProgress = true;
    this.cdRef.markForCheck();
  }

  getStopLoader(value) {
    this.workItemInProgress = false;
    this.cdRef.markForCheck();
  }

  closeUserStoryDialogWindow() {
    this.isInlineEdit = false;
    this.isInlineEditForEstimatedTime = false;
    this.isInlineEditForUserStoryStatus = false;
    this.isInlineEditForUserStoryOwner = false;
    this.inLineEditPopUps.forEach((p) => p.closePopover());
  }

  closeParkPopUp(value) {
    const popover = this.parkUserStoryPopUp;
    if (popover) { popover.close(); }
    if (value === "yes") {
      this.removeUserStory.emit(this.userStory.userStoryId);
    } else if (value === "no") {
      this.completeUserStory.emit(this.userStory.userStoryId);
    }
  }

  closeArchivePopUp(value) {
    this.archivePopUps.forEach((p) => p.closePopover());
    if (value === "yes") {
      this.removeUserStory.emit(this.userStory.userStoryId);
    } else if (value === "no") {
      this.completeUserStory.emit(this.userStory.userStoryId);
    }
  }

  closeTagsDialog() {
    this.isTagsPopUp = false;
    const popover = this.userStorytagsPopUp;
    this.selectedUserStoryId = null;
    if (popover) { popover.close(); }
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
    this.completeUserStory.emit(this.userStory.userStoryId);
  }

  openTagsPopUp() {
    this.isTagsPopUp = true;
  }

  openContextMenu(event: MouseEvent) {
    // this.selectedUserStoryId = this.userStory.userStoryId;
    this.isUserStorySelected = false;
    event.preventDefault();
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      if (this.isEditFromProjects) {
        this.contextMenuPosition.x = (event.clientX) + "px";
        this.contextMenuPosition.y = (event.clientY - 30) + "px";
      } else {
        this.contextMenuPosition.x = (event.clientX - 180) + "px";
        this.contextMenuPosition.y = (event.clientY - 90) + "px";
      }
      this.cdRef.detectChanges();
      contextMenu.openMenu();
    }
  }

  configureDeadlineDateDisplay(deadLineDate, isConfigureDate) {
    return this.datePipe.transform(deadLineDate, "dd-MMM-yyyy, h:mm a");
  }

  applyClassForUniqueName(userStoryTypeColor) {
    if (userStoryTypeColor) {
      return "asset-badge"
    } else {
      return "userstory-unique"
    }
  }

  loadWorkflowStatus(workflowId) {
    const workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = workflowId;
    if (workflowStatus.workFlowId !== undefined) {
      this.workflowStatus$ = this.store.pipe(
        select(dashboardModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
      );
      this.workflowStatus$
        .subscribe((s) => (this.workflowStatus = s));
      if (this.workflowStatus.length <= 0) {
        this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
      } else {
        if (this.userStory.userStoryStatusId.toLowerCase() === this.workflowStatus[0].userStoryStatusId.toLowerCase()) {
          this.userStoryStatusChecked = false;
        } else {
          this.userStoryStatusChecked = true;
        }
        this.cdRef.detectChanges();
      }
    }
  }

  changeWorkItemStatus(event) {
    if (event.checked) {
      this.userStoryStatusId = this.workflowStatus[1].userStoryStatusId;
    } else {
      this.userStoryStatusId = this.workflowStatus[0].userStoryStatusId;
    }
    if (this.workflowStatus.length > 0) {
      this.taskStatusOrder = this.workflowStatus[0].maxOrder;
    }
    const selectedStatus = this.workflowStatus.find((x) => x.orderId === this.taskStatusOrder);
    this.selectedStatusId = selectedStatus.userStoryStatusId;

    this.saveUserStory();
  }

  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/adhoc-workitem/' + this.userStory.userStoryId;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open(this.translateService.instant('USERSTORY.LINKCOPIEDSUCCESSFULLY'), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/adhoc-workitem/' + this.userStory.userStoryId;
    window.open(this.uniqueNumberUrl, "_blank");
  }

  LogAction(userStory) {
    const userStoryLogTime = new UserStoryLogTimeModel();
    // this.autoLog = !userStory.autoLog;
    if (this.userStory.userStoryId == userStory.userStoryId) {
      this.currentUserStory = true;
    }
    if (userStory.autoLog == false || userStory.autoLog == 0) {
      userStoryLogTime.startTime = userStory.startTime;   // log ending
      userStoryLogTime.endTime = new Date();
      userStoryLogTime.isFromAdhoc = true;
    }
    else {
      userStoryLogTime.startTime = new Date();     // log starting
      userStoryLogTime.isFromAdhoc = true;
    }
    userStoryLogTime.parentUserStoryId = userStory.parentUserStoryId;
    userStoryLogTime.userStoryId = userStory.userStoryId;
    userStoryLogTime.userStorySpentTimeId = userStory.userStorySpentTimeId;
    this.updateAutoLog.emit({ userStoryLogTime: userStoryLogTime });
    this.close.emit(true);
    //this.store.dispatch(new InsertLogTimeTriggered(this.userStoryLogTime));
    this.loadWorkflowStatus(this.workflowId);
  }

  saveUserStory() {
    this.workItemInProgress = true;
    this.cdRef.markForCheck();
    const userStory = new UserStory();
    userStory.userStoryId = this.userStory.userStoryId;
    userStory.ownerUserId = this.userStory.ownerUserId;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.userStory.estimatedTime;
    userStory.deadLineDate = this.userStory.deadlineDate;
    userStory.userStoryName = this.userStory.userStoryName;
    userStory.description = this.userStory.description;
    userStory.timeStamp = this.userStory.timeStamp;
    userStory.customApplicationId = this.userStory.customApplicationId;
    userStory.formId = this.userStory.formId;
    userStory.workFlowId = this.userStory.workFlowId;
    userStory.referenceId = this.userStory.referenceId;
    userStory.referenceTypeId = this.userStory.referenceTypeId;
    userStory.workFlowTaskId = this.userStory.workFlowTaskId;
    userStory.genericFormSubmittedId = this.userStory.genericFormSubmittedId;
    userStory.userStoryTypeId = this.userStory.userStoryTypeId;
    userStory.isWorkflowStatus = this.userStory.referenceTypeId ? true : null;
    if (this.isEditFromProjects) {
      if ((!this.isIncludeCompletedUserStories) && this.userStoryStatusId === this.selectedStatusId) {
        this.store.dispatch(new AdhocWorkStatusChangedTriggered(userStory))
      } else {
        this.store.dispatch(
          new CreateAdhocWorkTriggered(userStory)
        );
      }
    } else {
      this.adhocWorkService.upsertAdhocWork(userStory).subscribe((result: any) => {
        if (result.success) {
          this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStory.userStoryId));
          this.completeUserStory.emit(this.userStory.userStoryId);
        } else {
          this.getStopLoader(null);
          this.validationMessage = result.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessage);
        }
      });
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  markAsStatusName(userstoryStatusName) {
    if (this.workflowStatus && this.workflowStatus.length > 0) {
      let status = this.workflowStatus.find(x => x.userStoryStatusName != userstoryStatusName);
      return status.userStoryStatusName;
    }
  }
}
