import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ProgramViewComponent implements OnInit {
  selectedIndex: number;
  programId: string;
  tabName: string;
  constructor(private route: ActivatedRoute, private router : Router) {
    this.route.params.subscribe((routeParams => {
      if (routeParams.id) {
        this.programId = routeParams.id;
        this.tabName = routeParams.tab;
        this.selectedTab();
      }
    }))
  }

  ngOnInit() {

  }

  selectedTab() {
    if (this.tabName == 'kpi') {
      this.selectedIndex = 0;
    } else if (this.tabName == 'budget') {
      this.selectedIndex = 1;
    } else if (this.tabName == 'progress') {
      this.selectedIndex = 2;
    } else {
      this.selectedIndex = 0;
    }
  }

  changeRoute(event) {
    if (event.tab.textLabel.includes("KPI")) {
      this.router.navigate([
        "lives/program",
        this.programId,
        'kpi'
      ]);
    } else if(event.tab.textLabel.includes("Budget")) {
      this.router.navigate([
        "lives/program",
        this.programId,
        'budget'
      ]);
    }else if(event.tab.textLabel.includes("Progress")) {
      this.router.navigate([
        "lives/program",
        this.programId,
        'progress'
      ]);
    }
  }
}