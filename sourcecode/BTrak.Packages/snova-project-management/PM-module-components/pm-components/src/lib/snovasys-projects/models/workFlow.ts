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
