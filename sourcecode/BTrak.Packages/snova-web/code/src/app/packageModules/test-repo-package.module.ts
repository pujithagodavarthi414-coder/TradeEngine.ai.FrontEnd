import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import {
  ChartsViewComponent,
  TestrepoModule,
  TestSuitesViewComponent,
  TestrailMileStoneBaseComponent,
  TestRunsViewComponent,
  ReportsViewComponent,
  TestSuiteEditComponent,
  TestSuiteSectionEditComponent
} from '@thetradeengineorg1/snova-testrepo';
import { TestRailService } from "@thetradeengineorg1/snova-testrepo";
import { moduleLoader } from "app/common/constants/module-loader";

export class TestRepoComponentSupplierService {

  static components = [
    { name: "QA productivity report", componentTypeObject: ChartsViewComponent },
    {
      name: "Scenarios", componentTypeObject: TestSuitesViewComponent,
    },
    {
      name: "Runs", componentTypeObject: TestRunsViewComponent,
    }
    , {
      name: "Versions", componentTypeObject: TestrailMileStoneBaseComponent
    },
    {
      name: "Test Suites View",
      componentTypeObject: TestSuitesViewComponent
    },
    {
      name: "Test Runs View",
      componentTypeObject: TestRunsViewComponent
    },
    {
      name: "Test Milestone",
      componentTypeObject: TestrailMileStoneBaseComponent
    },
    {
      name: "Test Reports View",
      componentTypeObject: ReportsViewComponent
    },
    {
      name: "Test Suite Edit",
      componentTypeObject: TestSuiteEditComponent
    },
    {
      name: "Test Suite Section Edit",
      componentTypeObject: TestSuiteSectionEditComponent
    } 
  ];
}

@NgModule({
  imports: [
    CommonModule,
    TestrepoModule
  ],
  entryComponents: []
  ,
  providers: [
    // {provide: TestRailService, useValue: moduleLoader as any }
]
})
export class TestRepoPackageModule {
  static componentService = TestRepoComponentSupplierService;
}
