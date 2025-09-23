export class ProjectList {
  projectId: string;
  projectName: string;
  id: string;
  responsiblePerson: string;
  projectResponsiblePersonName: string;
  testSuiteCount: number;
  testRunCount: number;
  openTestRunCount: number;
  milestoneCount: number;
  openMilestoneCount: number;
  totalCount: number;
  reportCount: number;
  isArchived: boolean;
  reportsCount: number;
  casesCount: number;
}

export function createStubProjectList() {
  const projectsList = new ProjectList();
  projectsList.projectId = '4003';
  projectsList.projectName = 'Sample Project';
  return projectsList;
}
