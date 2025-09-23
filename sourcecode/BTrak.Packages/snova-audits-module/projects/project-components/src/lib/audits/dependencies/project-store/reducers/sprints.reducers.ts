import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { SprintModel } from "../../models/sprints-model";
import { SprintActionsUnion, SprintActionTypes } from "../actions/sprints.action";

export interface State extends EntityState<SprintModel> {
    loadingSprints: boolean;
    getSprintById: boolean;
    upsertSprint: boolean;
    deleteSprint: boolean;
    startSprintLoading: boolean;
    sprintModel: SprintModel;
    uniqueSprintModel: SprintModel;
    replanSprintLoading: boolean;
    loadingmoresprints: boolean;
    completeSprint: boolean;
    getUniqueSprintByid: boolean;
}

export const sprintAdapter: EntityAdapter<
    SprintModel
> = createEntityAdapter<SprintModel>({
    selectId: (sprints: SprintModel) => sprints.sprintId
    //sortComparer: (sprintsSortAsc: SprintModel, sprintsSortDesc: SprintModel) => sprintsSortDesc.createdDateTime.localeCompare(sprintsSortAsc.createdDateTime)
});

export const initialState: State = sprintAdapter.getInitialState({
    loadingSprints: false,
    getSprintById: true,
    upsertSprint: false,
    deleteSprint: false,
    insertDuplicateTemplate: false,
    loadingmoresprints: false,
    startSprintLoading: false,
    insertGoalTemplate: false,
    replanSprintLoading: false,
    sprintModel: null,
    uniqueSprintModel: null,
    completeSprint: false,
    getUniqueSprintByid: false
})

export function reducer(state: State = initialState, action: SprintActionsUnion): State {
    switch (action.type) {
        case SprintActionTypes.GetSprintsTriggered:
            return { ...initialState, loadingSprints: true };
        case SprintActionTypes.GetSprintsCompleted:
            return sprintAdapter.addAll(action.SprintsList, {
                ...state,
                loadingSprints: false
            })
        case SprintActionTypes.GetMoreSprintsTriggered:
            return { ...state, loadingSprints: true };
        case SprintActionTypes.GetSprintsFailed:
            return { ...state, loadingSprints: false };
        case SprintActionTypes.UpsertSprintsTriggered:
            return { ...state, upsertSprint: true };
        case SprintActionTypes.UpsertSprintsCompleted:
            return { ...state, upsertSprint: false };
        case SprintActionTypes.UpsertSprintsFailed:
            return { ...state, upsertSprint: false };
        case SprintActionTypes.ExceptionHandled:
            return { ...state, loadingSprints: false, upsertSprint: false, getSprintById: false };
        case SprintActionTypes.GetSprintsByIdTriggered:
            return { ...state, getSprintById: true };
        case SprintActionTypes.GetSprintsByIdCompleted:
            return { ...state, getSprintById: false, sprintModel: action.sprint };
        case SprintActionTypes.GetSprintsByIdFailed:
            return { ...state, getSprintById: false };
        case SprintActionTypes.GetUniqueSprintsByIdTriggered:
            return { ...state, getUniqueSprintByid: true };
        case SprintActionTypes.GetUniqueSprintsByIdCompleted:
            return { ...state, getUniqueSprintByid: false, uniqueSprintModel: action.sprint };
        case SprintActionTypes.GetUniqueSprintsByIdFailed:
            return { ...state, getUniqueSprintByid: false };
        case SprintActionTypes.RefreshSprintsList:
            return sprintAdapter.upsertOne(action.sprint, state);
        case SprintActionTypes.UpdateSprintsField:
            return sprintAdapter.updateOne(action.sprintUpdates.sprintUpdate, state);
        case SprintActionTypes.UpdateMultipleSprintsTriggered:
            return { ...state, loadingmoresprints: true };
        case SprintActionTypes.UpdateMultipleSprintsCompleted:
            return sprintAdapter.updateMany(action.sprintUpdatesMultiple.sprintUpdateMultiple, state);
        case SprintActionTypes.UpdateMultipleSprintsFailed:
            return { ...state, loadingmoresprints: false };
        case SprintActionTypes.ArchiveSprintsTriggered:
            return { ...state, deleteSprint: true };
        case SprintActionTypes.ArchiveSprintsCompleted:
            state = sprintAdapter.removeOne(action.sprintId, state);
            return { ...state, deleteSprint: false };
        case SprintActionTypes.ArchiveSprintsFailed:
            return { ...state, deleteSprint: false };
        case SprintActionTypes.CompleteSprintsTriggered:
            return { ...state, completeSprint: true };
        case SprintActionTypes.CompleteSprintsCompleted:
            state = sprintAdapter.removeOne(action.sprintId, state);
            return { ...state, completeSprint: false };
        case SprintActionTypes.CompleteSprintsFailed:
            return { ...state, completeSprint: false };
        case SprintActionTypes.SprintStartTriggered:
            return { ...state, startSprintLoading: true };
        case SprintActionTypes.SprintStartCompleted:
            state = sprintAdapter.removeOne(action.sprintId, state);
            return { ...state, startSprintLoading: false };
        case SprintActionTypes.SprintStartFailed:
            return { ...state, startSprintLoading: false };
        case SprintActionTypes.ReplanSprintTriggered:
            return { ...state, replanSprintLoading: true };
        case SprintActionTypes.ReplanSprintCompleted:
            return { ...state, replanSprintLoading: false };
        case SprintActionTypes.ReplanSprintFailed:
            return { ...state, replanSprintLoading: false };
        default:
            return state;
    }
}