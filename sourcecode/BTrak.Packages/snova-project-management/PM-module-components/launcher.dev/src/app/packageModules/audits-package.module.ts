import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";

import { SnovaAuditsModule, AuditDetailsComponent, AuditNonComplainceComponent, AuditComplainceComponent, AuditConductTimelineView, QuestionTypeComponent, MasterQuestionTypeComponent, auditModulesInfo, AuditModulesService, AuditsViewComponent, AuditConductsViewComponent, AuditReportsViewComponent, AddAuditActivityViewComponent, AddAuditActionsViewComponent, AuditUniqueDetailComponent, ConductUniqueDetailComponent, ConductQuestionActionComponent } from "@snovasys/snova-audits-module";

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
        },
        {
            name: "Audits",
            componentTypeObject: AuditsViewComponent
        },
        {
            name: "Conducts",
            componentTypeObject: AuditConductsViewComponent
        },
        {
            name: "Audit reports",
            componentTypeObject: AuditReportsViewComponent
        },
        {
            name: "Audit activity",
            componentTypeObject: AddAuditActivityViewComponent
        },
        {
            name: "Actions",
            componentTypeObject: AddAuditActionsViewComponent
        },
        {
            name: "Add action",
            componentTypeObject: ConductQuestionActionComponent
        },
        {
            name: "Audit unique page",
            componentTypeObject: AuditUniqueDetailComponent
        },
        {
            name: "Conduct unique page",
            componentTypeObject: ConductUniqueDetailComponent
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        SnovaAuditsModule
    ]
})

export class AuditsPackageModule {
    static componentService = AuditsComponentSupplierService;
}