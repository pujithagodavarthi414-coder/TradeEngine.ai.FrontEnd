import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";
import * as _ from 'underscore';
import { DashboardFilterModel } from "../../../models/dashboard-filter.model";
import { Router } from '@angular/router';


@Component({
  selector: "app-createforms", 
  templateUrl: "./createforms.component.html",
})
export class CreateformsComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
      if (data && data !== undefined) {
          this.dashboardFilters = data;
      }
  }
  dashboardFilters: DashboardFilterModel;

  constructor(public router : Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  viewReports = function () {
    this.router.navigate(["/applications/view-forms"]);
  };

}