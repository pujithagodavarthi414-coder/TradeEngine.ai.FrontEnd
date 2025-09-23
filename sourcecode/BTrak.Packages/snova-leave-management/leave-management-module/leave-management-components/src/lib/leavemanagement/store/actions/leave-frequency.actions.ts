import { Action } from '@ngrx/store';
import { LeaveFrequencyTypeSearchInputModel } from '../../models/leave-type-search-model';
import { LeaveFrequencyTypeModel } from '../../models/leave-frequency-type-model';
import { EncashmentTypeModel } from '../../models/encashment-type-model';
import { LeaveFormulaModel } from '../../models/leave-formula-model';
import { RestrictionTypeModel } from '../../models/restriction-type-model';

export enum LeaveFrequencyActionTypes {
    LoadLeaveFrequenciesTriggered = '[Leave management Leave Frequencies Component] Initial Data Load Triggered',
    LoadLeaveFrequenciesCompleted = '[Leave management Leave Frequencies Component] Initial Data Load Completed',
    LoadLeaveFrequenciesFailed = '[Leave management Leave Frequencies Component] Load Leave Types Details Failed',
    LoadLeaveFrequenciesByIdTriggered = '[Leave management Leave Frequencies Component] Leave Frequency By Id Triggered',
    LoadLeaveFrequenciesByIdCompleted = '[Leave management Leave Frequencies Component] Leave Frequency By Id Completed',
    LoadLeaveFrequenciesByIdFailed = '[Leave management Leave Frequencies Component] Leave Frequency By Id Details Failed',
    AddNewLeaveTypeFrequencyTriggered = '[Leave management Leave Types Component] New Leave Type Frequency Triggered',
    AddNewLeaveTypeFrequencyCompleted = '[Leave management Leave Types Component] New Leave Type Frequency Completed',
    AddNewLeaveTypeFrequencyFailed = '[Leave management Leave Types Component] New Leave Type Frequency Failed',
    ExceptionHandled = '[Leave management Leave Types Component] Handle Exception',
    LoadEncashmentTypesTriggered = '[Leave management Leave Frequencies Component] Load Encashment Types Triggered',
    LoadEncashmentTypesCompleted = '[Leave management Leave Frequencies Component] Load Encashment Types Completed',
    LoadEncashmentTypesFailed = '[Leave management Leave Frequencies Component] Load Encashment Types Failed',
    LoadLeaveFormulasTriggered = '[Leave management Leave Frequencies Component] Load Leave Formulas Triggered',
    LoadLeaveFormulasCompleted = '[Leave management Leave Frequencies Component] Load Leave Formulas Completed',
    LoadLeaveFormulasFailed = '[Leave management Leave Frequencies Component] Load Leave Formulas Failed',
    LoadRestrictionTypesTriggered = '[Leave management Leave Frequencies Component] Load Restriction Types Triggered',
    LoadRestrictionTypesCompleted = '[Leave management Leave Frequencies Component] Load Restriction Types Completed',
    LoadRestrictionTypesFailed = '[Leave management Leave Frequencies Component] Load Restriction Types Failed',
    LoadLeaveFrequenciesByFrequencyIdTriggered = '[Leave management Leave Frequencies Component] Leave Frequency By Frequency Id Triggered',
    LoadLeaveFrequenciesByFrequencyIdCompleted = '[Leave management Leave Frequencies Component] Leave Frequency By Frequency Id Completed',
    LoadLeaveFrequenciesByFrequencyIdFailed = '[Leave management Leave Frequencies Component] Leave Frequency By Frequency Id Details Failed',
    UpdateLeaveTypeFrequencyTriggered = '[Leave management Leave Frequencies Component] Update Leave Frequency By Frequency Id Triggered',
    UpdateLeaveTypeFrequencyCompleted = '[Leave management Leave Frequencies Component] Update Leave Frequency By Frequency Id Completed',
    UpdateLeaveTypeFrequencyFailed = '[Leave management Leave Frequencies Component] Update Leave Frequency By Frequency Id  Failed',
}

export class LoadLeaveFrequenciesTriggered implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesTriggered;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel) { }
}

export class LoadLeaveFrequenciesCompleted implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveTypeId: string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyTypesList: LeaveFrequencyTypeModel[]) { }
}

export class LoadLeaveFrequenciesFailed implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    leaveTypeId: string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveFrequenciesByIdTriggered implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdTriggered;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveTypeId: string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel) { }
}

export class LoadLeaveFrequenciesByIdCompleted implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyType: LeaveFrequencyTypeModel) { }
}

export class LoadLeaveFrequenciesByIdFailed implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class AddNewLeaveTypeFrequencyTriggered implements Action {
    type = LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyTriggered;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyInputModel: LeaveFrequencyTypeModel) { }
}

export class AddNewLeaveTypeFrequencyCompleted implements Action {
    type = LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveTypeId: string) { }
}

export class AddNewLeaveTypeFrequencyFailed implements Action {
    type = LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class UpdateLeaveTypeFrequencyTriggered implements Action {
    type = LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyTriggered;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyInputModel: LeaveFrequencyTypeModel) { }
}

export class UpdateLeaveTypeFrequencyCompleted implements Action {
    type = LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveTypeId: string) { }
}

export class UpdateLeaveTypeFrequencyFailed implements Action {
    type = LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LeaveFrequencyActionTypes.ExceptionHandled;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public errorMessage: string) { }
}

export class LoadEncashmentTypesTriggered implements Action
{
    type = LeaveFrequencyActionTypes.LoadEncashmentTypesTriggered;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public encashmentSearchModel:EncashmentTypeModel) { }
}

export class LoadEncashmentTypesCompleted implements Action
{
    type = LeaveFrequencyActionTypes.LoadEncashmentTypesCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public encashmentTypes:any) { }
}

export class LoadEncashmentTypesFailed implements Action
{
    type = LeaveFrequencyActionTypes.LoadEncashmentTypesFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveFormulasTriggered implements Action
{
    type = LeaveFrequencyActionTypes.LoadLeaveFormulasTriggered;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormulas:LeaveFormulaModel[];
    validationMessages: any[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFormula: LeaveFormulaModel) { }
}

export class LoadLeaveFormulasCompleted implements Action
{
    type = LeaveFrequencyActionTypes.LoadLeaveFormulasCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    validationMessages: any[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFormulas:LeaveFormulaModel[]) { }
}

export class LoadLeaveFormulasFailed implements Action
{
    type = LeaveFrequencyActionTypes.LoadLeaveFormulasFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    leaveFormula: LeaveFormulaModel;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadRestrictionTypesTriggered implements Action
{
    type = LeaveFrequencyActionTypes.LoadRestrictionTypesTriggered;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormulas:LeaveFormulaModel[];
    validationMessages: any[];
    leaveFormula: LeaveFormulaModel;
    restrictionTypesList:RestrictionTypeModel[];
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public restrictionTypeModel:RestrictionTypeModel) { }
}

export class LoadRestrictionTypesCompleted implements Action
{
    type = LeaveFrequencyActionTypes.LoadRestrictionTypesCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    validationMessages: any[];
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public restrictionTypesList:RestrictionTypeModel[]) { }
}

export class LoadRestrictionTypesFailed implements Action
{
    type = LeaveFrequencyActionTypes.LoadRestrictionTypesFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage:string;
    encashmentTypes:any;
    leaveFormula: LeaveFormulaModel;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveFrequenciesByFrequencyIdTriggered implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdTriggered;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    leaveTypeId: string;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    constructor(public leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel) { }
}

export class LoadLeaveFrequenciesByFrequencyIdCompleted implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdCompleted;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    errorMessage: string;
    leaveTypeId: string;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public leaveFrequencyDetails:LeaveFrequencyTypeModel) { }
}

export class LoadLeaveFrequenciesByFrequencyIdFailed implements Action {
    type = LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdFailed;
    leaveFrequencyTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveFrequencyTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveFrequencyInputModel: LeaveFrequencyTypeModel;
    leaveTypeId: string;
    leaveFrequencyType: LeaveFrequencyTypeModel;
    encashmentTypes:any;
    encashmentSearchModel:EncashmentTypeModel;
    leaveFormula: LeaveFormulaModel;
    leaveFormulas:LeaveFormulaModel[];
    restrictionTypesList:RestrictionTypeModel[];
    restrictionTypeModel:RestrictionTypeModel;
    leaveFrequencyDetails:LeaveFrequencyTypeModel;
    leaveFrequencySearchInputModel:LeaveFrequencyTypeSearchInputModel;
    constructor(public validationMessages: any[]) { }
}

export type LeaveManagementActions = LoadLeaveFrequenciesTriggered
    | LoadLeaveFrequenciesCompleted
    | LoadLeaveFrequenciesFailed
    | LoadLeaveFrequenciesByIdTriggered
    | LoadLeaveFrequenciesByIdCompleted
    | LoadLeaveFrequenciesByIdFailed
    | AddNewLeaveTypeFrequencyTriggered
    | AddNewLeaveTypeFrequencyCompleted
    | AddNewLeaveTypeFrequencyFailed
    | UpdateLeaveTypeFrequencyTriggered
    | UpdateLeaveTypeFrequencyCompleted
    | UpdateLeaveTypeFrequencyFailed
    | LoadEncashmentTypesTriggered
    | LoadEncashmentTypesCompleted
    | LoadEncashmentTypesFailed
    | LoadLeaveFormulasTriggered
    | LoadLeaveFormulasCompleted
    | LoadLeaveFormulasFailed
    | LoadRestrictionTypesTriggered
    | LoadRestrictionTypesCompleted
    | LoadRestrictionTypesFailed
    | LoadLeaveFrequenciesByFrequencyIdTriggered
    | LoadLeaveFrequenciesByFrequencyIdCompleted
    | LoadLeaveFrequenciesByFrequencyIdFailed
    | ExceptionHandled;