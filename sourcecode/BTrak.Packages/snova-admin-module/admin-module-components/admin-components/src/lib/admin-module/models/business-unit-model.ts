export class BusinessUnitModel {
    businessUnitId: string;
    businessUnitName: string;
    timeStamp: boolean;
    parentBusinessUnitId: string;
    isArchive: boolean;
    employeeIds:any[];
    operationsPerformedBy: string;
    canAddEmployee: boolean;
    employeeNames: string;
}