import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { LeaveManagementModule, MyLeavesListComponent } from "@thetradeengineorg1/snova-leave-management";

export class LeaveManagementService {

    static components = [
        {
            name: "My leaves list",
            componentTypeObject: MyLeavesListComponent
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        LeaveManagementModule
    ]
})

export class LeavesManagementPackageModule {
    static componentService = LeaveManagementService;
}
