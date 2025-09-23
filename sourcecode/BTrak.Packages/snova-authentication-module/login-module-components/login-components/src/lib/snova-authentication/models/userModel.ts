import { UserMiniModel } from "./userMiniModel";
import { Guid } from "guid-typescript";
export class UserModel extends UserMiniModel {
  firstName: string;
  lastName: string;
  profileImage: string;
  roleId: Guid;
}
