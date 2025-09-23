export class UserStorySpentTimeInputModel {
    projectId: string;
    dateDescription: string;
    dateFrom: Date;
    dateTo: Date;
    days: number;
    userDescription: string;
    userId: string;
    hoursDescription: string;
    hoursFrom: number;
    hoursTo: number;    

    //paging
    pageSize: number;
    pageNumber: number;
    companyId: number;
    searchText: number;
    searchGoal: number;
    searchUserStory: number;
    orderByField: number;
    orderByDirection: number;
    isActive: boolean;
    isArchived: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    entityId: string;
}



export class UserStorySpentTimeModel {
    userStorySpentTimeId: string;
    userStoryId: string;
    dateFrom: Date;
    dateTo: Date;
    logTimeOptionId: string;
    comment: string;
    rawSpentTime: string;
    rawRemainingTimeSetOrReducedBy: string;
    spentTime: number;
    remainingTimeSetOrReducedBy: number;
    remainingTimeInMin: number;
    spentTimeInMin: number;
    userId: string;
    userInput: number;
}