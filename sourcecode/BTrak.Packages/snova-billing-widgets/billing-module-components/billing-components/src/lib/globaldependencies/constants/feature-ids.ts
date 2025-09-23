import { Guid } from "guid-typescript";

export class FeatureIds {
  public static Feature_ArchiveOrUnarchiveInvoice: Guid = Guid.parse('C1DB6780-AC21-4BB4-A945-017F7DFAA904');
  public static Feature_DownloadOrShareInvoice: Guid = Guid.parse('9CE82415-885E-483B-80B8-235911073681');
  public static Feature_AddOrUpdateInvoice: Guid = Guid.parse('38234110-8A67-46CC-AB82-370A8F6F0CE6');
  public static Feature_ArchiveOrUnarchiveEstimate: Guid = Guid.parse('3470BB01-6130-4152-A9C1-47F9AB4F3B1C');
  public static Feature_ViewEstimate: Guid = Guid.parse('97478AD6-E466-4A8E-9BF5-BCEC1930AFA8');
  public static Feature_ViewInvoice: Guid = Guid.parse('694E21F0-BC3C-41A9-AADB-BEEA256029C6');
  public static Feature_ViewOrManageInvoiceStatus: Guid = Guid.parse('1DA2769E-2A76-4A39-A1FD-DCAB9983647C');
  public static Feature_AddOrUpdateEstimate: Guid = Guid.parse('634D217D-9A66-4107-9539-E82FEE70AF78');
  public static Feature_ManageInvoiceSettings: Guid = Guid.parse('F65E7934-FABD-FC07-6452-C76EA98A93C0');
  public static Feature_DeleteCustomFieldsForHrManagement: Guid = Guid.parse('74FBAFBC-FD1F-4DC7-9FA0-3C459412F31D');
  public static Feature_AddOrEditCustomFieldsForInvoices: Guid = Guid.parse('8B154265-6F3D-4222-BF8F-89A6BBB3AD29');
  public static Feature_CanSubmitCustomFieldsForInvoices: Guid = Guid.parse('6098A309-B0CB-4A22-A586-7B1D743DFCB1');
  public static Feature_ManageAdvancedInvoices: Guid = Guid.parse('9C3D67F3-3F8F-4EFC-AA8E-50C9EADB36CA');
  public static Feature_ManageEntryComponents: Guid = Guid.parse('C8ECFF90-A5FC-424C-89EC-28B2EAB9E0FF');
  public static Feature_ManageBankAccountComponents: Guid = Guid.parse('035DFB11-C824-4A77-B912-06904FFD1261');
  public static Feature_ManageMessageFieldType: Guid = Guid.parse('193013F3-3EBA-44AD-8790-2D89A735F6B4');
}
