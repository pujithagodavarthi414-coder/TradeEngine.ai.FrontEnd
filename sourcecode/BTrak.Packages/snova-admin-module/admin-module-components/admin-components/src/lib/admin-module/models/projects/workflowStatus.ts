export class WorkflowStatus {
  workflowStatusName: string;
  workFlowId: string;
  workFlowStatusId: string;
  statusId: any[];
  orderId: number;
  maxOrder: number;
  isComplete: boolean;
  isArchived: boolean;
  existingUserStoryStatusId: string;
  currentUserStoryStatusId: string;
  userStoryStatusId: string;
  taskStatusId: string;
  userStoryStatusName: string;
  timeStamp: any;
  userStoryStatusIds: any[];
  workflowId: string;
  canAdd: any;
  canDelete: any;
  addStatusId: string;
  archiveStatusId: string;
}

export class WorkFlowStatuses {
  userStoryStatuses: string;
  isCompleted: string;
  edit: string;
  delete: string;
}

export class WorkFlowStatusTransitionTableData {
  fromTransition: string;
  toTransition: string;
  deadline: string;
  roles: any[];
  workflowEligibleStatusTransitionId: string;
  workFlowId: string;
  currentTransition: string;
  isArchived: boolean;
  fromWorkflowUserStoryStatusId: string;
  toWorkflowUserStoryStatusId: string;
  fromWorkflowUserStoryStatus: string;
  toWorkflowUserStoryStatus: string;
  roleIds: string;
  transitionDeadlineId: string;
  projectId: string;
  roleGuids: any[];
  goalId: string;
  timeStamp:any;
  sprintId: string;
}

export class WorkFlowStatusesTableData {
  userStoryStatus: string;
  isCompleted: string;
}

