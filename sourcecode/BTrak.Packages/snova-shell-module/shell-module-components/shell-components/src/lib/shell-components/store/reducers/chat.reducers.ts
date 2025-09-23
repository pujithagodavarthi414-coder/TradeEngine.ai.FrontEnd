import {
  MessageActionTypes,
  ChatWebActions
} from "../actions/chat.actions"
import { MessageDetails } from "../../models/MessageDetails";
import { EmployeeStatusModel } from "../../models/EmployeeStatusModel";
import { InitialStatusOfUsers } from "../../models/initialStatusofUsers";
import { ChannelUpdateModel } from "../../models/ChannelUpdateModel"
import { MessageTypingDetails } from '../../models/MessageTypingDetails'

export interface State {
  error: string;
  messageDetails: MessageDetails;
  employeeStatusModel: EmployeeStatusModel;
  messageCount: number;
  initialStateOfUsers: InitialStatusOfUsers;
  gotColleagues: boolean;
  channelUpdateModel: ChannelUpdateModel;
  messageTypingDetails:MessageTypingDetails;
}


export function reducer(state: State, action: ChatWebActions): State {
  switch (action.type) {
    case MessageActionTypes.MessageTriggered:
      return {
        ...state,
        messageDetails: (action as ChatWebActions).messageDetails
      };
    case MessageActionTypes.MessageCompleted:
      return {
        ...state,
        messageDetails: (action as ChatWebActions).messageDetails
      };

    case MessageActionTypes.MessageFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      };
    case MessageActionTypes.ReceiveMessageTriggered:
      return {
        ...state,
        messageDetails: (action as ChatWebActions).messageDetails
      };
    case MessageActionTypes.ReceiveMessageCompleted:
      return {
        ...state,
        messageDetails: (action as ChatWebActions).messageDetails
      };

    case MessageActionTypes.ReceiveMessageFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      };
    case MessageActionTypes.PresenceEventTriggered:
      return {
        ...state,
        employeeStatusModel: (action as ChatWebActions).employeeStatusModel
      };
    case MessageActionTypes.PresenceEventCompleted:
      return {
        ...state,
        employeeStatusModel: (action as ChatWebActions).employeeStatusModel
      };
    case MessageActionTypes.PresenceEventFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      };
    case MessageActionTypes.CountTriggered:
      return {
        ...state,
        messageCount: (action as ChatWebActions).messageCount
      };
    case MessageActionTypes.CountCompleted:
      return {
        ...state,
        messageCount: (action as ChatWebActions).messageCount
      };

    case MessageActionTypes.CountFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      };
    case MessageActionTypes.InitalStateOfUsersTriggered:
      return {
        ...state,
        initialStateOfUsers: (action as ChatWebActions).initialStatusOfUsers
      }
    case MessageActionTypes.InitalStateOfUsersCompleted:
      return {
        ...state,
        initialStateOfUsers: (action as ChatWebActions).initialStatusOfUsers
      }
    case MessageActionTypes.InitalStateOfUsersFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      }
    case MessageActionTypes.RequestingStateOfUsersTriggered:
      return {
        ...state,
        gotColleagues: (action as ChatWebActions).gotColleagues
      }
    case MessageActionTypes.RequestingStateOfUsersCompleted:
      return {
        ...state,
        gotColleagues: (action as ChatWebActions).gotColleagues
      }
    case MessageActionTypes.RequestingStateOfUsersFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      }
    
      case MessageActionTypes.SendChannelUpdateModelTriggered:
      return {
        ...state,
        channelUpdateModel: (action as ChatWebActions).channelUpdateModel
      }
    case MessageActionTypes.SendChannelUpdateModelCompleted:
      return {
        ...state,
        channelUpdateModel: (action as ChatWebActions).channelUpdateModel
      }
    case MessageActionTypes.SendChannelUpdateModelFailed:
      return {
        ...state,
        error: (action as ChatWebActions).errorMessage
      }
      case MessageActionTypes.ReceiveChannelUpdateModelTriggered:
        return {
          ...state,
          channelUpdateModel: (action as ChatWebActions).channelUpdateModel
        }
      case MessageActionTypes.ReceiveChannelUpdateModelCompleted:
        return {
          ...state,
          channelUpdateModel: (action as ChatWebActions).channelUpdateModel
        }
      case MessageActionTypes.ReceiveChannelUpdateModelFailed:
        return {
          ...state,
          error: (action as ChatWebActions).errorMessage
        }
      case MessageActionTypes.SendingSignalTriggered:
        return {
          ...state,
          messageTypingDetails: (action as ChatWebActions).messageTypingDetails
        }
      case MessageActionTypes.SendingSignalCompleted:
        return {
          ...state,
          messageTypingDetails: (action as ChatWebActions).messageTypingDetails
        }
      case MessageActionTypes.SendingSignalFailed:
        return {
          ...state,
          error: (action as ChatWebActions).errorMessage
        }
      case MessageActionTypes.ReceiveSignalTriggered:
        return {
          ...state,
          messageTypingDetails: (action as ChatWebActions).messageTypingDetails
        }
      case MessageActionTypes.ReceiveSignalCompleted:
        return {
          ...state,
          messageTypingDetails: (action as ChatWebActions).messageTypingDetails
        }
      case MessageActionTypes.ReceiveSignalFailed:
        return {
          ...state,
          error: (action as ChatWebActions).errorMessage
        }
    default:
      return state;
  }
}