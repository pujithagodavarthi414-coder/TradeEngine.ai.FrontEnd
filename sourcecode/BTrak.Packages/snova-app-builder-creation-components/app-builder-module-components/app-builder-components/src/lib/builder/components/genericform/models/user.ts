import { SearchCriteriaInputModelBase } from '../../../models/search-criteria-input-base.model';

export class UserModel extends SearchCriteriaInputModelBase{

  userId : string;
  userName:string;
  firstName : string;
  fullName: string;
  surName : string;
  email : string;
  id: string;
  password : string;
  sortDirectionAsc : boolean = true;
  roleId : string;
  isPasswordForceReset :boolean;
  isDemoDataCleared:boolean;
  isActive :boolean;
  timeZoneId : string;
  mobileNo : string;
  isAdmin :boolean;
  isActiveOnMobile :boolean;
  profileImage : string;
  lastConnection : Date;
  isArchived :boolean;
  pageNo: number;
  PageNumber: any;
  pageSize: number;
  skip :number;
  timeStamp:any;
  isUsersPage:boolean;
  employeeId: string;
  registeredDateTime:Date;
  roleName: string;
  totalCount: number;
  productivityIndex: string;
  employeeNameText : string;
  roleIds : string[];
  approvedLeaves : string;
  leavesRemaining : string;
  entityId: string;
  companyId: string;
  branchId: string;
}

