import { AfterViewInit, Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { ChatService } from '../../services/chat.service';
import { PushNotificationsService } from 'ng-push-ivy';
import { ChatComponent } from '../chat-display/ChatComponent.component';
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../../../lib/globaldependencies/constants/localstorage-properties';
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State, MessageActionTypes, CountTriggered, MessageTriggered,ReceiveChannelUpdateModelCompleted,SendingSignalTriggered,ReceiveSignalCompleted,RequestingStateOfUsersTriggered, SendChannelUpdateModelTriggered  } from "@snovasys/snova-shell-module";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import Resumable from "resumablejs";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from "@ngx-translate/core";
import { ApiUrls } from '../../../../lib/globaldependencies/constants/api-urls';
import { Guid } from "guid-typescript";
import { MessageDetails } from '../../models/messageDetails';
import { CustomAppBaseComponent } from '../../../../lib/globaldependencies/components/componentbase';
import { MatMenuTrigger } from '@angular/material/menu';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateChannelDialog } from "../../dialogs/create-channel/create-channel-dialog";
import { ChannelUpdateModel } from '../../models/channelUpdateModel';
import { ChannelMemberModel } from '../../models/channelUpdateModel';
import { PushNotificationDialog } from "../../dialogs/push-notification/push-notifications-dialog";


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
})
export class MessengerComponent extends CustomAppBaseComponent implements OnInit, AfterViewInit {
  @ViewChild(ChatComponent) ChatComponent;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  displayingList = "colleagues";
  loggedInUserId = this.cookieService.get("CurrentUserId");
  loggedInuserCompanyId = this.cookieService.get("CompanyId");
  selectedcolleagueId: any;
  selectedChannelId: any;
  selectedRecentChatId: any;
  selectedColleague: any;
  colleague: any;
  channel: any;
  recentChat: any;
  searchText: string;
  colleaguesTemp: any = [];
  recentsTemp:any =[];
  userId: any;
  receiverId: any;
  profileImage: any;
  fullName: any;
  channelName: any;
  loggedInUserChannelName: any;
  id: any;
  userChannels = [];
  colleaguesList: [any];
  channelList: any;
  recentIndividualMessages: any;
  recentGroupMessages: any;
  recentChatsList = [];
  unReadMessages: any;
  previousColleague = null;
  previousChannel = null;
  previousRecentChat = null;
  senderDetails: string = "";
  selectedChannelIndex: number;
  selectedColleagueIndex: number;
  messageToChatComponent: any;
  currentChannelPosition: boolean = true;
  currentPosition: boolean;
  colleaguesTotalUnreadCount = 0;
  channelsTotalUnreadCount = 0;
  loggedInUserfullName: any;
  loggedInuserProfileImage: any;
  taggedme: boolean = false;
  messageReactions = [];
  totalFileCount: number = 0;
  fileCounter: number = 0;
  display: string = 'none';
  environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  progressValue: number;
  uploading: boolean = false;
  colleaguePresentedInArchivedChannel: boolean = false;
  ngDestroyed$ = new Subject();
  messageCount: number;
  previousMessageId : any;
  refreshChannelMemberList: boolean = false;
  channelToArchive: any;
  typingChannelName:any;
  typingStatus =  false;
  constructor( private pushNotifications: PushNotificationsService,
    private chatService: ChatService, private router: Router, private cdRef: ChangeDetectorRef, private translateService: TranslateService,
    private cookieService: CookieService, private toastr: ToastrService, private actionUpdates$: Actions,
    private store: Store<State>, private dialog: MatDialog) {
    super();
    this.pushNotifications.requestPermission();
    this.showPushNotificationDialog();
    this.chatService.getAllUsersForSlackApp().subscribe((colleagues: any) => {
      var uniq = {};
      colleagues.data = colleagues.data.filter(obj => !uniq[obj.userId] && (uniq[obj.userId] = true));
      this.colleaguesList = colleagues.data;
      this.colleaguesList.forEach(colleague => {
        colleague.messagesUnReadCount = 0;
        colleague.statusOfUser = false;
        colleague.typingStatus = false;
      })
      this.colleaguesTemp = this.colleaguesList;
      this.totalUnreadCount();
      var index = this.colleaguesList.findIndex(x => x.userId == this.loggedInUserId);
      this.loggedInUserfullName = this.colleaguesList[index].fullName;
      this.loggedInuserProfileImage = this.colleaguesList[index].profileImage;
      this.loggedInUserChannelName = this.generateChannelName(this.loggedInUserfullName, this.loggedInUserId);
      this.chatService.getUserChannels().subscribe((channels: any) => {
        if (channels.data != null) {
          this.channelList = channels.data;
          for (var i = 0; i < this.channelList.length; i++) {
            this.channelList[i].typingStatus = false;
            this.channelList[i].pubnubChannelName = this.loggedInuserCompanyId + '-' + this.channelList[i].id;
            this.channelsTotalUnreadCount += this.channelList[i].messagesUnReadCount;
          }
          this.previousChannel = this.channelList[0];
        }
      });
        this.chatService.getRecentIndividualMessages().subscribe((recentColleagueMessages: any) => {
          var uniq = {};
          recentColleagueMessages.data = recentColleagueMessages.data.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
          this.recentIndividualMessages = recentColleagueMessages.data;
          if (this.recentIndividualMessages != null && this.recentIndividualMessages != undefined) {
            this.recentIndividualMessages.forEach(element => {
              var index = this.colleaguesList.findIndex(x => x.userId == element.id);
              this.colleaguesList[index].messagesUnReadCount = element.unreadMessageCount;
              this.colleaguesTotalUnreadCount += this.colleaguesList[index].messagesUnReadCount;
            });
            this.colleaguesTemp = this.colleaguesList;
          }
          this.openConversationByNotification();
        });

        this.colleaguesList.sort((a, b) => {
          let fa = a.fullName.toLowerCase(),
            fb = b.fullName.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });

        var currentIndex = colleagues.data.map(function (colleaguesList) { return colleaguesList.id; }).indexOf(this.loggedInUserId);
        function moveCurrentLoggedInUserToFirstIndex(colleaguesList, current_index, first_index) {
          colleagues.data.splice(first_index, 0, colleagues.data.splice(current_index, 1)[0]);
          return colleaguesList;
        };

        moveCurrentLoggedInUserToFirstIndex(colleagues, currentIndex, 0);
        var loginUserFullname = this.colleaguesList[0].fullName + ' (me)';
        this.colleaguesList[0].fullName = loginUserFullname;
        this.colleaguesList[0].statusOfUser = true;
        this.store.dispatch( new RequestingStateOfUsersTriggered(true));
          this.chatService.getRecentConversations().subscribe((recentConversations: any) => {
            if (recentConversations.data != null && recentConversations.data != undefined) {
              recentConversations.data.forEach(element => {
                var foundInRecents = this.recentChatsList.findIndex(x => x.userId == element.receiverId)
                if (foundInRecents == -1) {
                  var colleagueIndexInColleagueList = this.colleaguesList.findIndex(x => x.userId == element.receiverId);
                  if (colleagueIndexInColleagueList != -1) {
                    this.recentChatsList.push(this.colleaguesList[colleagueIndexInColleagueList]);
                  }
                }
              });
              this.recentsTemp = this.recentChatsList;
            }

          });        
          this.colleaguesTemp = this.colleaguesList;
        });
          this.actionUpdates$
        .pipe(
          takeUntil(this.ngDestroyed$),
          ofType(MessageActionTypes.InitalStateOfUsersCompleted),
          tap((result: any) => {
            if (result != null && result != undefined && result != '' && result != "null" && result != "undefined") {
              var initialStatusOfUsers = result;
              result = initialStatusOfUsers['initialStatusOfUsers'];
              var presenceChannel = "MessengerPresence-" + this.loggedInuserCompanyId;
              var list = result.channels;
              var new_list = list[presenceChannel];
              var presenceOfUserDetails = new_list['occupants'];
              if (presenceOfUserDetails && presenceOfUserDetails.length > 0) {
                this.totalUnreadCount();
                if (this.colleaguesList != null && this.colleaguesList && undefined && this.colleaguesList != []) {
                  this.intialStateOfUser(presenceOfUserDetails);
                } else {
                    this.intialStateOfUser(presenceOfUserDetails);
                }
              }
            }
          })
        )
        .subscribe();
        this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.ReceiveChannelUpdateModelCompleted),
        tap((result: any) => {
          if (result != null && result != undefined && result != '' && result != "null" && result != "undefined") {
            this.receivedMessage(result.channelUpdateModel)
          }
        })
      )
      .subscribe();
      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(MessageActionTypes.ReceiveSignalCompleted),
        tap((result: any) => {
          var typingDetails = result['messageTypingDetails']
          var index =  this.colleaguesList.findIndex(x => x.userId == typingDetails.publisher);
         var channelIdIndex = this.channelList.findIndex(x => x.pubnubChannelName == typingDetails.channel);
          var typingState = JSON.parse(typingDetails.message)
          if( typingState.State == 'yes' && channelIdIndex == -1 ){
          this.colleaguesList[index].typingStatus = true; 
          }else if(typingState.State == 'no' && channelIdIndex == -1){
            this.colleaguesList[index].typingStatus = false;  
          }else if(typingState.State == 'yes' && channelIdIndex != -1 && this.loggedInUserId != typingDetails.publisher ){
             this.channelList[channelIdIndex].typingStatus = true;
             this.typingChannelName = this.colleaguesList[index].fullName;
          }else{
            this.channelList[channelIdIndex].typingStatus = false;
            this.typingChannelName = this.colleaguesList[index].fullName;
          }
          this.colleaguesTemp = this.colleaguesList;
        })
      )
      .subscribe();
      this.actionUpdates$
        .pipe(
          takeUntil(this.ngDestroyed$),
          ofType(MessageActionTypes.ReceiveMessageCompleted),
          tap((result: any) => {
            if (result != null && result != undefined && result != '' && result != "null" && result != "undefined") {
              if(this.previousMessageId!= result.messageDetails.id){
              this.receivedMessage(result.messageDetails)
              this.previousMessageId = result.messageDetails.id
              }
            }
          })
        )
        .subscribe();

      this.actionUpdates$
        .pipe(
          takeUntil(this.ngDestroyed$),
          ofType(MessageActionTypes.PresenceEventCompleted),
          tap((result: any) => {
            if (result != null && result != undefined && result != '' && result != "null" && result != "undefined") {
              var employeeStatusModel = result.employeeStatusModel;
              var presenceChannel = "MessengerPresence-" + this.loggedInuserCompanyId;
              if (employeeStatusModel.channel == presenceChannel) {
                var publisher = employeeStatusModel.uuid;
                var index = this.colleaguesList.findIndex(x => x.userId == publisher);
                if (employeeStatusModel.action == "join") {
                  this.colleaguesList[index].statusOfUser = true;
                } else {
                  this.colleaguesList[index].statusOfUser = false;
                }
                this.colleaguesTemp = this.colleaguesList;
              }
            }
          })
        )
        .subscribe();
  }

  ngAfterViewInit() { }
  ngOnInit() {
    super.ngOnInit();
    this.chatService.getRecentChannelMessages().subscribe((recentChannelMessages: any) => {
      this.recentGroupMessages = recentChannelMessages.data;
    });

  }
  onContextMenu(event, channel) {
    this.channelToArchive = channel;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX-50 + 'px';
    this.contextMenuPosition.y = event.clientY-50 + 'px';
    this.contextMenu.openMenu();
  }
  totalUnreadCount() {
    this.messageCount = 0;
    this.store.dispatch(new CountTriggered(this.messageCount));
  }

  intialStateOfUser(presenceOfUserDetails) {
    presenceOfUserDetails.forEach(user => {
      var index = this.colleaguesList.findIndex(x => x.userId == user.uuid);
      if (index != -1) {
        this.colleaguesList[index].statusOfUser = true;
        this.colleaguesTemp = this.colleaguesList;
      }
    });
  }

  openConversationByNotification() {
    var foundId = localStorage.getItem(LocalStorageProperties.ChatId);
    if (foundId == null || foundId == undefined || foundId == "null" || foundId == "undefined") {
      this.changeColleague(this.colleaguesList[0]);
    } else {
      var index = this.colleaguesList.findIndex(x => x.userId == foundId);
      if (index != -1) {
        this.displayingList = "colleagues";
        this.changeColleague(this.colleaguesList[index]);
      } else {
        index = this.channelList.findIndex(x => x.id == foundId);
        if (index != -1) {
          this.displayingList = "channels";
          this.changeChannel(this.channelList[index]);
        }
      }
      localStorage.setItem(LocalStorageProperties.ChatId, null);
    }
  }

  archiveChannel() {
    var inputModel = new ChannelUpdateModel();
    inputModel.channelName = this.channelToArchive.channelName;
    inputModel.channelId = this.channelToArchive.id;
    // inputModel.channelImage = this.data.loggedInuserProfileImage;
    inputModel.isDeleted = true;
    var member = new ChannelMemberModel();
    member.memberUserId = this.loggedInUserId;
    member.isReadOnly = false;
    inputModel.channelMemberModel = [member];
    this.chatService.upsertChannel(inputModel).subscribe((res: any) => {
      if(res.success == false) {
        this.toastr.error("Topic Creation failed","Failed");
      } 
    });  
  }


  async receivedMessage(messageDetails) {  
    
    if((messageDetails.isPinned == null || messageDetails.isPinned == undefined) &&  (messageDetails.isStarred == null || messageDetails.isStarred == undefined)) 
    { 
    if (messageDetails.refreshChannels == true || messageDetails.isFromAddMember == true || messageDetails.isFromRemoveMember == true || messageDetails.isFromChannelArchive == true) {
      if(messageDetails.isFromChannelArchive == true && this.selectedChannelId == messageDetails.channelId && this.displayingList == "channels") {
        this.colleaguePresentedInArchivedChannel = !this.colleaguePresentedInArchivedChannel;
      }
        this.chatService.getUserChannels().subscribe((channels: any) => {
          if (channels.data != null) {
            this.channelList = channels.data;  
            this.channelsTotalUnreadCount = 0;
            for (var i = 0; i < this.channelList.length; i++) {
              this.channelList[i].typingStatus = false;
              this.channelList[i].pubnubChannelName = this.loggedInuserCompanyId + '-' + this.channelList[i].id;
              this.channelsTotalUnreadCount += this.channelList[i].messagesUnReadCount;
            }        
          }
          if(channels.success && messageDetails.refreshChannels == true) {
            if(messageDetails.fromUserId == this.loggedInUserId) {
              var index = this.channelList.findIndex(x => x.id == messageDetails.channelId)
              this.changeChannel(this.channelList[index]);
            }
          }
          if(channels.success && messageDetails.isFromRemoveMember == true && this.selectedChannelId == messageDetails.channelId && this.displayingList == "channels") {
            var index = this.channelList.findIndex(x => x.id == messageDetails.channelId)
            if(index == -1)
             this.changeChannel(this.channelList[0]);            
          }
        });
      
      if(messageDetails.isFromAddMember == true || messageDetails.isFromRemoveMember == true) {
        if(messageDetails.channelId == this.selectedChannelId && this.displayingList == "channels") {
          this.refreshChannelMemberList = !this.refreshChannelMemberList;
        }
      }
    }
    else {
      if (messageDetails.channelId) {
        if (messageDetails.channelId == this.selectedChannelId && this.displayingList == "channels") {
          this.messageToChatComponent = messageDetails;
        }
        else {
          if (messageDetails.body.indexOf(this.loggedInUserfullName) != -1) {
            this.taggedme = true;
          }
          if (messageDetails.messageType != "Reaction" && messageDetails.senderUserId != this.loggedInUserId) {
            this.sendMessageNotificationToUser(messageDetails);
            var channelIndex = this.channelList.findIndex(x => x.id == messageDetails.channelId);
            this.channelList[channelIndex].messagesUnReadCount += 1;
            this.channelsTotalUnreadCount += 1;
            this.totalUnreadCount();
          }
        }
      }
      else {
        if( this.recentChatsList && messageDetails.channelId==null){
          var index = this.recentChatsList.findIndex(x => x.userId == messageDetails.senderUserId)
          if (index == -1) {
            var index1 = this.colleaguesList.findIndex(x => x.userId == messageDetails.senderUserId);
            this.recentChatsList.push(this.colleaguesList[index1]);
          }
          this.recentsTemp = this.recentChatsList;
        }
        if (messageDetails.senderUserId == this.loggedInUserId) {
          if ((messageDetails.receiverUserId == this.selectedcolleagueId) && (this.displayingList == "colleagues" || this.displayingList == "recentChats")) {
            this.messageToChatComponent = messageDetails;
          }
        } else {
          if ((messageDetails.senderUserId == this.selectedcolleagueId) && (this.displayingList == "colleagues" || this.displayingList == "recentChats")) {
            this.messageToChatComponent = messageDetails;
          }
          else {
            if (messageDetails.messageType != "Reaction") {
              this.sendMessageNotificationToUser(messageDetails);
              var index = this.colleaguesList.findIndex(x => x.userId == messageDetails.senderUserId);
              this.colleaguesList[index].messagesUnReadCount += 1;
              this.colleaguesTotalUnreadCount += 1;
              this.totalUnreadCount();
              this.colleaguesTemp = this.colleaguesList;
            }
          }
        }
      }
    }
   }
  }

  sendMessageNotificationToUser(messageDetails) {
    var imageforNotification: any;
    if (this.loggedInUserId != messageDetails.senderUserId) {
      if (messageDetails.senderProfileImage == null) {
        imageforNotification = "https://pngimage.net/wp-content/uploads/2018/05/avatar-png-images-1.png";
      } else {
        imageforNotification = messageDetails.senderProfileImage;
      }
      let options = {
        body: messageDetails.body,
        icon: imageforNotification,
        data: {
          senderUserId: messageDetails.senderUserId,
          channelId: messageDetails.channelId
        }
      }
      this.pushNotifications.create(messageDetails.title, options).subscribe(
        res => {
          if (res.event.type === 'click') {
            window.focus();
            if (this.router.url != '/chat') {
              if (res.notification.data.channelId != null && res.notification.data.channelId != undefined) {
                localStorage.setItem(LocalStorageProperties.ChatId, res.notification.data.channelId);
              } else {
                localStorage.setItem(LocalStorageProperties.ChatId, res.notification.data.senderUserId);
              }
              this.router.navigate(["/chat"]);
            } else {
              if (res.notification.data.channelId != null && res.notification.data.channelId != undefined) {
                var channelDetails: any;
                this.displayingList = "channels";
                channelDetails = this.channelList.find(x => x.id == res.notification.data.channelId);
                this.changeChannel(channelDetails);
              } else if (res.notification.data.senderUserId != null && res.notification.data.senderUserId != undefined) {
                var colleagueDetails: any;
                this.displayingList = "colleagues";
                colleagueDetails = this.colleaguesList.find(x => x.userId == res.notification.data.senderUserId);
                this.changeColleague(colleagueDetails);
              }
            }
          }
        },
        err => console.log(err)
      );
    }
  }

  generateChannelName(name: String, id: String) {

    name = name.trim();
    name = this.ChatComponent.replaceAll(name, " ", "")
    return (name + '-' + id);
  }

  getChannelsList() {
    this.closeSearch();
    this.displayingList = "channels";
    this.changeChannel(this.previousChannel);
  }
  getColleaguesList() {
    this.closeSearch();
    this.displayingList = "colleagues";
    this.changeColleague(this.previousColleague);
  }
  getRecentChatsList() {
    this.closeSearch();
    this.displayingList = "recentChats";
    this.changeColleague(this.previousColleague);
  }
  changeColleague(colleague) {
    this.closeSearch();
    this.selectedcolleagueId = colleague.userId;
    this.fullName = colleague.fullName;
    this.userId = colleague.userId
    this.colleague = colleague;
    this.channel = null;
    this.recentChat = null;
    this.previousColleague = colleague;
    var index = this.colleaguesList.findIndex(x => x.userId == this.selectedcolleagueId);
    if (this.colleaguesList[index].messagesUnReadCount) {
      this.colleaguesTotalUnreadCount -= this.colleaguesList[index].messagesUnReadCount;
      this.colleaguesList[index].messagesUnReadCount = 0;
      this.colleaguesTemp = this.colleaguesList;
      this.totalUnreadCount();
    }
    index = this.recentChatsList.findIndex(x => x.userId == this.selectedcolleagueId)
    if (index == -1) {
      var addColleagueIntoRecents = this.colleaguesList.find(x => x.userId == this.selectedcolleagueId);
      this.recentChatsList.push(addColleagueIntoRecents);
    }
    this.recentsTemp = this.recentChatsList;
  }
  openChannelChatFromDetails(id) {
    var index = this.channelList.findIndex(x => x.id == id);
    if(index != -1) {
      this.displayingList = "channels";
      this.changeChannel(this.channelList[index]);
    }
  }
  changeChannel(channel) {
    this.selectedChannelId = channel.id;
    this.id = channel.id;
    this.channelName = channel.channelName;
    this.colleague = null;
    this.recentChat = null;
    this.channel = channel;
    this.previousChannel = channel;
    var index = this.channelList.findIndex(x => x.id == this.selectedChannelId);
    this.channelsTotalUnreadCount -= this.channelList[index].messagesUnReadCount;
    if (this.channelList[index].messagesUnReadCount) {
      this.channelList[index].messagesUnReadCount = 0;
      this.taggedme = false;
      this.totalUnreadCount();
    }
  }
  archivedChannelOpened(openedChat) {
    if(openedChat == true) {
      this.changeChannel(this.channelList[0]);
    }
  }
  sendMessagesToUserOrChannel(messageDetail) {
    if (messageDetail.length != undefined && messageDetail.length != null && messageDetail.length != "null" && messageDetail.length != "undefined") {
      var url = this.environment.apiURL + ApiUrls.UploadFileChunks;
      var message = new MessageDetails();
      message.title = "New Message from " + this.loggedInUserfullName;
      var Id: any;
      if (this.colleague != null) {
        message.receiverUserId = this.userId;
        message.receiverName = this.fullName;
        message.receiverProfileImage = this.profileImage;
        message.channelName = null;
        message.channelId = null;
      }
      else {
        message.receiverUserId = null;
        message.receiverName = null;
        message.receiverProfileImage = null;
        message.channelName = this.channelName;
        message.channelId = this.id;
        message.title = message.title + " in " + this.channelName;
      }
      message.senderName = this.loggedInUserfullName;
      message.senderProfileImage = this.loggedInuserProfileImage;
      message.senderUserId = this.loggedInUserId;
      message.messageDateTime = new Date()
      message.lastReplyDateTime = new Date(1, 1, 1, 1, 1, 1);
      message.fromUserId = this.loggedInUserId;
      let progress = 0;
      var warningMessage: boolean = true;
      var files: File[] = [];
      for (var i = 0; i < messageDetail.length; i++) {
        if (messageDetail[i].size <= 0 && warningMessage) {
          warningMessage = false;
          if (messageDetail.length == 1) {
            this.toastr.error(this.translateService.instant('CHATAPP.YOUCANNOTUPLOADZEROSIZEDFILES'),
              this.translateService.instant('CHATAPP.FILEUPLOADFAILED'));
          } else {
            this.toastr.warning(this.translateService.instant('CHATAPP.YOUCANNOTUPLOADZEROSIZEDFILES'),
              this.translateService.instant('CHATAPP.ZEROSIZEDFILES'));
          }
        } else {
          files.push(messageDetail[i]);
        }
      }
      if (files.length > 0) {
        this.totalFileCount = files.length;
        this.fileCounter = 1;
        this.display = 'block';
        this.uploading = true;
        const r = new Resumable({
          target: url,
          chunkSize: 1 * 1024 * 1024, //3 MB
          headers: {
            // enctype: "multipart/form-data",
            // "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
          },
        });
        r.addFiles(files);
        r.on('fileAdded', (file, event) => {
          r.upload();
        });
        r.on('complete', (event) => {
          r.files.pop();
          this.uploading = false;
          this.progressValue = 0;
          this.display = 'none';
        });
        r.on('progress', () => {
          progress = Math.round(r.progress() * 100);
          this.progressValue = progress;
          this.cdRef.detectChanges();
        });
        r.on('fileSuccess', (file, response) => {
          if (response) {
            response = JSON.parse(response)
            Id = Guid.create()
            message.id = Id['value'];
            message.messageType = "file";
            message.filePath = response[0].FilePath;
            message.fileType = "file";
            message.body = response[0].FileName;
            message.taggedMembersIds = null;
            message.messageReactions = [];
            this.sendMessage(message);
            this.fileCounter += 1;
          }
        });
      }
    } else {
      if(!messageDetail.isFromStarred)
        messageDetail.isStarred = null;
      this.sendMessage(messageDetail);
    }
  }
  sendMessage(message) {
    if (message.channelId != null) {
      this.publishToTopics(message)
    } else {
      this.publishToColleagues(message);
    }
    this.chatService.sendingMessages(message).subscribe((message: any) => { })
  }
  publishToColleagues(messageDetails) {
    this.loggedInUserChannelName = this.generateChannelName(this.loggedInUserfullName, this.loggedInUserId);
    var receiverChannelName = this.generateChannelName(this.fullName, this.userId);
    var channelArray = [this.loggedInUserChannelName];
    if (messageDetails.receiverUserId != messageDetails.senderUserId) {
      channelArray.push(receiverChannelName)
    }
    messageDetails.pubnubChannelNameOfMessage = channelArray;
    this.store.dispatch(new MessageTriggered(messageDetails));
  }
  publishToTopics(messageDetails) {
    messageDetails.pubnubChannelNameOfMessage = [this.loggedInuserCompanyId + '-' + this.id];
    this.store.dispatch(new MessageTriggered(messageDetails));
  }
  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
  openChannelCreationDialog () {
    let createChannelDIalogRef = this.dialog.open(CreateChannelDialog, {
      width: '600px',
      data: {loggedInuserId: this.loggedInUserId, loggedInuserProfileImage: this.loggedInuserProfileImage, members: this.colleaguesList},
      disableClose: true,
    });
  }
  
  showPushNotificationDialog() {
    if(this.pushNotifications.permission  === 'denied') {
      let createChannelDIalogRef = this.dialog.open(PushNotificationDialog, {
        width: '600px',
        disableClose: true,
      });
    }
  }
  filterColleagues(event) {
    if (event != null) {
        this.searchText = event.target.value.toLowerCase();
        this.searchText = this.searchText.trim();
    } else {
        this.searchText = "";
    }
    const temp = this.colleaguesTemp.filter(((colleague) =>
    colleague.fullName.toLowerCase().indexOf(this.searchText) > -1 ));
    this.colleaguesList = temp;
  }
  filterRecents(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    } else {
      this.searchText = "";
    }
    const temp = this.recentsTemp.filter(((colleague) =>
    colleague.fullName.toLowerCase().indexOf(this.searchText) > -1 ));
    this.recentChatsList = temp;
  }
  closeSearch() {
    this.filterColleagues(null);
    this.filterRecents(null);
  }
}