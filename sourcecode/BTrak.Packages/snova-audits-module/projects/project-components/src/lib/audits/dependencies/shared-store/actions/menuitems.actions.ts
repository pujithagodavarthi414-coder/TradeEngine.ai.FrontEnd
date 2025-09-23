import { Action } from "@ngrx/store";
import { AppMenuItemModel } from "../../models/AppMenuItemModel";
import { ValidationModel } from "../../models/validation-messages";

export enum MenuItemActionTypes {
  GetAllMenuItemsTriggered = "[SnovaAudisModule MenuItems] Get All Menu Items Triggered",
  GetAllMenuItemsCompleted = "[SnovaAudisModule MenuItems] Get All Menu Items Completed",
  GetAllMenuItemsFailed = "[SnovaAudisModule MenuItems] Get All Menu Items Failed",
  ExceptionHandled = "[SnovaAudisModule MenuItems] Exception Handled",
  CategoryChangeRequested = "[SnovaAudisModule MenuItems] Category Change Requested"
}

export class GetAllMenuItemsTriggered implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsTriggered;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  errorMessage: string;
  constructor(public menuCategory: string) {}
}

export class GetAllMenuItemsCompleted implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsCompleted;
  validationMessages: ValidationModel[];
  menuCategory: string;
  errorMessage: string;
  constructor(public menuItems: AppMenuItemModel[]) {}
}

export class GetAllMenuItemsFailed implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsFailed;
  menuItems: AppMenuItemModel[];
  menuCategory: string;
  errorMessage: string;
  constructor(public validationMessages: ValidationModel[]) {}
}

export class CategoryChangeRequested implements Action {
  type = MenuItemActionTypes.CategoryChangeRequested;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  errorMessage: string;
  constructor(public menuCategory: string) {}
}


export class ExceptionHandled implements Action {
  type = MenuItemActionTypes.ExceptionHandled;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  menuCategory: string;
  constructor(public errorMessage: string) {}
}

export type MenuItemsActions =
  | GetAllMenuItemsTriggered
  | GetAllMenuItemsCompleted
  | GetAllMenuItemsFailed
  | CategoryChangeRequested
  | ExceptionHandled;
