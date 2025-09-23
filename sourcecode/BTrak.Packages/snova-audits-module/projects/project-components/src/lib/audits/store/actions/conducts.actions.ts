import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AuditConduct } from '../../models/audit-conduct.model';

export enum AuditConductActionTypes {
    LoadAuditConductTriggered = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Load Triggered',
    LoadAuditConductCompleted = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Load Completed',
    LoadSubmitConductTriggered = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Submit Conduct Load Triggered',
    LoadSubmitConductCompleted = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Submit Conduct Load Completed',
    LoadAuditConductDelete = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Delete',
    LoadAuditConductRelatedCountsTriggered = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Related Counts Load Triggered',
    LoadAuditConductRelatedCountsCompleted = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Related Counts Load Completed',
    LoadAuditConductByIdTriggered = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct By Id Load Triggered',
    LoadAuditConductByIdCompleted = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct By Id Load Completed',
    RefreshAuditConductsList = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Refresh List Load Completed',
    AuditConductEditCompletedWithInPlaceUpdate = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct Update Load Completed',
    LoadAuditConductListTriggered = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct List Load Triggered',
    LoadAuditConductListCompleted = '[SnovaAuditsModule Audit Conduct Component] Initial Audit Conduct List Load Completed',
    AuditConductFailed = '[SnovaAuditsModule Audit Conduct Component] Audit Conduct Load Failed',
    AuditConductException = '[SnovaAuditsModule Audit Conduct Component] Audit Conduct Exception Handled'
}

export class LoadAuditConductTriggered implements Action {
    type = AuditConductActionTypes.LoadAuditConductTriggered;
    conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class LoadAuditConductCompleted implements Action {
    type = AuditConductActionTypes.LoadAuditConductCompleted;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public conductId: string) { }
}

export class LoadSubmitConductTriggered implements Action {
    type = AuditConductActionTypes.LoadSubmitConductTriggered;
    conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class LoadSubmitConductCompleted implements Action {
    type = AuditConductActionTypes.LoadSubmitConductCompleted;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public conductId: string) { }
}

export class LoadAuditConductRelatedCountsTriggered implements Action {
    type = AuditConductActionTypes.LoadAuditConductRelatedCountsTriggered;
    auditConduct: AuditConduct;
    public conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class LoadAuditConductRelatedCountsCompleted implements Action {
    type = AuditConductActionTypes.LoadAuditConductRelatedCountsCompleted;
    public conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class LoadAuditConductDelete implements Action {
    type = AuditConductActionTypes.LoadAuditConductDelete;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public conductId: string) { }
}

export class LoadAuditConductByIdTriggered implements Action {
    type = AuditConductActionTypes.LoadAuditConductByIdTriggered;
    conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class LoadAuditConductByIdCompleted implements Action {
    type = AuditConductActionTypes.LoadAuditConductByIdCompleted;
    auditConduct: AuditConduct;
    conductId: string;
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditConducts: AuditConduct[]) { }
}

export class RefreshAuditConductsList implements Action {
    type = AuditConductActionTypes.RefreshAuditConductsList;
    conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class AuditConductEditCompletedWithInPlaceUpdate implements Action {
    type = AuditConductActionTypes.AuditConductEditCompletedWithInPlaceUpdate;
    conductId: string;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConductUpdates: { auditConductUpdate: Update<AuditConduct> }) { }
}

export class LoadAuditConductListTriggered implements Action {
    type = AuditConductActionTypes.LoadAuditConductListTriggered;
    conductId: string;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditConduct: AuditConduct) { }
}

export class LoadAuditConductListCompleted implements Action {
    type = AuditConductActionTypes.LoadAuditConductListCompleted;
    conductId: string;
    auditConduct: AuditConduct;
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditConducts: AuditConduct[]) { }
}

export class AuditConductFailed implements Action {
    type = AuditConductActionTypes.AuditConductFailed;
    conductId: string;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class AuditConductException implements Action {
    type = AuditConductActionTypes.AuditConductException;
    conductId: string;
    auditConduct: AuditConduct;
    searchAuditConducts: AuditConduct[];
    auditConductUpdates: { auditConductUpdate: Update<AuditConduct> };
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type AuditConductActions = LoadAuditConductTriggered | LoadAuditConductCompleted | LoadAuditConductRelatedCountsTriggered | LoadAuditConductRelatedCountsCompleted | LoadAuditConductDelete |
    LoadAuditConductByIdTriggered | LoadAuditConductByIdCompleted | RefreshAuditConductsList | AuditConductEditCompletedWithInPlaceUpdate | LoadAuditConductListTriggered | LoadAuditConductListCompleted |
    LoadSubmitConductTriggered | LoadSubmitConductCompleted | AuditConductFailed | AuditConductException