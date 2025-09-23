import * as fromAudits from './audits.effects';
import * as fromAuditCategories from './audit-categories.effects';
import * as fromAuditConducts from './conducts.effects';
import * as fromQuestions from './questions.effects';
import * as fromAuditReports from './audit-report.effects';
import * as fromSoftLabelEffects from "../../dependencies/common-store/effects/soft-labels.effects";
import * as fromBugPriorities from "../../dependencies/project-store/effects/bug-priority.effects";
import * as fromNotificationValidators from './notification-validator.effects';

export const allAuditModuleEffects: any = [
    fromAudits.AuditEffects,
    fromAuditCategories.AuditCategoryEffects,
    fromAuditConducts.AuditConductEffects,
    fromQuestions.QuestionEffects,
    fromAuditReports.AuditReportEffects,
    fromSoftLabelEffects.SoftLabelConfigurationEffects,
    fromBugPriorities.BugPriorityTypesEffects,
    fromNotificationValidators.NotificationValidatorEffects
];