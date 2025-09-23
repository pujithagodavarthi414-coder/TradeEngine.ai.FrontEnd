export class AssetCommentsAndHistory {
    assetHistoryId: string;
    createdByUserId: string;
    fullName: string;
    profileImage: string;
    createdDateTime: Date;
    comment: string;
    assetsFieldsChangedList: AssetsFieldsChangedList[];
    totalCount: number;
}

export class AssetsFieldsChangedList {
    description: string;
    oldValueText: string;
    newValueText: string;
    fullName: string;
}
