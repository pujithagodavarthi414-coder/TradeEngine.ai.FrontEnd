import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ChartsViewComponent, TestrepoModule } from "@thetradeengineorg1/snova-testrepo";



export class TestRepoComponentSupplierService {

  static components =  [
    { name: "QA productivity report", componentTypeObject: ChartsViewComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    TestrepoModule
  ],
  entryComponents:[
    ChartsViewComponent
  ]
})
export class TestRepoPackageModule {
  static componentService = TestRepoComponentSupplierService;
}
