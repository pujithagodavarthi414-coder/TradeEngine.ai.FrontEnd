export class MostProductiveUsersInputModel{
    applicationTypeName: string;
    dateFrom: string;
    dateTo: string;
}

export class MostProductiveUsersOutputModel{
    userId: string;
    fullName: string;
    profileImage: string;
    spentPercent: any;
    spentTime: string;
    totalTime: string;
}