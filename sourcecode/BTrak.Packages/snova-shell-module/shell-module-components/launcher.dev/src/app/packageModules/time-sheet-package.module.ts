import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TimesheetModule, FeedtimesheetComponentProfile } from "@thetradeengineorg1/snova-timesheet";

export class TimesheetComponentSupplierService {

    static components = [
        {
            name: "Time punch card",
            componentTypeObject: FeedtimesheetComponentProfile
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        TimesheetModule
    ]
})
export class TimesheetPackageModule {
    static componentService = TimesheetComponentSupplierService;
}
