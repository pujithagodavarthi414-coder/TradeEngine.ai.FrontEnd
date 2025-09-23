import { IBadge } from "./IBadge";
import { IChildItem } from "./IChildItem";

export interface IMenuItem {
  id: string;
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  menu?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  menuCategory: string;
}


