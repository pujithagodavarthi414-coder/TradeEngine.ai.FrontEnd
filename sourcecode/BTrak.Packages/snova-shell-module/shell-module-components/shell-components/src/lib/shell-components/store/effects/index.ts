import * as fromAuthentication from "./authentication.effects";
import * as fromMenuItems from "./menuitems.effects";
import * as fromNotifications from "./notifications.effects";
import * as fromNotificationValidator from "./notification-validator.effects";
import * as fromChatEffects from "./chat.effects"

export const allSharedModuleEffects: any = [
  fromAuthentication.AuthenticationEffects,
  fromMenuItems.MenuItemsEffects,
  fromNotifications.NotificationEffect,
  fromNotificationValidator.NotificationValidatorEffects,
  fromChatEffects.MessageEffects
];
