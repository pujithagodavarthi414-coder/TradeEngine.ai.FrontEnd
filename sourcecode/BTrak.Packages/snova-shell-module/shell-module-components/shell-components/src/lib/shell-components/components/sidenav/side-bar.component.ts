import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { RecentSearchService } from '../../services/recentSearch.service';

@Component({
    selector: "app-sidebar",
    templateUrl: "./side-bar.component.html"
})

export class SideBarComponent {
    menuItem: any[] = [];
    items: any[] = [];
    selectedRowIndex: any;
    showBackGroundColor: number;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private recentSearchService: RecentSearchService, private router: Router) {

    }

    ngOnInit() {
        this.router.events
      .subscribe(
        (event: any) => {
          if (event instanceof NavigationEnd) {
            this.routerActive();
          }
        });
        this.getSoftLabelConfigurations();
        this.getMenuItems();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
      }

    getMenuItems() {
        var retrieveDashboards = false
        this.menuItem = JSON.parse(localStorage.getItem(LocalStorageProperties.SideBarMenuItems));

        if (!this.menuItem) {
            this.recentSearchService.searchMenuData(retrieveDashboards).subscribe((response: any) => {
                if (response.success) {
                    let data = response.data;
                    var menuItems = data ? data.menuItems : null;
                    if (menuItems && menuItems != null) {
                        this.menuItem = menuItems;
                        localStorage.setItem(LocalStorageProperties.SideBarMenuItems, JSON.stringify(this.menuItem));
                        this.items = this.menuItem.filter(item => item.type != "dropDown");
                        this.routerActive();
                    }
                }
            });
        }
        else {
            this.items = this.menuItem.filter(item => item.type != "dropDown");
            this.routerActive();
        }
    }

    routerActive() {
        if (this.items && this.items.length > 0) {
            var index = this.items.findIndex(i => this.router.url == "/" + i.state);
            this.selectedRowIndex = index;
            if (this.router.url.includes('/dashboard-management')) {
                this.selectedRowIndex = 99;
            }
        }
    }

    enter(i) {
        this.showBackGroundColor = i;
    }

    leave(i) {
        this.showBackGroundColor = null;
    }

    openMenu(link){
        this.router.navigate([link]);
    }
    
}
