import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { AuditCompliance } from '../../models/audit-compliance.model';

import { AuditActions, AuditActionTypes } from '../actions/audits.actions';

export interface State extends EntityState<AuditCompliance> {
    loadingAudit: boolean;
    loadingAuditClone: boolean;
    loadingAuditDelete: boolean;
    loadingAuditList: boolean;
    loadingAuditCopyList: boolean;
    loadingAuditVersionList: boolean;
    loadingAuditRelatedCounts: boolean;
    loadingAuditTag: boolean;
    loadingConductTag: boolean;
    loadingAuditTagList: boolean;
    loadingConductTagList: boolean;
    auditList: AuditCompliance[];
    auditVersions: AuditCompliance[];
    auditCopyList: AuditCompliance[];
    auditTagList: AuditCompliance[];
    conductTagList: AuditCompliance[];
    auditRelatedCounts: AuditCompliance;
    activeAuditsCount: number;
    archivedAuditsCount: number;
    activeAuditFoldersCount: number;
    archivedAuditFoldersCount: number; 
    activeAuditConductsCount: number;
    archivedAuditConductsCount: number;
    activeAuditReportsCount: number;
    archivedAuditReportsCount: number;
    actionsCount: number;
}

export const auditAdapter: EntityAdapter<AuditCompliance> = createEntityAdapter<AuditCompliance>({
    selectId: (audit: AuditCompliance) => audit.auditId,
    sortComparer: (auditAsc: AuditCompliance, auditDesc: AuditCompliance) => auditDesc.createdDateTime.toString().localeCompare(auditAsc.createdDateTime.toString())
});

export const initialState: State = auditAdapter.getInitialState({
    loadingAudit: false,
    loadingAuditClone: false,
    loadingAuditDelete: false,
    loadingAuditList: false,
    loadingAuditCopyList: false,
    loadingAuditVersionList: false,
    loadingAuditRelatedCounts: false,
    loadingAuditTag: false,
    loadingConductTag: false,
    loadingAuditTagList: false,
    loadingConductTagList: false,
    auditList: null,
    auditVersions: null,
    auditCopyList: null,
    auditTagList: null,
    conductTagList: null,
    auditRelatedCounts: null,
    activeAuditsCount: -1,
    archivedAuditsCount: -1,
    activeAuditFoldersCount: -1,
    archivedAuditFoldersCount: -1,
    activeAuditConductsCount: -1,
    archivedAuditConductsCount: -1,
    activeAuditReportsCount: -1,
    archivedAuditReportsCount: -1,
    actionsCount: -1
});

export function reducer(
    state: State = initialState,
    action: AuditActions
): State {
    switch (action.type) {
        case AuditActionTypes.LoadAuditTriggered:
            return { ...state, loadingAudit: true };
        case AuditActionTypes.LoadAuditCompleted:
            return { ...state, loadingAudit: false };
        case AuditActionTypes.LoadAuditCloneTriggered:
            return { ...state, loadingAuditClone: true };
        case AuditActionTypes.LoadAuditCloneCompleted:
            return { ...state, loadingAuditClone: false };
        case AuditActionTypes.LoadAuditTagTriggered:
            return { ...state, loadingAuditTag: true };
        case AuditActionTypes.LoadAuditTagCompleted:
            return { ...state, loadingAuditTag: false };
        case AuditActionTypes.LoadConductTagTriggered:
            return { ...state, loadingConductTag: true };
        case AuditActionTypes.LoadConductTagCompleted:
            return { ...state, loadingConductTag: false };
        case AuditActionTypes.LoadAuditTagListTriggered:
            return { ...state, loadingAuditTagList: true };
        case AuditActionTypes.LoadAuditTagListCompleted:
            return { ...state, loadingAuditTagList: false, auditTagList: action.searchAudits };
        case AuditActionTypes.LoadConductTagListTriggered:
            return { ...state, loadingConductTagList: true };
        case AuditActionTypes.LoadConductTagListCompleted:
            return { ...state, loadingConductTagList: false, conductTagList: action.searchAudits };
        case AuditActionTypes.LoadAuditByIdTriggered:
            return { ...state, loadingAudit: true, loadingAuditTag: true, loadingAuditClone: true };
        case AuditActionTypes.LoadAuditByIdCompleted:
            return { ...state, loadingAudit: false, loadingAuditTag: false, loadingAuditClone: false };
        case AuditActionTypes.LoadAuditRelatedCountsTriggered:
            return { ...state, loadingAuditRelatedCounts: true };
        case AuditActionTypes.LoadAuditRelatedCountsCompleted:
            return {
                ...state,
                loadingAuditRelatedCounts: false,
                auditRelatedCounts: (action as AuditActions).audit,
                activeAuditsCount: (action as AuditActions).audit.activeAuditsCount,
                archivedAuditsCount: (action as AuditActions).audit.archivedAuditsCount,
                activeAuditConductsCount: (action as AuditActions).audit.activeAuditConductsCount,
                archivedAuditConductsCount: (action as AuditActions).audit.archivedAuditConductsCount,
                activeAuditFoldersCount: (action as AuditActions).audit.activeAuditFoldersCount,
                archivedAuditFoldersCount: (action as AuditActions).audit.archivedAuditFoldersCount,
                activeAuditReportsCount: (action as AuditActions).audit.activeAuditReportsCount,
                archivedAuditReportsCount: (action as AuditActions).audit.archivedAuditReportsCount,
                actionsCount: (action as AuditActions).audit.actionsCount
            };
        case AuditActionTypes.LoadAuditDelete:
            return auditAdapter.removeOne(action.auditId, state);
        case AuditActionTypes.LoadAuditListTriggered:
            return { ...state, loadingAuditList: true };
        case AuditActionTypes.LoadAuditListCompleted:
            return auditAdapter.addAll(action.searchAudits, {
                ...state,
                loadingAuditList: false
            });
        case AuditActionTypes.LoadCopyAuditListTriggered:
            return { ...state, loadingAuditCopyList: true };
        case AuditActionTypes.LoadCopyAuditListCompleted:
            return { ...state, loadingAuditCopyList: false, auditCopyList: action.searchAudits };
        case AuditActionTypes.LoadAuditVersionListTriggered:
            return { ...state, loadingAuditVersionList: true };
        case AuditActionTypes.LoadAuditVersionListCompleted:
            return { ...state, loadingAuditVersionList: false, auditVersions: action.searchAudits };
        case AuditActionTypes.RefreshAuditsList:
            return auditAdapter.upsertOne(action.audit, state);
        case AuditActionTypes.AuditEditCompletedWithInPlaceUpdate:
            return auditAdapter.updateOne(action.auditUpdates.auditUpdate, state);
        case AuditActionTypes.LoadMultipleAuditsByIdCompleted:
            return auditAdapter.updateMany(action.multipleAudit.multipleAudits, state);
        case AuditActionTypes.AuditFailed:
            return { ...state, loadingAudit: false, loadingAuditList: false, loadingAuditRelatedCounts: false, loadingAuditTag: false, loadingConductTag: false, loadingAuditTagList: false, loadingConductTagList: false, loadingAuditClone: false };
        case AuditActionTypes.AuditException:
            return { ...state, loadingAudit: false, loadingAuditList: false, loadingAuditRelatedCounts: false, loadingAuditTag: false, loadingConductTag: false, loadingAuditTagList: false, loadingConductTagList: false, loadingAuditClone: false };
        default:
            return state;
    }
}