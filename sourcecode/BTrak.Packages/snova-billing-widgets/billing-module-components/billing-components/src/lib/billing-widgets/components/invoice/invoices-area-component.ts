import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import "../../../globaldependencies/helpers/fontawesome-icons"

import { MatTabGroup } from '@angular/material/tabs';
import { AppBaseComponent } from '../componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { WidgetService } from '../../services/widget.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { DashboardList } from '../../Models/dashboardList';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HrDashboardService } from '../../services/hr-dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoices-area-component',
  templateUrl: 'invoices-area-component.html'
})

export class InvoicesAreaComponent extends AppBaseComponent implements AfterViewInit, OnInit {
  @ViewChildren("openMessagePopUp") openMessagePopUp;

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  selectedTabLable: string;
  selectedTab: number = 0;
  selectedUserId: string;
  dashboardFilter: DashboardFilterModel;
  selectedWorkspaceIdForInvoiceSettings: string;
  selectedWorkspaceIdForAdvancedInvoiceSettings: string;
  messageForm: FormGroup;
  isAnyOperationIsInprogress: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.clearForm();
    //  this.GetCustomizedDashboardIdForInvoiceSettings();
  }

  constructor(
    private widgetService: WidgetService,private cdRef: ChangeDetectorRef,private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,private hrDashboardService: HrDashboardService,
    private route: Router, private cookieService: CookieService) {
    super();
    this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
  }
  ngAfterViewInit(): void {
    super.ngOnInit()
    this.subscribeToRouteChangeAndInitializeTheEntirePage();
  }
  subscribeToRouteChangeAndInitializeTheEntirePage() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedTabLable = params["tab"];
    });
    if (this.selectedTabLable) {
      this.selectedTab = this.getTabIndex(this.selectedTabLable);

    } else {
      this.selectedTabLable = "invoices";
      this.route.navigate(['invoices/invoices-area/' + this.selectedTabLable]);
    }
    
  }

  getTabIndex(tabName: string) {
    if (this.matTabGroup != null && this.matTabGroup != undefined) {
      const matTabs = this.matTabGroup._tabs.toArray();
      let index = 0;
      for (const matTab of matTabs) {
        if (matTab.textLabel === "invoices" && tabName === "invoices") {
          return index;
        }
        if (matTab.textLabel === "invoice-settings" && tabName === "invoice-settings") {
          return index;
        }
        if (matTab.textLabel === "advanced-invoices" && tabName === "advanced-invoices") {
          return index;
        }
        // if (matTab.textLabel === "reports" && tabName === "reports") {
        //     // if (!this.selectedWorkspaceId) {
        //     //     this.GetCustomizedDashboardId();
        //     // }
        //     return index;
        // }
        index++;
      }
      return index;
    }
  }

  selectedMatTab(event) {
    if (event.tab.textLabel === "invoice-settings") {
      if (!this.selectedWorkspaceIdForInvoiceSettings) {
        this.GetCustomizedDashboardIdForInvoiceSettings();
      }
    } else if(event.tab.textLabel === "advanced-invoices") {
      this.GetCustomizedDashboardIdForAdvancedInvoices();
    }
    this.route.navigate(['invoices/invoices-area/' + event.tab.textLabel]);
  }


  GetCustomizedDashboardIdForInvoiceSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "invoicesettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForInvoiceSettings = result.data;
      }
    });
  }

  GetCustomizedDashboardIdForAdvancedInvoices() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "advancedinvoices";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForAdvancedInvoiceSettings = result.data;
      }
    });
  }

  openMessage(openMessage) {
    openMessage.openPopover();
  }

  closeMessagePopUp() {
    this.openMessagePopUp.forEach((p) => p.closePopover());
  }

  clearForm() {
    this.messageForm = new FormGroup({
        mobileNo: new FormControl(null,
            Validators.compose([
                Validators.required,
            ])
        )
    })
  }

  sendMessage() {
    let sendMsg = {
      mobileNo: null
    }
    this.isAnyOperationIsInprogress = true;
    sendMsg = this.messageForm.value;
    this.hrDashboardService.sendMessage(sendMsg.mobileNo).subscribe((result: any) => {
      if (result == 'true' || result == true) {
        this.toastr.success("Message sent successfully");
      }
      else {
        this.toastr.error("Message sent failed");
      }
      this.isAnyOperationIsInprogress = false;
      this.cdRef.detectChanges();
    });
  }
}