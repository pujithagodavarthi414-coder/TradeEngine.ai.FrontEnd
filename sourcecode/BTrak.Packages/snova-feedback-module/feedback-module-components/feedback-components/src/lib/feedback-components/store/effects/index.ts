import * as fromFeedBacks from "./feedback.effects";
import * as  fromNotificationEffects from "./notification-validator.effects";

export const allSharedModuleEffects: any = [
  fromFeedBacks.FeedBackEffects,
  fromNotificationEffects.NotificationValidatorEffects
];
