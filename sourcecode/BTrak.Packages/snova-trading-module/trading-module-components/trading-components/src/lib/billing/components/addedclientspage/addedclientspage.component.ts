import { ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ClientSearchInputModel } from '../../models/client-search-input.model';
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
  selector: 'app-addedclientspage',
  templateUrl: './addedclientspage.component.html'
})
export class AddedclientspageComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  selectedTab: string = "Invoices";

  selectedClientId: any;
  isMenu: boolean;

  selectedValue: any;
  clientSearchResult: ClientSearchInputModel = new ClientSearchInputModel();

  constructor(private BillingDashboardService: BillingDashboardService, private cd: ChangeDetectorRef, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe(routeParams => {
      this.selectedClientId = routeParams.id;
      this.clientSearchResult.clientId = this.selectedClientId;
    })
    this.getClients();
  }

  // archive()
  // {
  //   this.menuText = "Archived successfully";
  //   this.trigger.openMenu();
  //   this.trigger.closeMenu();
  //   this.menuText = "This client has active invoices and projects, please delete them before archiving this client";
  // }
  closeMenu() {
    this.trigger.closeMenu();
    this.selectedValue = '';
  }
  onTabChange(data) {

    this.selectedTab = data.tab.textLabel;

  }

  getClients() {
    this.BillingDashboardService.getClients(this.clientSearchResult)
      .subscribe((responseData: any) => {
        if (responseData.success == false) {
        }
        else if (responseData.success == true) {

        }
      });
  }

}
