export class WorkFlow {
  WorkFlowName: string;
  workFlowId: string;
  IsArchived: boolean;
}

export class AllWorkFlow {
  WorkFlowName: string;
  WorkFlowId: string;
}
export class WorkFlowSearchCriteriaInputModel {
  WorkFlowName: string;
  WorkFlowId: string;
  IsArchived: boolean;
  OperationsPerformedBy: string;
}

export class DeadlineDropDown {
  deadline: string;
  id: string;
}

export class PermissionsManagementTableData {
  field: string;
  permission: string;
  isMandatory: string;
  goalStatus: string;
  userStoryStatus: string;
  goalType: string;
  role: string;
}

export class StatusesModel {
  userStoryStatusId: string;
  userStoryStatusName: string;
  IsArchived: boolean;
  lookUpKey: number;
}
