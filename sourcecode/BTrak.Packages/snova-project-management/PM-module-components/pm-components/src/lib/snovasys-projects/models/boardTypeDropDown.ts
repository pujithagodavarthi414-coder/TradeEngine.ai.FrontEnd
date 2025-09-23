export class BoardTypeDropDownData {
  BoardTypeUIName: string;
  BoardTypeId: string;
  BoardTypeView: string;
}

export class BoardTypes {
  boardTypeName: string;
  boardTypeId: string;
}

export class BoardTypeModel {
  boardTypeId: string;
  boardTypeName: string;
  boardTypeUiId: string;
  workFlowId: string;
  isArchived: boolean;
  timeStamp:any;
  isKanban:boolean;
  isKanbanBug:boolean;
  isSuperagile:boolean;
  isApi:boolean;
  isBugBoard:boolean;
}
