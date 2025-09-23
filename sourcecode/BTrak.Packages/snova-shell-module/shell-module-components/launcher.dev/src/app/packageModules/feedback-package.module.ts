import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FeedbackModule, FeedBackComponent } from '"@thetradeengineorg1/snova-feedback-module';

export class FeedbackComponentSupplierService {

    static components = [
        {
            name: "Feedback comp",
            componentTypeObject: FeedBackComponent
        }
    ]
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
