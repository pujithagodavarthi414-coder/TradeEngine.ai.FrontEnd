import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { FeedbackListComponent, FeedbackModule } from "@thetradeengineorg1/snova-feedback-module";

export class FeedbackComponentSupplierService {

  static components =  [
    { name: "Feedback", componentTypeObject: FeedbackListComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    FeedbackModule
  ]
})
export class FeedbackPackageModule {
  static componentService = FeedbackComponentSupplierService;
}
