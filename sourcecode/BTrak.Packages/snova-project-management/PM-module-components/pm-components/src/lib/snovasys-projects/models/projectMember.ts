import { RoleModelBase } from "./RoleModelBase";
import { User } from "./user";

export class ProjectMember {
  id: string;
  userId: string;
  goalId: string;
  projectId: string;
  projectName: string;
  userName: string;
  roles: RoleModelBase[];
  roleNames: string;
  users: string;
  profileImage: string;
  roleIds: any[];
  userIds: any[];
  projectMember: any;
  projectMemberId: string;
  timestamp: any;
  isArchived: boolean;
  roleId: string;
  projectMemberIds: string[];
  createdDateTime: any;
}