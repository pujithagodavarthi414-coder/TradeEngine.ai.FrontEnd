import { Guid } from "guid-typescript";


export class FeatureIds {
  public static Feature_AddOrUpdateTimesheetentry: Guid = Guid.parse('AB1218DB-D348-45DB-BF5A-9808DC00651E');
  public static Feature_ViewPermissions: Guid = Guid.parse('177D8CD2-AE16-4289-8453-DD4431FD20BE');
  public static Feature_ViewTodaysTimesheet: Guid = Guid.parse('C4269551-FC5D-4850-BA65-66B91D390833');
  public static Feature_PunchCard: Guid = Guid.parse('F369FF94-F64C-4028-94E5-91D6CFF2C74A');
  public static Feature_ViewTimesheetFeed: Guid = Guid.parse('7774A180-FB01-4996-9EF3-7186B2F47556');
  public static Feature_ManageRegion: Guid = Guid.parse('BFC75CE3-5D68-4925-81EA-00976C6F662F');
  public static Feature_AddPermission: Guid = Guid.parse('BC3F0AD1-D9C5-400A-BA4D-65F57A35C45B');
  public static Feature_UpdatePermission: Guid = Guid.parse('3B7CAE23-30A6-4BB6-80D4-6BA115607EEB');
  public static Feature_DeletePermissions: Guid = Guid.parse('371FE420-4525-4D53-B977-FF5B6A6CDD90');
  public static Feature_ViewActivityScreenshots: Guid = Guid.parse('E3E6E572-2CDD-4077-9164-CFF274BAB507');
  public static Feature_CanViewLiveScreen: Guid = Guid.parse('4ACAA8AC-DE32-4D33-9F96-9DF5E1ABDEA9');
}