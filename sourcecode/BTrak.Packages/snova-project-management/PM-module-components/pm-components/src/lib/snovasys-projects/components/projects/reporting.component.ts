import { Component } from "@angular/core";

@Component({
  selector: "app-pm-reporting",
  template: ``
})
export class ReportingComponent {
  public chartcategories: any = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Feb",
    "Mar",
    "Apr",
    "Feb",
    "Dec"
  ];

  public series: any[] = [
    {
      type: "column",
      data: [14, 8, 7, 5, 6, 12, 11, 3, 7, 4, 8, 14],
      stack: true,

      color: "#ff7f0e"
    }
  ];
}
