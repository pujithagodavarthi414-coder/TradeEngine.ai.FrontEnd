import { Action } from "@ngrx/store";
import { AppMenuItemModel } from '../../models/AppMenuItemModel';
import { ValidationModel } from '../../models/validation.model';

export enum MenuItemActionTypes {
  GetAllMenuItemsTriggered = "[Snovasys-Shell] [MenuItems] Get All Menu Items Triggered",
  GetAllMenuItemsCompleted = "[Snovasys-Shell] [MenuItems] Get All Menu Items Completed",
  GetAllMenuItemsFailed = "[Snovasys-Shell] [MenuItems] Get All Menu Items Failed",
  ExceptionHandled = "[Snovasys-Shell] [MenuItems] Exception Handled",
  CategoryChangeRequested = "[Snovasys-Shell] [MenuItems] Category Change Requested"
}

export class GetAllMenuItemsTriggered implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsTriggered;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  errorMessage: string;
  constructor(public menuCategory: string) { }
}

export class GetAllMenuItemsCompleted implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsCompleted;
  validationMessages: ValidationModel[];
  menuCategory: string;
  errorMessage: string;
  constructor(public menuItems: AppMenuItemModel[]) { }
}

export class GetAllMenuItemsFailed implements Action {
  type = MenuItemActionTypes.GetAllMenuItemsFailed;
  menuItems: AppMenuItemModel[];
  menuCategory: string;
  errorMessage: string;
  constructor(public validationMessages: ValidationModel[]) { }
}

export class CategoryChangeRequested implements Action {
  type = MenuItemActionTypes.CategoryChangeRequested;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  errorMessage: string;
  constructor(public menuCategory: string) { }
}


export class ExceptionHandled implements Action {
  type = MenuItemActionTypes.ExceptionHandled;
  menuItems: AppMenuItemModel[];
  validationMessages: ValidationModel[];
  menuCategory: string;
  constructor(public errorMessage: string) { }
}

export type MenuItemsActions =
  | GetAllMenuItemsTriggered
  | GetAllMenuItemsCompleted
  | GetAllMenuItemsFailed
  | CategoryChangeRequested
  | ExceptionHandled;
