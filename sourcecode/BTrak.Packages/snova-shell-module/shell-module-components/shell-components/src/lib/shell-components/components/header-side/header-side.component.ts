import { UserDetailsFetchedAfterLogin, UserDetailsFetchedAfterCompanyLogin, FetchTimeSheetButtonDetails, RolesFetchTriggered } from './../../store/actions/authentication.actions';
import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  NgModuleRef,
  NgModuleFactoryLoader,
  ViewContainerRef, ViewChildren, ChangeDetectorRef, TemplateRef
} from "@angular/core";
import {
  ReceiveMessageTriggered,
  PresenceEventTriggered,
  InitalStateOfUsersTriggered,
  MessageActionTypes,
  ReceiveChannelUpdateModelTriggered,
  ReceiveSignalTriggered,
} from "../../store/actions/chat.actions"
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { GetUserStoreIdTriggered, AuthenticationActionTypes } from "../../store/actions/authentication.actions";
import { ClearAllUnreadNotificationsTriggered, ClearUnreadNotificationsTriggered, NewNotificationReceived, NotificationsActionTypes, UpsertUnreadNotificationsTriggered } from "../../store/actions/notifications.actions";
import { State } from "../../store/reducers/index";
import * as sharedModuleReducers from "../../store/reducers/index";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { CommonService } from "../../services/common-used.service";
import { Actions, ofType } from "@ngrx/effects";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ChannelNames } from '../../constants/channel-names';
import { WINDOW } from '../../../globaldependencies/helpers/window.helper';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TimesheetDisableorEnable } from '../../models/timesheetenabledisable';
import { ThemeModel } from '../../models/themes.model';
import { NotificationModel, NotificationOutputModel } from '../../models/NotificationsOutPutModel';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { UserModel } from '../../models/user';
import { CompaniesList } from '../../models/companieslist.model';
import { StoreModel } from '../../models/store-model';
import { AppNotification } from '../../models/AppNotification';
import { StoreSearchModel } from '../../models/store-search-model';
import { NgModuleFactory, Type } from '@angular/core';
import { WorkItemsDialogComponent } from '../all-work-items-dialog/all-work-items-dialog.component';
import { ShellModulesService } from '../../services/shell.modules.service';
import * as _ from "underscore";
import { FeedTimeDialogComponent } from '../feed-time/feed-time-dialog.component';
import { NotificationTypeIds } from '../../constants/notification-type-ids';
import { UserStoryAssignedNotification } from '../../models/UserStoryAssignedNotification';
import { ChannelRoutes } from '../../constants/notification-routes';
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
import { AnnoucementDialogComponent } from '../notifications/announcement-dialog.component';
import { WorkspaceList } from '../../models/workspaceList';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { NewProjectFeatureCreatedNotificationModel } from '../../models/NewProjectFeatureNotificationModel';
import { UserStoryArchiveNotificationModel } from '../../models/archiveUserStoryModel';
import { UserStoryParkNotificationModel } from '../../models/parkUserStoryInputModel';
import { ExportConfigurationDialogComponent } from '../export-import-configuration/export-configuration.component';
import { FileModel, FileResultModel, StoreManagementService } from "@thetradeengineorg1/snova-document-management";
import { ToastrService } from 'ngx-toastr';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
// import { ConstantVariables } from "../constants/constant-variables";
import Resumable from "resumablejs";
import { ApiUrls } from '../../constants/api-urls';
import { AvailableLangs } from '../../constants/available-languages';
import { ImportConfigurationModel } from '../../models/import-configuration-model';
import { ChatService } from '../../services/chat.service';
import { MessageDetails } from '../../models/MessageDetails';
import { ChannelUpdateModel } from '../../models/ChannelUpdateModel';
import { PushNotificationsService } from 'ng-push-ivy';
import { MessageTypingDetails } from '../../models/MessageTypingDetails';
import { PubNubAngular } from 'pubnub-angular2';


import { IntroModel } from "../../models/IntroModel";
import { LeaveApplicationNotification } from '../../models/leaveApplicationNotifiction';
import { SignalrService } from '../../services/signalr.service';

/** @dynamic */

@Component({
  selector: "app-header-side",
  templateUrl: "./header-side.template.html",
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 })),
        animate(6000, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class HeaderSideComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild('feedTimeSheet') feedTimeSheetPopover: SatPopover;
  @ViewChild('feedBackPopover') feedBackPopOver: SatPopover;
  @ViewChildren("fileUploadDropzonePopup") fileUploadDropzonePopup;
  @ViewChild('documentPopover') documentPopover: SatPopover;
  softLabels: SoftLabelConfigurationModel[];
  @Input() notificPanel;
  @Output() opened = new EventEmitter<any>();
  @ViewChild("openAnnoucementDialogComponent") private openAnnoucementDialogComponent: TemplateRef<any>;
  spinnerType = SPINNER.circle;
  public availableLangs = AvailableLangs.languages;
  public availableLangsMobile = [
    {
      name: "En",
      code: "en"
    },
    {
      name: "Te",
      code: "te"
    },
    {
      name: "Ko",
      code: "ko"
    },
    {
      name: "Ar",
      code: "ar"
    }
  ];
  // themeModel$: Observable<ThemeModel>;
  countOfNotifications$: Observable<number>;
  notifications$: Observable<NotificationOutputModel[]>;
  unreadCountOfNotifications$: Observable<number>;
  assetId$: Observable<string>;
  userStoreId$: Observable<string>;
  themeModel: ThemeModel;
  reload: boolean;
  public ngDestroyed$ = new Subject();
  dashboardFilters = {
    projectId: null,
    userId: null,
    goalId: null,
    isDailogue: true
  };
  public egretThemes;
  public layoutConf: any;
  public timesheetDisableorEnable: TimesheetDisableorEnable;
  domains: any[];
  loadingInProgress$: Observable<boolean>;
  timePunchCardShow = false;
  showTrailPeriod: boolean = false;
  applicationVersion: any;
  companiesList = [];
  menuType: string
  isFeedBackDialog: boolean;
  selectedLangName: string;
  currentLang: string;
  selectedStoreId: string = "";
  userStoreId: string;
  storesList: StoreModel[];
  validationMessage: string;
  isRecording: boolean = false;
  projectRoleText: string = 'Project role configuration';
  loggedInUserId: string = "";
  company: any;
  loggedUserDetails: any;
  noOfDays: any;
  showDeleteIcon: boolean = false;
  showDelete: boolean = false;
  isStoreAccess: boolean = true;
  companyId: string;
  returnUrl: string;
  selectedCompanyName: string;
  selectedCompany: CompaniesList;
  userName: string;
  loading: boolean;
  authenticatedUserRecord: UserModel;
  employeeId: string;
  isFeedTimeSheet: boolean;
  defaultDashboardId: string;
  timeSheetButtonDetails$: Observable<TimesheetDisableorEnable>
  notifications: NotificationOutputModel[];
  announcementId: string;
  announceNotificationId: string;
  displayWelcomeNote: boolean;
  loggedInCount: any;
  userFullName: any;
  files: File[] = [];
  filesPresent: boolean;
  progressValue: number;
  fileResultModel: FileResultModel[];
  moduleTypeId = 9;
  anyOperationInProgress: boolean;
  fileIndex: number = 0;
  fileCounter: number = 1;
  uploadedFileNames = [];
  isFileUploadCompleted: boolean = false;
  isFolderUploadCompleted: boolean = false;
  importingInProgress: boolean;
  searchText: string = null;
  // messagesUnreadCount: number = 0;
  channelList: any;
  userChannels: any;
  colleaguesList: any;
  loggedInUserfullName: any;
  logInUserId = this.cookieService.get("CurrentUserId");
  loginUserchannelName: string;
  previousMessage: any;
  publishingMessageOfUser: any;
  newNotificationsCount: any = 0;

  constructor(
    private pushNotifications: PushNotificationsService,
    private themeService: ThemeService,
    private ngxService: NgxUiLoaderService,
    private layout: LayoutService,
    public translate: TranslateService,
    public router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private store: Store<State>,
    private pubnub: PubNubAngular,
    private authService: AuthenticationService,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private storeManagementService: StoreManagementService,
    private ShellModulesService: ShellModulesService,
    private chatService: ChatService,
    private signalr: SignalrService,
    @Inject(WINDOW) private window: Window
  ) {
    super();
    // this.signalr.initializeSignalRConnection();
    this.signalr.notifications$.subscribe((data: any) => this.newNotificationsCount = data && data.length ? data.length : 0);

    this.pushNotifications.requestPermission();
    this.isRecording = false;
    // this.getActTrackerRecorder();
    if ((localStorage.getItem(LocalStorageProperties.UserModel) != null && localStorage.getItem(LocalStorageProperties.UserModel) != undefined)
    ) {
      this.loadNotifications();
    }
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
    const companylan = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    let currentCulturelan = companylan.lanCode;

    if (currentCulture == '' || currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
      if (currentCulturelan == '' || currentCulturelan == null || currentCulturelan == undefined || currentCulturelan === 'null' || currentCulturelan === 'undefined') {
        currentCulture = 'en';
      }
      else {
        currentCulture = currentCulturelan;
      }
    }
    this.currentLang = currentCulture;
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.set(LocalStorageProperties.CurrentCulture, this.currentLang, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.UserDetailsFetchedAfterCompanyLogin),
        tap(() => {
          this.reload = true;
          this.getIntroDetails();
          this.ngOnInit();
          this.getNotifications();
          this.getTeamMembers();
          var DefaultDashboardIdForLoggedInUser = this.cookieService.check(LocalStorageProperties.DefaultDashboard) ? JSON.parse(this.cookieService.get(LocalStorageProperties.DefaultDashboard)) : null;
          const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
          if (!DefaultDashboardIdForLoggedInUser) {
            this.router.navigate([this.returnUrl]);
          } else if (userReference != "null" && userReference != null) {
            this.router.navigateByUrl("dashboard-management/dashboard/" + DefaultDashboardIdForLoggedInUser + "/form/" + userReference);
          } else {
            this.router.navigateByUrl("dashboard-management/dashboard/" + DefaultDashboardIdForLoggedInUser);
          }

        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.UserDetailsFetchedAfterLogin),
        tap(() => {
          setTimeout(() => {
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
              const purchaseExecutionAssignedChannelToSubscribeInto = ChannelNames.Channel_PurchaseExecutionAssignToEmployeeNotification + CurrentUserId;
              console.log("subscribing to " + taskAssignmentChannelToSubscribeInto);
              console.log("subscribing to " + tastatusReportSubmissionChannelToSubscribeInto);
              console.log("subscribing to " + tastatusConfigAssignChannelToSubscribeInto);
              console.log("subscribing to" + assetsAssignedChannelToSubscribeInto);
              console.log("subscribing to" + projectCreatedChannelToSubscribeInto);
              console.log("subscribing to" + projectAccessToMemberChannelToSubscribeInto);
              console.log("subscribing to" + goalApprovedChannelToSubscribeInto);
              console.log("subscribing to" + userStoryUpdateChannelToSubscribeInto);
              console.log("subscribing to" + AnnouncementChannelToSubscribeInto);
              console.log("subscribing to" + purchaseExecutionAssignedChannelToSubscribeInto);
              pubnub.subscribe({
                channels: [taskAssignmentChannelToSubscribeInto, tastatusReportSubmissionChannelToSubscribeInto,
                  tastatusConfigAssignChannelToSubscribeInto, multiChartsSchedulingChannelToSubscribeInto,
                  assetsAssignedChannelToSubscribeInto, projectCreatedChannelToSubscribeInto, ,
                  projectAccessToMemberChannelToSubscribeInto, goalApprovedChannelToSubscribeInto,
                  userStoryUpdateChannelToSubscribeInto, AnnouncementChannelToSubscribeInto, purchaseExecutionAssignedChannelToSubscribeInto]
              });

              // Add other subscriptions here.
            } else {
              console.log("User not logged in yet to be able to subscribe.");
            }

            var roleUpdatesChannelToSubscribeInto = ChannelNames.Channel_RoleUpdates + "19B6F9FC-7370-4B9C-A05C-3B8D819EEEAF";
            console.log("subscribing to " + roleUpdatesChannelToSubscribeInto);
            pubnub.subscribe({
              channels: [roleUpdatesChannelToSubscribeInto]
            });
          }, 3000);
        })).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(NotificationsActionTypes.ClearAllUnreadNotificationsCompleted),
        tap(() => {
          this.notifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationAll));
          this.notifications$.subscribe(x => {
            this.notifications = x;
            const index = this.notifications.findIndex((p) => JSON.parse(p.notificationJson).NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Announcement_Received.toString().toLowerCase());
            if (index > -1) {
              //this.announceNotificationId = JSON.parse(this.notifications[index].notificationJson).notificationId;
              this.announceNotificationId = this.notifications[index].notificationId;
              this.openAnnouncementDialog(JSON.parse(this.notifications[index].notificationJson));

            }
          });

        })
      )
      .subscribe();

    // this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(MessageActionTypes.CountCompleted),
    //     tap((result: any) => {
    //       this.messagesUnreadCount = result.messageCount;
    //       this.cdRef.detectChanges();
    //     })
    //   )
    //   .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.RequestingStateOfUsersCompleted),
        tap((result: any) => {
          this.subScribingToPresenceChannel();

        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.MessageCompleted),
        tap((result: any) => {
          var messageDetails = result['messageDetails'];
          this.publishingMessageOfUser = messageDetails;
          this.publishingMessage();
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.SendChannelUpdateModelCompleted),
        tap((result: any) => {
          var channelUpdateModel = result['channelUpdateModel'];
          var loginCompanyId = this.cookieService.get("CompanyId");
          this.pubnub.publish({
            channel: [(loginCompanyId + '-' + channelUpdateModel.channelId)],
            message: JSON.stringify(channelUpdateModel)
          }, function (status, resopnse) {
            // console.log(status)
            // console.log(resopnse)
          })
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.SendingSignalCompleted),
        tap((result: any) => {
          var messageTypingDetails = result.messageTypingDetails;
          var signalMessage = new MessageTypingDetails();
          signalMessage.state = messageTypingDetails.state;
          console.log(messageTypingDetails, signalMessage);
          // this.pubnub.signal({
          //   channel:[messageTypingDetails.pubnubChannelNameOfMessage],
          //   message : JSON.stringify(signalMessage)
          // })
        })
      )
      .subscribe();
    const storeListner = (message) => {
      console.log("---------Received pubnub message---------");
      //this.toastr.info(message.message.Summary);
      try {
        //Receiving the User Story Assigned Notification
        if (typeof (message.message) == 'string') {
          var indexOfCurrentTopic: number;
          var messageDetailsObject = JSON.parse(message.message);
          if (messageDetailsObject.textMessage || messageDetailsObject.filePath || messageDetailsObject.messageType) {
            this.store.dispatch(new ReceiveMessageTriggered(messageDetailsObject));
          }
          else if (messageDetailsObject.isFromChannelArchive == true ||
            messageDetailsObject.isFromRemoveMember == true ||
            messageDetailsObject.refreshChannels == true || messageDetailsObject.isFromAddMember == true) {
            this.chatService.getUserChannels().subscribe((channels: any) => {
              this.channelList = channels.data;
              var loginCompanyId = this.cookieService.get("CompanyId");
              var channelName = loginCompanyId + '-' + messageDetailsObject.channelId;
              var index = this.channelList.findIndex(x => x.id == messageDetailsObject.channelId);
              if (index != -1 && (messageDetailsObject.refreshChannels == true || messageDetailsObject.isFromAddMember == true)) {
                this.pubnub.subscribe({
                  channels: [channelName]
                })
              } else {
                if (index == -1) {
                  this.pubnub.unsubscribe({
                    channels: [channelName]
                  })
                }
              }
              this.store.dispatch(new ReceiveChannelUpdateModelTriggered(messageDetailsObject));
            });
          }

          if (this.router.routerState.snapshot.url != "/chat" && messageDetailsObject.messageType != "Reaction" && messageDetailsObject.body != null && messageDetailsObject.title != null && (messageDetailsObject.isPinned == null || messageDetailsObject.isPinned == undefined) && (messageDetailsObject.isStarred == null || messageDetailsObject.isStarred == undefined) && messageDetailsObject.senderUserId != this.logInUserId) {
            if (messageDetailsObject.channelId) {
              this.chatService.getUserChannels().subscribe((channels: any) => {
                this.channelList = channels.data;
                indexOfCurrentTopic = this.channelList.findIndex(x => x.id == messageDetailsObject.channelId);
                if (indexOfCurrentTopic != -1) {
                  // this.notificationOfChat(messageDetailsObject);
                }
              });
            } else {
              // this.notificationOfChat(messageDetailsObject);
            }
          }
        } else
          if (message.message.NotificationTypeGuid == NotificationTypeIds.Notification_WorkItemAssignedToUser) {
            var userStoryAssignedNotification = new UserStoryAssignedNotification();
            userStoryAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            userStoryAssignedNotification.route = ChannelRoutes.ViewWorkItem + userStoryAssignedNotification.notificationId;
            this.store.dispatch(new NewNotificationReceived(userStoryAssignedNotification));
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.GenericNotificationActivity) {
            var userStoryAssignedNotification = new UserStoryAssignedNotification();
            userStoryAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            // userStoryAssignedNotification.route = ChannelRoutes.ViewWorkItem + userStoryAssignedNotification.notificationId;
            this.store.dispatch(new NewNotificationReceived(userStoryAssignedNotification));
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Notification_RoleUpdated) {
            var roleUpdatedNotification = new RoleUpdatedNotification();
            roleUpdatedNotification.loadFromCaseInsensitiveObject(message.message);
            roleUpdatedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(roleUpdatedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Status_Report_Sumitted) {
            var reportSubmittedNotification = new ReportSubmittedNotification();
            reportSubmittedNotification.loadFromCaseInsensitiveObject(message.message);
            reportSubmittedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(reportSubmittedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Status_Report_Config_Created) {
            var reportConfigAssignedNotification = new ReportConfigAssignedNotification();
            reportConfigAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            reportConfigAssignedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(reportConfigAssignedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Multiple_Charts_Scheduling_created) {
            var multipleChartsScheduling = new MultipleChartsScheduling();
            multipleChartsScheduling.loadFromCaseInsensitiveObject(message.message);
            multipleChartsScheduling.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(multipleChartsScheduling));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid == NotificationTypeIds.Assets_Assignment) {
            const assetAssignedNotification = new AssetAssignedNotification();
            assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            assetAssignedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Reminder_Notification.toString().toLowerCase()) {
            const assetAssignedNotification = new AssetAssignedNotification();
            assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            assetAssignedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Announcement_Received.toString().toLowerCase()) {
            const assetAssignedNotification = new AssetAssignedNotification();
            assetAssignedNotification.loadFromCaseInsensitiveObject(message.message);
            assetAssignedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(assetAssignedNotification));
            this.store.dispatch(new RolesFetchTriggered());
            // if (message.message.Id != this.announceNotificationId) {
            //   this.announceNotificationId = message.message.Id;
            //   this.openAnnouncementDialog(message.message);
            // }
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.Performance_Received.toString().toLowerCase() || message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProjectMemberRoleAddedNotificationId.toString().toLowerCase()) {
            const newProjectCreatedNotification = new NewProjectCreatedNotificationModel();
            newProjectCreatedNotification.loadFromCaseInsensitiveObject(message.message);
            newProjectCreatedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(newProjectCreatedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.NewProjectCreatedNotificationId.toString().toLowerCase() || message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProjectMemberRoleAddedNotificationId.toString().toLowerCase()) {
            const newProjectCreatedNotification = new NewProjectCreatedNotificationModel();
            newProjectCreatedNotification.loadFromCaseInsensitiveObject(message.message);
            newProjectCreatedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(newProjectCreatedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.GoalApprovedFromReplan.toString().toLowerCase()) {
            const goalApprovedNotificationModel = new GoalApprovedNotificationModel();
            goalApprovedNotificationModel.loadFromCaseInsensitiveObject(message.message);
            goalApprovedNotificationModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(goalApprovedNotificationModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.USerStoryUpdateNotificationId.toString().toLowerCase()) {
            const userStoryUpdateNotificationModel = new UserStoryUpdateNotificationModel();
            userStoryUpdateNotificationModel.loadFromCaseInsensitiveObject(message.message);
            userStoryUpdateNotificationModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(userStoryUpdateNotificationModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PushNotificationForUserStoryComment.toString().toLowerCase()) {
            const userStoryCommentNotificationModel = new UserStoryCommentNotificationModel();
            userStoryCommentNotificationModel.loadFromCaseInsensitiveObject(message.message);
            userStoryCommentNotificationModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(userStoryCommentNotificationModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.SprintStarted.toString().toLowerCase()) {
            const sprintStartedNotificationModel = new SprintStartedNotificationModel();
            sprintStartedNotificationModel.loadFromCaseInsensitiveObject(message.message);
            sprintStartedNotificationModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(sprintStartedNotificationModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.SprintRequestdForREplan.toString().toLowerCase()) {
            const sprintReplanStartedNotificationModel = new SprintReplanStartedNotificationModel();
            sprintReplanStartedNotificationModel.loadFromCaseInsensitiveObject(message.message);
            sprintReplanStartedNotificationModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(sprintReplanStartedNotificationModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProjectFeature.toString().toLowerCase()) {
            const newProjectFeatureCreatedNotification = new NewProjectFeatureCreatedNotificationModel();
            newProjectFeatureCreatedNotification.loadFromCaseInsensitiveObject(message.message);
            newProjectFeatureCreatedNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(newProjectFeatureCreatedNotification));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.UserStoryArchive.toString().toLowerCase()) {
            const newUserStoryArchiveModel = new UserStoryArchiveNotificationModel();
            newUserStoryArchiveModel.loadFromCaseInsensitiveObject(message.message);
            newUserStoryArchiveModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(newUserStoryArchiveModel));
            this.store.dispatch(new RolesFetchTriggered());
          } else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.UserStoryPark.toString().toLowerCase()) {
            const newUserStoryParkModel = new UserStoryParkNotificationModel();
            newUserStoryParkModel.loadFromCaseInsensitiveObject(message.message);
            newUserStoryParkModel.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(newUserStoryParkModel));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.LeaveApplication.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ApproveLeaveApplication.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.RejectLeaveApplication.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ResignationNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ResignationApprovalNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ResignationRejectionNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.AutoTimeSheetSubmissionNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ProbationAssignNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ReviewAssignToEmployeeNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ReviewSubmittedByEmployeeNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.ReviewInvitationNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PerformanceReviewSubmittedByEmployeeNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PerformanceReviewInvitationNotificationModel.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PerformanceReviewAssignToEmployeeNotification.toString().toLowerCase()) {
            const leaveApplicationNotification = new LeaveApplicationNotification();
            leaveApplicationNotification.loadFromCaseInsensitiveObject(message.message);
            leaveApplicationNotification.route = ChannelRoutes.ViewAccount;
            this.store.dispatch(new NewNotificationReceived(leaveApplicationNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else if (message.message.NotificationTypeGuid.toString().toLowerCase() == NotificationTypeIds.PurchaseShipmentNotificationId.toString().toLowerCase()) {
            const purchaseExecutionNotification = new LeaveApplicationNotification();
            purchaseExecutionNotification.loadFromCaseInsensitiveObject(message.message);
            purchaseExecutionNotification.route = ChannelRoutes.EditPurchaseExecution;
            this.store.dispatch(new NewNotificationReceived(purchaseExecutionNotification));
            this.store.dispatch(new RolesFetchTriggered());
          }
          else {
            // TODO: Send these errors onto server for further processing
            console.log("Found undetected notification type. " + message.message.NotificationTypeGuid);
          }
        // Add other notifications here.

      } catch (exception) {
        // TODO: Send these exceptions onto server for further processing
        console.log("Exception Occured" + exception.message);
      }
    };
    const statusOfUser = (presenceEvent) => {
      this.store.dispatch(new PresenceEventTriggered(presenceEvent));
    }
    const typingStatus = (signalEvent) => {
      this.store.dispatch(new ReceiveSignalTriggered(signalEvent));
    }
    this.chatService.getPubnubKeys().subscribe((keys: any) => {
      this.pubnub.init({
        publishKey: keys.data.publishKey,
        subscribeKey: keys.data.subscribeKey,
        uuid: this.logInUserId
      })
      this.chatService.getAllUsersForSlackApp().subscribe((colleagues: any) => {
        this.colleaguesList = colleagues.data;
        this.chatService.getUserChannels().subscribe((channels: any) => {
          this.channelList = channels.data;
          this.signOutUserChannels();
          var loginCompanyId = this.cookieService.get("CompanyId");
          if (this.channelList != undefined || this.channelList != null) {
            for (var index1 = 0; index1 < this.channelList.length; index1++) {
              this.pubnub.subscribe({
                channels: [(loginCompanyId + '-' + this.channelList[index1].id)]
              });
            }
          }
          this.pubnub.subscribe({
            channels: [('ChannelUpdates-' + loginCompanyId)]
          });
          this.pubnub.subscribe({
            channels: [('UserUpdates-' + loginCompanyId)]
          });
          var index12 = this.colleaguesList.findIndex(x => x.userId == this.logInUserId);
          if (index12 > -1) {
            var name = this.colleaguesList[index12].fullName;
            name = name.trim();
            name = this.replaceAll(name, " ", "")
            this.loginUserchannelName = (name + '-' + this.logInUserId);
            this.pubnub.subscribe({
              channels: [this.loginUserchannelName]
            });
          }
        })
      })
      this.pubnub.addListener({
        status: st => {
          if (st.category === "PNUnknownCategory") {
            var newState = {
              new: "error"
            };
            this.pubnub.setState(
              {
                state: newState
              }
              // function (status) {
              //   console.log(st.errorData.message);
              // }
            );
          }
        },
        signal: signalEvent => {
          typingStatus(signalEvent)
        },
        presence: presenceEvent => {
          statusOfUser(presenceEvent)
        },
        message: message => {
          console.log("subscribed to " + message);
          storeListner(message);
        }
      });
    });
  }
  async signOutUserChannels() {
    this.pubnub.unsubscribe({ channels: [this.loginUserchannelName] });
    var loginCompanyId = this.cookieService.get("CompanyId");
    if (this.channelList != undefined || this.channelList != null) {
      for (var index = 0; index < this.channelList.length; index++) {
        this.pubnub.unsubscribe({
          channels: [(loginCompanyId + '-' + this.channelList[index].id)]
        });
      }
    }
    this.pubnub.unsubscribe({
      channels: [('ChannelUpdates-' + loginCompanyId)]
    });
    this.pubnub.unsubscribe({
      channels: [('UserUpdates-' + loginCompanyId)]
    });
  }

  async subScribingToPresenceChannel() {
    var loginCompanyId = this.cookieService.get("CompanyId");
    var presenceChannel = "MessengerPresence-" + loginCompanyId;
    await this.pubnub.subscribe({
      channels: [presenceChannel],
      withPresence: true
    });
    this.pubnub.hereNow({
      channels: [presenceChannel],
      includeUUIDs: true,
      includeState: true
    },
      (status, response) => {
        this.store.dispatch(new InitalStateOfUsersTriggered(response))
      }
    );

  }
  publishingMessage() {
    if (this.publishingMessageOfUser.pubnubChannelNameOfMessage.length > 0) {
      this.publishingMessageOfUser.pubnubChannelNameOfMessage.forEach(channelName => {
        this.pubnub.publish({
          channel: [channelName],
          message: JSON.stringify(this.publishingMessageOfUser)
        }, function (status, resopnse) {
          // console.log(status)
          // console.log(resopnse)
        })
      });
    }
  }

  openAnnouncementDialog(announced) {
    this.dialog.closeAll();
    let dialogId = "annoucement-dialog";
    const dialogRef = this.dialog.open(this.openAnnoucementDialogComponent, {
      minWidth: "60vw",
      maxWidth: "60vw",
      minHeight: "50vh",
      maxHeight: "80vh",
      disableClose: true,
      id: dialogId,
      data: {
        dialogId: dialogId,
        announcementId: announced.AnnouncementId,
        announcement: announced.Announcement,
        announcedBy: announced.AnnouncedBy,
        announcedById: announced.AnnouncedById,
        announcedByUserImage: announced.AnnouncedByUserImage,
        announcedOn: announced.AnnouncedOn
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      const index = this.notifications.findIndex((p) => p.notificationId.toString().toLowerCase() == this.announceNotificationId.toString().toLowerCase());
      if (index > -1) {
        this.upsertReadNotification(this.notifications[index]);
      }
    });
  }
  // notificationOfChat(messageDetailsObject) {
  //   if(this.previousMessage != messageDetailsObject){
  //   this.messagesUnreadCount += 1;
  //   var imageforNotification: any;
  //   if (messageDetailsObject.senderProfileImage == null) {
  //     imageforNotification = "https://pngimage.net/wp-content/uploads/2018/05/avatar-png-images-1.png";
  //   }
  //   else {
  //     imageforNotification = messageDetailsObject.senderProfileImage;
  //   }
  //   let options = {
  //     body: messageDetailsObject.body,
  //     icon: imageforNotification,
  //     data: {
  //       senderUserId: messageDetailsObject.senderUserId,
  //       channelId: messageDetailsObject.channelId
  //     }
  //   }
  //   this.pushNotifications.create(messageDetailsObject.title, options).subscribe(
  //     res => {
  //       if (res.event.type === 'click') {
  //         window.focus();
  //         if (this.router.url != '/chat') {
  //           if (res.notification.data.channelId != null && res.notification.data.channelId != undefined) {
  //             localStorage.setItem(LocalStorageProperties.ChatId, res.notification.data.channelId);
  //           } else {
  //             localStorage.setItem(LocalStorageProperties.ChatId, res.notification.data.senderUserId);
  //           }
  //           this.router.navigate(["/chat"]);
  //         }
  //       }
  //     },
  //     err => console.log(err)
  //   );
  //   this.previousMessage = messageDetailsObject
  //   }
  // }
  upsertReadNotification(selectedNotification) {
    const notifications = [];
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
    } else if (selectedNotification.notificationTypeId.toString().toLowerCase() ==
      NotificationTypeIds.PurchaseShipmentNotificationId.toString().toLowerCase()) {
      this.router.navigate(["client/purchase-execution/" + notiifcationmodel.PurchaseGuid]);
    }
    this.store.dispatch(new UpsertUnreadNotificationsTriggered(notifications));


  }
  loadNotifications() {
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
    const projectFeatureChannelToSubscribeInto = ChannelNames.Channel_ProjectFeature + CurrentUserId;
    const userStoryArchiveChannelToSubscribeInto = ChannelNames.Channel_UserStoryArchive + CurrentUserId;
    const userStoryParkChannelToSubscribeInto = ChannelNames.Channel_UserStoryPark + CurrentUserId;
    const genericActivityNotificationChannelToSubscribeInto = ChannelNames.Channel_GenericActivityNotification + CurrentUserId;
    const purchaseExecutionAssignedChannelToSubscribeInto = ChannelNames.Channel_GenericActivityNotification + CurrentUserId;

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
    console.log("subscribing to" + projectFeatureChannelToSubscribeInto);
    console.log("subscribing to" + userStoryArchiveChannelToSubscribeInto);
    console.log("subscribing to" + userStoryParkChannelToSubscribeInto);
    console.log("subscribing to" + genericActivityNotificationChannelToSubscribeInto);
    console.log("subscribing to" + purchaseExecutionAssignedChannelToSubscribeInto);


    this.pubnub.subscribe({
      channels: [taskAssignmentChannelToSubscribeInto, tastatusReportSubmissionChannelToSubscribeInto,
        tastatusConfigAssignChannelToSubscribeInto, multiChartsSchedulingChannelToSubscribeInto,
        assetsAssignedChannelToSubscribeInto, projectCreatedChannelToSubscribeInto, ,
        projectAccessToMemberChannelToSubscribeInto, goalApprovedChannelToSubscribeInto,
        userStoryUpdateChannelToSubscribeInto, AnnouncementChannelToSubscribeInto, ReminderChannelToSubscribeInto,
        userStoryCommentChannelToSubscribeInto, sprintStartedChannelToSubscribeInto,
        sprintReplanChannelToSubscribeInto,
        PerformanceChannelToSubscribeInto,
        projectFeatureChannelToSubscribeInto,
        userStoryArchiveChannelToSubscribeInto,
        userStoryParkChannelToSubscribeInto, genericActivityNotificationChannelToSubscribeInto, purchaseExecutionAssignedChannelToSubscribeInto]
    });
    var roleUpdatesChannelToSubscribeInto = ChannelNames.Channel_RoleUpdates + "19B6F9FC-7370-4B9C-A05C-3B8D819EEEAF";
    console.log("subscribing to " + roleUpdatesChannelToSubscribeInto);
    this.pubnub.subscribe({
      channels: [roleUpdatesChannelToSubscribeInto]
    });
     var user = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if (user != null) {
      this.monitorCompanyrelatedDetails(user);
    }

  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }
  ngOnInit() {
    this.signalr.getNotificationsFromApi().subscribe();
    this.getSoftLabels();
    if (this.cookieService.check(LocalStorageProperties.DisplayWelComeNote) && this.cookieService.get(LocalStorageProperties.DisplayWelComeNote) == 'true') {
      if ((localStorage.getItem(LocalStorageProperties.UserModel) != null && localStorage.getItem(LocalStorageProperties.UserModel) != undefined)
      ) {
        this.userFullName = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel)).fullName;
      }
      var count = this.cookieService.check(LocalStorageProperties.UserLoggedInCount);
      if (count && this.cookieService.get(LocalStorageProperties.UserLoggedInCount) != 'null'
        && this.cookieService.get(LocalStorageProperties.UserLoggedInCount) != 'undefined') {
        this.loggedInCount = this.cookieService.get(LocalStorageProperties.UserLoggedInCount);
        if (this.loggedInCount == '1' || this.loggedInCount == '2') {
          this.displayWelcomeNote = true;
          setTimeout(() => {
            this.displayWelcomeNote = false;
            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
            this.cookieService.set(LocalStorageProperties.DisplayWelComeNote, 'false', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }, 8000);
        }
      }
    }
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
    const companylan = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    let currentCulturelan = companylan.lanCode;

    if (currentCulture == '' || currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
      if (currentCulturelan == '' || currentCulturelan == null || currentCulturelan == undefined || currentCulturelan === 'null' || currentCulturelan === 'undefined') {
        currentCulture = 'en';
      }
      else {
        currentCulture = currentCulturelan;
      }
    }
    this.currentLang = currentCulture;
    super.ngOnInit();
    this.loadingInProgress$ = this.store.pipe(select(sharedModuleReducers.isTimeSheetFetching));
    this.timeSheetButtonDetails$ = this.store.pipe(select(sharedModuleReducers.getTimeShettButtonDetails));
    this.timeSheetButtonDetails$
      .subscribe(data => {
        this.timesheetDisableorEnable = data;
      })
    //this.getTimeSheetButtons();
    //this.getUserStore();
    this.showTrailPeriod = false;
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;

    // this.themeModel$ = this.store.pipe(select(sharedModuleReducers.getThemeModel));
    //this.store.dispatch(new InitializeAfterLoginData());
    this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.getEmployeeIdByUserId();
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.applicationVersion = environment.version;
    this.menuType = "Main";
    this.selectedLangName = this.availableLangs.find(x => x.code == this.currentLang).name;
    this.userStoreId$ = this.store.pipe(select(sharedModuleReducers.getUserStoreId));
    this.userStoreId$.subscribe(result => {
      this.userStoreId = result;
    })
  }

  showHideDeleteButton(data) {
    this.showDeleteIcon = data.isDemoDataCleared ? false : data.isToShowDeleteIcon;
  }

  monitorCompanyrelatedDetails(user) {
    this.authenticatedUserRecord = user;
    this.showHideDeleteButton(user);
    this.companiesList = user.companiesList;
    this.getCompanyDetails(user.companyId);
    var company = this.companiesList.filter(x => x.companyId.toLowerCase() == this.cookieService.get(LocalStorageProperties.CompanyId).toLowerCase())
    this.selectedCompany = company ? company[0] : null;
    this.selectedCompanyName = company ? company[0] ? company[0].companyName : null : null;
    this.cdRef.detectChanges();
  }

  navigateToDashboards() {
    const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
    this.defaultDashboardId = this.cookieService.check(LocalStorageProperties.DefaultDashboard) ? JSON.parse(this.cookieService.get(LocalStorageProperties.DefaultDashboard)) : null;
    if (this.defaultDashboardId && userReference != "null" && userReference != null) {
      this.router.navigateByUrl("dashboard-management/dashboard/" + this.defaultDashboardId + "/form/" + userReference);
    } else if (this.defaultDashboardId) {
      this.router.navigateByUrl("dashboard-management/dashboard/" + this.defaultDashboardId);
    }
  }

  isOpened(event) {
    this.opened.emit(event);
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  async onSignout() {
    this.reload = false;
    const CurrentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    const taskAssignmentChannelToSubscribeInto = ChannelNames.Channel_TaskAssignments
      + this.cookieService.get(LocalStorageProperties.CurrentUserId);
    const tastatusReportSubmissionChannelToSubscribeInto = ChannelNames.Channel_StatusReportSubmission
      + this.cookieService.get(LocalStorageProperties.CurrentUserId);
    const tastatusConfigAssignChannelToSubscribeInto = ChannelNames.Channel_StatusConfigAssign
      + this.cookieService.get(LocalStorageProperties.CurrentUserId);
    const multiChartsSchedulingChannelToSubscribeInto = ChannelNames.Channel_MultiChartsScheduling + CurrentUserId;
    const assetsAssignedChannelToSubscribeInto = ChannelNames.Channel_AssetAssignment + CurrentUserId;
    const projectCreatedChannelToSubscribeInto = ChannelNames.Channel_NewProject + CurrentUserId;
    const projectAccessToMemberChannelToSubscribeInto = ChannelNames.Channel_ProjectMemberRole + CurrentUserId;
    const goalApprovedChannelToSubscribeInto = ChannelNames.Channel_GoalApprovedFromReplan + CurrentUserId;
    const userStoryUpdateChannelToSubscribeInto = ChannelNames.Channel_UserStoryUpdateNotification + CurrentUserId;
    const AnnouncementChannelToSubscribeInto = ChannelNames.Channel_AnnouncementNotification + CurrentUserId;
    const userStoryCommentChannelToSubscribeInto = ChannelNames.Channel_UserStoryComment + CurrentUserId;
    const sprintStartedChannelToSubscribeInto = ChannelNames.Channel_SprintStarted + CurrentUserId;
    const sprintReplanChannelToSubscribeInto = ChannelNames.Channel_SprintRequestedToReplan + CurrentUserId;
    const PerformanceChannelToSubscribeInto = ChannelNames.Channel_PeroformanceNotification + CurrentUserId;
    const ReminderChannelToSubscribeInto = ChannelNames.Channel_ReminderNotification + CurrentUserId;
    const projectFeatureChannelToSubscribeInto = ChannelNames.Channel_ProjectFeature + CurrentUserId;
    const userStoryArchiveChannelToSubscribeInto = ChannelNames.Channel_UserStoryArchive + CurrentUserId;
    const userStoryParkChannelToSubscribeInto = ChannelNames.Channel_UserStoryPark + CurrentUserId;
    const genericActivityNotificationChannelToSubscribeInto = ChannelNames.Channel_GenericActivityNotification + CurrentUserId;
    const purchaseExecutionAssignedChannelToSubscribeInto = ChannelNames.Channel_PurchaseExecutionAssignToEmployeeNotification + CurrentUserId;

    this.pubnub.unsubscribe({ channels: [taskAssignmentChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [tastatusReportSubmissionChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [tastatusConfigAssignChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [multiChartsSchedulingChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [assetsAssignedChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [projectCreatedChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [projectAccessToMemberChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [goalApprovedChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [userStoryUpdateChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [AnnouncementChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [userStoryCommentChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [sprintStartedChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [sprintReplanChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [PerformanceChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [ReminderChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [projectFeatureChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [userStoryArchiveChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [userStoryParkChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [purchaseExecutionAssignedChannelToSubscribeInto] });
    this.pubnub.unsubscribe({ channels: [this.loginUserchannelName] });
    // var loginCompanyId = this.cookieService.get("CompanyId");
    // var presenceChannel = "MessengerPresence-" + loginCompanyId;
    // this.pubnub.unsubscribe({
    //   channels: [presenceChannel],
    // });
    // if (this.channelList != undefined || this.channelList != null) {
    //   for (var index = 0; index < this.channelList.length; index++) {
    //     this.pubnub.unsubscribe({
    //       channels: [(loginCompanyId + '-' + this.channelList[index].id)]
    //     });
    //   }
    // }
    // this.pubnub.unsubscribe({
    //   channels: [('ChannelUpdates-' + loginCompanyId)]
    // });
    // this.pubnub.unsubscribe({
    //   channels: [('UserUpdates-' + loginCompanyId)]
    // });
    this.pubnub.unsubscribe({ channels: [genericActivityNotificationChannelToSubscribeInto] });
    // this.pubnub.unsubscribeAll();
    // this.pubnub.removeAllListeners();
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let companyName = this.cookieService.get(LocalStorageProperties.CompanyDetails);
    let companyId = this.cookieService.get(LocalStorageProperties.CompanyId);

    let companyDetails = this.cookieService.get(LocalStorageProperties.CompanyDetails);
    let companyTheme = this.cookieService.get(LocalStorageProperties.CompanyTheme);
    let UserLoggedInCount = this.cookieService.get(LocalStorageProperties.UserLoggedInCount);
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
    this.cookieService.deleteAll(environment.cookiePath);
    this.cookieService.delete("selectedProjectsTab");


    this.cookieService.set(LocalStorageProperties.UserLoggedInCount, UserLoggedInCount, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CurrentCulture, currentCulture, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CurrentUser, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CurrentUserId, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyName, companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyId, companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.DefaultDashboard, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyDetails, companyDetails, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyTheme, companyTheme, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.SearchClick, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.UserModel, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.EnableTeamDashboard, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    localStorage.setItem(LocalStorageProperties.Dashboards, null);
    localStorage.setItem(LocalStorageProperties.UserReferenceId, null);
    localStorage.setItem(LocalStorageProperties.RoleFeatures, null);
    localStorage.removeItem(LocalStorageProperties.UserRoleFeatures);
    localStorage.removeItem(LocalStorageProperties.RedirectionUrl);
    localStorage.removeItem(LocalStorageProperties.SideBarMenuItems);
    localStorage.removeItem(LocalStorageProperties.IntroModules);
    this.cookieService.set(LocalStorageProperties.AddOrEditCustomAppIsRequired, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");

    this.router.navigate(["/sessions/signin"]);
    return false;
  }

  setLang() {
    this.translate.use(this.currentLang);
    console.log(this.window.location.hostname);
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.set(LocalStorageProperties.CurrentCulture, this.currentLang, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.selectedLangName = this.availableLangs.find(x => x.code == this.currentLang).name;
  }

  changeTheme(theme) {
    this.themeService.changeTheme(theme);
  }

  toggleNotific() {
    // this.getUnreadNotifications();
  }

  toggleRecording() {
    this.getActTrackerRecorder();
    var user = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if (user != null) {
      this.monitorCompanyrelatedDetails(user);
    }
  }

  getNotifications() {
    const notificationSearchModel = new AppNotification();
    this.store.dispatch(new ClearAllUnreadNotificationsTriggered(notificationSearchModel));
    this.unreadCountOfNotifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationUnreadTotal));
  }

  getUnreadNotifications() {
    const notificationSearchModel = new AppNotification();
    this.store.dispatch(new ClearUnreadNotificationsTriggered(notificationSearchModel));
    this.unreadCountOfNotifications$ = this.store.pipe(select(sharedModuleReducers.getNotificationUnreadTotal));
  }

  getActTrackerRecorder() {
    this.commonService.getActTrackerRecorder().subscribe((response: any) => {
      if (response.success) {
        this.isRecording = response.data;
      }
    });
  }

  clearDemoData() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: "30%",
      width: "30%",
      hasBackdrop: true,
      direction: "ltr",
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }


  exportConfigurationDialogData() {
    const dialogRef = this.dialog.open(ExportConfigurationDialogComponent, {
      height: "45%",
      width: "40%",
      hasBackdrop: true,
      direction: "ltr",
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }

  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === "closed") {
      return this.layout.publishLayoutChange({
        sidebarStyle: "full"
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: "closed"
    });
    setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 250);
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === "compact") {
      return this.layout.publishLayoutChange(
        {
          sidebarStyle: "full"
        },
        { transitionClass: true }
      );
    }

    // * --> compact
    this.layout.publishLayoutChange(
      {
        sidebarStyle: "compact"
      },
      { transitionClass: true }
    );
  }

  public getTimeSheetButtons() {
    //this.loadingInProgress = true;
    // this.commonService.getTimeSheetEnabledInformation().pipe(takeUntil(this.ngDestroyed$))
    //   .subscribe((data: any) => {
    //     if (data === "" || data === undefined) {
    //       return;
    //     }
    //     this.timesheetDisableorEnable = JSON.parse(data);
    //     this.loadingInProgress = false;
    //   });
    this.store.dispatch(new FetchTimeSheetButtonDetails());
  }

  closeFeedTimeSheet() {
    this.feedTimeSheetPopover.close();
    this.isFeedTimeSheet = false;
  }

  openTimeSheet() {
    const projectDialog = this.dialog.open(FeedTimeDialogComponent, {
      minWidth: '30vw',
      height: '35vh',
      data: !this.isFeedTimeSheet
      //disableClose: true
    });
    projectDialog.afterClosed().subscribe(() => {
      this.closeFeedTimeSheet();
    });
    this.getTimeSheetButtons();
    // this.isFeedTimeSheet = !this.isFeedTimeSheet;
  }

  // getAllMenuItems() {
  //   this.store.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
  // }

  changeMenuType(type) {
    this.menuType = type;
  }

  openFeedBackDialog() {
    this.isFeedBackDialog = true;
  }

  closeFeedBacklogDialog() {
    this.isFeedBackDialog = false;
    this.feedBackPopOver.close();
  }

  getCompanyDetails(companyId: string) {
    if (this.cookieService.check(LocalStorageProperties.CompanyDetails) && this.cookieService.check(LocalStorageProperties.CompanyId)) {
      this.company = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    }
    if (!this.company) {
      this.commonService.getCompanyById(companyId).subscribe((response: any) => {
        this.company = response.data;

        if (this.company.isRemoteAccess == 1 && this.company.trailDays > 0) {
          this.showTrailPeriod = true;
          // this.noOfDays=this.company.noOfDays;
        }
        if (this.company.isDemoData == true) {
          this.showDelete = true;
        } else {
          this.showDelete = false;
        }
        if (this.company.isDemoData == false || this.company.isDemoData == null) {
          this.showDelete = false;
        }
        if (this.company != null && this.company != undefined && this.company.industryId.toUpperCase() == '7499F5E3-0EF2-4044-B840-2411B68302F9')
          this.isStoreAccess = false;
        else
          this.isStoreAccess = true;
      });
    }
    else {
      if (this.company.isRemoteAccess == 1 && this.company.trailDays > 0) {
        this.showTrailPeriod = true;
        // this.noOfDays=this.company.noOfDays;
      }
      if (this.company.isDemoData == true) {
        this.showDelete = true;
      }
      if (this.company.isDemoData == false || this.company.isDemoData == null) {
        this.showDelete = false;
      }
      if (this.company != null && this.company != undefined && this.company.industryId.toUpperCase() == '7499F5E3-0EF2-4044-B840-2411B68302F9')
        this.isStoreAccess = false;
      else
        this.isStoreAccess = true;
    }
  }

  getUserStore() {
    let storeSearchModel = new StoreSearchModel();
    storeSearchModel.isArchived = false;
    storeSearchModel.isDefault = true;
    storeSearchModel.isCompany = false;
    this.store.dispatch(new GetUserStoreIdTriggered(storeSearchModel));
  }

  goToUserStore() {
    if (this.cookieService.get(LocalStorageProperties.CurrentUserId))
      this.router.navigate(["document/store", this.userStoreId, this.cookieService.get(LocalStorageProperties.CurrentUserId).toLowerCase()]);
  }

  selectAfterlogin(e) {
    this.companyId = e.companyId
    this.selectedCompanyName = e.companyName;
    this.selectedCompany = e;
  }

  async selectCompany(e) {
    if (this.cookieService.get(LocalStorageProperties.CompanyId).toLowerCase() != e.companyId.toString().toLowerCase()) {
      this.reload = false;
      console.log(e);
      this.companyId = e.companyId;
      this.selectedCompanyName = e.companyName;
      this.selectedCompany = e;
      this.loading = true;
      this.searchText = null;
      this.ngxService.start();
      this.authService.companyLogin(this.selectedCompany).subscribe(async (userToken: any) => {
        if (userToken.success) {
          await this.onSignout();
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set(LocalStorageProperties.CurrentUser, e.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CurrentUserId, e.userId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CurrentUser, userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("DefaultDashboard", userToken.data.defaultDashboardId ? JSON.stringify(userToken.data.defaultDashboardId.workspaceId) : null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set('CompanyDetails', JSON.stringify(userToken.data.companyDetails));
          this.cookieService.set('CompaniesList', JSON.stringify(userToken.data.usersModel.companiesList)),
            localStorage.setItem('RoleFeatures', JSON.stringify(userToken.data.roleFeatures));
          localStorage.setItem("UserModel", JSON.stringify(userToken.data.usersModel));
          localStorage.setItem('SoftLabels', JSON.stringify(userToken.data.softLabels));
          localStorage.setItem("CompanySettings", JSON.stringify(userToken.data.companySettings));
          localStorage.setItem("FromLogIn", JSON.stringify(true));
          this.cookieService.set(LocalStorageProperties.CompanyName, userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CompanyId, userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          //this.store.dispatch(new UserDetailsFetchedAfterCompanyLogin(userToken.data.usersModel));
          this.setDafaultLanguage();
        }
        this.loading = false;
        this.ngxService.stop();
      });
    }
  }

  setDafaultLanguage() {
    const company = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    let currentCulture = company.lanCode;
    if (currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
      currentCulture = 'en';
    }
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.set(LocalStorageProperties.CurrentCulture, currentCulture, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.currentLang = currentCulture;
    this.translate.use(this.currentLang);
  }


  getEmployeeIdByUserId() {

  }

  navigateToProfile() {
    this.commonService.getUserById(this.cookieService.get(LocalStorageProperties.CurrentUserId).toLowerCase()).subscribe((response: any) => {
      if (response.success == true) {
        this.employeeId = response.data.employeeId;
        if (this.employeeId) {
          this.router.navigate(["dashboard/profile", this.cookieService.get(LocalStorageProperties.CurrentUserId).toLowerCase(), "overview"]);
        }
        else {
          this.router.navigate(["dashboard/myProfile", this.cookieService.get(LocalStorageProperties.CurrentUserId).toLowerCase()]);
        }
      }
    });
  }



  navigateToMessenger() {
    this.router.navigate(["/chat"]);
  }


  navigateToStatusReport() {
    const projectDialog = this.dialog.open(WorkItemsDialogComponent, {
      minWidth: '82vw',
      height: '82vh',
      data: { dashboardFilters: this.dashboardFilters },
      disableClose: true
    });
    projectDialog.afterClosed().subscribe(() => { });
  }
  navigateToSettings() {
    this.router.navigate(["/settings"]);
  }

  alternateSignIn() {
    this.router.navigate(["/sessions/generic-signin"]);
  }

  navigateToRoles() {
    this.router.navigate(["/rolemanagement/rolemanagement"]);
  }

  navigateToUrl(workspaceId) {
    const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
    if (userReference != "null" && userReference != null) {
      this.router.navigateByUrl("dashboard-management/dashboard/" + workspaceId + "/form/" + userReference);
    } else {
      this.router.navigateByUrl("dashboard-management/dashboard/" + workspaceId);
    }
  }

  addUploadFilePopupOpen(fileUploadDropzonePopup) {
    fileUploadDropzonePopup.openPopover();
  }
  setLabelNameForDropzone(fileName) {
    return fileName.substring(0, 20) + "...";
  }
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length > 0) {
      this.filesPresent = true;
    } else {
      this.filesPresent = false;
    }
  }
  removeAllFiles() {
    this.filesPresent = false;
    this.files = [];
  }
  filesSelected(event) {
    this.files.push(...event.addedFiles);
    if (this.files.length > 0) {
      this.filesPresent = true;
    }
  }

  closeUploadFilePopup() {
    this.fileUploadDropzonePopup.forEach((p) => p.closePopover());
    this.files = [];
    this.fileResultModel = [];
  }
  saveFiles() {
    this.anyOperationInProgress = true;
    const formData = new FormData();
    this.files.forEach((file: File) => {
      this.fileIndex = this.fileIndex + 1;
      const fileKeyName = "file" + this.fileIndex.toString();
      formData.append(fileKeyName, file);
    });

    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.UploaderOnInit(environment.apiURL + ApiUrls.UploadFileChunks);
  }
  private UploaderOnInit(url: string): void {
    let progress = 0;
    const r = new Resumable({
      target: url,
      chunkSize: 1 * 1024 * 1024, //3 MB
      query: { moduleTypeId: this.moduleTypeId },
      headers: {
        "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
      },
    });
    r.addFiles(this.files);
    r.on('fileAdded', (file, event) => {
      if (!this.fileResultModel || this.fileResultModel.length > 0) {
        this.fileResultModel = [];
        this.cdRef.detectChanges();
      }
      r.upload()
    });
    r.on('complete', (event) => {
      r.files.pop();
      this.progressValue = 0;
      this.filesPresent = false;
      this.uploadedFileNames = [];
      this.fileCounter = 1;
      this.fileIndex = 0;
      this.anyOperationInProgress = false;
    });
    r.on('progress', () => {
      progress = Math.round(r.progress() * 100);
      this.progressValue = progress;
      this.cdRef.detectChanges();
    });
    r.on('fileSuccess', (file, response) => {
      if (file && file.fileName) {
        if (!this.uploadedFileNames.find(x => x == file.fileName)) {
          this.uploadedFileNames.push(file.fileName)
          this.fileCounter = this.uploadedFileNames.length;

          let result = JSON.parse(response);
          if (result && result.length > 0) {
            if (!this.fileResultModel) {
              this.fileResultModel = [];
            }
            let fileResult = new FileResultModel();
            fileResult.fileExtension = result[0].FileExtension;
            fileResult.fileName = result[0].FileName;
            fileResult.filePath = result[0].FilePath;
            fileResult.fileSize = result[0].FileSize;
            this.fileResultModel.push(fileResult);
            if (result[0].FilePath != null && result[0].FilePath != "")
              this.importDynamicJson(result[0].FilePath);
            else
              this.closeUploadFilePopup();
          }
          this.cdRef.detectChanges();
        }
      }
    });
  }

  importDynamicJson(configuredJsonURL) {
    var importConfigurationModel = new ImportConfigurationModel();
    importConfigurationModel.configurationUrl = configuredJsonURL;
    this.importingInProgress = true;
    this.commonService.SystemImportConfiguration(importConfigurationModel).subscribe((response: any) => {
      if (response.success === true) {
        this.closeUploadFilePopup();
        this.toastr.success("Data imported successfully");
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.importingInProgress = false;
    });
  }

  closeSearch() {
    this.searchText = null;
  }

  searchCompanies(companies, search) {
    if (search == null || search == '') {
      return companies;
    } else if (search != null) {
      search = search.toLowerCase();
      search = search.trim();
      const temp = companies.filter(data =>
        data.companyName.toString().toLowerCase().indexOf(search) > -1
      )
      return temp;
    }
  }

  trackByCompanyId(index: number, company: any): string {
  return company.companyId;
}


  ngOnDestroy() {
    // this.pubnub.unsubscribe({ channels: [this.loginUserchannelName] });
    // var loginCompanyId = this.cookieService.get("CompanyId");
    // if (this.channelList != undefined || this.channelList != null) {
    //   for (var index = 0; index < this.channelList.length; index++) {
    //     this.pubnub.unsubscribe({
    //       channels: [(loginCompanyId + '-' + this.channelList[index].id)]
    //     });
    //   }
    // }
    //  this.pubnub.unsubscribe({
    //   channels: [('ChannelUpdates-' + loginCompanyId)]
    // });
    // this.pubnub.unsubscribe({
    //   channels: [('UserUpdates-' + loginCompanyId)]
    // });
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
  onNavigateToBillingScreen() {
    this.router.navigate(["/shell/Accounts"]);
  }

  onNavigateToPricingScreen() {
    this.router.navigate(["/shell/payments-plans"]);
  }
  getIntroDetails() {
    var intro = new IntroModel();
    intro.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.commonService.getIntroDetails(intro).subscribe((responseData: any) => {
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.anyOperationInProgress = false;
        this.toastr.error(this.validationMessage);
      }
      else if (responseData.success == true) {
        let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
        if (!intro)
          localStorage.setItem(LocalStorageProperties.IntroModules, JSON.stringify(responseData.data));
      }
    });
  }

  getTeamMembers() {
    var teamMemberModel;
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    var teamMemberModel;
    teamMemberModel = {
      isForTracker: true
    }
    teamMemberModel.isArchived = false;
    this.commonService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
      let employeesDropDown = responseData.data;
      if (employeesDropDown && employeesDropDown.length > 1) {
        this.cookieService.set(LocalStorageProperties.EnableTeamDashboard, 'true', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      }
      else {
        this.cookieService.set(LocalStorageProperties.EnableTeamDashboard, 'false', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      }
    })
  }
}
