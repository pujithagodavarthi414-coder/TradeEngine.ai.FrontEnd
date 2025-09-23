import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BillingDashboardService } from "../../services/billing-dashboard.service";
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
})

export class EstimatesComponent implements OnInit {

  statusList = [{ "name": "status1" }, { "name": "status2" }]
  estimatesList: any;
  anyOperationProgress: boolean;
  scrollbarH: boolean;
  searchText:string;
  isOpen:boolean;
  searchIsActive:boolean;
  selectedProject:any[];
  AnyOperationProgress:boolean;
  constructor(private BillingDashboardService: BillingDashboardService, private router: Router) { }

  ngOnInit() {
    this.getEstimates();
  }

  getEstimates() {
    
  }
  searchRecords()
  {

  }
  changeFilterType()
  {

  }

  addEstimate() {
    this.router.navigate(['billing/estimate/new']);
  }

  editEstimate()
  {
    this.router.navigate(['billing/estimate/edit']);
  }
  
  resetAllFilters()
  {

  }
  closeSearch(){}
}
