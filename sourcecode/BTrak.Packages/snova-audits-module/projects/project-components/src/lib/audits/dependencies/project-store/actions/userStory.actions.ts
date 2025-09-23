
  import { Action } from "@ngrx/store";
  import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
  import { UserStory } from "../../models/userStory";
  import { WorkflowStatusesModel } from "../../models/workflowStatusesModel";
  import { UserStoryReplanModel } from "../../models/userStoryReplanModel";
  import { fileModel } from "../../models/fileModel";
  import { Update } from "@ngrx/entity";
  import { ParkUserStoryInputModel } from "../../models/parkedUserstoryModel";
  import { ArchivedUserStoryInputModel } from "../../models/archivedUserStoryModel";
  import { ValidationModel } from "../../models/validation-messages";
  import { ArchivedkanbanModel } from "../../models/kanbanViewstatusModel";
  import { AmendUserStoryModel } from "../../models/amend-userstory-model";
  import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
  
  export enum UserStoryActionTypes {
    Search = "[SnovaAudisModule UserStory] Search",
    SearchComplete = "[SnovaAudisModule UserStory] Search Complete",
    SearchFailed =  "[SnovaAudisModule UserStory] Search Failed",
    SearchError = "[SnovaAudisModule UserStory] Search Error",
    Load = "[SnovaAudisModule UserStory] Load",
    Select = "[SnovaAudisModule UserStory] Select",
    PopulateWorkFlowStatuses = "[SnovaAudisModule UserStory] Populate Workflow Statuses",
    CreateUserStoryTriggered = "[SnovaAudisModule UserStory] Create UserStory",
    CreateUserStoryCompleted = "[SnovaAudisModule UserStory] Complete UserStory",
    CreateBugForUserStoryTriggered = "[SnovaAudisModule UserStory] Create Bug For UserStory",
    CreateBugForUserStoryCompleted = "[SnovaAudisModule UserStory] Complete Bug For UserStory",
    CreateBugForTestCaseStatusTriggered = "[SnovaAudisModule UserStory] Create Bug For Test Case Status",
    CreateBugForTestCaseStatusCompleted = "[SnovaAudisModule UserStory] Complete Bug For Test Case Status",
    CreateUserStoryCompletedWithInPlaceUpdate = "[SnovaAudisModule UserStory] Complete UserStory With In place Update",
    RefreshUserStoriesList = "[SnovaAudisModule UserStory] Complete UserStory With In place Add",
    RemoveUserStoryFromList = "[SnovaAudisModule UserStory] Remove UserStory From List",
    CreateUserStoryFailed = "[SnovaAudisModule UserStory] Failed UserStory",
    CreateMultipleUserStoriesTriggered = "[SnovaAudisModule UserStory] Create Multiple UserStory Triggered",
    CreateMultipleUserStoriesCompleted = "[SnovaAudisModule UserStory] Create Multiple UserStory Completed",
    CreateMultipleUserStoriesFailed = "[SnovaAudisModule UserStory] Failed Multiple UserStory",
    ClearUserStories = "[SnovaAudisModule UserStory] Clear User Stories",
    InsertUserStoryReplanTriggered = "[SnovaAudisModule UserStoryReplan] Insert UserStoryReplan",
    InsertUserStoryReplanCompleted = "[SnovaAudisModule UserStoryReplan] Complete UserStoryReplan",
    InsertUserStoryReplanFailed = "[SnovaAudisModule UserStoryReplan] Failed UserStoryReplan",
    ExceptionHandled = "[SnovaAudisModule UserStory] ExceptionHandled",
    MultipleUserStoriesUsingFileTriggered = "[SnovaAudisModule UserStory]Multiple UserStories Triggered",
    MultipleUserStoriesUsingFileCompleted = "[SnovaAudisModule UserStory]Multiple UserStories Completed",
    MultipleUserStoriesUsingFileFailed = "[SnovaAudisModule UserStory]Multiple UserStories Failed",
    GetUserStoryByIdTriggered = "[SnovaAudisModule UserStory]Get User Story By Id Triggered",
    GetUserStoryByIdCompleted = "[SnovaAudisModule UserStory]Get User Story By Id Completed",
    GetUniqueUserStoryByIdTriggered = "[SnovaAudisModule UserStory]Get Unique User Story By Id Triggered",
    GetUniqueUserStoryByIdCompleted = "[SnovaAudisModule UserStory]Get Unique User Story By Id Completed",
    CreateMultipleUserStoriesSplitTriggered = "[SnovaAudisModule UserStory] Create Multiple UserStories Split Triggered",
    CreateMultipleUserStoriesSplitCompleted = "[SnovaAudisModule UserStory] Create Multiple UserStories Split Completed",
    CreateMultipleUserStoriesSplitFailed = "[SnovaAudisModule UserStory] Create Multiple UserStories Split Failed",
    ArchiveUserStoryTriggred = "[SnovaAudisModule UserStory] Archive UserStory Triggered",
    ArchiveUserStoryCompleted = "[SnovaAudisModule UserStory] Archive UserStory Completed",
    ArchiveUserStoryFailed = "[SnovaAudisModule UserStory] Archive UserStory Failed",
    ArchiveUniqueUserStoryTriggred = "[SnovaAudisModule UserStory] Archive Unique UserStory Triggered",
    ArchiveUniqueUserStoryCompleted = "[SnovaAudisModule UserStory] Archive Unique UserStory Completed",
    ArchiveUniqueUserStoryFailed = "[SnovaAudisModule UserStory] Archive Unique UserStory Failed",
    ParkUserStoryTriggred = "[SnovaAudisModule UserStory]  Park UserStory Triggered",
    ParkUserStoryCompleted = "[SnovaAudisModule UserStory] Park UserStory Completed",
    ParkUserStoryFailed = "[SnovaAudisModule UserStory] Park UserStory Failed",
    ParkUniqueUserStoryTriggred = "[SnovaAudisModule UserStory]  Park Unique UserStory Triggered",
    ParkUniqueUserStoryCompleted = "[SnovaAudisModule UserStory] Park Unique UserStory Completed",
    ParkUniqueUserStoryFailed = "[SnovaAudisModule UserStory] Park Unique UserStory Failed",
    UpdateUserStoryGoalTriggred = "[SnovaAudisModule UserStory]  Update UserStoryGoal Triggered",
    UpdateUserStoryGoalCompleted = "[SnovaAudisModule UserStory] Update UserStoryGoal Completed",
    UpdateUserStoryGoaalFailed = "[SnovaAudisModule UserStory] Update UserStoryGoal Failed",
    SearchAllGoals = "[SnovaAudisModule UserStory] Search All Goals",
    ArchivekanbanGoalsTriggered = "[SnovaAudisModule ArchivekanbanGoals] Archive All KanbanGoals Triggered" ,
    ArchivekanbanGoalsCompleted = "[SnovaAudisModule ArchivekanbanGoals] Archive All KanbanGoals Completed" ,
    ArchivekanbanGoalsFailed = "[SnovaAudisModule ArchivekanbanGoals] Archive All KanbanGoals Failed",
    ArchiveKanbanFailed = "[SnovaAudisModule ArchivekanbanGoals] Archive Kanban Failed",
    ReOrderUserStoriesTriggred = "[SnovaAudisModule UserStory] ReOrder UserStories Triggred",
    ReOrderUserStoriesCompleted = "[SnovaAudisModule UserStory] ReOrder UserStories Completed",
    ReOrderUserStoriesFailed = "[SnovaAudisModule UserStory] ReOrder UserStories Failed",
    ReOrderSubUserStoriesTriggred = "[SnovaAudisModule UserStory] ReOrder SubUserStories Triggred",
    ReOrderSubUserStoriesCompleted = "[SnovaAudisModule UserStory] ReOrder SubUserStories Completed",
    ReOrderSubUserStoriesFailed = "[SnovaAudisModule UserStory] ReOrder SubUserStories Failed",
    UpdateReOrderUserStories = "[SnovaAudisModule UserStory] Update ReOrder User stories",
    RefreshMultipleUserStoriesList = "[SnovaAudisModule UserStory]Refresh Multiple UserStories List",
    UpdateMultipleUserStories = "[SnovaAudisModule UserStory]Update Multiple UserStories",
    UpdateSingleUserStoryForBugsTriggered = "[SnovaAudisModule UserStory]Update Multiple UserStories For Bugs Triggered",
    UpdateSingleUserStoryForBugsCompleted = "[SnovaAudisModule UserStory]Update Multiple UserStories For Bugs Completed",
    AmendUserStoriesDeadlineTriggered = "[SnovaAudisModule UserStory]Amend UserStories Deadline Triggered",
    AmendUserStoriesDeadlineCompleted = "[SnovaAudisModule UserStory]Amend UserStories Deadline Completed",
    AmendUserStoriesDeadlineFailed = "[SnovaAudisModule UserStory]Amend UserStories Deadline Failed",
    UpsertUserStoryTagsTriggered = "[SnovaAudisModule UserStory]UserStory Tags Triggered",
    UpsertUserStoryTagsCompleted = "[SnovaAudisModule UserStory]UserStory Tags Completed",
    UpsertUserStoryTagsFailed = "[SnovaAudisModule UserStory]UserStory Tags Failed",
    UpsertSubTaskCompleted = "[SnovaAudisModule UserStory]UserStory SubTask Completed",
    GetUserStorySubTasksTriggered = "[SnovaAudisModule UserStory]Get UserStory SubTasks Triggered",
    GetUserStorySubTasksCompleted = "[SnovaAudisModule UserStory]Get UserStory SubTasks Completed",
    GetUserStorySubTasksFailed = "[SnovaAudisModule UserStory]Get UserStory SubTasks Failed",
    SearchAutoCompleteTriggered = "[SnovaAudisModule UserStory]Search Autocomplete Triggered",
    SearchAutoCompleteCompleted = "[SnovaAudisModule UserStory]Search Autocomplete Completed",
    SearchAutoCompleteFailed = "[SnovaAudisModule UserStory]Search Autocomplete Failed",
    UpdateSubTaskUserStoryTriggered = "[SnovaAudisModule UserStory] Update SubTask User story Triggered",
    UpdateSubTaskUserStoryCompleted = "[SnovaAudisModule UserStory] Update SubTask User story Completed",
    UpdateSubTaskUserStoryFailed = "[SnovaAudisModule UserStory] Update SubTask User story Failed",
    UpdateSubTaskInUniquePageTriggered = "[SnovaAudisModule UserStory] Update SubTask User story In Unique Page Triggered",
    UpdateSubTaskInUniquePageCompleted = "[SnovaAudisModule UserStory] Update SubTask User story In Unique Page Completed",
    UpdateSubTaskInUniquePageFailed = "[SnovaAudisModule UserStory] Update SubTask User story In Unique Page Failed",
    ArchiveSubTaskUserStoryTriggred = "[SnovaAudisModule UserStory] Archive SubTask UserStory Triggered",
    ArchiveSubTaskUserStoryCompleted = "[SnovaAudisModule UserStory] Archive SubTask UserStory Completed",
    ArchiveSubTaskUserStoryFailed = "[SnovaAudisModule UserStory] Archive SubTask UserStory Failed",
    ParkSubTaskUserStoryTriggred = "[SnovaAudisModule UserStory]  Park SubTask UserStory Triggered",
    ParkSubTaskUserStoryCompleted = "[SnovaAudisModule UserStory] Park SubTask UserStory Completed",
    ParkSubTaskUserStoryFailed = "[SnovaAudisModule UserStory] Park SubTask UserStory Failed",
    UpsertUserStoryByIdTriggered = "[SnovaAudisModule UserStory] Updated UserStoryData Failed",
    UpsertUserStoryByIdCompleted = "[SnovaAudisModule UserStory] Updated UserStoryData Triggered",
    UpsertUserStoryByIdFailed = "[SnovaAudisModule UserStory] Updated UserStoryData Completed",
    RemoveUserStoryFromBacklogList = "[SnovaAudisModule UserStory] Remove UserStory From Backlog List"
  }
  
  export class Search implements Action {
    readonly type = UserStoryActionTypes.Search;
    UserStory: UserStory[];
    error: string;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    userStory: UserStory;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(
      public userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel
    ) {}
  }
  
  
  export class SearchAllGoals implements Action {
    readonly type = UserStoryActionTypes.SearchAllGoals;
    UserStory: UserStory[];
    error: string;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    userStory: UserStory;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(
      public userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel
    ) {}
  }
  
  export class SearchComplete implements Action {
    readonly type = UserStoryActionTypes.SearchComplete;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    error: string;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    userStory: UserStory;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryList: UserStory[]) {}
  }
  
  export class SearchError implements Action {
    readonly type = UserStoryActionTypes.SearchError;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryList: UserStory[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    userStory: UserStory;
    errorMessage: string;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public error: string) {}
  }
  
  export class Load implements Action {
    readonly type = UserStoryActionTypes.Load;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryList: UserStory[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    userStoryId: string;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class Select implements Action {
    readonly type = UserStoryActionTypes.Select;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryList: UserStory[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class PopulateWorkFlowStatuses implements Action {
    readonly type = UserStoryActionTypes.PopulateWorkFlowStatuses;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    userStory: UserStory;
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public workflowStatusModel: WorkflowStatusesModel[]) {}
  }
  
  export class CreateMultipleUserStoriesSplitTriggered implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesSplitTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class CreateMultipleUserStoriesSplitCompleted implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class CreateMultipleUserStoriesSplitFailed implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesSplitFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class CreateUserStoryTriggered implements Action {
    type = UserStoryActionTypes.CreateUserStoryTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class CreateUserStoryCompleted implements Action {
    type = UserStoryActionTypes.CreateUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class CreateBugForUserStoryTriggered implements Action {
    type = UserStoryActionTypes.CreateBugForUserStoryTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStory: UserStory;
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public bugForUserStory: UserStory) {}
  }
  
  export class CreateBugForUserStoryCompleted implements Action {
    type = UserStoryActionTypes.CreateBugForUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStory: UserStory;
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public bugForUserStoryId: string) {}
  }
  
  export class CreateBugForTestCaseStatusTriggered implements Action {
    type = UserStoryActionTypes.CreateBugForTestCaseStatusTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStory: UserStory;
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public bugForTestCaseStatus: UserStory) {}
  }
  
  export class CreateBugForTestCaseStatusCompleted implements Action {
    type = UserStoryActionTypes.CreateBugForTestCaseStatusCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStory: UserStory;
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public bugForTestCaseStatusId: string) {}
  }
  
  export class CreateUserStoryCompletedWithInPlaceUpdate implements Action {
    type = UserStoryActionTypes.CreateUserStoryCompletedWithInPlaceUpdate;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryId: string;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(
      public userStoryUpdates: { userStoryUpdate: Update<UserStory> }
    ) {}
  }
  
  export class RefreshUserStoriesList implements Action {
    type = UserStoryActionTypes.RefreshUserStoriesList;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryId: string;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class RefreshMultipleUserStoriesList implements Action {
    type = UserStoryActionTypes.RefreshMultipleUserStoriesList;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStory: UserStory;
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryId: string;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryList: UserStory[]) {}
  }
  
  
  export class RemoveUserStoryFromList implements Action {
    type = UserStoryActionTypes.RemoveUserStoryFromList;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryId: string;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class GetUserStoryByIdTriggered implements Action {
    type = UserStoryActionTypes.GetUserStoryByIdTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class GetUserStoryByIdCompleted implements Action {
    type = UserStoryActionTypes.GetUserStoryByIdCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class CreateUserStoryFailed implements Action {
    type = UserStoryActionTypes.CreateUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ArchivedUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ArchiveUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public archiveUserStory: ArchivedUserStoryInputModel) {}
  }
  
  export class ArchiveUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ArchiveUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class ArchiveUserStoryFailed implements Action {
    type = UserStoryActionTypes.ArchiveUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ArchivedUniqueUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ArchiveUniqueUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public archiveUserStory: ArchivedUserStoryInputModel) {}
  }
  
  export class ArchiveUniqueUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ArchiveUniqueUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public userStoryId: string) {}
  }
  
  export class ArchiveUniqueUserStoryFailed implements Action {
    type = UserStoryActionTypes.ArchiveUniqueUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ArchivedSubTaskUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ArchiveSubTaskUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public archiveUserStory: ArchivedUserStoryInputModel) {}
  }
  
  export class ArchiveSubTaskUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public userStoryId: string) {}
  }
  
  export class ArchiveSubTaskUserStoryFailed implements Action {
    type = UserStoryActionTypes.ArchiveSubTaskUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ParkUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ParkUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    archiveUserStory: ArchivedUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public parkUserStory: ParkUserStoryInputModel) {}
  }
  
  export class ParkUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ParkUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class ParkUserStoryFailed implements Action {
    type = UserStoryActionTypes.ParkUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ParkUniqueUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ParkUniqueUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    archiveUserStory: ArchivedUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public parkUserStory: ParkUserStoryInputModel) {}
  }
  
  export class ParkUniqueUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ParkUniqueUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public userStoryId: string) {}
  }
  
  export class ParkUniqueUserStoryFailed implements Action {
    type = UserStoryActionTypes.ParkUniqueUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ParkSubTaskUserStoryTriggered implements Action {
    type = UserStoryActionTypes.ParkSubTaskUserStoryTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    archiveUserStory: ArchivedUserStoryInputModel;
    userStory: UserStory;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public parkUserStory: ParkUserStoryInputModel) {}
  }
  
  export class ParkSubTaskUserStoryCompleted implements Action {
    type = UserStoryActionTypes.ParkSubTaskUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public userStoryId: string) {}
  }
  
  export class ParkSubTaskUserStoryFailed implements Action {
    type = UserStoryActionTypes.ParkSubTaskUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class InsertUserStoryReplanTriggered implements Action {
    type = UserStoryActionTypes.InsertUserStoryReplanTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStory: UserStory;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryReplan: UserStoryReplanModel) {}
  }
  
  export class InsertUserStoryReplanCompleted implements Action {
    type = UserStoryActionTypes.InsertUserStoryReplanCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class InsertUserStoryReplanFailed implements Action {
    type = UserStoryActionTypes.InsertUserStoryReplanFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ClearUserStories implements Action {
    type = UserStoryActionTypes.ClearUserStories;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    parkUserStory: ParkUserStoryInputModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor() {}
  }
  
  export class ExceptionHandled implements Action {
    type = UserStoryActionTypes.ExceptionHandled;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public errorMessage: string) {}
  }
  
  export class CreateMultipleUserStoriestriggered implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class CreateMultipleUserStoryCompleted implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class CreateMultipleUserStoriesFailed implements Action {
    type = UserStoryActionTypes.CreateMultipleUserStoriesFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class MultipleUserStoriesUsingFileTriggered implements Action {
    type = UserStoryActionTypes.MultipleUserStoriesUsingFileTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    userStory: UserStory;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public fileModel: fileModel) {}
  }
  
  export class MultipleUserStoriesUsingFileCompleted implements Action {
    type = UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class MultipleUserStoriesUsingFileFailed implements Action {
    type = UserStoryActionTypes.MultipleUserStoriesUsingFileFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  
  export class UpdateUserStoryGoalTriggred implements Action {
    type = UserStoryActionTypes.UpdateUserStoryGoalTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class UpdateUserStoryGoalCompleted implements Action {
    type = UserStoryActionTypes.UpdateUserStoryGoalCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class UpdateUserStoryGoaalFailed implements Action {
    type = UserStoryActionTypes.UpdateUserStoryGoaalFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  
  export class SearchFailed implements Action {
    type = UserStoryActionTypes.SearchFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class GetUniqueUserStoryByIdTriggered implements Action {
    type = UserStoryActionTypes.GetUniqueUserStoryByIdTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  export class ReOrderUserStoriesTriggred implements Action {
    type = UserStoryActionTypes.ReOrderUserStoriesTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    userStory: UserStory;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public reOrderedUserstoriesList: string[],public parentUserStoryId : string) {}
  }
  
  export class ReOrderSubUserStoriesTriggred implements Action {
    type = UserStoryActionTypes.ReOrderSubUserStoriesTriggred;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    userStory: UserStory;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public reOrderedUserstoriesList: string[]) {}
  }
  
  
  export class GetUniqueUserStoryByIdCompleted implements Action {
    type = UserStoryActionTypes.GetUniqueUserStoryByIdCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  export class ReOrderUserStoriesCompleted implements Action {
    type = UserStoryActionTypes.ReOrderUserStoriesCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryId: string;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor() {}
  }
  
  export class ReOrderUserStoriesFailed implements Action {
    type = UserStoryActionTypes.ReOrderUserStoriesFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ReOrderSubUserStoriesCompleted implements Action {
    type = UserStoryActionTypes.ReOrderSubUserStoriesCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryId: string;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor() {}
  }
  
  export class ReOrderSubUserStoriesFailed implements Action {
    type = UserStoryActionTypes.ReOrderSubUserStoriesFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class ArchivekanbanGoalsTriggered implements Action {
    type = UserStoryActionTypes.ArchivekanbanGoalsTriggered;
    goalId: string;
    archivedkanban:string;
    validationMessages: any[];
    errorMessage: string;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    userStory: UserStory;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryReplan: UserStoryReplanModel;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public archivedkanbanModel: ArchivedkanbanModel) { }
  }
  
  export class ArchivekanbanGoalsCompleted implements Action {
    type = UserStoryActionTypes.ArchivekanbanGoalsCompleted;
    goalId: string;
    validationMessages: any[];
    errorMessage: string;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    userStory: UserStory;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryReplan: UserStoryReplanModel;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    archivedkanbanModel: ArchivedkanbanModel;
    amendUserStoryModel : AmendUserStoryModel;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStories: string[]) { }
  }
  
  export class ArchivekanbanGoalsFailed implements Action {
    type = UserStoryActionTypes.ReOrderUserStoriesFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) { }
  }
  
  export class UpdateMultipleUserStories implements Action {
    type = UserStoryActionTypes.UpdateMultipleUserStories;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    validationMessages: ValidationModel[];
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] }) { }
  }

  export class UpdateSingleUserStoryForBugsTriggered implements Action {
    type = UserStoryActionTypes.UpdateSingleUserStoryForBugsTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }

  export class UpdateSingleUserStoryForBugsCompleted implements Action {
    type = UserStoryActionTypes.UpdateSingleUserStoryForBugsCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryId: string;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryUpdates: { userStoryUpdate: Update<UserStory> }) {}
  }
  
  export class AmendUserStoryDeadlineTriggered implements Action {
    type = UserStoryActionTypes.AmendUserStoriesDeadlineTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    validationMessages: ValidationModel[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] }
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public  amendUserStoryModel : AmendUserStoryModel) { }
  }
  
  export class AmendUserStoryDeadlineCompleted implements Action {
    type = UserStoryActionTypes.AmendUserStoriesDeadlineCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    validationMessages: ValidationModel[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] }
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public  userStories: string[]) { }
  }
  
  export class AmendUserStoryDeadlineFailed implements Action {
    type = UserStoryActionTypes.AmendUserStoriesDeadlineFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public  validationMessages: ValidationModel[]) { }
  }
  
  export class UpsertUserStoryTagsTriggered implements Action {
    type = UserStoryActionTypes.UpsertUserStoryTagsTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    validationMessages: ValidationModel[];
    constructor(public   tagsInputModel :UserStoryInputTagsModel) { }
  }
  
  export class UpsertUserStoryTagsCompleted implements Action {
    type = UserStoryActionTypes.UpsertUserStoryTagsCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) { }
  }
  
  export class UpsertUserStoryTagsFailed implements Action {
    type = UserStoryActionTypes.UpsertUserStoryTagsFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public   validationMessages: ValidationModel[]) { }
  }
  
  export class UpsertSubTaskCompleted implements Action {
    type = UserStoryActionTypes.UpsertSubTaskCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor() { }
  }
  
  export class GetUserStorySubTasksTriggered implements Action {
    type = UserStoryActionTypes.GetUserStorySubTasksTriggered;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor( public userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel) { }
  }
  
  export class GetUserStorySubTasksCompleted implements Action {
    type = UserStoryActionTypes.GetUserStorySubTasksCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor(public  userStoryList: UserStory[]) { }
  }
  
  export class GetUserStorySubTasksFailed implements Action {
    type = UserStoryActionTypes.GetUserStorySubTasksFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor() { }
  }
  
  export class SearchAutoCompleteFailed implements Action {
    type = UserStoryActionTypes.SearchAutoCompleteFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) { }
  }
  
  export class SearchAutoCompleteTriggered implements Action {
    type = UserStoryActionTypes.SearchAutoCompleteTriggered;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor(public userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel) { }
  }
  
  export class SearchAutoCompleteCompleted implements Action {
    type = UserStoryActionTypes.SearchAutoCompleteCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor(public  userStoryList: UserStory[]) { }
  }
  
  
  export class UpdateSubTaskUserStoryTriggered implements Action {
    type = UserStoryActionTypes.UpdateSubTaskUserStoryTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class UpdateSubTaskUserStoryCompleted implements Action {
    type = UserStoryActionTypes.UpdateSubTaskUserStoryCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    userStory: UserStory;
    constructor(public userStoryId: string) {}
  }
  
  export class UpdateSubTaskUserStoryFailed implements Action {
    type = UserStoryActionTypes.UpdateSubTaskUserStoryFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) { }
  }
  
  export class UpdateSubTaskInUniquePageTriggered implements Action {
    type = UserStoryActionTypes.UpdateSubTaskInUniquePageTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStoryId: string) {}
  }
  
  export class UpdateSubTaskInUniquePageCompleted implements Action {
    type = UserStoryActionTypes.UpdateSubTaskInUniquePageCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public userStory: UserStory) {}
  }
  
  export class UpdateSubTaskInUniquePageFailed implements Action {
    type = UserStoryActionTypes.UpdateSubTaskInUniquePageFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  
  export class UpsertUserStoryByIdTriggered implements Action {
    type = UserStoryActionTypes.UpsertUserStoryByIdTriggered;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    userStory: UserStory;
    constructor(public requestId:string) {}
  }
  
  export class UpsertUserStoryByIdCompleted implements Action {
    type = UserStoryActionTypes.UpsertUserStoryByIdCompleted;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    validationMessages: ValidationModel[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryId: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    userStory: UserStory;
    constructor(public userStoryUpdates: { userStoryUpdate: Update<UserStory> }) {}
  }
  
  export class UpsertUserStoryByIdFailed implements Action {
    type = UserStoryActionTypes.UpsertUserStoryByIdFailed;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryList: UserStory[];
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    goalId: string;
    archivedkanban:string;
    userStories: string[];
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    constructor(public validationMessages: ValidationModel[]) {}
  }
  export class UpdateReOrderUserStories implements Action {
    type = UserStoryActionTypes.UpdateReOrderUserStories;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStoryId: string;
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    public requestId:string;
    validationMessages: ValidationModel[];
    constructor() { }
  }

  export class RemoveUserStoryFromBacklogList implements Action {
    type = UserStoryActionTypes.RemoveUserStoryFromBacklogList;
    userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
    workflowStatusModel: WorkflowStatusesModel[];
    userStory: UserStory;
    userStoryList: UserStory[];
    userStoryReplan: UserStoryReplanModel;
    errorMessage: string;
    fileModel: fileModel;
    userStoryUpdates: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    reOrderedUserstoriesList: string[];
    parentUserStoryId : string
    userStories: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    amendUserStoryModel : AmendUserStoryModel;
    tagsInputModel :UserStoryInputTagsModel;
    validationMessages: ValidationModel[];
    constructor( public userStoryId: string) { }
  }
  
  
  
  /**
   * Export a type alias of all actions in this action group
   * so that reducers can easily compose action types
   */
  export type UserStoryActionsUnion =
    | Search
    | SearchComplete
    | SearchError
    | SearchFailed
    | Load
    | Select
    | PopulateWorkFlowStatuses
    | CreateUserStoryTriggered
    | CreateUserStoryCompleted
    | CreateBugForUserStoryTriggered
    | CreateBugForUserStoryCompleted
    | CreateBugForTestCaseStatusTriggered
    | CreateBugForTestCaseStatusCompleted
    | CreateUserStoryFailed
    | ClearUserStories
    | InsertUserStoryReplanTriggered
    | InsertUserStoryReplanCompleted
    | InsertUserStoryReplanFailed
    | ExceptionHandled
    | CreateMultipleUserStoriestriggered
    | CreateMultipleUserStoryCompleted
    | CreateMultipleUserStoriesFailed
    | MultipleUserStoriesUsingFileTriggered
    | MultipleUserStoriesUsingFileCompleted
    | MultipleUserStoriesUsingFileFailed
    | CreateUserStoryCompletedWithInPlaceUpdate
    | RefreshUserStoriesList
    | GetUserStoryByIdTriggered
    | GetUserStoryByIdCompleted
    | RemoveUserStoryFromList
    | CreateMultipleUserStoriesSplitTriggered
    | CreateMultipleUserStoriesSplitCompleted
    | CreateMultipleUserStoriesSplitFailed
    | ArchivedUserStoryTriggered
    | ArchiveUserStoryCompleted
    | ArchiveUserStoryFailed
    | ArchivedUniqueUserStoryTriggered
    | ArchiveUniqueUserStoryCompleted
    | ArchiveUniqueUserStoryFailed
    | ParkUserStoryTriggered
    | ParkUserStoryCompleted
    | ParkUserStoryFailed
    | ParkUniqueUserStoryTriggered
    | ParkUniqueUserStoryCompleted
    | ParkUniqueUserStoryFailed
    | UpdateUserStoryGoalTriggred
    | UpdateUserStoryGoalCompleted
    | UpdateUserStoryGoaalFailed
    | SearchAllGoals
    | GetUniqueUserStoryByIdTriggered
    | GetUniqueUserStoryByIdCompleted
    | ArchivekanbanGoalsTriggered
    | ArchivekanbanGoalsCompleted
    | ArchivekanbanGoalsFailed
    | SearchAllGoals
    | ReOrderUserStoriesTriggred
    | ReOrderUserStoriesCompleted
    | ReOrderUserStoriesFailed
    | RefreshMultipleUserStoriesList
    | UpdateMultipleUserStories
    | UpdateSingleUserStoryForBugsTriggered
    | UpdateSingleUserStoryForBugsCompleted
    | AmendUserStoryDeadlineTriggered
    | AmendUserStoryDeadlineCompleted
    | AmendUserStoryDeadlineFailed
    | UpsertUserStoryTagsTriggered
    | UpsertUserStoryTagsCompleted
    | UpsertUserStoryTagsFailed
    | UpsertSubTaskCompleted
    | GetUserStorySubTasksTriggered
    | GetUserStorySubTasksCompleted
    | GetUserStorySubTasksFailed
    | SearchAutoCompleteTriggered
    | SearchAutoCompleteCompleted
    | SearchAutoCompleteFailed
    | UpdateSubTaskUserStoryTriggered
    | UpdateSubTaskUserStoryCompleted
    | UpdateSubTaskUserStoryFailed
    | UpdateSubTaskInUniquePageTriggered
    | UpdateSubTaskInUniquePageCompleted
    | UpdateSubTaskInUniquePageCompleted
    | ArchivedSubTaskUserStoryTriggered
    | ArchiveSubTaskUserStoryCompleted
    | ArchiveSubTaskUserStoryFailed
    | ParkSubTaskUserStoryTriggered
    | ParkSubTaskUserStoryCompleted
    | ParkSubTaskUserStoryFailed
    | ReOrderSubUserStoriesTriggred
    | ReOrderSubUserStoriesCompleted
    | ReOrderSubUserStoriesFailed
    | UpsertUserStoryByIdCompleted
    | UpsertUserStoryByIdTriggered
    | RemoveUserStoryFromBacklogList
    | UpsertUserStoryByIdFailed;
  