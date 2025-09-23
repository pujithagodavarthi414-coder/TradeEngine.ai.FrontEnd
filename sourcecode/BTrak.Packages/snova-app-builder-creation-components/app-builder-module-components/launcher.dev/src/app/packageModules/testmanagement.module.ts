import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { TestSuitesViewComponent, TestRunsViewComponent, TestrailMileStoneBaseComponent, TestrepoModule } from "@thetradeengineorg1/snova-testrepo";

export class TestManagementModuleService {

  static components = [
    {
      name: "Scenarios", componentTypeObject: TestSuitesViewComponent,
    },
    {
      name: "Runs", componentTypeObject: TestRunsViewComponent,
    }
    , {
      name: "Versions", componentTypeObject: TestrailMileStoneBaseComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    TestrepoModule
  ],
  entryComponents:[TestSuitesViewComponent,TestRunsViewComponent,TestrailMileStoneBaseComponent]
})
export class TestManagementPackageModule {
  static componentService = TestManagementModuleService;
}
