export class ChannelUpdateModel {
    activityTrackerStatus: boolean;
    channelId: string;
    channelName: string;
    deviceId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fromChannelImage: boolean;
    fromUserId: string
    id: string;
    isActivityMessage: boolean;
    isActivityStatusUpdated: boolean;
    isAddedToChannel: boolean;
    isChannelMember: boolean;
    isDeleted: boolean;
    isEdited: boolean;
    isFromAddMember: boolean;
    isFromBackend: boolean;
    isFromChannelArchive: boolean;
    isFromChannelRename: boolean;
    isFromReadOnly: boolean;
    isFromRemoveMember: boolean;
    isRead: boolean;
    isReadOnly: boolean;
    mACAddress: string;
    messageDateTime: Date;
    messageReceiveDate: Date;
    messageReceiveTime: any;
    messageType: string;
    messageTypeId: string;
    receiverName: string;
    receiverProfileImage: string;
    receiverUserId: string;
    refreshChannels: boolean;
    refreshUsers: boolean
    reportMessage: any;
    senderName: string;
    senderProfileImage: string;
    senderUserId: string;
    textMessage: string;
    timeStamp: null
    unreadMessageCount: number;
    updatedDateTime: any;
    body: string;
    title: string;
    channelImage: any;
    currentOwnerShipId: string;
    channelMemberModel: Array<ChannelMemberModel>;
}

export class ChannelMemberModel {
    channelMemberId: any;
    memberUserId: string;
    isReadOnly: boolean;
    timeStamp: null;
}