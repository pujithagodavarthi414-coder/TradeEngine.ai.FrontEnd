import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AuditCategory, ConductCategories } from '../../models/audit-category.model';
import { TestCaseDropdownList } from '../../dependencies/models/testcasedropdown';

export enum AuditCategoryActionTypes {
    LoadAuditCategoryTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Category Load Triggered',
    LoadAuditCategoryCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Category Load Completed',
    LoadAuditCategoriesForConductsTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Categories For Conducts Load Triggered',
    LoadAuditCategoriesForConductsCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Categories For Conducts Load Completed',
    LoadAuditCategoriesForConductsEditTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Categories For Conducts Edit Load Triggered',
    LoadAuditCategoriesForConductsEditCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Categories For Conducts Edit Load Completed',
    LoadCategoriesTriggered = '[SnovaAuditModule Audit Category Component] Initial Categories Load Triggered',
    LoadCategoriesCompleted = '[SnovaAuditModule Audit Category Component] Initial Categories Load Completed',
    LoadVersionCategoriesTriggered = '[SnovaAuditModule Audit Category Component] Initial Version Categories Load Triggered',
    LoadVersionCategoriesCompleted = '[SnovaAuditModule Audit Category Component] Initial Version Categories Load Completed',
    LoadFirstAuditCategory = '[SnovaAuditModule Audit Category Component] Initial First Audit Category Load Triggered',
    LoadAuditCategoryFirstCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Category First Load Completed',
    LoadAuditCategoryDelete = '[SnovaAuditModule Audit Category Component] Initial Audit Category Delete',
    LoadAuditCategoryByIdTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Category By Id Load Triggered',
    LoadAuditCategoryByIdCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Category By Id Load Completed',
    LoadAuditCategoryForAnswerByIdTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Category For Answer By Id Load Triggered',
    LoadAuditCategoryForAnswerByIdCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Category For Answer By Id Load Completed',
    RefreshAuditCategoryList = '[SnovaAuditModule Audit Category Component] Initial Audit Category Refresh List Load Completed',
    AuditCategoryEditCompletedWithInPlaceUpdate = '[SnovaAuditModule Audit Category Component] Initial Audit Category Update Load Completed',
    LoadAuditCategoryListTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Category List Load Triggered',
    LoadAuditCategoryListCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Category List Load Completed',
    LoadAuditVersionCategoryListTriggered = '[SnovaAuditModule Audit Category Component] Initial Audit Version Category List Load Triggered',
    LoadAuditVersionCategoryListCompleted = '[SnovaAuditModule Audit Category Component] Initial Audit Version Category List Load Completed',
    AuditCategoryFailed = '[SnovaAuditModule Audit Category Component] Audit Category Load Failed',
    AuditCategoryException = '[SnovaAuditModule Audit Category Component] Audit Category Exception Handled'
}

export class LoadAuditCategoryTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoryCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryCompleted;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategoryId: string) { }
}

export class LoadAuditCategoriesForConductsTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoriesForConductsTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoriesForConductsCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoriesForConductsCompleted;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategoryId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditCategories: AuditCategory[]) { }
}

export class LoadAuditCategoriesForConductsEditTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoriesForConductsEditCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditCompleted;
    auditCategoryId: string;
    auditId: string;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public conductCategories: ConductCategories) { }
}

export class LoadCategoriesTriggered implements Action {
    type = AuditCategoryActionTypes.LoadCategoriesTriggered;
    auditCategory: AuditCategory;
    auditCategoryId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}
export class LoadCategoriesCompleted implements Action {
    type = AuditCategoryActionTypes.LoadCategoriesCompleted;
    auditId: string;
    auditCategoryId: string;
    conductCategories: ConductCategories;
    auditCategory: AuditCategory;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategories: TestCaseDropdownList[]) { }
}

export class LoadVersionCategoriesTriggered implements Action {
    type = AuditCategoryActionTypes.LoadVersionCategoriesTriggered;
    auditCategory: AuditCategory;
    auditCategoryId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditId: string) { }
}
export class LoadVersionCategoriesCompleted implements Action {
    type = AuditCategoryActionTypes.LoadVersionCategoriesCompleted;
    auditId: string;
    auditCategoryId: string;
    conductCategories: ConductCategories;
    auditCategory: AuditCategory;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategories: TestCaseDropdownList[]) { }
}

export class LoadFirstAuditCategory implements Action {
    type = AuditCategoryActionTypes.LoadFirstAuditCategory;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategoryId: string;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class LoadAuditCategoryDelete implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryDelete;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategoryId: string) { }
}

export class LoadAuditCategoryByIdTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryByIdTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoryByIdCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategoryId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditCategories: AuditCategory[]) { }
}

export class LoadAuditCategoryForAnswerByIdTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryForAnswerByIdTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoryForAnswerByIdCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryForAnswerByIdCompleted;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategoryId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditCategories: AuditCategory[]) { }
}

export class RefreshAuditCategoryList implements Action {
    type = AuditCategoryActionTypes.RefreshAuditCategoryList;
    auditCategory: AuditCategory;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategoryId: string;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class AuditCategoryEditCompletedWithInPlaceUpdate implements Action {
    type = AuditCategoryActionTypes.AuditCategoryEditCompletedWithInPlaceUpdate;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategory: AuditCategory;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class LoadAuditCategoryListTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryListTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditCategoryListCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditCategoryListCompleted;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategory: AuditCategory;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditCategories: AuditCategory[]) { }
}

export class LoadAuditVersionCategoryListTriggered implements Action {
    type = AuditCategoryActionTypes.LoadAuditVersionCategoryListTriggered;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public auditCategory: AuditCategory) { }
}

export class LoadAuditVersionCategoryListCompleted implements Action {
    type = AuditCategoryActionTypes.LoadAuditVersionCategoryListCompleted;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategory: AuditCategory;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchAuditCategories: AuditCategory[]) { }
}

export class AuditCategoryFailed implements Action {
    type = AuditCategoryActionTypes.AuditCategoryFailed;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategory: AuditCategory;
    searchAuditCategories: AuditCategory[];
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class AuditCategoryException implements Action {
    type = AuditCategoryActionTypes.AuditCategoryException;
    auditCategoryId: string;
    auditId: string;
    conductCategories: ConductCategories;
    auditCategories: TestCaseDropdownList[];
    auditCategory: AuditCategory;
    searchAuditCategories: AuditCategory[];
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type AuditCategoryActions = LoadAuditCategoryTriggered | LoadAuditCategoryCompleted | LoadAuditCategoryDelete | LoadAuditCategoryByIdTriggered | LoadAuditCategoryByIdCompleted |
    RefreshAuditCategoryList | AuditCategoryEditCompletedWithInPlaceUpdate | LoadAuditCategoryListTriggered | LoadAuditCategoryListCompleted | LoadFirstAuditCategory |
    LoadCategoriesTriggered | LoadCategoriesCompleted | LoadAuditCategoriesForConductsTriggered | LoadAuditCategoriesForConductsCompleted | 
    LoadAuditCategoriesForConductsEditTriggered | LoadAuditCategoriesForConductsEditCompleted | LoadAuditCategoryForAnswerByIdTriggered | LoadAuditCategoryForAnswerByIdCompleted |
    AuditCategoryFailed | AuditCategoryException | LoadAuditVersionCategoryListTriggered | LoadAuditVersionCategoryListCompleted | LoadVersionCategoriesTriggered | LoadVersionCategoriesCompleted