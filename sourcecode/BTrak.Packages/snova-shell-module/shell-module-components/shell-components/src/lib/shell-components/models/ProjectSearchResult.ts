import { Project } from "./project";

export class ProjectSearchResult extends Project {
  projectTypeName: string;
  projectStatusColor: string;
  userName: string;
  profileImage: string;
  createdDateTime: Date;
  fullName: string;
  roleName: string;
  projectResponsiblePersonId: string;
  activeGoalCount: number;
  numberOfReds: number;
  testSuiteCount: number;
  testRunCount: number;
  milestoneCount: number;
  totalCount: number;
  reportCount: number;
  casesCount: number;
  viewGoalsPermissionCount: number;
}
