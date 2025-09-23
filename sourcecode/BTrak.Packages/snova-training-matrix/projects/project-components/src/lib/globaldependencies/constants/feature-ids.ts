import { Guid } from "guid-typescript";

export class FeatureIds {
  public static Feature_ViewTrainingCourses: Guid = Guid.parse('7BDFD84F-2416-47B4-BE9E-0E16F2617EA6');
  public static Feature_AssignOrUnassignTrainingCourse: Guid = Guid.parse('F2CB1EF2-D544-4491-9026-148F53FD404B');
  public static Feature_ViewTrainingAssignments: Guid = Guid.parse('F59F9F21-5833-409E-9861-717C7C013806');
  public static Feature_ViewTrainingMatrix: Guid = Guid.parse('CFD444ED-0FB8-46CA-81D0-829A2C51CAC4');
  public static Feature_ArchiveTrainingCourse: Guid = Guid.parse('9A5E3E71-AB44-4145-A6C3-912A0B0F6FCC');
  public static Feature_AddOrUpdateTrainingCourse: Guid = Guid.parse('60D74B68-47D9-4D4E-A624-C59910283289');
  public static Feature_TrainingManagement: Guid = Guid.parse('D6418CAB-48C7-491D-B1DF-F9A30CBEBD46');
  public static Feature_ViewTrainingRecord: Guid = Guid.parse('8E7CAC53-4831-40B7-AB4C-3F4F8F084751');
  public static Feature_AddOrUpdateAssignmentStatus: Guid = Guid.parse('3515DD83-E79D-484D-ACDB-29809881107B');
  public static Feature_DragApps: Guid = Guid.parse('1557DCD6-B1DE-44DB-8E4B-3BA4D2994383');
}
