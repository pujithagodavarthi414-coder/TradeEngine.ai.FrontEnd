import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "./../../store/reducers/index";
import * as sharedModuleReducers from "./../../store/reducers/index";

import { Observable } from "rxjs";
import { MenuItemActionTypes, GetAllMenuItemsTriggered } from "../../store/actions/menuitems.actions";
import { tap } from "rxjs/operators";
import { IMenuItem } from '../../models/IMenuItem';
import { MenuCategories } from '../../constants/menu-categories';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.template.html"
})

export class SidenavComponent {
  @Input("hasIconMenu") public hasIconTypeMenuItem: boolean;
  @Input("iconMenuTitle") public iconTypeMenuTitle: string;

  public menuItems$: Observable<IMenuItem[]>;

  showTooltip: any;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.menuItems$ = this.store.pipe(
      select(sharedModuleReducers.getCurrentActiveMenuCategoryMenuItems),
      tap(menuList => console.log(menuList))
    );

    this.store.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
  }
}
