import { Action } from "@ngrx/store";
import { ProjectsViewModel } from "../../models/projects-view-model";
import { MyWorkModel } from "../../models/my-work-model";
import { MyWork } from "../../models/myWork";
import { Update } from "@ngrx/entity";

export enum MyWorkActionTypes {
  LoadMyWorkUserStoriesTriggered = "[SnovaAudisModule MyWork Component] Initial Data Load Triggered",
  LoadMyWorkUserStoriesCompleted = "[SnovaAudisModule MyWork Component] Initial Data Load Completed",
  LoadMyWorkUserStoriesFailed = "[SnovaAudisModule MyWork Component] Initial Data Load Failed",
  LoadMyWorkUserStoriesTriggeredOnPageLoad = "[SnovaAudisModule MyWork Component] Initial Data Load Triggered On Page Load",
  LoadMyWorkOverViewDetailsTriggered = "[SnovaAudisModule MyWork Component] Initial Data Load Project OverView Triggered",
  LoadMyWorkOverViewDetailsCompleted = "[SnovaAudisModule MyWork Component] Initial Data Load Project OverView Completed",
  LoadMyWorkOverViewDetailsFailed = "[SnovaAudisModule MyWork Component] Initial Data Load Project OverView Failed",
  ExceptionHandled = "[SnovaAudisModule MyWork Component] Exception Handled",
  UserStoryCompletedWithInPlaceUpdate = "[SnovaAudisModule MyWork Component] UserStory Update",
  LoadMyWorkUserStoryByIdFailed = "[SnovaAudisModule MyWork Component] Updated UserStoryData Failed",
  LoadMyWorkUserStoryByIdTriggered = "[SnovaAudisModule MyWork Component] Updated UserStoryData Triggered",
  LoadMyWorkUserStoryByIdCompleted = "[SnovaAudisModule MyWork Component] Updated UserStoryData Completed"
}

export class LoadMyWorkUserStoriesTriggered implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoriesTriggered;
  errorMessage: string;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public projectsViewModel: ProjectsViewModel) {}
}

export class LoadMyWorkUserStoriesTriggeredOnPageLoad implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoriesTriggeredOnPageLoad;
  errorMessage: string;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public projectsViewModel: ProjectsViewModel) {}
}

export class LoadMyWorkUserStoriesCompleted implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoriesCompleted;
  validationMessages: any[];
  errorMessage: string;
  projectsViewModel: ProjectsViewModel;
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public userStoryList: MyWorkModel[]) {}
}

export class LoadMyWorkUserStoriesFailed implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoriesFailed;
  errorMessage: string;
  projectsViewModel: ProjectsViewModel;
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public validationMessages: any[]) {}
}

export class LoadMyWorkOverViewDetailsTriggered implements Action {
  type = MyWorkActionTypes.LoadMyWorkOverViewDetailsTriggered;
  errorMessage: string;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public projectsViewModel: ProjectsViewModel) {}
}

export class LoadMyWorkOverViewDetailsCompleted implements Action {
  type = MyWorkActionTypes.LoadMyWorkOverViewDetailsCompleted;
  validationMessages: any[];
  errorMessage: string;
  projectsViewModel: ProjectsViewModel;
  userStoryList: MyWorkModel[];
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public overViewCount: MyWork) {}
}

export class LoadMyWorkOverViewDetailsFailed implements Action {
  type = MyWorkActionTypes.LoadMyWorkOverViewDetailsFailed;
  errorMessage: string;
  projectsViewModel: ProjectsViewModel;
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public validationMessages: any[]) {}
}

export class UserStoryCompletedWithInPlaceUpdate implements Action {
  type = MyWorkActionTypes.UserStoryCompletedWithInPlaceUpdate;
  errorMessage: string;
  projectsViewModel: ProjectsViewModel;
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  validationMessages: any[];
  constructor(
    public userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> }
  ) {}
}

export class ExceptionHandled implements Action {
  type = MyWorkActionTypes.ExceptionHandled;
  projectsViewModel: ProjectsViewModel;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public errorMessage: string) {}
}

export class LoadMyWorkUserStoryByIdTriggered implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoryByIdTriggered;
  errorMessage: string;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  userStory: MyWorkModel;
  projectsViewModel: ProjectsViewModel; 
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public requestId:string,public isFromAdoc:boolean) {}
}

export class LoadMyWorkUserStoryByIdCompleted implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoryByIdCompleted;
  errorMessage: string;
  validationMessages: any[];
  requestId:string;
  isFromAdoc:boolean;
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;  
  userStory: MyWorkModel;
  constructor(
    public userStoryUpdates: { userStoryUpdate: Update<MyWorkModel>}
  ) {}
}

export class LoadMyWorkUserStoryByIdFailed implements Action {
  type = MyWorkActionTypes.LoadMyWorkUserStoryByIdFailed;
  validationMessages: any[];
  userStoryList: MyWorkModel[];
  overViewCount: MyWork;
  requestId:string;
  isFromAdoc:boolean;
  userStory: MyWorkModel;
  userStoryUpdates: { userStoryUpdate: Update<MyWorkModel> };
  constructor(public errorMessage: string) {}
}

export type MyWorkActions =
  | LoadMyWorkUserStoriesTriggered
  | LoadMyWorkUserStoriesCompleted
  | LoadMyWorkUserStoriesFailed
  | LoadMyWorkOverViewDetailsTriggered
  | LoadMyWorkOverViewDetailsCompleted
  | LoadMyWorkOverViewDetailsFailed
  | ExceptionHandled
  | UserStoryCompletedWithInPlaceUpdate
  | LoadMyWorkUserStoriesTriggeredOnPageLoad
  | LoadMyWorkUserStoryByIdTriggered
  | LoadMyWorkUserStoryByIdCompleted
  | LoadMyWorkUserStoryByIdFailed;
