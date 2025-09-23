export class AdhocWorkSearchCriteriaInputModel{
    teamMemberId:string;
    userStoryId:string;
    pageNumber:number;
    pageSize:number;
    teamMembersList:string;
    isParked:boolean;
    isArchived: boolean;
    isIncludeCompletedUserStories: boolean;
    searchUserstoryTag: string;
}