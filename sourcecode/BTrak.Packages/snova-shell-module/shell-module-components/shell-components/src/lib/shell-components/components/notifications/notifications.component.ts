import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NavigationEnd, Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { PubNubAngular } from "pubnub-angular2";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { AuthenticationActionTypes, RolesFetchTriggered } from "../../store/actions/authentication.actions";
import { ClearAllNotifications, NewNotificationReceived, NotificationsActionTypes, UpsertUnreadNotificationsTriggered } from "../../store/actions/notifications.actions";
import { State } from "../../store/reducers/index";
import * as sharedModuleReducers from "../../store/reducers/index";
import { NotificationTypeIds } from '../../constants/notification-type-ids';
import { NotificationModel, NotificationOutputModel, UserNotificationReadModel } from '../../models/NotificationsOutPutModel';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { UserModel } from '../../models/user';
import { OrderByPipe } from '../../../globaldependencies/pipes/orderby-pipe';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ChannelNames } from '../../constants/channel-names';
import { ChannelRoutes } from '../../constants/notification-routes';
import { UserStoryAssignedNotification } from '../../models/UserStoryAssignedNotification';
import { RoleUpdatedNotification } from '../../models/RoleUpdatedNotification';
import { ReportSubmittedNotification } from '../../models/ReportSubmittedNotification';
import { ReportConfigAssignedNotification } from '../../models/ReportConfigAssignedNotification';
import { MultipleChartsScheduling } from '../../models/multiChartsScheduling';
import { AssetAssignedNotification } from '../../models/AssetAssignedNotificationModel';
import { NewProjectCreatedNotificationModel } from '../../models/NewProjectCreatedNotificationModel';
import { GoalApprovedNotificationModel } from '../../models/goalApprovedNotificationModel';
import { UserStoryUpdateNotificationModel } from '../../models/userStoryUpdateNotificationModel';
import { UserStoryCommentNotificationModel } from '../../models/userStoryCommentNotificationModel';
import { SprintStartedNotificationModel } from '../../models/sprintStartedNotificationModel';
import { SprintReplanStartedNotificationModel } from '../../models/sprintReplanRequestedModel';
import { AnnoucementDialogComponent } from './announcement-dialog.component';
import { Guid } from 'guid-typescript';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as _ from "underscore";
import { SignalrService } from "../../services/signalr.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html"
})

export class NotificationsComponent implements OnInit {

  @Input() notificPanel;

  public ngDestroyed$ = new Subject();
  constNotification_WorkItemAssignedToUser = NotificationTypeIds.Notification_WorkItemAssignedToUser;
  notifications$: Observable<NotificationOutputModel[]>;
  notifications: NotificationOutputModel[];
  softLabels: SoftLabelConfigurationModel[];
  loadingNotifications$: Observable<boolean>;
  selectedNotification: UserNotificationReadModel;
  announcementId: string;
  announceNotificationId: string;
  notificationColor = false;
  authenticatedUserRecord$: Observable<UserModel>;
  newNotifications: NotificationModel[] = [];

  constructor(
    private router: Router, private pubnub: PubNubAngular, private store: Store<State>,
    private actionUpdates$: Actions, private cookieService: CookieService, private toastr: ToastrService,
    public dialog: MatDialog, private orderByPipe: OrderByPipe, private signalr: SignalrService,
    private cdRef: ChangeDetectorRef,) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.UserDetailsFetchedAfterLogin),
        tap(() => {
          if (this.cookieService.check(LocalStorageProperties.CurrentUserId)) {

            const CurrentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            // Subscribe to Task Assignment Notificaitons here.
            const taskAssignmentChannelToSubscribeInto = ChannelNames.Channel_TaskAssignments + CurrentUserId;
            const tastatusReportSubmissionChannelToSubscribeInto = ChannelNames.Channel_StatusReportSubmission + CurrentUserId;
            const tastatusConfigAssignChannelToSubscribeInto = ChannelNames.Channel_StatusConfigAssign + CurrentUserId;
            const multiChartsSchedulingChannelToSubscribeInto = ChannelNames.Channel_MultiChartsScheduling + CurrentUserId;
            const assetsAssignedChannelToSubscribeInto = ChannelNames.Channel_AssetAssignment + CurrentUserId;
            const projectCreatedChannelToSubscribeInto = ChannelNames.Channel_NewProject + CurrentUserId;
            const projectAccessToMemberChannelToSubscribeInto = ChannelNames.Channel_ProjectMemberRole + CurrentUserId;
            const goalApprovedChannelToSubscribeInto = ChannelNames.Channel_GoalApprovedFromReplan + CurrentUserId;
            const userStoryUpdateChannelToSubscribeInto = ChannelNames.Channel_UserStoryUpdateNotification + CurrentUserId;
            const AnnouncementChannelToSubscribeInto = ChannelNames.Channel_AnnouncementNotification + CurrentUserId;
            const ReminderChannelToSubscribeInto = ChannelNames.Channel_ReminderNotification + CurrentUserId;
            const PerformanceChannelToSubscribeInto = ChannelNames.Channel_PeroformanceNotification + CurrentUserId;
            const userStoryCommentChannelToSubscribeInto = ChannelNames.Channel_UserStoryComment + CurrentUserId;
            const sprintStartedChannelToSubscribeInto = ChannelNames.Channel_SprintStarted + CurrentUserId;
            const sprintReplanChannelToSubscribeInto = ChannelNames.Channel_SprintRequestedToReplan + CurrentUserId;
            const leaveAppliedChannelToSubscribeInto = ChannelNames.Channel_LeaveApplied + CurrentUserId;
            const ApproveLeaveChannelToSubscribeInto = ChannelNames.Channel_ApproveLeave + CurrentUserId;
            const RejectLeaveChannelToSubscribeInto = ChannelNames.Channel_RejectLeave + CurrentUserId;
            const ResignationChannelToSubscribeInto = ChannelNames.Channel_Resignation + CurrentUserId;
            const ApproveResignationChannelToSubscribeInto = ChannelNames.Channel_ApproveResignation + CurrentUserId;
            const RejectResignationChannelToSubscribeInto = ChannelNames.Channel_RejectResignation + CurrentUserId;
            const AutoTImesheetSubmissionChannelToSubscribeInto = ChannelNames.Channel_AutoTimesheetSubmission + CurrentUserId;
            const ProbationAssignNotification = ChannelNames.Channel_ProbationAssignNotification + CurrentUserId;
            const ReviewAssignToEmployeeNotification = ChannelNames.Channel_ReviewAssignToEmployeeNotification + CurrentUserId;
            const ReviewSubmittedByEmployeeNotification = ChannelNames.Channel_ReviewSubmittedByEmployeeNotification + CurrentUserId;
            const ReviewInvitationNotificationModel = ChannelNames.Channel_ReviewInvitationNotificationModel + CurrentUserId;
            const PerformanceReviewSubmittedByEmployeeNotification = ChannelNames.Channel_PerformanceReviewSubmittedByEmployeeNotification + CurrentUserId;
            const PerformanceReviewInvitationNotificationModel = ChannelNames.Channel_PerformanceReviewInvitationNotificationModel + CurrentUserId;
            const PerformanceReviewAssignToEmployeeNotification = ChannelNames.Channel_PerformanceReviewAssignToEmployeeNotification + CurrentUserId;
            console.log("subscribing to " + taskAssignmentChannelToSubscribeInto);
            console.log("subscribing to " + tastatusReportSubmissionChannelToSubscribeInto);
            console.log("subscribing to " + tastatusConfigAssignChannelToSubscribeInto);
            console.log("subscribing to" + assetsAssignedChannelToSubscribeInto);
            console.log("subscribing to" + projectCreatedChannelToSubscribeInto);
            console.log("subscribing to" + projectAccessToMemberChannelToSubscribeInto);
            console.log("subscribing to" + goalApprovedChannelToSubscribeInto);
            console.log("subscribing to" + userStoryUpdateChannelToSubscribeInto);
            console.log("subscribing to" + AnnouncementChannelToSubscribeInto);
            console.log("subscribing to" + userStoryCommentChannelToSubscribeInto);
            console.log("subscribing to" + sprintStartedChannelToSubscribeInto);
            console.log("subscribing to" + sprintReplanChannelToSubscribeInto);
            console.log("subscribing to" + ReminderChannelToSubscribeInto);
            console.log("subscribing to" + PerformanceChannelToSubscribeInto);
            this.pubnub.subscribe({
              channels: [taskAssignmentChannelToSubscribeInto, tastatusReportSubmissionChannelToSubscribeInto,
                ProbationAssignNotification, ReviewAssignToEmployeeNotification, ReviewSubmittedByEmployeeNotification,
                ReviewInvitationNotificationModel, PerformanceReviewSubmittedByEmployeeNotification, PerformanceReviewAssignToEmployeeNotification,
                tastatusConfigAssignChannelToSubscribeInto, multiChartsSchedulingChannelToSubscribeInto, PerformanceReviewInvitationNotificationModel,
                assetsAssignedChannelToSubscribeInto, projectCreatedChannelToSubscribeInto, ,
                projectAccessToMemberChannelToSubscribeInto, goalApprovedChannelToSubscribeInto,
                userStoryUpdateChannelToSubscribeInto, AnnouncementChannelToSubscribeInto, ReminderChannelToSubscribeInto, RejectResignationChannelToSubscribeInto,
                userStoryCommentChannelToSubscribeInto, sprintStartedChannelToSubscribeInto, ResignationChannelToSubscribeInto, ApproveResignationChannelToSubscribeInto,
                sprintReplanChannelToSubscribeInto, leaveAppliedChannelToSubscribeInto, ApproveLeaveChannelToSubscribeInto, RejectLeaveChannelToSubscribeInto,
                PerformanceChannelToSubscribeInto, AutoTImesheetSubmissionChannelToSubscribeInto]
            });
            // Add other subscriptions here.
          } else {
            console.log("User not logged in yet to be able to subscribe.");
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.UserDetailsFetchedAfterLogin),
        tap(() => {
          var roleUpdatesChannelToSubscribeInto = ChannelNames.Channel_RoleUpdates + "19B6F9FC-7370-4B9C-A05C-3B8D819EEEAF";
          console.log("subscribing to " + roleUpdatesChannelToSubscribeInto);
          this.pubnub.subscribe({
            channels: [roleUpdatesChannelToSubscribeInto]
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(NotificationsActionTypes.ClearAllUnreadNotificationsCompleted),
        tap(() => {
          this.notifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationAll));
          this.notifications$.subscribe(x => {
            this.notifications = x;
          });

        })
      )
      .subscribe();

    // const storeListner = (message) => {
    //   console.log("---------Received pubnub message---------");
    //   // this.toastr.info(message.message.Summary);
    //   try {
    //     // Receiving the User Story Assigned Notification
    //     if (message.message.NotificationTypeGuid == NotificationTypeIds.Notification_WorkItemAssignedToUser) {
    //       var userStoryAssignedNotification = new UserStoryAssignedNotification();
    //       userStoryAssignedNotification.loadFromCaseInsensitiveObject(message.message);
    //       userStoryAssignedNotification.route = ChannelRoutes.ViewWorkItem + userStoryAssignedNotification.notificationId;
    //       this.store.dispatch(new NewNotificationReceived(userStoryAssignedNotification));
    //     } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Notification_RoleUpdated) {
    //       var roleUpdatedNotification = new RoleUpdatedNotification();
    //       roleUpdatedNotification.loadFromCaseInsensitiveObject(message.message);
    //       roleUpdatedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(roleUpdatedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Status_Report_Sumitted) {
    //       var reportSubmittedNotification = new ReportSubmittedNotification();
    //       reportSubmittedNotification.loadFromCaseInsensitiveObject(message.message);
    //       reportSubmittedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(reportSubmittedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Status_Report_Config_Created) {
    //       var reportConfigAssignedNotification = new ReportConfigAssignedNotification();
    //       reportConfigAssignedNotification.loadFromCaseInsensitiveObject(message.message);
    //       reportConfigAssignedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(reportConfigAssignedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Multiple_Charts_Scheduling_created) {
    //       var multipleChartsScheduling = new MultipleChartsScheduling();
    //       multipleChartsScheduling.loadFromCaseInsensitiveObject(message.message);
    //       multipleChartsScheduling.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(multipleChartsScheduling));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Assets_Assignment) {
    //       const assetAssignedNotification = new AssetAssignedNotification();
    //       assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
    //       assetAssignedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Reminder_Notification.toString().toLowerCase()) {
    //       const assetAssignedNotification = new AssetAssignedNotification();
    //       assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
    //       assetAssignedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Announcement_Received.toString().toLowerCase()) {
    //       const assetAssignedNotification = new AssetAssignedNotification();
    //       assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
    //       assetAssignedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //       if (message.message.Id != this.announceNotificationId) {
    //         this.announceNotificationId = message.message.Id;
    //         this.openAnnouncementDialog(message.message);
    //       }
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Performance_Received.toString().toLowerCase() || message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProjectMemberRoleAddedNotificationId.toString().toLowerCase()) {
    //       const newProjectCreatedNotification = new NewProjectCreatedNotificationModel();
    //       newProjectCreatedNotification.loadFromCaseInsensitiveObject(message.message);
    //       newProjectCreatedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(newProjectCreatedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.NewProjectCreatedNotificationId.toString().toLowerCase() || message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProjectMemberRoleAddedNotificationId.toString().toLowerCase()) {
    //       const newProjectCreatedNotification = new NewProjectCreatedNotificationModel();
    //       newProjectCreatedNotification.loadFromCaseInsensitiveObject(message.message);
    //       newProjectCreatedNotification.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(newProjectCreatedNotification));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.GoalApprovedFromReplan.toString().toLowerCase()) {
    //       const goalApprovedNotificationModel = new GoalApprovedNotificationModel();
    //       goalApprovedNotificationModel.loadFromCaseInsensitiveObject(message.message);
    //       goalApprovedNotificationModel.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(goalApprovedNotificationModel));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.USerStoryUpdateNotificationId.toString().toLowerCase()) {
    //       const userStoryUpdateNotificationModel = new UserStoryUpdateNotificationModel();
    //       userStoryUpdateNotificationModel.loadFromCaseInsensitiveObject(message.message);
    //       userStoryUpdateNotificationModel.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(userStoryUpdateNotificationModel));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PushNotificationForUserStoryComment.toString().toLowerCase()) {
    //       const userStoryCommentNotificationModel = new UserStoryCommentNotificationModel();
    //       userStoryCommentNotificationModel.loadFromCaseInsensitiveObject(message.message);
    //       userStoryCommentNotificationModel.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(userStoryCommentNotificationModel));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.SprintStarted.toString().toLowerCase()) {
    //       const sprintStartedNotificationModel = new SprintStartedNotificationModel();
    //       sprintStartedNotificationModel.loadFromCaseInsensitiveObject(message.message);
    //       sprintStartedNotificationModel.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(sprintStartedNotificationModel));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.SprintRequestdForREplan.toString().toLowerCase()) {
    //       const sprintReplanStartedNotificationModel = new SprintReplanStartedNotificationModel();
    //       sprintReplanStartedNotificationModel.loadFromCaseInsensitiveObject(message.message);
    //       sprintReplanStartedNotificationModel.route = ChannelRoutes.ViewAccount;
    //       this.store.dispatch(new NewNotificationReceived(sprintReplanStartedNotificationModel));
    //       this.store.dispatch(new RolesFetchTriggered());
    //     } else {
    //       // TODO: Send these errors onto server for further processing
    //       console.log("Found undetected notification type. " + message.message.NotificationTypeGuid);
    //     }
    //     // Add other notifications here.

    //   } catch (exception) {
    //     // TODO: Send these exceptions onto server for further processing
    //     console.log("Exception Occured" + exception.message);
    //   }
    // };

    // this.pubnub.addListener({
    //   status: st => {
    //     if (st.category === "PNUnknownCategory") {
    //       var newState = {
    //         new: "error"
    //       };
    //       this.pubnub.setState(
    //         {
    //           state: newState
    //         }
    //         // function (status) {
    //         //   console.log(st.errorData.message);
    //         // }
    //       );
    //     }
    //   },
    //   message: message => {
    //     console.log("subscribed to " + message);
    //     storeListner(message);
    //   }
    // });
  }

  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          if (this.notificPanel) {
            this.notificPanel.close();
          }
        }
      });
    this.signalr.notifications$.subscribe((data: any) => {
      this.newNotifications = data && data.length > 0 ? data : [];
      this.cdRef.detectChanges();
    });
    this.getSoftLabelConfigurations();

    this.notifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationAll),
      tap(x => console.log(x))
    );

    this.authenticatedUserRecord$ = this.store.pipe(
      select(sharedModuleReducers.getAuthenticatedUserModel)
    );

    this.loadingNotifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationsLoading));
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  clearAll(e) {
    const notifications = [];
    this.notifications.forEach((element) => {
      notifications.push(element);
    });
    this.store.dispatch(new ClearAllNotifications(notifications));
    e.preventDefault();
    this.notificationColor = !this.notificationColor;
  }

  // openAnnouncementDialog(announced) {
  //   this.dialog.closeAll();
  //   const dialogRef = this.dialog.open(AnnoucementDialogComponent, {
  //     minWidth: "60vw",
  //     maxWidth: "60vw",
  //     minHeight: "50vh",
  //     maxHeight: "80vh",
  //     disableClose: true,
  //     data: {
  //       announcementId: announced.AnnouncementId,
  //       announcement: announced.Announcement,
  //       announcedBy: announced.AnnouncedBy,
  //       announcedById: announced.AnnouncedById,
  //       announcedByUserImage: announced.AnnouncedByUserImage,
  //       announcedOn: announced.AnnouncedOn
  //     }
  //   });
  //   dialogRef.componentInstance.closeMatDialog.subscribe((result) => {
  //     const index = this.notifications.findIndex((p) => p.notificationId.toString().toLowerCase() == this.announceNotificationId.toString().toLowerCase());
  //     if (index > -1) {
  //       this.upsertReadNotification(this.notifications[index]);
  //     }
  //   });
  // }

  upsertReadNotification(selectedNotification) {
    const notifications = [];
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    let Feature_ApproveOrRejectLeave = '2C22916F-B80B-4C51-9534-23F698DE120B';
    let canAccess_feature_ApproveOrRejectLeave = _.find(roles, function (role) { return role['featureId'].toLowerCase() == Feature_ApproveOrRejectLeave.toString().toLowerCase(); }) != null;
    const CurrentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    notifications.push(selectedNotification);
    const notiifcationmodel = JSON.parse(selectedNotification.notificationJson);
    if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.NewProjectCreatedNotificationId.toString().toLowerCase() ||
      selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ProjectMemberRoleAddedNotificationId.toString().toLowerCase()) {
      this.router.navigate(["projects/projectstatus/" + notiifcationmodel.ProjectGuid + "/active-goals"]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.GoalApprovedFromReplan.toString().toLowerCase()) {
      this.router.navigate(["projects/goal/" + notiifcationmodel.GoalGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.Notification_WorkItemAssignedToUser.toString().toLowerCase()) {
      this.router.navigate(["projects/workitem/" + notiifcationmodel.UserStoryGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.USerStoryUpdateNotificationId.toString().toLowerCase()) {
      this.router.navigate(["projects/workitem/" + notiifcationmodel.UserStoryId]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.SprintStarted.toString().toLowerCase()) {
      this.router.navigate(["projects/sprint/" + notiifcationmodel.SprintGuid]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.PushNotificationForUserStoryComment.toString().toLowerCase()) {
      this.router.navigate(["projects/workitem/" + notiifcationmodel.UserStoryGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.GoalRequestdForREplan.toString().toLowerCase()) {
      this.router.navigate(["projects/goal/" + notiifcationmodel.GoalGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.SprintRequestdForREplan.toString().toLowerCase()) {
      this.router.navigate(["projects/sprint/" + notiifcationmodel.SprintGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.Notification_AdhocWorkItemAssignedToUser.toString().toLowerCase()) {
      this.router.navigate(["dashboard/adhoc-workitem/" + notiifcationmodel.UserStoryGuid]);
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.AdhocUSerStoryUpdateNotificationId.toString().toLowerCase()) {
      this.router.navigate(["dashboard/adhoc-workitem/" + notiifcationmodel.UserStoryId]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.LeaveApplication.toString().toLowerCase() && canAccess_feature_ApproveOrRejectLeave) {
      this.router.navigate(["hrmanagment/leaves"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ApproveLeaveApplication.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + CurrentUserId + "/leaves-permissions"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.RejectLeaveApplication.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + CurrentUserId + "/leaves-permissions"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.AutoTimeSheetSubmissionNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + CurrentUserId + "/timesheetApproval"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ProbationAssignNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + notiifcationmodel.UserId + "/probation"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ReviewAssignToEmployeeNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + CurrentUserId + "/probation"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ReviewSubmittedByEmployeeNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + notiifcationmodel.UserId + "/probation"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.ReviewInvitationNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + notiifcationmodel.UserId + "/probation"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.PerformanceReviewSubmittedByEmployeeNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + notiifcationmodel.UserId + "/performance"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.PerformanceReviewInvitationNotificationModel.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + notiifcationmodel.UserId + "/performance"]);
    }
    else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.PerformanceReviewAssignToEmployeeNotification.toString().toLowerCase()) {
      this.router.navigate(["dashboard/profile/" + CurrentUserId + "/performance"]);
    }
    this.store.dispatch(new UpsertUnreadNotificationsTriggered(notifications));
  }

  upsertReadNewNotification(notification) {
    let notes: NotificationModel[] = [notification];
    this.signalr.upsertReadNewNotifications(notes)
      .subscribe((res: any) => {
        if (res.success) {
          this.signalr.removeItemFromNotifications(notification.id);
        }
      });
    if (notification.navigationUrl) {
      window.open(notification.navigationUrl, "_blank");
    }

  }

  clearNewAll(e) {
    this.signalr.upsertReadNewNotifications(this.newNotifications)
      .subscribe((res: any) => {
        if (res.success) {
          this.signalr.removeAllNotifications();
        }
      });
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
