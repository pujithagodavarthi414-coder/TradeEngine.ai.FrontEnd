import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class HistoricalWorkReportModel extends SearchCriteriaInputModelBase {
    userId: string;
    dateFrom: Date;
    dateTo: Date;
    lineManagerId : string;
    projectId : string;
    boardTypeId : string;
    NoOfReplansMin: number;
    NoOfReplansMax: number;
    Showcomments: boolean;
    IsTableView: boolean;
    GoalSearchText: string;
    UserStorySearchText: string;
    BranchId : string;
    VerifiedBy : string;
    VerifiedOn : Date;
    IsGoalDealyed: boolean;
    IsUserStoryDealyed: boolean;
    UserStoryTypeId : string;
    UserStoryPriorityId : string;
    isSprintUserStory:boolean;
}