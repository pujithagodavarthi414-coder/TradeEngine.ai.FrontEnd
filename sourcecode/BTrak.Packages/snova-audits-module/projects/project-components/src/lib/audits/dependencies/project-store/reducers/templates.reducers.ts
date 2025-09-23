import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { TemplateModel } from "../../models/templates-model";
import { TemplateActions, TemplateActionTypes } from "../actions/templates.action";

export interface State extends EntityState<TemplateModel> {
    loadingTemplates: boolean;
    getTemplateById: boolean;
    upsertTemplate: boolean;
    deleteTemplate: boolean;
    insertDuplicateTemplate: boolean;
    insertGoalTemplate: boolean;
    templateModel: TemplateModel;
}

export const templateAdapter: EntityAdapter<
    TemplateModel
> = createEntityAdapter<TemplateModel>({
    selectId: (templates: TemplateModel) => templates.templateId,
    sortComparer: (templatesSortAsc: TemplateModel, templatesSortDesc: TemplateModel) => templatesSortDesc.createdDateTime.localeCompare(templatesSortAsc.createdDateTime)
});

export const initialState: State = templateAdapter.getInitialState({
    loadingTemplates: false,
    getTemplateById: true,
    upsertTemplate: false,
    deleteTemplate: false,
    insertDuplicateTemplate: false,
    insertGoalTemplate: false,
    templateModel: null
})

export function reducer(state: State = initialState, action: TemplateActions): State {
    switch (action.type) {
        case TemplateActionTypes.GetTemplatesTriggered:
            return initialState;
        case TemplateActionTypes.GetTemplatesCompleted:
            return templateAdapter.addAll(action.templatesList, {
                ...state,
                loadingTemplates: false
            })
        case TemplateActionTypes.GetTemplatesFailed:
            return { ...state, loadingTemplates: false };
        case TemplateActionTypes.UpsertTemplatesTriggered:
            return { ...state, upsertTemplate: true };
        case TemplateActionTypes.UpsertTemplatesCompleted:
            return { ...state, upsertTemplate: false };
        case TemplateActionTypes.InsertDuplicateTemplateTriggered:
            return { ...state, insertDuplicateTemplate: true };
        case TemplateActionTypes.InsertDuplicateTemplateCompleted:
            return { ...state, insertDuplicateTemplate: false };
        case TemplateActionTypes.UpsertTemplatesFailed:
            return { ...state, upsertTemplate: false, insertDuplicateTemplate: false };
        case TemplateActionTypes.ExceptionHandled:
            return { ...state, loadingTemplates: false, upsertTemplate: false, getTemplateById: false };
        case TemplateActionTypes.GetTemplatesByIdTriggered:
            return { ...state, getTemplateById: true };
        case TemplateActionTypes.GetTemplatesByIdCompleted:
            return { ...state, getTemplateById: false, templateModel: action.template };
        case TemplateActionTypes.GetTemplatesByIdFailed:
            return { ...state, getTemplateById: false };
        case TemplateActionTypes.RefreshTemplatesList:
            return templateAdapter.upsertOne(action.template, state);
        case TemplateActionTypes.UpdateTemplatesField:
            return templateAdapter.updateOne(action.templateUpdates.templateUpdate, state);
        case TemplateActionTypes.InsertGoalTemplateTriggered:
            return { ...state, insertGoalTemplate: true };
        case TemplateActionTypes.InsertGoalTemplateCompleted:
            return { ...state, insertGoalTemplate: false };
        case TemplateActionTypes.InsertGoalTemplateFailed:
            return { ...state, insertGoalTemplate: false };
        case TemplateActionTypes.ArchiveTemplatesTriggered:
            return { ...state, deleteTemplate: true };
        case TemplateActionTypes.ArchiveTemplatesCompleted:
            state = templateAdapter.removeOne(action.templateId, state);
            return { ...state, deleteTemplate: false };
        case TemplateActionTypes.ArchiveTemplatesFailed:
            return { ...state, deleteTemplate: false };
        default:
            return state;
    }
}