import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewChildren, QueryList, 
  ChangeDetectorRef, ViewEncapsulation  } from '@angular/core';
import { chatSearchInputModel } from '../../models/chatSearchInputModel';
import { ChatService } from '../../services/chat.service';
import { Guid } from "guid-typescript";
import { MessageDetails } from '../../models/messageDetails';
import { taggedPeople } from '../../models/taggedPeople';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from "ngx-cookie-service";
import { SatPopover } from '@ncstate/sat-popover';
import { MatSidenav } from '@angular/material/sidenav'
import { channelMembersSearchInputModel } from '../../models/channelMembersSearchInputModel';
import { ChannelMemberModel, ChannelUpdateModel } from '../../models/channelUpdateModel';
import { TranslateService } from "@ngx-translate/core";
import { GetSharedorUnsharedchannels } from '../../models/getSharedorUnsharedchannels';
import { CustomAppBaseComponent } from '../../../../lib/globaldependencies/components/componentbase';
import { AddMembersToChannelDialog } from "../../dialogs/add-members-to-channel/add-members-to-channel";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MessageTypingDetails } from '../../models/MessageTypingDetails';
import { Actions, ofType } from "@ngrx/effects";
import { State,MessageActionTypes,SendingSignalTriggered,ReceiveSignalCompleted, } from "@snovasys/snova-shell-module";
import { takeUntil, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";

@Component({
  selector: 'app-ChatComponent',
  templateUrl: './ChatComponent.component.html',
  styleUrls: ['./ChatComponent.component.css'],
})
export class ChatComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren(SatPopover) allPopovers: QueryList<SatPopover>;
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  public taggedPeople: taggedPeople;
  @Output() messageToUserOrChannel = new EventEmitter<any>();
  @Output() archivedChannelOpened = new EventEmitter<any>();
  @Output() openChannelChatById = new EventEmitter<any>();
  selectedTag: boolean;
  nameOfCurrentChat: any;
  currentId:any;
  channel: any;
  colleague: any;
  loggedInUserId = this.CookieService.get("CurrentUserId");
  messageOfUser: string = '';
  chat: any = [];
  personProfileImage: any;
  channelProfileImage: any;
  personalChatDisplay: boolean = true;
  userId: any;
  fullName: any;
  profileImage: any;
  channelId: any;
  channelName: any;
  channelImage: any;
  tempMsgCount: number;
  scrollPosition: boolean = false;
  loading = false;
  showEmojiPicker: any;
  emojiPicker: any;
  companythemecolor = localStorage.getItem('themeColor');
  loggedInuserCompanyId = this.CookieService.get("CompanyId");
  colleaguesList: any;
  items: any;
  taggedMembers: Array<string> = [];
  newtaggedMembers: Array<any> = [];
  data: string;
  taggedMembersIndexes: Array<any> = [];
  messageReactions: Array<any> = [];
  reactedPersons: Array<any> = [];
  currentMessage: any;
  loggedInUserfullName: any;
  loggedInuserProfileImage: any;
  reactionMessage: any;
  createdByUserName: any;
  createdDateTime: any;
  channelMemberCount: any;
  channelMembersList: any;
  channelMembersLoading = false;
  sharedOrUnsharedTopicsLoading: any = false;
  chatLoading: any = false;
  showDetails: string = '';
  sharedOrUnsharedTopicsCount: number = 0;
  sharedOrUnsharedTopics: any = null;
  shared: boolean = false;
  currentArchivedChannel = false;
  colleagueDetails:any = null;
  lastShownTime: any;
  ngDestroyed$ = new Subject();
  currentSelectedUserId :any;
  typingStatusOfSelectedOne :boolean = false;
  channelList: any;
  selectedpubnubChannelName :any;
  typingPersonNameInChannel :any;
  flag = 0;
  typing :string;
  currentMessageOfUser: string;

  constructor(private chatService: ChatService, private toastr: ToastrService, private CookieService: CookieService,
    private dialog: MatDialog, private actionUpdates$: Actions,
    private store: Store<State>) {
    super();
    this.actionUpdates$
    .pipe(
      takeUntil(this.ngDestroyed$),
      ofType(MessageActionTypes.ReceiveSignalCompleted),
      tap((result: any) => {
        var typingDetails = result['messageTypingDetails']
        var index =  this.colleaguesList.findIndex(x => x.userId == typingDetails.publisher);
        var typingState = JSON.parse(typingDetails.message)
        if( typingState.State == 'yes' && this.currentSelectedUserId == typingDetails.publisher  ){
          this.flag = 0;
           this.typingStatusOfSelectedOne = true;
        }else if(typingState.State == 'no' && this.currentSelectedUserId == typingDetails.publisher){
          this.flag = 0;
          this.typingStatusOfSelectedOne = false;
        }else if(typingState.State == 'yes' && this.selectedpubnubChannelName == typingDetails.channel  && this.loggedInUserId != typingDetails.publisher  ){
          this.flag = 1;
          this.typingStatusOfSelectedOne = true;
          this. typingPersonNameInChannel =this.colleaguesList[index].fullName;
        }else{
          this.flag = 1;
          this.typingStatusOfSelectedOne = false;
        }
      })
    )
    .subscribe();
  }
  ngOnInit() {
    super.ngOnInit();
    this.currentArchivedChannel = false;
    this.chatService.getAllUsersForSlackApp().subscribe((colleagues: any) => {
      var uniq = {};
      colleagues.data = colleagues.data.filter(obj => !uniq[obj.userId] && (uniq[obj.userId] = true));
      this.colleaguesList = colleagues.data;
      var index = this.colleaguesList.findIndex(x => x.userId == this.loggedInUserId);
      this.loggedInUserfullName = this.colleaguesList[index].fullName;
      this.loggedInuserProfileImage = this.colleaguesList[index].profileImage;
      for (var i = 0; i < this.colleaguesList.length; i++) {
        if (this.colleaguesList[i].userId == this.loggedInUserId) {
          this.colleaguesList[i].fullName = this.colleaguesList[i].fullName + " (me) ";
        }
        else {
          this.colleaguesList[i].fullName = this.colleaguesList[i].fullName + " ";
        }
      }
      this.items = this.colleaguesList;
    });
  }

  @Input("channel") set _channel(data) {
    this.chatLoading = true;
    this.scrollPosition = false;
    if (data != null && data != undefined) {
      this.channelId = data.id;
      this.currentSelectedUserId = null;
      this.selectedpubnubChannelName  =  this.loggedInuserCompanyId + '-' +data.id;
      this.channelName = data.channelName;
      this.channelImage = data.channelImage;
      this.nameOfCurrentChat = data.channelName;
      this.createdByUserName = data.createdByUserName;
      this.createdDateTime = data.createdDateTime
      var inputModel = new channelMembersSearchInputModel();
      inputModel.channelId = this.channelId; 
      inputModel.isDeleted = false;
      inputModel.isAddMemberToChannel = false;    
      this.chatService.getChannelMembers(inputModel).subscribe((channelMembers) => {
        if(channelMembers.success) {
          this.channelMembersList = channelMembers.data; 
         for (var i=0; i<this.channelMembersList.length; i++){
          this.channelMembersList[i].fullName = this.channelMembersList[i].firstName + ' ' +this.channelMembersList[i].surName;
          if(this.channelMembersList[i].fullName == this.loggedInUserfullName) {
            this.channelMembersList[i].fullName =  this.channelMembersList[i].fullName + ' (me) ';
          } else {
            this.channelMembersList[i].fullName =  this.channelMembersList[i].fullName + ' ';
          }
         }
        }
      this.items = this.channelMembersList;
      this.channelMemberCount = this.channelMembersList.length;
      });
      this.userId = null;
      if (this.channelImage != null) {
        this.channelProfileImage = this.channelImage;
      } else {
        this.channelProfileImage = "https://pngimage.net/wp-content/uploads/2018/05/avatar-png-images-1.png";
      }
      this.getChannelChat();
      this.personalChatDisplay = false;
    }
  }
  @Input("colleague") set _colleague(data) {
    this.chatLoading = true;
    this.scrollPosition = false;
    if (data != null && data != undefined) {
      this.sharedOrUnsharedTopics = null;
      this.sharedOrUnsharedTopicsCount = 0;
      this.userId = data.userId;
      this.currentSelectedUserId = data.userId;
      this.fullName = data.fullName;
      this.profileImage = data.profileImage;
      this.nameOfCurrentChat = data.fullName;
      this.channelId = null;
      this.items = this.colleaguesList;
      this.getPersonalChat();
      this.personalChatDisplay = true;
    }
  }
  @Input("message") set _message(data) {
    this.scrollPosition = false ;
    if (data != null && data != undefined) {
      this.updateChat(data);
    }
  }
  @Input("colleaguePresentedInArchivedChannel") set _colleaguePresentedInArchivedChannel(data) {
    if (data != null && data != undefined) {
      this.archivedChannel();
    }
  }
  @Input("refreshChannelMemberList") set _refreshChannelMemberList(data) {
    if(data !=null && data != undefined) {
      var inputModel = new channelMembersSearchInputModel();
      inputModel.channelId = this.channelId; 
      inputModel.isDeleted = false;
      inputModel.isAddMemberToChannel = false;    
      this.chatService.getChannelMembers(inputModel).subscribe((channelMembers) => {
        if(channelMembers.success) {
          this.channelMembersList = channelMembers.data; 
         for (var i=0; i<this.channelMembersList.length; i++){
          this.channelMembersList[i].fullName = this.channelMembersList[i].firstName + ' ' +this.channelMembersList[i].surName;
          if(this.channelMembersList[i].fullName == this.loggedInUserfullName) {
            this.channelMembersList[i].fullName =  this.channelMembersList[i].fullName + ' (me) ';
          } else {
            this.channelMembersList[i].fullName =  this.channelMembersList[i].fullName + ' ';
          }
         }
         this.channelMemberCount = this.channelMembersList.length;
         this.items = this.channelMembersList;
        }
      });
    }
  }

  archivedChannel() {
    this.currentArchivedChannel = true;
  }
  archivedChannelClose() {
    this.archivedChannelOpened.emit(true);
  }
  checkTag(event) {
    if (event.key == '@') {
      this.selectedTag = true;
    }
  }
  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }
  trimNewLines(message) {
    while (1) {
      if (message.indexOf('\n') == 0) {
        message = message.slice(1, message.length)
      } else {
        break;
      }
    }
    return message;
  }
  reverseString(str) {
    return str.split("").reverse().join("");
  }
  channelDetails() {
    this.showDetails = 'channelMembers';    
    this.sidenav.open();
  }
  openColleagueDetails(colleagueId) {
    this.showDetails = 'colleagueDetails';
    this.colleagueDetails = this.colleaguesList.find(x => x.userId == colleagueId);
    this.sidenav.open();
    this.sharedTopicsList(colleagueId);
  }
  sharedTopicsList(colleagueId) {
    this.shared = true;
    this.sharedOrUnsharedTopics = null;
    this.sharedOrUnsharedTopicsCount = 0;
    var sharedorUnsharedTopicsInputModel = new GetSharedorUnsharedchannels();
    sharedorUnsharedTopicsInputModel.userId = colleagueId;
    sharedorUnsharedTopicsInputModel.isShared = true;
    this.sharedOrUnsharedTopicsLoading = true;
    this.chatService.getSharedorUnsharedchannels(sharedorUnsharedTopicsInputModel).subscribe((response: any) => {
      if(response.success == true) {
        this.sharedOrUnsharedTopics = response.data;
        this.sharedOrUnsharedTopicsCount = this.sharedOrUnsharedTopics.length;
        this.sharedOrUnsharedTopicsLoading = false;
      } else {
        this.sharedOrUnsharedTopicsLoading = false;
      }
    });
  }
  unsharedTopicsList (colleagueId) {
    this.shared = false;
    this.sharedOrUnsharedTopics = null;
    this.sharedOrUnsharedTopicsCount = 0;
    var sharedorUnsharedTopicsInputModel = new GetSharedorUnsharedchannels();
    sharedorUnsharedTopicsInputModel.userId = colleagueId;
    sharedorUnsharedTopicsInputModel.isShared = false;
    this.sharedOrUnsharedTopicsLoading = true;
    this.chatService.getSharedorUnsharedchannels(sharedorUnsharedTopicsInputModel).subscribe((response: any) => {
      if(response.success == true) {
        this.sharedOrUnsharedTopics = response.data;
        this.sharedOrUnsharedTopicsCount = this.sharedOrUnsharedTopics.length;
        this.sharedOrUnsharedTopicsLoading = false;
      } else {
        this.sharedOrUnsharedTopicsLoading = false;
      }
    });
  }
  sidenavClose() {
    this.sidenav.close();
    this.showDetails = '';
    this.shared = true;
    this.sharedOrUnsharedTopicsCount = 0;
    this.sharedOrUnsharedTopics = null;
    this.colleagueDetails = null;
  }
  generateChannelName(name: String, id: String) {
    name = name.trim();
    name = this.replaceAll(name, " ", "")
    return (name + '-' + id);
  }
  isTyping(){
    if(this.messageOfUser != this.currentMessageOfUser){
    var messageTypingDetails = new MessageTypingDetails();
     messageTypingDetails.state = 'yes';
    var typingModel= this.assignPubnubChannelName(messageTypingDetails);
    this.store.dispatch(new SendingSignalTriggered(typingModel))
    this.currentMessageOfUser = this.messageOfUser;
    }else if(this.messageOfUser == this.currentMessageOfUser || this.messageOfUser == null ||this.messageOfUser == undefined || this.messageOfUser == '' ){
      var messageTypingDetails = new MessageTypingDetails();
      messageTypingDetails.state = 'no';
     var typingModel= this.assignPubnubChannelName(messageTypingDetails);
     this.currentMessageOfUser = this.messageOfUser;
     this.store.dispatch(new SendingSignalTriggered(typingModel))
    }
  }
  assignPubnubChannelName(messageTypingDetails){
    if (this.userId != null) {
      messageTypingDetails.pubnubChannelNameOfReceiver = [this.generateChannelName(this.fullName, this.userId)];
    }
    else {
      messageTypingDetails.pubnubChannelNameOfReceiver = [(this.loggedInuserCompanyId + '-' + this.channelId)];
    }
    return messageTypingDetails;
  }
  removeUser(removedUserId) {
    var inputModel = new ChannelUpdateModel();
    inputModel.channelId = this.channelId;
    inputModel.isDeleted = true;
    var member = new ChannelMemberModel();
    member.memberUserId = removedUserId;
    member.isReadOnly = false;
    inputModel.channelMemberModel = [member];
    this.chatService.archiveChannelMembers(inputModel).subscribe((res: any) => {
    });
  }
  async messageToUserOrCollegue(event) {
    if (this.selectedTag) {
      this.selectedTag = false;
      return;
    }
    var emptyMessage: string = this.messageOfUser.trim()
    if ((emptyMessage == '\n' || emptyMessage == '') && event.length == undefined) {
      this.messageOfUser = '';
      return;
    }
    var message = new MessageDetails();  
    message.title = "New Message from " + this.loggedInUserfullName;
    var Id: any;
    if (this.userId != null) {
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
      message.channelId = this.channelId;
      message.title = message.title + " in " + this.channelName;
    }
    message.senderName = this.loggedInUserfullName;
    message.senderProfileImage = this.loggedInuserProfileImage;
    message.senderUserId = this.loggedInUserId;
    message.messageDateTime = new Date()
    message.lastReplyDateTime = new Date(1, 1, 1, 1, 1, 1);
    message.fromUserId = this.loggedInUserId;
    if (this.messageOfUser != null && this.messageOfUser != '' && this.messageOfUser != undefined) {
      this.messageOfUser = this.trimNewLines(this.messageOfUser);
      var reversedMessage = this.reverseString(this.messageOfUser);
      reversedMessage = this.trimNewLines(reversedMessage);
      this.messageOfUser = this.reverseString(reversedMessage);
      message.body = this.messageOfUser;
      message.body = this.replaceAll(message.body, '@' + this.loggedInUserfullName + ' (me) ', '@' + this.loggedInUserfullName + ' ')
      if (this.messageOfUser.indexOf("@") != -1) {
        this.data = this.messageOfUser;
        this.messageOfUser = this.replaceFullNamewithTag(this.messageOfUser);
      }
      Id = Guid.create()
      message.id = Id['value'];
      message.textMessage = this.messageOfUser;
      this.messageOfUser = "";
      message.messageType = "text";
      message.filePath = null;
      message.fileType = null;
      message.taggedMembersIds = this.taggedMembers;
      message.messageReactions = [];
      this.taggedMembers = [];
      this.taggedMembersIndexes = [];
      if (this.userId != null) {
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
        message.channelId = this.channelId;
        message.title = message.title + " in " + this.channelName;
      }
      this.messageToUserOrChannel.emit(message);
    }
    else {
      if (event.length != null && event.length != undefined && event.length != 0 && event.length != '') {
        this.messageToUserOrChannel.emit(event);
      }
    }
  }
  updateChat(message) {
    if (this.chat && this.chat[this.chat.length-1].id != message.id){
      this.currentMessage=this.frameMessage(message);
      if (this.chat && message.messageType != "Reaction") {
        this.formattingDates(this.currentMessage,message)
        this.chat.push(this.currentMessage)
      }
    }
    else if (message.messageType != "Reaction" && !this.chat) {
      this.currentMessage=this.frameMessage(message);
      this.currentMessage.date = "Today";
      this.chat = [];
      this.chat[0] = this.currentMessage;
    }
  }
frameMessage(message){
  var stringOfDate= new Date(message.messageDateTime).toLocaleDateString()
  var indexforimg = this.colleaguesList.findIndex(x => x.userId == message.senderUserId);
  var image;
    if (indexforimg != -1) {
      image = this.colleaguesList[indexforimg].profileImage;
    }
  if (message.fileType != undefined && message.fileType != null) {
    var filenameIndex = message.filePath.lastIndexOf('/');
    var filepathlength = message.filePath.length;
    this.currentMessage = message;
      this.currentMessage = {
        id: message.id,
        senderName: message.senderName,
        senderProfileImage: image,
        fileType : message.fileType ,
        filePath : message.filePath,
        fileName :message.filePath.substring(filenameIndex + 1, filepathlength),
        messageDateTime: message.messageDateTime,
        stringDateOfMessage  :stringOfDate,
        messageReactions: []
    }; 
  }
  else if (message.messageType == "Reaction") {
    var reactionMessage = {
      emojiCount: 1,
      textMessage: message.textMessage,
      reactedByUserIds: [message.reactedByUserId]
    }
    var index = this.chat.findIndex(x => x.id == message.parentMessageId)
    if(index != -1) {
      if(this.chat[index].messageReactions.length == 0) {
        this.chat[index].messageReactions[0] = reactionMessage;
      }
      else {
        var reactionMessageIndex = this.chat[index].messageReactions.findIndex(x => x.textMessage == message.textMessage)
        if(reactionMessageIndex != -1) {
          var reactedUserIndex = this.chat[index].messageReactions[reactionMessageIndex].reactedByUserIds.indexOf(message.reactedByUserId)
          if(reactedUserIndex != -1) {
            this.chat[index].messageReactions[reactionMessageIndex].emojiCount -= 1;
            this.chat[index].messageReactions[reactionMessageIndex].reactedByUserIds.splice(reactedUserIndex, 1);
          }
          else {
            this.chat[index].messageReactions[reactionMessageIndex].emojiCount += 1;
            this.chat[index].messageReactions[reactionMessageIndex].reactedByUserIds.push(message.reactedByUserId);
          }
        }
        else {
          this.chat[index].messageReactions.push(reactionMessage);
        }
      }
    }
  }
  else {
    var urlsOfMessage = this.findurls(message.textMessage);
    var taggedTemp = message.taggedMembersIds;
    if (taggedTemp != undefined && taggedTemp != null && taggedTemp != 'undefined' && taggedTemp != 'null') {
      var msg = {
        taggedMembersIds: taggedTemp,
        textMessage: urlsOfMessage
      }
      urlsOfMessage = this.replaceTagwithFullname(msg);
    }
    this.currentMessage = {
      id: message.id,
      senderName: message.senderName,
      senderProfileImage: image,
      textMessage: urlsOfMessage,
      messageDateTime: message.messageDateTime,
      stringDateOfMessage  :stringOfDate,
      messageReactions:[]
    }
  }
  if (message.messageType != "Reaction") {
    this.currentMessage.showNameAndTime = true;
    this.currentMessage.localDateTime = new Date(message.messageDateTime);
    this.currentMessage.senderUserId = message.senderUserId;
    if (this.chat && this.chat.length > 0 && this.chat[this.chat.length-1].senderUserId == message.senderUserId) {
      if(this.minutesGapBetweenTwoDates(this.lastShownTime, this.currentMessage.localDateTime) < 10) {
        this.currentMessage.showNameAndTime = false;
      } else {
        this.lastShownTime = this.currentMessage.localDateTime;
      }
    } else {
      this.lastShownTime = this.currentMessage.localDateTime;
    }
  }
  return this.currentMessage;
}
  formattingDates(currentMessage,message){
    var todayDate = new Date();
    var todayDateToString = todayDate.toLocaleDateString();
    if(this.chat[this.chat.length-1].receiverUserId || this.chat[this.chat.length-1].channelId){
      if(this.chat[this.chat.length-1].stringDateOfMessage != todayDateToString){
        currentMessage.date = "Today";
      }
    }else{
      if(this.chat[this.chat.length-1].stringDateOfMessage!= todayDateToString){
        currentMessage.date = "Today";
      }
    }
  }

  chatScroll(e) {
    if (e.target.scrollTop == 0) {
      this.scrollPosition = true;
      if (this.channelId == null)
        this.personalChatLoading();
      if (this.userId == null)
        this.channelChatLoading();
    }
  }
  personalChatLoading() {
    var messageSearchInputModel = new chatSearchInputModel();
    messageSearchInputModel.messageCount = 10 + this.tempMsgCount;
    this.tempMsgCount = messageSearchInputModel.messageCount;
    messageSearchInputModel.userId = this.userId;
    messageSearchInputModel.isPersonalChat = true;
    this.loadingMessages(messageSearchInputModel);
  }
  channelChatLoading() {
    var messageSearchInputModel = new chatSearchInputModel();
    messageSearchInputModel.messageCount = 10 + this.tempMsgCount;
    this.tempMsgCount = messageSearchInputModel.messageCount;
    messageSearchInputModel.channelId = this.channelId;
    messageSearchInputModel.isPersonalChat = false;
    this.loadingMessages(messageSearchInputModel);
  }
  replaceTagwithFullname(message) {
    if (message.taggedMembersIds != null && message.taggedMembersIds.length > 0 && message.taggedMembersIds != undefined) {
      for (var i = 0; i < message.taggedMembersIds.length; i++) {
        var taggedMemberIndex = message.textMessage.indexOf("{tag}");
        if (taggedMemberIndex == -1) {
          break;
        }
        var index = this.colleaguesList.findIndex(x => x.userId == message.taggedMembersIds[i])
        if (index != -1)
          message.textMessage = message.textMessage.substring(0, taggedMemberIndex - 1) +
          '<a href="javascript:void(0)">@' + this.colleaguesList[index].fullName.trim() + '</a>' + 
          message.textMessage.substring(taggedMemberIndex + 5, message.textMessage.length);
        else {
          message.textMessage = message.textMessage.substring(0, taggedMemberIndex) + ' ' + message.textMessage.substring(taggedMemberIndex + 5, message.textMessage.length)
        }
      }
    }
    return message.textMessage;
  }

  replaceFullNamewithTag(message) {
    for (var i = 0; i < this.colleaguesList.length;) {
      if (message.indexOf('@' + this.colleaguesList[i].fullName) == -1) {
        i++;
      }
      else {
        var taggedMemberIndex = message.indexOf('@' + this.colleaguesList[i].fullName);
        this.taggedPeople = new taggedPeople();
        this.taggedPeople.taggedPeopleId = this.colleaguesList[i].userId;
        this.taggedPeople.taggedPeopleIndex = message.indexOf('@' + this.colleaguesList[i].fullName);
        this.taggedMembersIndexes.push(this.taggedPeople);
        message = message.substring(0, taggedMemberIndex) + "@{tag} " + message.substring(taggedMemberIndex + this.colleaguesList[i].fullName.length + 1, message.length)
      }
    }
    this.newtaggedMembers = this.taggedMembersIndexes.sort(function (a, b) {
      return a.taggedPeopleIndex - b.taggedPeopleIndex
    });
    for (var j = 0; j < this.newtaggedMembers.length; j++) {
      this.taggedMembers.push(this.newtaggedMembers[j].taggedPeopleId);
    }
    return message;
  }
  reactionsToolTip(reactions) {
    var toolTip = '';
    for (var i = 0; i < reactions.length; i++) {
      for (var j = 0; j < this.colleaguesList.length; j++) {
        if (reactions[i] == this.colleaguesList[j].userId) {
          if (i < reactions.length - 1)
            toolTip += this.colleaguesList[j].fullName + ', ';
          else
            toolTip += this.colleaguesList[j].fullName;
        }
      }
    }
    return toolTip;
  }
  thumsupReaction(message) {
    var emoji = "👍";
    this.addEmojiReaction(message, emoji);
  }
  emojiReactions(message, event) {
    this.addEmojiReaction(message, `${event.emoji.native}`);
  }
  addEmojiReaction(messageReact, emoji) {
    this.allPopovers.forEach(p => p.close());
     var message = new MessageDetails();
     message.isDeleted = false;
     var index = messageReact.messageReactions.findIndex(x => x.textMessage == emoji)
     if(index != -1) {
       var reactionMsg = messageReact.messageReactions[index]
       var reaction = reactionMsg.reactedByUserIds.indexOf(this.loggedInUserId)
       if(reaction != -1) {
         message.isDeleted = true;
       }
     }
     message.body = emoji
     var Id = Guid.create()
     message.id = Id['value'];
     message.isFromStarred = false;
        message.isThreadMessage = false;
        message.reportMessage = null;
        message.taggedMembersIdsXml = null;
        message.taggedMembersIds = [];
        message.pinnedByUserId = null;
        message.isStarred = false;
        message.isPinned = null;
        message.messageTypeId = messageReact.messageTypeId;
        message.timeStamp = null;
        message.unreadMessageCount = messageReact.unreadMessageCount;
        message.filePath = null;
        message.fileType = null;
        message.updatedDateTime = null;
        message.isEdited = false;
        message.messageTimeSpan = messageReact.messageTimeSpan;
        message.threadCount = messageReact.threadCount;
        message.isActivityMessage = null;
        message.messageReactions = [];
        message.parentMessageId = messageReact.id;
        message.textMessage = emoji;
        message.messageType = "Reaction";
        message.senderName = this.loggedInUserfullName;
        message.senderUserId = this.loggedInUserId;
        message.senderProfileImage = this.loggedInuserProfileImage;
        message.receiverUserId = this.loggedInUserId;
        message.fromUserId = this.loggedInUserId;
        message.isRead = null;
        message.messageTimeSpan = null;
        message.isAddedToChannel = false;
        message.messageDateTime = new Date();
        message.deviceId = null;
        message.messageReceiveDate = null;
        message.messageReceiveTime = null;
        message.activityTrackerStatus = false;
        message.isChannelMember = null;
        message.isChannelMember = null;
        message.fileName = null;
        message.refreshChannels = false;
        message.refreshUsers = false;
        message.isFromChannelRename = false;
        message.isFromChannelArchive = false;
        message.isFromAddMember = false;
        message.isFromRemoveMember = false;
        message.isFromBackend = false;
        message.isActivityStatusUpdated = null;
        message.reactedByUserId = this.loggedInUserId;
        message.messageSentStatus = null;
        message.messageSentStatus = null;
        message.isFromReadOnly = false;
        message.isReadOnly = false;
        message.userName = null;
        message.fromUserProfileImage = null;
        message.fromChannelImage = false;
        if (this.userId != null) {
            message.receiverUserId = this.userId;
            message.receiverName = this.fullName;
            message.receiverProfileImage = this.profileImage;
            message.channelName = "";
            message.channelId = null;
        }
        else {
            message.receiverUserId = null;
            message.receiverName = "";
            message.receiverProfileImage = null;
            message.channelName = this.channelName;
            message.channelId = this.channelId;
            message.title = message.title + " in " + this.channelName;
        }
    this.messageToUserOrChannel.emit(message);
  }
  // findurls(text) {
  //   var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  //   return text.replace(urlRegex, function(url,b,c) {
  //     var url2 = (c == 'www.') ?  'http://' +url : url;
  //     return '<a target="_blank" href="' +url2+ '">' + url + '</a>';
  //   }) 
  // }
  findurls(text) {
    var splittedBySpace = text.split(" ");
    var returnString = ''
    splittedBySpace.forEach(element => {
      var splittedByDot = element.split(".");
      var valid: boolean = false;
      for(var i = 1; i < splittedByDot.length; i++) {
        if(splittedByDot[i].length > 1) {
          if((/[a-zA-Z]/).test(splittedByDot[i][0]) && (/[a-zA-Z]/).test(splittedByDot[i][0]) && 
          (/[a-zA-Z]/).test(splittedByDot[i][1]) && (/[a-zA-Z]/).test(splittedByDot[i][1]) && splittedByDot[i-1].length > 0) {
            valid = true;
            break;
          }
        }
      }
      if(valid == true) {
        returnString += '<a target="_blank" href="' +element+ '">' + element + '</a> ';
      } else {
        returnString += element + ' ';
      }
    });
    return returnString;
  }
  loadingMessages(messageSearchInputModel) {
    this.currentArchivedChannel = false;
    this.chatService.getPersonalChatOrChannelChat(messageSearchInputModel).subscribe((res: any) => {
      if(res.success == true) {
        this.chatLoading = false;
      }
      if (res.data != null) {
        var uniq = {};
        res.data = res.data.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
        this.chat = res.data;
        res.data.forEach(message => {
          if(message.reportMessage!=null) {
            var statusReportMessage = JSON.parse(message.reportMessage);
            message.reportMessage = statusReportMessage;
          }           
          if(message.textMessage != null && message.textMessage != "")
          {
            message.textMessage = this.findurls(message.textMessage);
          }
          if (message.filePath != null) {
            message["fileType"] = this.messageFileType(message)
          }
          if (message.textMessage != null && message.textMessage != undefined && message.textMessage != '') {
            message.textMessage = this.replaceTagwithFullname(message);
          }
          // Converting server time into local time
          var tempVarOfDateTime = new Date(message.messageDateTime)
          var offset = new Date().getTimezoneOffset();
          message['messageDateTime'] = tempVarOfDateTime.setMinutes(tempVarOfDateTime.getMinutes() - offset);
          message['localDateTime'] = tempVarOfDateTime;
          message['stringDateOfMessage'] = tempVarOfDateTime.toLocaleDateString();
          message['date'] = tempVarOfDateTime.toLocaleDateString();
        });
        var t = (res.data.length) - 1;
        for (var i = t; i > 0; i--) {
          for (var j = i - 1; j >= 0; j--) {
            if (res.data[i].date == res.data[j].date) {
              res.data[j].date = null;
            }
          }
        }
        if (res.data != null) {
          var date = new Date();
          var todayDate = date.toLocaleDateString();
          var yes = date.setDate(date.getDate() - 1);
          var yesterdayDate = date.getDate();
          var yesterdayDateMonth = (date.getMonth())
          var yesterdayDateYear = date.getFullYear();
          res.data.forEach(message => {
            if (message.date != null && message.date == todayDate) {
              message.date = "Today";
            }
            if (message.date != null) {
              if (dateOfMessage == 2 || dateOfMessage == 22) {
                message.wordOfDay = "nd";
              } else if (dateOfMessage == 3 || dateOfMessage == 23) {
                message.wordOfDay = "rd";
              }
              else if (dateOfMessage == 1 || dateOfMessage == 21 || dateOfMessage == 31) {
                message.wordOfDay = "st";
              } else {
                message.wordOfDay = "th";
              }
              var dateOfMessage = message.localDateTime.getDate();
              var monthOfMessage = message.localDateTime.getMonth();
              var yearOfMessage = message.localDateTime.getFullYear()
              if (dateOfMessage == yesterdayDate && monthOfMessage == yesterdayDateMonth && yearOfMessage == yesterdayDateYear) {
                message.date = "Yesterday";
              }

            }
          });
        }
        this.chat = res.data;
        if(this.chat && this.chat.length > 0) {
          this.lastShownTime = this.chat[this.chat.length - 1].localDateTime;
          this.chat[this.chat.length - 1].showNameAndTime = true; 
        }
        for (var i = this.chat.length -2;i >= 0; i--) {
          var minutesGap = this.minutesGapBetweenTwoDates(this.lastShownTime, this.chat[i].localDateTime);
          if (minutesGap < 10 && this.chat[i+1].senderUserId == this.chat[i].senderUserId) {
            this.chat[i].showNameAndTime = false;
          } else {
            this.chat[i].showNameAndTime = true; 
            this.lastShownTime = this.chat[i].localDateTime;
          }
        } 
        this.chat = this.chat.reverse();
        if ( this.chat.length > 30 ) {
          this.scrollPosition = true;
          
        }
      }
      if(res.data == null) {
        this.chat = null;
      }
    })
  }
  minutesGapBetweenTwoDates(fromTime, toTime) {
    var minutesDifference = Math.abs(fromTime.getMinutes() - toTime.getMinutes());
    if ( Math.abs(fromTime.getHours() - toTime.getHours()) > 0) {
      minutesDifference += 11;
    }
    if ( Math.abs(fromTime.getDate() - toTime.getDate()) > 0) {
      minutesDifference += 11;
    }
    if ( Math.abs(fromTime.getMonth() - toTime.getMonth()) > 0) {
      minutesDifference += 11;
    }
    if ( Math.abs(fromTime.getFullYear() - toTime.getFullYear()) > 0) {
      minutesDifference += 11;
    }
    return minutesDifference;
  }
  messageFileType(message) {
    var filenameIndex = message.filePath.lastIndexOf('/');
    var filepathlength = message.filePath.length;
    var extensionIndex = message.filePath.lastIndexOf('.');
    var filetype = message.filePath.substring(extensionIndex, filepathlength);
    message["filePath"] = message.filePath;
    message["fileName"] = message.filePath.substring(filenameIndex + 1, filepathlength);
    // Separting Images'
    if (filetype == ".tiff" || filetype == ".bmp" || filetype == ".tif" || filetype == ".img" || filetype == ".jpeg" || filetype == ".jpg" || filetype == ".png" || filetype == ".gif" || filetype == ".PNG" || filetype == ".JPG" || filetype == ".JPEG") {
      return "image";
    } else {
      return "file";
    }
  }
  getPersonalChat() {
    this.sidenav.close();
    this.messageOfUser = "";
    var messageSearchInputModel = new chatSearchInputModel();
    messageSearchInputModel.userId = this.userId;
    messageSearchInputModel.isPersonalChat = true;
    messageSearchInputModel.messageCount = 30;
    this.tempMsgCount = messageSearchInputModel.messageCount;
    this.loadingMessages(messageSearchInputModel);
  }
  getChannelChat() {
    this.sidenav.close();
    this.messageOfUser = "";
    var messageSearchInputModel = new chatSearchInputModel();
    messageSearchInputModel.channelId = this.channelId;
    messageSearchInputModel.isPersonalChat = false;
    messageSearchInputModel.messageCount = 30;
    this.tempMsgCount = messageSearchInputModel.messageCount;
    this.loadingMessages(messageSearchInputModel);
  }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  toggleEmojiPickerPopUp() {
    this.showEmojiPicker = false;
  }
  addEmoji(event) {
    const { messageOfUser } = this;
    const text = `${messageOfUser}${event.emoji.native}`;
    this.messageOfUser = text + " ";
  }
  openAddMembersToChannelDiloag () {
    let addMembersDialogRef = this.dialog.open(AddMembersToChannelDialog, {
      data: {channelId: this.channelId,
            channelName: this.channelName,
      },
      width: '600px',
      disableClose: true,
    });
  }
  moveToChannel (channel) {
    if (channel.id != null && channel.id != undefined && channel.id != 'null' && channel.id != 'undefined') {
      this.openChannelChatById.emit(channel.id);
    }
  }
}