import { Guid } from "guid-typescript";

export class FeatureIds {
  public static Feature_CreateRoster: Guid = Guid.parse('EACD1105-3B6F-48B9-A8CA-140592482A8F');
  public static Feature_ApproveOrRejectTimesheet: Guid = Guid.parse('3845D5C9-E786-49E2-8262-5C2E251257EF');
  public static Feature_ManageRoster: Guid = Guid.parse('1F913475-F189-4329-9ABB-61D1801F257D');
  public static Feature_TimeSheetManagement: Guid = Guid.parse('6B49DFE1-E79C-4845-A2F3-7518D72CCFEB');
  public static Feature_EditRoster: Guid = Guid.parse('5A221595-8A31-47EA-A830-84267C3A5E7E');
  public static Feature_SubmitTimesheet: Guid = Guid.parse('F633A5A4-C36B-4947-AD31-BB4A4BA46F93');
  public static Feature_ViewRoster: Guid = Guid.parse('F0D5BA0D-464F-4019-849C-C27E4681BD78');
  public static Feature_ApproveRoster: Guid = Guid.parse('FEBDDCA7-8581-4701-B80D-D77CB603F30F');
}
