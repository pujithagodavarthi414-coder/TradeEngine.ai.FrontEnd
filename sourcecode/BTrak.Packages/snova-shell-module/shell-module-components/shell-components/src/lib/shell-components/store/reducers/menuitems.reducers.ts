import { Action } from "@ngrx/store";
import {
  MenuItemActionTypes,
  MenuItemsActions
} from "../actions/menuitems.actions";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { IMenuItem } from '../../models/IMenuItem';

export interface State extends EntityState<IMenuItem> {
  error: string;
  menuItemsLoading: boolean;
  menuCategory: string;
}

export const menuItemsAdapter: EntityAdapter<IMenuItem> = createEntityAdapter<
  IMenuItem
>({
  selectId: (appMenuItemModel: IMenuItem) => appMenuItemModel.id
});

export const initialState: State = menuItemsAdapter.getInitialState({
  error: null,
  menuItemsLoading: false,
  menuCategory: "Main"
});

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case MenuItemActionTypes.GetAllMenuItemsTriggered:
      return {
        ...state,
        menuItemsLoading: true,
        error: null,
        menuCategory: (action as MenuItemsActions).menuCategory
      };

    case MenuItemActionTypes.GetAllMenuItemsCompleted:
      var allFetchedMenuItems = (action as MenuItemsActions).menuItems;
      // var allParentMenuItems: IMenuItem[] = [];

      // for (let menuItemFromServer of allFetchedMenuItems) {
      //   if (menuItemFromServer.parentMenu === null) {
      //     allParentMenuItems.push({
      //       id: menuItemFromServer.id,
      //       type: menuItemFromServer.type,
      //       menu: menuItemFromServer.menu,
      //       state: menuItemFromServer.state,
      //       icon: menuItemFromServer.icon,
      //       tooltip: menuItemFromServer.toolTip,
      //       disabled: false,
      //       sub: [],
      //       badges: [],
      //       menuCategory: menuItemFromServer.menuCategory
      //     });
      //   }
      // }

      // for (let parentMenuItem of allParentMenuItems) {
      //   for (let menuItemFromServer of allFetchedMenuItems) {
      //     if (parentMenuItem.id == menuItemFromServer.parentMenuItemId) {
      //       parentMenuItem.sub.push({
      //         type: menuItemFromServer.type,
      //         name: menuItemFromServer.menu,
      //         state: menuItemFromServer.state,
      //         icon: menuItemFromServer.icon,
      //         sub: []
      //       });
      //     }
      //   }
      // }

      return menuItemsAdapter.addAll(allFetchedMenuItems, {
        ...state,
        menuItemsLoading: false,
        error: null
      });

    case MenuItemActionTypes.GetAllMenuItemsFailed:
      return menuItemsAdapter.removeAll({
        ...state,
        menuItemsLoading: false,
        error: (action as MenuItemsActions).errorMessage
      });

    case MenuItemActionTypes.CategoryChangeRequested:
      return {
        ...state,
        menuCategory: (action as MenuItemsActions).menuCategory
      };

    default:
      return state;
  }
}
