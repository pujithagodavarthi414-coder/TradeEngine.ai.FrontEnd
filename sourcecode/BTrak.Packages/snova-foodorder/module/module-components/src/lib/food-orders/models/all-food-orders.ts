export class AllFoodOrders {
    orderedItems: string;
    claimDate: string;
    membersCount: string;
    members: string;
    amount: string;
    claimedBy: string;
    claimStatusSetBy: string;
    claimStatus: string;
    reason: string;
    action: string;
    receipt: string;
}

export class FoodOrderModel {
    foodOrderId: string;
    companyId: string;
    foodItemName: string;
    amount: number;
    currencyId: string;
    comment: string;
    claimedByUserId: string;
    claimedByUserName: string;
    claimedByUserProfileImage: string;
    foodOrderStatusId: string;
    status: string;
    statusSetByUserId: string;
    orderedDate: Date;
    orderedDateTime: Date;
    statusSetDateTime: Date;
    reason: string;
    createdDateTime: Date;
    createdByUserId: string;
    employeesName: string;
    employeesCount: number
    receipts: string;
    totalCount: number;
    foodOrderItems: string;
    memberId: any[];
    statusId: string;
    file: FileDetails[];
}

export class FoodOrderManagementApiInput {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirectionAsc: boolean;
    searchText: string;
    fromDate: Date;
    toDate: Date;
    date :Date;
    isRecent: boolean;
    entityId: string;
}

export class ChangeFoodOrderStatusInputModel
{
    foodOrderId:string;
    isFoodOrderApproved:boolean;
    rejectReason:string;
    timeStamp:any;
}

export class FileDetails {
    fileName: string;
    fileType: string;
    filePath: string;
}