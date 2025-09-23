export class AssetComments {
    receiverId: string;
    comment: string;
    commentId: string;
    commentedByUserId: string;
    parentCommentId: string;
    adminFlag: boolean;
    profileImage: string;
    commentedByUserProfileImage: string;
    commentedByUserFullName: string;
    createdDateFormat: string;
    createdDateTime: Date;
    updatedDateTime: Date;
    childComments: AssetComments;
}
