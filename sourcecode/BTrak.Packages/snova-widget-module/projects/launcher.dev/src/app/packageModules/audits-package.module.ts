import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { SnovaAuditsModule, AuditDetailsComponent, AuditNonComplainceComponent, AuditComplainceComponent, AuditConductTimelineView, QuestionTypeComponent, MasterQuestionTypeComponent } from "@thetradeengineorg1/snova-audits-module"


export class AuditsComponentSupplierService {

  static components = [
    {
        name: "Total number of audits submitted",
        componentTypeObject: AuditDetailsComponent
    },
    {
        name: "Non compliant audit responses",
        componentTypeObject: AuditNonComplainceComponent
    },
    {
        name: "Audit compliance",
        componentTypeObject: AuditComplainceComponent
    },
    {
        name: "Audit conduct timeline view",
        componentTypeObject: AuditConductTimelineView
    },
    {
        name: "Question type",
        componentTypeObject: QuestionTypeComponent
    },
    {
        name: "Master question type",
        componentTypeObject: MasterQuestionTypeComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    SnovaAuditsModule
  ],
  entryComponents:[
    QuestionTypeComponent,
    MasterQuestionTypeComponent,
    AuditConductTimelineView
  ]
})
export class AuditsPackageModule {
  static componentService = AuditsComponentSupplierService;
}
