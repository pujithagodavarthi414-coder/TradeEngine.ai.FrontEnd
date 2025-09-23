import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AuditCompliance } from '../../models/audit-compliance.model';

export enum AuditActionTypes {
    LoadAuditTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Load Triggered',
    LoadAuditCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Load Completed',
    LoadAuditCloneTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Clone Load Triggered',
    LoadAuditCloneCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Clone Load Completed',
    LoadAuditTagListTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Tag List Load Triggered',
    LoadAuditTagListCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Tag List Load Completed',
    LoadConductTagListTriggered = '[SnovaAuditsModule Audit Component] Initial Conduct Tag List Load Triggered',
    LoadConductTagListCompleted = '[SnovaAuditsModule Audit Component] Initial Conduct Tag List Load Completed',
    LoadAuditTagTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Tag Load Triggered',
    LoadAuditTagCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Tag Load Completed',
    LoadConductTagTriggered = '[SnovaAuditsModule Audit Component] Initial Conduct Tag Load Triggered',
    LoadConductTagCompleted = '[SnovaAuditsModule Audit Component] Initial Conduct Tag Load Completed',
    LoadAuditDelete = '[SnovaAuditsModule Audit Component] Initial Audit Delete',
    LoadAuditRelatedCountsTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Related Counts Load Triggered',
    LoadAuditRelatedCountsCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Related Counts Load Completed',
    LoadAuditByIdTriggered = '[SnovaAuditsModule Audit Component] Initial Audit By Id Load Triggered',
    LoadAuditByIdCompleted = '[SnovaAuditsModule Audit Component] Initial Audit By Id Load Completed',
    LoadAnotherAuditByIdTriggered = '[SnovaAuditsModule Audit Component] Initial Another Audit By Id Load Triggered',
    LoadAnotherAuditByIdCompleted = '[SnovaAuditsModule Audit Component] Initial Another Audit By Id Load Completed',
    LoadMultipleAuditsByIdTriggered = '[SnovaAuditsModule Audit Component] Initial Multiple Audits By Id Load Triggered',
    LoadMultipleAuditsByIdCompleted = '[SnovaAuditsModule Audit Component] Initial Multiple Audits By Id Load Completed',
    RefreshAuditsList = '[SnovaAuditsModule Audit Component] Initial Audit Refresh List Load Completed',
    AuditEditCompletedWithInPlaceUpdate = '[SnovaAuditsModule Audit Component] Initial Audit Update Load Completed',
    LoadAuditListTriggered = '[SnovaAuditsModule Audit Component] Initial Audit List Load Triggered',
    LoadAuditListCompleted = '[SnovaAuditsModule Audit Component] Initial Audit List Load Completed',
    LoadCopyAuditListTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Copy List Load Triggered',
    LoadCopyAuditListCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Copy List Load Completed',
    LoadAuditVersionListTriggered = '[SnovaAuditsModule Audit Component] Initial Audit Version List Load Triggered',
    LoadAuditVersionListCompleted = '[SnovaAuditsModule Audit Component] Initial Audit Version List Load Completed',
    AuditFailed = '[SnovaAuditsModule Audit Component] Audit Load Failed',
    AuditException = '[SnovaAuditsModule Audit Component] Audit Exception Handled'
}

export class LoadAuditTriggered implements Action {
    type = AuditActionTypes.LoadAuditTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditCompleted implements Action {
    type = AuditActionTypes.LoadAuditCompleted;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}

export class LoadAuditCloneTriggered implements Action {
    type = AuditActionTypes.LoadAuditCloneTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditCloneCompleted implements Action {
    type = AuditActionTypes.LoadAuditCloneCompleted;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}

export class LoadAuditTagTriggered implements Action {
    type = AuditActionTypes.LoadAuditTagTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditTagCompleted implements Action {
    type = AuditActionTypes.LoadAuditTagCompleted;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}

export class LoadConductTagTriggered implements Action {
    type = AuditActionTypes.LoadConductTagTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadConductTagCompleted implements Action {
    type = AuditActionTypes.LoadConductTagCompleted;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}

export class LoadAuditTagListTriggered implements Action {
    type = AuditActionTypes.LoadAuditTagListTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditTagListCompleted implements Action {
    type = AuditActionTypes.LoadAuditTagListCompleted;
    audit: AuditCompliance;
    projectId: string;
    auditId: string;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadConductTagListTriggered implements Action {
    type = AuditActionTypes.LoadConductTagListTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadConductTagListCompleted implements Action {
    type = AuditActionTypes.LoadConductTagListCompleted;
    audit: AuditCompliance;
    projectId: string;
    auditId: string;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadAuditRelatedCountsTriggered implements Action {
    type = AuditActionTypes.LoadAuditRelatedCountsTriggered;
    audit: AuditCompliance;
    auditId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public projectId: string) { }
}

export class LoadAuditRelatedCountsCompleted implements Action {
    type = AuditActionTypes.LoadAuditRelatedCountsCompleted;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditDelete implements Action {
    type = AuditActionTypes.LoadAuditDelete;
    audit: AuditCompliance;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}

export class LoadAuditByIdTriggered implements Action {
    type = AuditActionTypes.LoadAuditByIdTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditByIdCompleted implements Action {
    type = AuditActionTypes.LoadAuditByIdCompleted;
    audit: AuditCompliance;
    auditId: string;
    projectId: string;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadAnotherAuditByIdTriggered implements Action {
    type = AuditActionTypes.LoadAnotherAuditByIdTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAnotherAuditByIdCompleted implements Action {
    type = AuditActionTypes.LoadAnotherAuditByIdCompleted;
    audit: AuditCompliance;
    auditId: string;
    projectId: string;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadMultipleAuditsByIdTriggered implements Action {
    type = AuditActionTypes.LoadMultipleAuditsByIdTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadMultipleAuditsByIdCompleted implements Action {
    type = AuditActionTypes.LoadMultipleAuditsByIdCompleted;
    audit: AuditCompliance;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[]
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public multipleAudit: { multipleAudits: Update<AuditCompliance>[] }) { }
}

export class RefreshAuditsList implements Action {
    type = AuditActionTypes.RefreshAuditsList;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class AuditEditCompletedWithInPlaceUpdate implements Action {
    type = AuditActionTypes.AuditEditCompletedWithInPlaceUpdate;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    searchAudits: AuditCompliance[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditUpdates: { auditUpdate: Update<AuditCompliance> }) { }
}

export class LoadAuditListTriggered implements Action {
    type = AuditActionTypes.LoadAuditListTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditListCompleted implements Action {
    type = AuditActionTypes.LoadAuditListCompleted;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadCopyAuditListTriggered implements Action {
    type = AuditActionTypes.LoadCopyAuditListTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadCopyAuditListCompleted implements Action {
    type = AuditActionTypes.LoadCopyAuditListCompleted;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class LoadAuditVersionListTriggered implements Action {
    type = AuditActionTypes.LoadAuditVersionListTriggered;
    auditId: string;
    projectId: string;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public audit: AuditCompliance) { }
}

export class LoadAuditVersionListCompleted implements Action {
    type = AuditActionTypes.LoadAuditVersionListCompleted;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAudits: AuditCompliance[]) { }
}

export class AuditFailed implements Action {
    type = AuditActionTypes.AuditFailed;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class AuditException implements Action {
    type = AuditActionTypes.AuditException;
    auditId: string;
    projectId: string;
    audit: AuditCompliance;
    searchAudits: AuditCompliance[];
    auditUpdates: { auditUpdate: Update<AuditCompliance> };
    multipleAudit: { multipleAudits: Update<AuditCompliance>[] };
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type AuditActions = LoadAuditTriggered | LoadAuditCompleted | LoadAuditRelatedCountsTriggered | LoadAuditRelatedCountsCompleted | LoadAuditDelete |
    LoadAuditByIdTriggered | LoadAuditByIdCompleted | RefreshAuditsList | AuditEditCompletedWithInPlaceUpdate | LoadAuditListTriggered | LoadAuditListCompleted |
    LoadMultipleAuditsByIdTriggered | LoadMultipleAuditsByIdCompleted | LoadAuditTagTriggered | LoadAuditTagCompleted | LoadAuditTagListTriggered |
    LoadAuditTagListCompleted | LoadAuditCloneTriggered | LoadAuditCloneCompleted | AuditFailed | AuditException | LoadAnotherAuditByIdTriggered | LoadAnotherAuditByIdCompleted |
    LoadAuditVersionListTriggered | LoadAuditVersionListCompleted | LoadCopyAuditListTriggered | LoadCopyAuditListCompleted | LoadConductTagListTriggered | LoadConductTagListCompleted |
    LoadConductTagTriggered | LoadConductTagCompleted