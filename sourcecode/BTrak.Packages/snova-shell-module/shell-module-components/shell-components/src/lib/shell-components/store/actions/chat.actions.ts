import { Action } from "@ngrx/store";
import { MessageDetails } from "../../models/MessageDetails";
import { EmployeeStatusModel } from "../../models/EmployeeStatusModel";
import { InitialStatusOfUsers } from "../../models/initialStatusofUsers";
import { ChannelUpdateModel } from "../../models/ChannelUpdateModel";
import { MessageTypingDetails} from '../../models/MessageTypingDetails';


export enum MessageActionTypes {
  // Message Sending from chat-web to shell
  MessageTriggered = "[Snovasys-Shell] [chat-web-module] MessageTriggered",
  MessageCompleted = "[Snovasys-Shell] [chat-web-module] MessageCompleted",
  MessageFailed = "[Snovasys-Shell] [chat-web-module] MessageFailed",
  //Message Receiving shell to chat-web
  ReceiveMessageTriggered = "[Snovasys-Shell] [chat-web-module] ReceiveMessageTriggered",
  ReceiveMessageCompleted = "[Snovasys-Shell] [chat-web-module] ReceiveMessageCompleted",
  ReceiveMessageFailed = "[Snovasys-Shell] [chat-web-module] ReceiveMessageFailed",
  // Newly joined people status
  PresenceEventTriggered = "[Snovasys-Shell]  [chat-web-module] PresenceEventTriggered",
  PresenceEventCompleted = "[Snovasys-Shell] [chat-web-module] PresenceEventCompleted",
  PresenceEventFailed = "[Snovasys-Shell] [chat-web-module] PresenceEventFailed",
  // Message Unread Count of Shell
  CountTriggered = "[Snovasys-Shell] [chat-web-module] CountTriggered",
  CountCompleted = "[Snovasys-Shell] [chat-web-module] CountCompleted",
  CountFailed = "[Snovasys-Shell] [chat-web-module] CountFailed",
  //Previously joined people status
  InitalStateOfUsersTriggered = "[Snovasys-Shell] [chat-web-module]  InitalStateOfUsersTriggered",
  InitalStateOfUsersCompleted = "[Snovasys-Shell] [chat-web-module]  InitalStateOfUsersCompleted",
  InitalStateOfUsersFailed = "[Snovasys-Shell] [chat-web-module] InitalStateOfUsersFailed",
  //When we open the chat-web messenger this trigger will hit
  RequestingStateOfUsersTriggered = "[Snovasys-Shell] [chat-web-module] RequestingStateOfUsersTriggered",
  RequestingStateOfUsersCompleted = "[Snovasys-Shell] [chat-web-module] RequestingStateOfUsersCompleted",
  RequestingStateOfUsersFailed = "[Snovasys-Shell] [chat-web-module] RequestingStateOfUsersFailed",
  //Sending TOpic details (chat-web to shell)
  SendChannelUpdateModelTriggered = "[Snovasys-Shell] [chat-web-module] SendChannelUpdateModelTriggered",
  SendChannelUpdateModelCompleted = "[Snovasys-Shell] [chat-web-module] SendChannelUpdateModelCompleted",
  SendChannelUpdateModelFailed = "[Snovasys-Shell] [chat-web-module] SendChannelUpdateModelFailed",
  //Receiving Topic details (shell to chat-web)
  ReceiveChannelUpdateModelTriggered = "[Snovasys-Shell] [chat-web-module]  ReceiveChannelUpdateModelTriggered",
  ReceiveChannelUpdateModelCompleted = "[Snovasys-Shell] [chat-web-module]  ReceiveChannelUpdateModelCompleted",
  ReceiveChannelUpdateModelFailed = "[Snovasys-Shell] [chat-web-module]  ReceiveChannelUpdateModelFailed",
  //Sending Typing model (chat-web to shell)
  SendingSignalTriggered = "[Snovasys-Shell] [chat-web-module] SendingSignalTriggered",
  SendingSignalCompleted = "[Snovasys-Shell] [chat-web-module] SendingSignalCompleted",
  SendingSignalFailed = "[Snovasys-Shell] [chat-web-module] SendingSignalFailed",
  //Receiving SignalEvent response (shell to chat-web)
  ReceiveSignalTriggered = "[Snovasys-Shell] [chat-web-module] ReceiveSignalTriggered",
  ReceiveSignalCompleted = "[Snovasys-Shell] [chat-web-module] ReceiveSignalCompleted",
  ReceiveSignalFailed = "[Snovasys-Shell] [chat-web-module] ReceiveSignalFailed",
}
export class MessageTriggered implements Action {
    type = MessageActionTypes.MessageTriggered;
    public errorMessage: string;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageDetails: MessageDetails) { }
}

export class MessageCompleted implements Action {
    type = MessageActionTypes.MessageCompleted;
    public errorMessage: string;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageDetails: MessageDetails) { }
}

export class MessageFailed implements Action {
    type = MessageActionTypes.MessageFailed;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { }
}
export class ReceiveMessageTriggered implements Action {
    type = MessageActionTypes.ReceiveMessageTriggered;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageDetails: MessageDetails) { }
}

export class ReceiveMessageCompleted implements Action {
    type = MessageActionTypes.ReceiveMessageCompleted;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageDetails: MessageDetails) { }
}

export class ReceiveMessageFailed implements Action {
    type = MessageActionTypes.ReceiveMessageFailed;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public employeeStatusModel: EmployeeStatusModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { }
}
export class PresenceEventTriggered implements Action {
    type = MessageActionTypes.PresenceEventTriggered;
    public errorMessage: string;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public employeeStatusModel: EmployeeStatusModel) { };
}

export class PresenceEventCompleted implements Action {
    type = MessageActionTypes.PresenceEventCompleted;
    public errorMessage: string;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public employeeStatusModel: EmployeeStatusModel) { };
}

export class PresenceEventFailed implements Action {
    type = MessageActionTypes.PresenceEventFailed;
    public employeeStatusModel: EmployeeStatusModel;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}

export class CountTriggered implements Action {
    type = MessageActionTypes.CountTriggered;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageCount: number) { };
}

export class CountCompleted implements Action {
    type = MessageActionTypes.CountCompleted;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public messageCount: number) { };
}

export class CountFailed implements Action {
    type = MessageActionTypes.CountFailed;
    public messageCount: number;
    public channelUpdateModel: ChannelUpdateModel;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}

export class InitalStateOfUsersTriggered implements Action {
    type = MessageActionTypes.InitalStateOfUsersTriggered;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public initialStatusOfUsers: InitialStatusOfUsers) { };
}
export class InitalStateOfUsersCompleted implements Action {
    type = MessageActionTypes.InitalStateOfUsersCompleted;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public initialStatusOfUsers: InitialStatusOfUsers) { };
}

export class InitalStateOfUsersFailed implements Action {
    type = MessageActionTypes.InitalStateOfUsersFailed;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public channelUpdateModel: ChannelUpdateModel;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}
export class RequestingStateOfUsersTriggered implements Action {
    type = MessageActionTypes.RequestingStateOfUsersTriggered;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public gotColleagues: boolean) { };
}
export class RequestingStateOfUsersCompleted implements Action {
    type = MessageActionTypes.RequestingStateOfUsersCompleted;
    public errorMessage: string;
    public channelUpdateModel: ChannelUpdateModel;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public gotColleagues: boolean) { };
}

export class RequestingStateOfUsersFailed implements Action {
    type = MessageActionTypes.RequestingStateOfUsersFailed;
    public messageCount: number;
    public channelUpdateModel: ChannelUpdateModel;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}
export class  SendChannelUpdateModelTriggered implements Action {
    type = MessageActionTypes. SendChannelUpdateModelTriggered;
    public errorMessage: string;
    public gotColleagues: boolean
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public channelUpdateModel: ChannelUpdateModel) { };
}
export class  SendChannelUpdateModelCompleted implements Action {
    type = MessageActionTypes. SendChannelUpdateModelCompleted;
    public errorMessage: string;
    public gotColleagues: boolean
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public channelUpdateModel: ChannelUpdateModel) { };
}

export class  SendChannelUpdateModelFailed implements Action {
    type = MessageActionTypes. SendChannelUpdateModelFailed;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}
export class  ReceiveChannelUpdateModelTriggered implements Action {
    type = MessageActionTypes. ReceiveChannelUpdateModelTriggered;
    public errorMessage: string;
    public gotColleagues: boolean
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public channelUpdateModel: ChannelUpdateModel) { };
}
export class  ReceiveChannelUpdateModelCompleted implements Action {
    type = MessageActionTypes. ReceiveChannelUpdateModelCompleted;
    public errorMessage: string;
    public gotColleagues: boolean
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public channelUpdateModel: ChannelUpdateModel) { };
}

export class  ReceiveChannelUpdateModelFailed implements Action {
    type = MessageActionTypes. ReceiveChannelUpdateModelFailed;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}

export class SendingSignalTriggered implements Action{
    type = MessageActionTypes.SendingSignalTriggered;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public errorMessage :string;
    constructor(public messageTypingDetails:MessageTypingDetails) { };
}
export class SendingSignalCompleted implements Action{
    type = MessageActionTypes.SendingSignalCompleted;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public errorMessage :string;
    constructor(public messageTypingDetails:MessageTypingDetails) { };
}
export class SendingSignalFailed implements Action{
    type = MessageActionTypes.SendingSignalFailed;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}
export class ReceiveSignalTriggered implements Action{
    type = MessageActionTypes.ReceiveSignalTriggered;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public errorMessage :string;
    constructor(public messageTypingDetails:MessageTypingDetails) { };
}
export class ReceiveSignalCompleted implements Action{
    type = MessageActionTypes.ReceiveSignalCompleted;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public errorMessage : string;
    constructor(public messageTypingDetails:MessageTypingDetails) { };
}
export class ReceiveSignalFailed implements Action{
    type = MessageActionTypes.ReceiveMessageFailed;
    public messageCount: number;
    public messageDetails: MessageDetails;
    public employeeStatusModel: EmployeeStatusModel;
    public initialStatusOfUsers: InitialStatusOfUsers;
    public gotColleagues: boolean;
    public channelUpdateModel: ChannelUpdateModel;
   
    public messageTypingDetails:MessageTypingDetails;
    constructor(public errorMessage: string) { };
}
export type ChatWebActions = MessageTriggered |
    MessageCompleted |
    MessageFailed |
    PresenceEventTriggered |
    PresenceEventCompleted |
    PresenceEventFailed |
    CountTriggered |
    CountCompleted |
    CountFailed |
    InitalStateOfUsersCompleted |
    InitalStateOfUsersFailed |
    InitalStateOfUsersTriggered |
    ReceiveMessageCompleted |
    ReceiveMessageFailed |
    ReceiveMessageTriggered |
    RequestingStateOfUsersTriggered |
    RequestingStateOfUsersCompleted |
    RequestingStateOfUsersFailed |
    SendChannelUpdateModelCompleted|
    SendChannelUpdateModelFailed|
    SendChannelUpdateModelTriggered |
    ReceiveChannelUpdateModelCompleted |
    ReceiveChannelUpdateModelFailed |
    ReceiveChannelUpdateModelTriggered |
    SendingSignalCompleted|
    SendingSignalFailed|
    SendingSignalTriggered|
    ReceiveSignalTriggered|
    ReceiveSignalCompleted|
    ReceiveSignalFailed

