import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { AuditConduct } from '../../models/audit-conduct.model';

import { AuditConductActions, AuditConductActionTypes } from '../actions/conducts.actions';

export interface State extends EntityState<AuditConduct> {
    loadingAuditConduct: boolean;
    loadingAuditConductDelete: boolean;
    loadingAuditConductList: boolean;
    loadingSubmitConduct: boolean;
    auditConductList: AuditConduct[];
}

export const auditConductAdapter: EntityAdapter<AuditConduct> = createEntityAdapter<AuditConduct>({
    selectId: (auditConduct: AuditConduct) => auditConduct.conductId,
    sortComparer: (auditAsc: AuditConduct, auditDesc: AuditConduct) => auditDesc.createdDateTime.toString().localeCompare(auditAsc.createdDateTime.toString())
});

export const initialState: State = auditConductAdapter.getInitialState({
    loadingAuditConduct: false,
    loadingAuditConductDelete: false,
    loadingAuditConductList: false,
    loadingSubmitConduct: false,
    auditConductList: null,
});

export function reducer(
    state: State = initialState,
    action: AuditConductActions
): State {
    switch (action.type) {
        case AuditConductActionTypes.LoadAuditConductTriggered:
            return { ...state, loadingAuditConduct: true };
        case AuditConductActionTypes.LoadAuditConductCompleted:
            return { ...state, loadingAuditConduct: false };
        case AuditConductActionTypes.LoadSubmitConductTriggered:
            return { ...state, loadingSubmitConduct: true };
        case AuditConductActionTypes.LoadSubmitConductCompleted:
            return { ...state, loadingSubmitConduct: false };
        case AuditConductActionTypes.LoadAuditConductByIdTriggered:
            return { ...state, loadingAuditConduct: true };
        case AuditConductActionTypes.LoadAuditConductByIdCompleted:
            return { ...state, loadingAuditConduct: false };
        case AuditConductActionTypes.LoadAuditConductDelete:
            return auditConductAdapter.removeOne(action.conductId, state);
        case AuditConductActionTypes.LoadAuditConductListTriggered:
            return { ...state, loadingAuditConductList: true };
        case AuditConductActionTypes.LoadAuditConductListCompleted:
            return auditConductAdapter.addAll(action.searchAuditConducts, {
                ...state,
                loadingAuditConductList: false
            });
        case AuditConductActionTypes.RefreshAuditConductsList:
            return auditConductAdapter.upsertOne(action.auditConduct, state);
        case AuditConductActionTypes.AuditConductEditCompletedWithInPlaceUpdate:
            return auditConductAdapter.updateOne(action.auditConductUpdates.auditConductUpdate, state);
        case AuditConductActionTypes.AuditConductFailed:
            return { ...state, loadingAuditConduct: false, loadingAuditConductList: false, loadingSubmitConduct: false };
        case AuditConductActionTypes.AuditConductException:
            return { ...state, loadingAuditConduct: false, loadingAuditConductList: false, loadingSubmitConduct: false };
        default:
            return state;
    }
}