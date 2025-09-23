import { NotificationOutputModel } from "./NotificationsOutPutModel";
import { Guid } from "guid-typescript";

export class AssetAssignedNotification extends NotificationOutputModel {
    notificationAssignedByUserGuid: Guid;
    notificationAssignedToUserGuid: Guid;
    assetId : Guid;
    assetsNames : string;
    assetNumbers : string;
  
    loadFromCaseInsensitiveObject(assetNotification: any) {
      this.notificationAssignedByUserGuid = assetNotification.NotificationAssignedByUserGuid;
      this.notificationAssignedToUserGuid = assetNotification.NotificationAssignedToUserGuid;
      this.assetId = assetNotification.assetId;
      this.assetsNames = assetNotification.assetsNames;
      this.assetNumbers = assetNotification.assetNumbers;
      super.loadFromCaseInsensitiveObject(assetNotification);
    }
  }