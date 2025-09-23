import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import {
  // ApproverTimeSheetSubmissionComponent,
  // EmployeeTimeSheetSubmissionComponent,
  RosterModule
} from "@thetradeengineorg1/snova-rostering";


export class  RosterComponentSupplierService {

  static components =  [
    // { name: "Timesheets waiting for approval", componentTypeObject: ApproverTimeSheetSubmissionComponent },
    // { name: "Timesheet submission", componentTypeObject: EmployeeTimeSheetSubmissionComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    RosterModule
  ],
  entryComponents:[
    // ApproverTimeSheetSubmissionComponent
  ]
})
export class RosterPackageModule {
  static componentService = RosterComponentSupplierService;
}
