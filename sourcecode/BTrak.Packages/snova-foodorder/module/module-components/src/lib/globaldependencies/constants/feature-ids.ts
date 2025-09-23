import { Guid } from "guid-typescript";

export class FeatureIds {
  public static Feature_AllFoodOrders: Guid = Guid.parse('8D4F4DD9-5911-4BA9-9A9D-A57B8E27F4E7');
  public static Feature_ViewFoodOrders: Guid = Guid.parse('D5694B15-8C1D-4D0C-9543-E7E75E44F05D');
  public static Feature_AddFoodOrder: Guid = Guid.parse('14DE641A-B105-4FA6-A655-E16B265A2BEA');
  public static Feature_BillAmountOnDailyBasis: Guid = Guid.parse('53A073FE-3781-451C-BF0C-ADB4EAC85D10');
  public static Feature_RecentIndividualFoodOrders: Guid = Guid.parse('3CC69BC9-B410-459E-BF0E-B5172A522FF6');
  public static Feature_UpdateFoodOrder: Guid = Guid.parse('9C6EE407-2DE4-4398-8CDA-463724D2C376');
}
