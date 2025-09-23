export class PayRollRunEmployeeComponentModel{
    payRollRunEmployeeComponentId: string;
    employeeId: string;
    payRollRunId: string;
    componentId: string;
    actualComponentAmount: string;
    comments: string;
    timeStamp: any;
    isDeduction: boolean;
    isComponentUpdated: any;
    modifiedOriginalActualComponentAmount: string;
    componentAmount: number;
    originalComponentAmount: number;
    isYTDComponentUpdated: boolean;
    oldYTDComponentAmountFormat: string;
    ytdComments: string;
    originalActualComponentAmount: number;
    addOrUpdateComponent: boolean;
    addOrUpdateYtdComponent: boolean;
    includeYtd: boolean;
}