import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { AuditCategory, ConductCategories } from '../../models/audit-category.model';

import { AuditCategoryActions, AuditCategoryActionTypes } from '../actions/audit-categories.actions';
import { TestCaseDropdownList } from '../../dependencies/models/testcasedropdown';

export interface State extends EntityState<AuditCategory> {
    loadingAuditCategory: boolean;
    loadingAuditCategoryDelete: boolean;
    loadingAuditCategoryList: boolean;
    loadingAuditVersionCategoryList: boolean;
    loadingCategoryList: boolean;
    loadingVersionCategoryList: boolean;
    loadingAuditCategoriesForConducts: boolean;
    loadingAuditCategoriesForConductsEdit: boolean;
    auditCategoryList: AuditCategory[];
    auditVersionCategoryList: AuditCategory[];
    auditCategoriesForConducts: AuditCategory[];
    auditCategoriesForConductsEdit: ConductCategories;
    categoryList: TestCaseDropdownList[];
    versionCategoryList: TestCaseDropdownList[];
}

export const auditCategoryAdapter: EntityAdapter<AuditCategory> = createEntityAdapter<AuditCategory>({
    selectId: (auditCategory: AuditCategory) => auditCategory.auditCategoryId
});

export const initialState: State = auditCategoryAdapter.getInitialState({
    loadingAuditCategory: false,
    loadingAuditCategoryDelete: false,
    loadingAuditCategoryList: false,
    loadingAuditVersionCategoryList: false,
    loadingCategoryList: false,
    loadingVersionCategoryList: false,
    loadingAuditCategoriesForConducts: false,
    loadingAuditCategoriesForConductsEdit: false,
    auditCategoryList: null,
    auditVersionCategoryList: null,
    auditCategoriesForConducts: null,
    auditCategoriesForConductsEdit: null,
    categoryList: null,
    versionCategoryList: null
});

export function reducer(
    state: State = initialState,
    action: AuditCategoryActions
): State {
    switch (action.type) {
        case AuditCategoryActionTypes.LoadAuditCategoryTriggered:
            return { ...state, loadingAuditCategory: true };
        case AuditCategoryActionTypes.LoadAuditCategoryCompleted:
            return { ...state, loadingAuditCategory: false };
        case AuditCategoryActionTypes.LoadAuditCategoriesForConductsTriggered:
            return { ...state, loadingAuditCategoriesForConducts: true };
        case AuditCategoryActionTypes.LoadAuditCategoriesForConductsCompleted:
            return { ...state, loadingAuditCategoriesForConducts: false, auditCategoriesForConducts: action.searchAuditCategories };
        case AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditTriggered:
            return { ...state, loadingAuditCategoriesForConductsEdit: true };
        case AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditCompleted:
            return { ...state, loadingAuditCategoriesForConductsEdit: false, auditCategoriesForConductsEdit: action.conductCategories };
        case AuditCategoryActionTypes.LoadCategoriesTriggered:
            return { ...state, loadingCategoryList: true };
        case AuditCategoryActionTypes.LoadCategoriesCompleted:
            return { ...state, loadingCategoryList: false, categoryList: action.auditCategories };
        case AuditCategoryActionTypes.LoadVersionCategoriesTriggered:
            return { ...state, loadingVersionCategoryList: true };
        case AuditCategoryActionTypes.LoadVersionCategoriesCompleted:
            return { ...state, loadingVersionCategoryList: false, versionCategoryList: action.auditCategories };
        case AuditCategoryActionTypes.LoadAuditCategoryByIdTriggered:
            return { ...state, loadingAuditCategory: true };
        case AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted:
            return { ...state, loadingAuditCategory: false };
        case AuditCategoryActionTypes.LoadAuditCategoryListTriggered:
            return { ...state, loadingAuditCategoryList: true };
        case AuditCategoryActionTypes.LoadAuditCategoryListCompleted:
            return { ...state, loadingAuditCategoryList: false, loadingAuditCategory: false, auditCategoryList: action.searchAuditCategories };
        case AuditCategoryActionTypes.LoadAuditVersionCategoryListTriggered:
            return { ...state, loadingAuditVersionCategoryList: true };
        case AuditCategoryActionTypes.LoadAuditVersionCategoryListCompleted:
            return { ...state, loadingAuditVersionCategoryList: false, loadingAuditCategory: false, auditVersionCategoryList: action.searchAuditCategories };
        case AuditCategoryActionTypes.AuditCategoryFailed:
            return { ...state, loadingAuditCategory: false, loadingAuditCategoryList: false, loadingAuditCategoriesForConducts: false };
        case AuditCategoryActionTypes.AuditCategoryException:
            return { ...state, loadingAuditCategory: false, loadingAuditCategoryList: false, loadingAuditCategoriesForConducts: false };
        default:
            return state;
    }
}