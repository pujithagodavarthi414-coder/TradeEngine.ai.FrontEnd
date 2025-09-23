import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { ArchiveGoalInputModel } from "../../models/ArchiveGoalInputModel";
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { ParkGoalInputModel } from "../../models/ParkGoalInputModel";
import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
import { CustomTagsModel } from "../../models/custom-tags-model";
import { ValidationModel } from '../../models/validation-messages';

export enum GoalActionTypes {
  Search = "[Snovasys-PM][GoalModel] Search",
  SearchComplete = "[Snovasys-PM][GoalModel] Search Complete",
  SearchError = "[Snovasys-PM][GoalModel] Search Error",
  SearchFailed = "[Snovasys-PM][GoalModel]Search Failed",
  Load = "[Snovasys-PM][GoalModel] Load",
  Select = "[Snovasys-PM][GoalModel] Select",
  CreateGoalTriggered = "[Snovasys-PM][GoalModel]Create Goal",
  CreateActiveGoalTriggered = "[Snovasys-PM][GoalModel]Create Active Goal",
  CreateGoalCompleted = "[Snovasys-PM][GoalModel]Create Goal Complete",
  CreateGoalFailed = "[Snovasys-PM][GoalModel]Create Goal Failed",
  CreateUniqueGoalTriggered = "[Snovasys-PM][GoalModel]Create Unique Goal",
  CreateUniqueGoalCompleted = "[Snovasys-PM][GoalModel]Create Unique Goal Complete",
  CreateUniqueGoalFailed = "[Snovasys-PM][GoalModel]Create Unique Goal Failed",
  GoalExceptionHandled = "[Snovasys-PM][GoalModel]Exception Handled",
  ArchiveGoalTriggered = "[Snovasys-PM][Goal]Archive Goal Triggered",
  ArchiveGoalCompleted = "[Snovasys-PM][Goal]Archive Goal Complete",
  ArchiveUnArchiveGoalCompleted = "[Snovasys-PM][Goal] Archive UnArchive Goal Complete",
  ArchiveGoalFailed = "[Snovasys-PM][Goal]Archive Goal Failed",
  ParkGoalTriggered = "[Snovasys-PM][Goal]Park Goal Triggered",
  ParkGoalCompleted = "[Snovasys-PM][Goal]Park Goal Complete",
  ParkGoalFailed = "[Snovasys-PM][Goal]Park Goal Failed",
  GetGoalByIdTriggered = "[Snovasys-PM][Goal]Get Goal By Id Triggered",
  GetGoalByIdCompleted = "[Snovasys-PM][Goal]Get Goal By Id Completed",
  GetAllGoalByIdTriggered = "[Snovasys-PM][Goal]Get All Goal By Id Triggered",
  GetGoalByIdFailed = "[Snovasys-PM][Goal]Get Goal By Id Failed",
  GetUniqueGoalByIdTriggered = "[Snovasys-PM][Goal]Get Unique Goal By Id Triggered",
  GetUniqueGoalByIdCompleted = "[Snovasys-PM][Goal]Get Unique Goal By Id Completed",
  GetUniqueGoalByIdFailed = "[Snovasys-PM][Goal]Get Unique Goal By Id Failed",
  GetUniqueGoalByUniqueIdTriggered = "[Snovasys-PM][Goal]Get Unique Goal By Unique Id Triggered",
  UpdateGoalList = "[Snovasys-PM][Goal]Update Goal Model",
  SearchAllGoals = "[Snovasys-PM][Goal]Search AllGoals Triggered",
  ApproveGoalCompleted = "[Snovasys-PM][Goal]Approve Goal Completed",
  ReplanGoalCompleted = "[Snovasys-PM][Goal]Replan Goal Completed",
  CreateNewGoalCompleted = "[Snovasys-PM][Goal]Create New Goal Completed",
  GetGoalDetailsByMultipleGoalIdsTriggered = "[Snovasys-PM][Goal]Get GoalDetails By Multiple Goal Ids Triggered",
  GetGoalDetailsByMultipleGoalIdsCompleted = "[Snovasys-PM][Goal]Get GoalDetails By Multiple Goal Ids Completed",
  GetGoalDetailsByMultipleGoalIdsForBugsTriggered = "[Snovasys-PM][Goal]Get GoalDetails By Multiple Goal Ids For Bugs Triggered",
  GetGoalDetailsByMultipleGoalIdsForBugsCompleted = "[Snovasys-PM][Goal]Get GoalDetails By Multiple Goal Ids For Bugs Completed",
  GetGoalDetailsByMultipleGoalIdsFailed = "[Snovasys-PM][Goal]Get GoalDetails By Multiple Goal Ids Failed",
  RefreshGoalsList = "[Snovasys-PM][Goal]Refresh Goals Page",
  UpsertGoalTagsTriggered = "[Snovasys-PM][Goal] Upsert Goal Tags Triggered",
  UpsertGoalTagsCompleted = "[Snovasys-PM][Goal] Upsert Goal Tags Completed",
  UpsertGoalTagsFailed = "[Snovasys-PM][Goal] Upsert Goal Tags Failed",
  SearchTagsTriggered = "[Snovasys-PM][Goal] Search Tags Triggered",
  SearchTagsCompleted = "[Snovasys-PM][Goal] Search Tags Completed",
  SearchTagsFailed = "[Snovasys-PM][Goal] Search Tags Failed"
}

export class Search implements Action {
  readonly type = GoalActionTypes.Search;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Update<GoalModel[]> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalSearchResult: GoalSearchCriteriaApiInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchAllGoals implements Action {
  readonly type = GoalActionTypes.SearchAllGoals;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Update<GoalModel[]> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalSearchResult: GoalSearchCriteriaApiInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchComplete implements Action {
  readonly type = GoalActionTypes.SearchComplete;
  error: string;
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalResult: GoalModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchError implements Action {
  readonly type = GoalActionTypes.SearchError;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public error: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class Load implements Action {
  readonly type = GoalActionTypes.Load;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class Select implements Action {
  readonly type = GoalActionTypes.Select;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUniqueGoalTriggered implements Action {
  type = GoalActionTypes.CreateUniqueGoalTriggered;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUniqueGoalCompleted implements Action {
  type = GoalActionTypes.CreateUniqueGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateUniqueGoalFailed implements Action {
  type = GoalActionTypes.CreateUniqueGoalFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateGoalTriggered implements Action {
  type = GoalActionTypes.CreateGoalTriggered;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goal: GoalModel) {}
}

export class CreateActiveGoalTriggered implements Action {
  type = GoalActionTypes.CreateActiveGoalTriggered;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateGoalCompleted implements Action {
  type = GoalActionTypes.CreateGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateGoalFailed implements Action {
  type = GoalActionTypes.CreateGoalFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GoalExceptionHandled implements Action {
  type = GoalActionTypes.CreateGoalFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  validationMessages: ValidationModel[];
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public errorMessage: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalTriggered implements Action {
  type = GoalActionTypes.ArchiveGoalTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  goalId: string;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public archivedGoalModel: ArchiveGoalInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalCompleted implements Action {
  type = GoalActionTypes.ArchiveGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  validationMessages: ValidationModel[];
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>>};
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveUnArchiveGoalCompleted implements Action {
  type = GoalActionTypes.ArchiveUnArchiveGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  goalId: string;
  errorMessage: string;
  projectId: string;
  validationMessages: ValidationModel[];
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>>};
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalFailed implements Action {
  type = GoalActionTypes.ArchiveGoalFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ParkGoalTriggered implements Action {
  type = GoalActionTypes.ParkGoalTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  goalId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public parkGoalModel: ParkGoalInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ParkGoalCompleted implements Action {
  type = GoalActionTypes.ParkGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  validationMessages: ValidationModel[];
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ParkGoalFailed implements Action {
  type = GoalActionTypes.ParkGoalFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalByIdTriggered implements Action {
  type = GoalActionTypes.GetGoalByIdTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

export class GetAllGoalByIdTriggered implements Action {
  type = GoalActionTypes.GetAllGoalByIdTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalByIdCompleted implements Action {
  type = GoalActionTypes.GetGoalByIdCompleted;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  validationMessages: ValidationModel[];
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalByIdFailed implements Action {
  type = GoalActionTypes.GetGoalByIdFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetUniqueGoalByIdTriggered implements Action {
  type = GoalActionTypes.GetUniqueGoalByIdTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

export class GetUniqueGoalByUniqueIdTriggered implements Action {
  type = GoalActionTypes.GetUniqueGoalByUniqueIdTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetUniqueGoalByIdCompleted implements Action {
  type = GoalActionTypes.GetUniqueGoalByIdCompleted;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  validationMessages: ValidationModel[];
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetUniqueGoalByIdFailed implements Action {
  type = GoalActionTypes.GetUniqueGoalByIdFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateGoalList implements Action {
  type = GoalActionTypes.UpdateGoalList;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  validationMessages: ValidationModel[];
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalUpdates: { goalUpdate: Update<GoalModel> }) {}
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshGoalsList implements Action {
  type = GoalActionTypes.RefreshGoalsList;
  goalResult: GoalModel[];
  error: string;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goal: GoalModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchFailed implements Action {
  type = GoalActionTypes.SearchFailed;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> }
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ApproveGoalCompleted implements Action {
  type = GoalActionTypes.ApproveGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  validationMessages: ValidationModel[];
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>>};
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class ReplanGoalCompleted implements Action {
  type = GoalActionTypes.ReplanGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  validationMessages: ValidationModel[];
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor( ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateNewGoalCompleted implements Action {
  type = GoalActionTypes.CreateNewGoalCompleted;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  validationMessages: ValidationModel[];
  goalIds: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor( ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalDetailsByMultipleGoalIdsTriggered implements Action {
  type = GoalActionTypes.GetGoalDetailsByMultipleGoalIdsTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  validationMessages: ValidationModel[];
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>>};
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalIds: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalDetailsByMultipleGoalIdsCompleted implements Action {
  readonly type = GoalActionTypes.GetGoalDetailsByMultipleGoalIdsCompleted;
  error: string;
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalResult: GoalModel[];
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> }) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalDetailsByMultipleGoalIdsForBugsTriggered implements Action {
  type = GoalActionTypes.GetGoalDetailsByMultipleGoalIdsForBugsTriggered;
  goalResult: GoalModel[];
  error: string;
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  projectId: string;
  errorMessage: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  validationMessages: ValidationModel[];
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>>};
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalIds: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalDetailsByMultipleGoalIdsForBugsCompleted implements Action {
  readonly type = GoalActionTypes.GetGoalDetailsByMultipleGoalIdsForBugsCompleted;
  error: string;
  goal: GoalModel;
  goalId: string;
  validationMessages: ValidationModel[];
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  goalResult: GoalModel[];
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> }) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalDetailsByMultipleGoalIdsFailed implements Action {
  readonly type = GoalActionTypes.GetGoalDetailsByMultipleGoalIdsFailed;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalTagsTriggered implements Action {
  readonly type = GoalActionTypes.UpsertGoalTagsTriggered;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  validationMessages: ValidationModel[];
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  goalTagsUpsertModel: UserStoryInputTagsModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalTagsCompleted implements Action {
  readonly type = GoalActionTypes.UpsertGoalTagsCompleted;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  validationMessages: ValidationModel[];
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  goalId: string ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalTagsFailed implements Action {
  readonly type = GoalActionTypes.UpsertGoalTagsFailed;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalId: string;
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchTagsTriggered implements Action {
  readonly type = GoalActionTypes.SearchTagsTriggered;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalId: string;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  validationMessages: ValidationModel[];
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  
  constructor(public  searchText: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchTagsCompleted implements Action {
  readonly type = GoalActionTypes.SearchTagsCompleted;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  validationMessages: ValidationModel[];
  goalTagsUpsertModel: UserStoryInputTagsModel;
  goalId: string;
  searchText: string;
  constructor(public customTagsModel: CustomTagsModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SearchTagsFailed implements Action {
  readonly type = GoalActionTypes.SearchTagsFailed;
  goalResult: GoalModel[];
  goal: GoalModel;
  goalSearchResult: GoalSearchCriteriaApiInputModel;
  errorMessage: string;
  projectId: string;
  archivedGoalModel: ArchiveGoalInputModel;
  parkGoalModel: ParkGoalInputModel;
  goalUpdates: { goalUpdate: Update<GoalModel> };
  goalIds: string;
  error: string;
  goalUpdatesMultiple: { goalUpdateMultiple: Array<Update<GoalModel>> };
  goalId: string;
  goalTagsUpsertModel: UserStoryInputTagsModel;
  customTagsModel: CustomTagsModel[];
  searchText: string;
  constructor(public  validationMessages: ValidationModel[]) {}
}

export type GoalActionsUnion =
  | Search
  | SearchComplete
  | SearchError
  | SearchFailed
  | Load
  | Select
  | CreateGoalCompleted
  | CreateGoalTriggered
  | CreateGoalFailed
  | GoalExceptionHandled
  | ArchiveGoalTriggered
  | ArchiveGoalCompleted
  | ArchiveUnArchiveGoalCompleted
  | ArchiveGoalFailed
  | ParkGoalTriggered
  | ParkGoalCompleted
  | ParkGoalFailed
  | GetGoalByIdTriggered
  | GetGoalByIdCompleted
  | GetGoalByIdFailed
  | UpdateGoalList
  | RefreshGoalsList
  | SearchAllGoals
  | ApproveGoalCompleted
  | ReplanGoalCompleted
  | GetGoalDetailsByMultipleGoalIdsTriggered
  | GetGoalDetailsByMultipleGoalIdsCompleted
  | GetGoalDetailsByMultipleGoalIdsForBugsTriggered
  | GetGoalDetailsByMultipleGoalIdsForBugsCompleted
  | GetGoalDetailsByMultipleGoalIdsFailed
  | GetUniqueGoalByIdTriggered
  | GetUniqueGoalByIdCompleted
  | GetUniqueGoalByIdFailed
  | GetUniqueGoalByUniqueIdTriggered
  | CreateUniqueGoalTriggered
  | CreateUniqueGoalCompleted
  | CreateUniqueGoalFailed
  | UpsertGoalTagsTriggered
  | UpsertGoalTagsCompleted
  | UpsertGoalTagsFailed
  | SearchTagsTriggered
  | SearchTagsCompleted
  | SearchTagsFailed;
