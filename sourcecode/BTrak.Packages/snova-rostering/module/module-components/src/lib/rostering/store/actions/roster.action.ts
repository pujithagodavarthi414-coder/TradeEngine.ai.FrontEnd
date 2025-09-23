import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { RosterPlan } from "../../models/roster-create-plan-model";
import { RosterPlanSolution } from "../../models/roster-plan-solution-model";
import { RosterPlanOutput } from "../../models/roster-planoutput-model";
import { RosterRequestModel } from "../../models/roster-request-model";
import { RosterPlanOutputByRequestModel } from "../../models/roster-request-plan-model";
import { RosterTemplatePlanOutputByRequestModel } from "../../models/roster-request-template-plan-model";
import { RosterPlanInput } from "../../models/roster-plan-input-model";
import { EmployeeRateSheetModel } from '../../models/employee-ratesheet-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

export enum EmployeeRosterActionTypes {
    CreateEmployeeRosterSolutionTriggered = '[Rostering Employee Roster Component] Create Employee Roster Solution Triggered',
    CreateEmployeeRosterSolutionCompleted = '[Rostering Employee Roster Component] Create Employee Roster Solution Completed',
    CreateEmployeeRosterSolutionFailed = '[Rostering Employee Roster Component] Create Employee Roster Solution Failed',
    CreateEmployeeRosterPlanTriggered = '[Rostering Employee Roster Component] Create Employee Roster Plan Triggered',
    CreateEmployeeRosterPlanCompleted = '[Rostering Employee Roster Component] Create Employee Roster Plan Completed',
    CreateEmployeeRosterPlanFailed = '[Rostering Employee Roster Component] Create Employee Roster Plan Failed',
    UpdateEmployeeRosterTriggered = '[Rostering Employee Roster Component] Update Employee Roster Triggered',
    UpdateEmployeeRosterCompleted = '[Rostering Employee Roster Component] Update Employee Roster Completed',
    UpdateEmployeeRosterFailed = '[Rostering Employee Roster Component] Update Employee Roster Failed',
    DeleteEmployeeRosterCompleted = '[Rostering Employee Roster Component] Delete Employee Roster Completed',
    LoadEmployeeRosterPlansTriggered = '[Rostering Employee Roster Component] Load Employee Roster Plans Triggered',
    LoadEmployeeRosterPlansCompleted = '[Rostering Employee Roster Component] Load Employee Roster Plans Completed',
    LoadEmployeeRosterPlansFailed = '[Rostering Employee Roster Component] Load Employee Roster Plans Failed',
    ApproveEmployeeRosterTriggered = '[Rostering Employee Roster Component] Approve Employee Roster Plans Triggered',
    ApproveEmployeeRosterCompleted = '[Rostering Employee Roster Component] Approve Employee Roster Plans Completed',
    ApproveEmployeeRosterFailed = '[Rostering Employee Roster Component] Approve Employee Roster Plans Failed',
    GetEmployeeRosterByIdTriggered = '[Rostering Employee Roster Component] Get Employee Roster By Id Triggered',
    GetEmployeeRosterByIdCompleted = '[Rostering Employee Roster Component] Get Employee Roster By Id Completed',
    GetEmployeeRosterByIdFailed = '[Rostering Employee Roster Component] Get Employee Roster By Id Failed',
    GetRosterSolutionsByIdTriggered = '[Rostering Employee Roster Component] Get Roster Solutions By Id Triggered',
    GetRosterSolutionsByIdCompleted = '[Rostering Employee Roster Component] Get Roster Solutions By Id Completed',
    GetRosterSolutionsByIdFailed = '[Rostering Employee Roster Component] Get Roster Solutions By Id Failed',
    GetEmployeeRosterPlanRequestByIdTriggered = '[Rostering Employee Roster Component] Get Employee Roster Plan By Request Id Triggered',
    GetEmployeeRosterPlanRequestByIdCompleted = '[Rostering Employee Roster Component] Get Employee Roster Plan By Request Id Completed',
    GetEmployeeRosterPlanRequestByIdFailed = '[Rostering Employee Roster Component] Get Employee Roster Plan By Request Id Failed',
    UpdateEmployeeRosterById = '[Rostering Employee Roster Component] Update Employee Roster By Id',
    UpdateEmployeeRosterPlanByRequestId = '[Rostering Employee Roster Component] Update Employee Roster Plan By Request Id',
    RefreshEmployeeRosterList = '[Rostering Employee Roster Component] Refresh Employee Roster List',
    LoadEmployeeRosterTemplatePlansTriggered = '[Rostering Employee Roster Component] Load Employee Roster Template Plan Triggered',
    LoadEmployeeRosterTemplatePlansCompleted = '[Rostering Employee Roster Component] Load Employee Roster Template Plan Completed',
    LoadEmployeeRosterTemplatePlansFailed = '[Rostering Employee Roster Component] Load Employee Roster Template Plan Failed',
    ExceptionHandled = '[Rostering Employee Roster Component] Handle Exception',
    LoadEmployeeRateSheetDetailsTriggered = '[Rostering Employee Rate Sheet Details Component] Initial Data Load Triggered',
    LoadEmployeeRateSheetDetailsCompleted = '[Rostering Employee Rate Sheet Details Component] Initial Data Load Completed',
    LoadEmployeeRateSheetDetailsFailed = '[Rostering Employee Rate Sheet Details Component] Initial Data Load Failed',

}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterSolutionTriggered implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterSolutionTriggered;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public employeeRosterInsertModel: RosterPlan) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterSolutionCompleted implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterSolutionCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterSolutions: RosterPlanSolution[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterSolutionFailed implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterSolutionFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterPlanTriggered implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterPlanTriggered;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution
    rosterSolutions: RosterPlanSolution[];
    employeeRosterInsertModel: RosterPlan;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterPlanInput: RosterPlanInput) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterPlanCompleted implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted;
    errorMessage: string;
    validationMessages: any[];
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class CreateEmployeeRosterPlanFailed implements Action {
    type = EmployeeRosterActionTypes.CreateEmployeeRosterPlanFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRosterTriggered implements Action {
    type = EmployeeRosterActionTypes.UpdateEmployeeRosterTriggered;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterSolution: RosterPlanSolution) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRosterCompleted implements Action {
    type = EmployeeRosterActionTypes.UpdateEmployeeRosterCompleted;
    errorMessage: string;
    validationMessages: any[];
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRosterFailed implements Action {
    type = EmployeeRosterActionTypes.UpdateEmployeeRosterFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ApproveEmployeeRosterTriggered implements Action {
    type = EmployeeRosterActionTypes.ApproveEmployeeRosterTriggered;
    errorMessage: string;
    validationMessages: any[];
    loadSearchObject: any;
    requestId: string;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterPlanInput: RosterPlanInput) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ApproveEmployeeRosterCompleted implements Action {
    type = EmployeeRosterActionTypes.ApproveEmployeeRosterCompleted;
    errorMessage: string;
    validationMessages: any[];
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ApproveEmployeeRosterFailed implements Action {
    type = EmployeeRosterActionTypes.ApproveEmployeeRosterFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteEmployeeRosterCompleted implements Action {
    type = EmployeeRosterActionTypes.DeleteEmployeeRosterCompleted;
    errorMessage: string;
    validationMessages: any[];
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterPlansTriggered implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterPlansTriggered;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public loadSearchObject: any) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterPlansCompleted implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterPlansCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterRequests: RosterRequestModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterPlansFailed implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterPlansFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterByIdTriggered implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterByIdTriggered;
    errorMessage: string;
    loadSearchObject: any;
    validationMessages: any[];
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterByIdCompleted implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterByIdCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterPlans: RosterPlanOutputByRequestModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterByIdFailed implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterByIdFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetRosterSolutionsByIdTriggered implements Action {
    type = EmployeeRosterActionTypes.GetRosterSolutionsByIdTriggered;
    errorMessage: string;
    loadSearchObject: any;
    validationMessages: any[];
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public requestId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetRosterSolutionsByIdCompleted implements Action {
    type = EmployeeRosterActionTypes.GetRosterSolutionsByIdCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterSolutionsOutput: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetRosterSolutionsByIdFailed implements Action {
    type = EmployeeRosterActionTypes.GetRosterSolutionsByIdFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRosterById implements Action {
    type = EmployeeRosterActionTypes.UpdateEmployeeRosterById;
    errorMessage: string;
    validationMessages: any[]
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> }) { }
}


// tslint:disable-next-line: max-classes-per-file
export class UpdateEmployeeRosterPlanByRequestId implements Action {
    type = EmployeeRosterActionTypes.UpdateEmployeeRosterPlanByRequestId;
    errorMessage: string;
    validationMessages: any[]
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> }
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> }) { }
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshEmployeeRosterList implements Action {
    type = EmployeeRosterActionTypes.RefreshEmployeeRosterList;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterPlanInput: RosterPlanInput;
    employeeRosterInsertModel: RosterPlan;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> }
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterSolutions: RosterPlanSolution[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterPlanRequestByIdTriggered implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdTriggered;
    errorMessage: string;
    requestId: string;
    validationMessages: any[];
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public loadSearchObject: any) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterPlanRequestByIdCompleted implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterSolutionsOutput: any[];
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterRequest: RosterRequestModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetEmployeeRosterPlanRequestByIdFailed implements Action {
    type = EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterTemplatePlansTriggered implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansTriggered;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public loadSearchObject: any) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterTemplatePlansCompleted implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansCompleted;
    errorMessage: string;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterRequests: RosterRequestModel[];
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolution: RosterPlanSolution;
    rosterSolutionsOutput: any[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRosterTemplatePlansFailed implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = EmployeeRosterActionTypes.ExceptionHandled;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public errorMessage: string) { }
}

export class LoadEmployeeRateSheetDetailsTriggered implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsTriggered;
    validationMessages: any[];
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    constructor(public employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRateSheetDetailsCompleted implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsCompleted;
    validationMessages: any[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    constructor(public employeeRateSheetDetails: EmployeeRateSheetModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEmployeeRateSheetDetailsFailed implements Action {
    type = EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsFailed;
    errorMessage: string;
    requestId: string;
    loadSearchObject: any;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterUpdates: { rosterUpdates: Update<RosterPlanOutput> };
    employeeRosterInsertModel: RosterPlan;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    rosterRequestUpdates: { rosterRequestUpdate: Update<RosterRequestModel> };
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    rosterSolutionsOutput: any[];
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    employeeRateSheetDetails: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    constructor(public validationMessages: any[]) { }
}

export type EmployeeRosterActions = CreateEmployeeRosterSolutionTriggered
    | CreateEmployeeRosterSolutionCompleted
    | CreateEmployeeRosterSolutionFailed
    | CreateEmployeeRosterPlanTriggered
    | CreateEmployeeRosterPlanCompleted
    | CreateEmployeeRosterPlanFailed
    | DeleteEmployeeRosterCompleted
    | UpdateEmployeeRosterTriggered
    | UpdateEmployeeRosterCompleted
    | UpdateEmployeeRosterFailed
    | ApproveEmployeeRosterTriggered
    | ApproveEmployeeRosterCompleted
    | ApproveEmployeeRosterFailed
    | GetEmployeeRosterByIdTriggered
    | GetEmployeeRosterByIdCompleted
    | GetEmployeeRosterByIdFailed
    | GetRosterSolutionsByIdTriggered
    | GetRosterSolutionsByIdCompleted
    | GetRosterSolutionsByIdFailed
    | GetEmployeeRosterPlanRequestByIdTriggered
    | GetEmployeeRosterPlanRequestByIdCompleted
    | GetEmployeeRosterPlanRequestByIdFailed
    | UpdateEmployeeRosterPlanByRequestId
    | UpdateEmployeeRosterById
    | RefreshEmployeeRosterList
    | ExceptionHandled
    | LoadEmployeeRateSheetDetailsTriggered
    | LoadEmployeeRateSheetDetailsCompleted
    | LoadEmployeeRateSheetDetailsFailed;
