import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { moduleLoader } from "app/common/constants/module-loader";
import { SnovaAuditsModule, AuditDetailsComponent, AuditNonComplainceComponent, AuditComplainceComponent, AuditConductTimelineView, QuestionTypeComponent, MasterQuestionTypeComponent, auditModulesInfo, AuditModulesService, AuditsViewComponent, AuditConductsViewComponent, AuditReportsViewComponent, AddAuditActivityViewComponent, AddAuditActionsViewComponent, AuditUniqueDetailComponent, ConductUniqueDetailComponent, ConductQuestionActionComponent, AuditPriorityViewComponent, AuditImpactViewComponent, ActionCategoryComponent, AuditRiskComponent, AuditRatingComponent } from "@thetradeengineorg1/snova-audits-module";

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
        },
        {
            name: "Audit Priority",
            componentTypeObject: AuditPriorityViewComponent
        },
        {
            name: "Audit Impact",
            componentTypeObject: AuditImpactViewComponent
        },
        {
            name: "Audit unique details",
            componentTypeObject: AuditUniqueDetailComponent
        },
        {
            name: "Conduct unique details",
            componentTypeObject: ConductUniqueDetailComponent
        },
        {
            name: "Action category",
            componentTypeObject: ActionCategoryComponent
        },
        {
            name: "Audit risk",
            componentTypeObject: AuditRiskComponent
        },
        {
            name: "Audit rating",
            componentTypeObject: AuditRatingComponent
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        SnovaAuditsModule.forChild(moduleLoader as any)
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: AuditModulesService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class AuditsPackageModule {
    static componentService = AuditsComponentSupplierService;
}