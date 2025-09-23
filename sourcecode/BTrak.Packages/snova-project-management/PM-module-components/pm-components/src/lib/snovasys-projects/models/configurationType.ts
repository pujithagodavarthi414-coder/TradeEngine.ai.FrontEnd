export class ConfigurationType {
  ConfigurationTypeName: string;
  ConfigurationTypeId: string;
}
export class AllConfigurationType {
  ConfigurationTypeName: string;
  ConfigurationTypeId: string;
}
export class ConfigurationSearchCriteriaInputModel {
  ConfigurationTypeName: string;
  ConfigurationTypeId: string;
  IsArchived: boolean;
  OperationsPerformedBy: string;
}

export class ConfigurationSettingModel {
  configurationTypeId: string;
  fieldId: string;
  fieldName: string;
  crudOperationId: string;
  operationName: string;
  fieldPermissionId: string;
  goalStatuses: string;
  userStoryStatuses: string;
  goalTypes: string;
  roles: string;
  goalStatusIds: string;
  userStoryStatusIds: string;
  goalTypeIds: string;
  roleIds: string;
  goalStatusNames: string;
  userStoryStatusNames: string;
  goalTypeNames: string;
  roleNames: string;
  isMandatory: string;
  configurationSettingXml: string;
  projectId: string;
  timeStamp:any;
}
