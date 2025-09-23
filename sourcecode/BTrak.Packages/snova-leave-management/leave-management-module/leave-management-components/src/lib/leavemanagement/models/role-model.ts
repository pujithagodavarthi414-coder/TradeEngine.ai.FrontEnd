export class RolesModel {
    roleId: string;
    roleName: string;
    list1:string;
    fullName:string;
  }

  export class RoleModel {
    roleId: string;
    roleName: string;
    features: string[];
    featureIds: string[];
    isArchived: boolean;
    featureIdXml: string;
    data: string;
    timeStamp: any;
    isDeveloper: boolean;
}
