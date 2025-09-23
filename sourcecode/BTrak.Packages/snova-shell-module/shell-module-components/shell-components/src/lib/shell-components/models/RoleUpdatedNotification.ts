import { Guid } from "guid-typescript";
import { NotificationOutputModel } from "./NotificationsOutPutModel";
export class RoleUpdatedNotification extends NotificationOutputModel {
  roleGuid: Guid;
  roleName: string;

  loadFromCaseInsensitiveObject(appNotification: any) {
    this.roleGuid = appNotification.RoleGuid;
    this.roleName = appNotification.RoleName;
    super.loadFromCaseInsensitiveObject(appNotification);
  }
}
