import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ChartsViewComponent, TestrepoModule, TestSuitesViewComponent, TestRunsViewComponent, TestrailMileStoneBaseComponent, ReportsViewComponent, TestSuiteEditComponent, TestSuiteSectionEditComponent } from '@snovasys/snova-testrepo';



export class TestRepoComponentSupplierService {

  static components =  [
    { name: "QA productivity report", componentTypeObject: ChartsViewComponent },
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
  entryComponents:[]
})
export class TestRepoPackageModule {
  static componentService = TestRepoComponentSupplierService;
}
