import { Guid } from "guid-typescript";

export class NotificationTypeIds {
  public static Notification_WorkItemAssignedToUser: Guid = Guid.parse(
    "32184689-fd1a-4f3b-bff5-57a3febc9481"
  );
  public static Notification_RoleUpdated: Guid = Guid.parse(
    "7662113B-94D9-4665-86A9-935E3FDB2C65"
  );
  public static Status_Report_Sumitted: Guid = Guid.parse(
    "0b67af9d-2c08-481a-99d0-b4ecb334386d"
  );
  public static Status_Report_Config_Created: Guid = Guid.parse(
    "d182d572-d314-43f7-b953-b132dfc048d2"
  );
  public static Multiple_Charts_Scheduling_created: Guid = Guid.parse(
    "935f6891-9029-482d-b6d8-a0a62673e47a"
  );
  public static Assets_Assignment: Guid = Guid.parse(
    "86a845a5-8e52-4ebd-a4fa-90f7d8f5bae5"
  );
  public static Announcement_Received: Guid = Guid.parse(
    "36F28A72-D3B3-42E2-A495-FC49453BAFFB"
  );
  public static Reminder_Notification: Guid = Guid.parse(
    "A2811F64-DCE6-4FE5-BDE3-D5AD6EA4EB61"
  );
  public static Performance_Received: Guid = Guid.parse(
    "622FFD3A-8A2B-4C84-94EE-8E4CBA986650"
  );
  public static NewProjectCreatedNotificationId : Guid = Guid.parse("E9C64357-492E-47D7-A98E-350FBD613F12");
  public static ProjectMemberRoleAddedNotificationId : Guid = Guid.parse("6747F62C-1B90-4805-98B3-93DA6D8F6195");
  public static GoalApprovedFromReplan : Guid = Guid.parse("80513474-1DD1-4A6B-8336-AFE11A7370FE");
  public static USerStoryUpdateNotificationId : Guid = Guid.parse("E004EF10-1787-4AB3-8B31-DC48D58F68D0");
  public static SprintStarted : Guid = Guid.parse("29C2059A-B2B6-49EC-A61B-C0D9BF4A9898");
  public static PushNotificationForUserStoryComment : Guid = Guid.parse("5AEFF52D-4F36-414C-A3D5-BA7AA4774B18");
  public static GoalRequestdForREplan : Guid = Guid.parse("F8B3FD7D-1A4B-4023-84E8-88CEA28DC16D");
  public static SprintRequestdForREplan : Guid = Guid.parse("2B1D4317-EAA9-4CB2-A5A8-8F187BE6ADBC");
  public static AdhocUSerStoryUpdateNotificationId : Guid = Guid.parse("BB04BB53-E26A-4588-B694-FB893098C61B");
  public static Notification_AdhocWorkItemAssignedToUser : Guid = Guid.parse("D436963A-4063-421E-8C90-1ECE778E3DFF");
  public static UserStoryArchive : Guid = Guid.parse("F6586541-471C-4657-B929-832B88E56B76");
  public static UserStoryPark : Guid = Guid.parse("8A61EF7D-A738-46BE-BA74-71CFD6D03223");
  public static ProjectFeature: Guid = Guid.parse("0C85E7B0-CCC1-4C4F-AF39-1942A40B4C7D");
  public static GenericNotificationActivity: Guid = Guid.parse("750B94A6-1D1F-43F5-9843-1BB1A7ADD8AB");
  public static LeaveApplication: Guid = Guid.parse("2ABD0FD7-5A6E-BEB5-B02A-B9D4E69DC493");
  public static ApproveLeaveApplication: Guid = Guid.parse("A4E3ABFC-F234-474E-A3F0-4D4F692A6DC3");
  public static RejectLeaveApplication: Guid = Guid.parse("5E9AD394-D415-40F5-8E5B-D79F3E033FB8");
  public static ResignationNotification: Guid = Guid.parse("987A697A-6161-4BC9-8D21-14BE1189E594");
  public static ResignationApprovalNotification: Guid = Guid.parse("8A3CAFF7-651C-45D3-BD3B-E682A5081A52");
  public static ResignationRejectionNotification: Guid = Guid.parse("6651A770-42B0-4015-AE8B-74D162F6A7B2");
  public static AutoTimeSheetSubmissionNotification: Guid = Guid.parse("FE3C8D88-304D-4B1D-B6A6-370E2CD25913");
  public static ProbationAssignNotification: Guid = Guid.parse("F75527DB-AF69-4905-89B5-388789989FBE");
  public static ReviewAssignToEmployeeNotification: Guid = Guid.parse("A1256DB2-B40A-4189-A9A4-63B5D153B0B9");
  public static ReviewSubmittedByEmployeeNotification: Guid = Guid.parse("5E0F808D-9908-4EC2-B805-456D94419631");
  public static ReviewInvitationNotification: Guid = Guid.parse("733DE5A1-4E8D-44D8-9F49-5079B8DF37AA");
  public static PerformanceReviewSubmittedByEmployeeNotification: Guid = Guid.parse("A75D64FC-83BE-4BE1-9B24-BF4850F6C3AE");
  public static PerformanceReviewInvitationNotificationModel: Guid = Guid.parse("56487941-867E-456B-9090-D076742150D6");
  public static PerformanceReviewAssignToEmployeeNotification: Guid = Guid.parse("47DC740D-3AF7-4219-A0B1-805876CC13FC");
  public static PurchaseShipmentNotificationId : Guid = Guid.parse("67100C98-7133-4213-AD98-30F6BEEC983C");
}
