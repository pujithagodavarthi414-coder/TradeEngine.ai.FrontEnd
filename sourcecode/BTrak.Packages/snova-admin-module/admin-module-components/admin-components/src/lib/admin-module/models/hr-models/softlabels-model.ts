export class SoftLabelConfigurationModel {
    softLabelConfigurationId: string;
    projectLabel: string;
    goalLabel: string;
    employeeLabel: string;
    userStoryLabel: string;
    deadlineLabel: string;
    projectsLabel: string;
    goalsLabel: string;
    employeesLabel: string;
    userStoriesLabel: string;
    deadlinesLabel: string;
    estimatedTimeLabel: string;
    estimationLabel: string;
    estimationsLabel: string;
    estimateLabel: string;
    estimatesLabel: string;
    auditLabel: string;
	auditsLabel: string;
	conductLabel: string;
	conductsLabel: string;
	actionLabel: string;
	actionsLabel: string;
	timelineLabel: string;
	auditActivityLabel: string;
	auditReportLabel: string;
    auditReportsLabel: string;
    reportLabel: string;
	reportsLabel: string;
	auditAnalyticsLabel: string;
    companyId: string;
    createdDateTime: string;
    timeStamp: any;
    searchText: string;
    clientLabel: string;
    clientsLabel: string;
}

export class WorkspaceDashboardFilterModel {
    workspaceDashboardId: string;
    workspaceDashboardFilterId: string;
    filterJson: string;
    isCalenderView: boolean;
    searchText: string;
    state: any;
    isArchived: boolean;
}

export class WorkspaceDashboardFilterDropdown {
    searchText: string;
    tagSearchText: string;
    workItemStatuses: string;
    workItemTypes: string;
    bugPriorities: string;
    isIncludeUnAssigned: boolean;
    isExcludeOtherUs: boolean;
    isUserBoardView: boolean;
    pageSize: number;
    pageNumber: number;
    schedulerViewIndex: number;
    isTheBoardLayoutKanban: boolean;
    isReportsPage: boolean;
    isCalenderView: boolean;
    isEmployeeTaskBoardPage: boolean;
    selectedItem:any;
    isDocumentsView:boolean;
    isReviewEnabled:boolean;
}