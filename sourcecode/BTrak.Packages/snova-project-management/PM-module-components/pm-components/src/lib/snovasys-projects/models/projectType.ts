export class ProjectType {
  projectTypeId: string;
  projectTypeName: string;
  timeStamp:any;
  isArchived:boolean=false;
}

export function createStubProjectTypeDropDownData() {
  const data = new ProjectType();
  data.projectTypeName = "Web";
  data.projectTypeId = "1";
  return data;
}
