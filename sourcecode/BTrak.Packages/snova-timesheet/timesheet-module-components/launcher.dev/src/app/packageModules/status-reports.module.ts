import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StatusReportsModule, StatusReportingComponent } from "@snovasys/snova-status-reports-module";

export class StatusReportComponentSupplierService {
    static components =  [
      { name: "Status reporting",
       componentTypeObject: StatusReportingComponent 
      }
    ];
  }

@NgModule({
    imports: [
        CommonModule,
        StatusReportsModule,
    ]
})

export class StatusReportPackageModule {
    static componentService = StatusReportComponentSupplierService;
 }
