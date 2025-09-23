import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { DashboardModule, EmployeeHistoricalWorkReportComponent, ImminentDeadlinesComponent, WorkAllocationSummaryChartComponent } from "@thetradeengineorg1/snova-dashboard-module";

export class DashboardComponentSupplierService {

    static components = [
        {
            name: "Historical work report",
            componentTypeObject: EmployeeHistoricalWorkReportComponent
        },
        {
            name: "Work allocation summary",
            componentTypeObject: WorkAllocationSummaryChartComponent
        },
        {
            name: "Imminent deadlines",
            componentTypeObject: ImminentDeadlinesComponent
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        DashboardModule
    ]
})
export class DashboardPackageModule {
    static componentService = DashboardComponentSupplierService;
}
