import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { RecruitmentmanagementAppModule,DocumentTypeComponent,HiringStatusComponent,InterviewTypeComponent,JobOpeningStatusComponent,StatusComponent,RatingTypeComponent,InterviewProcessAppComponent} from "@thetradeengineorg1/snova-recruitment-module";

export class RecruitmentComponentSupplierService {

  static components =  [
    {
        name: "Document type",
        componentTypeObject: DocumentTypeComponent
    },
    {
        name: "Hiring status",
        componentTypeObject: HiringStatusComponent
    },
    {
        name: "Interview types",
        componentTypeObject: InterviewTypeComponent
    },
    {
        name: "Job opening status",
        componentTypeObject: JobOpeningStatusComponent
    },
    {
        name: "Interview ratings",
        componentTypeObject: RatingTypeComponent
    },
    {
        name: "Sources",
        componentTypeObject: StatusComponent
    },
    {
        name: "Interview process",
        componentTypeObject: InterviewProcessAppComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    RecruitmentmanagementAppModule
  ]
})
export class RecruitmentPackageModule {
  static componentService = RecruitmentComponentSupplierService;
}
