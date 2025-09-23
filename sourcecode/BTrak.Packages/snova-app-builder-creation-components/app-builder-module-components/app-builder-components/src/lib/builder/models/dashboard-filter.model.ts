export class DashboardFilterModel {
    projectId: string;
    userId: string;
    goalId: string;
    sprintId: string;
    dateFrom: string;
    dateTo: string;
    date: string;
    entityId: string;
    branchId: string;
    designationId: string;
    roleId: string;
    sprintStartdate: Date;
    sprintEndDate: Date;
    departmentId: string;
    isFinancialYear: string;
    isActiveEmployeesOnly: string;
    monthDate: string;
    yearDate: string;
    auditId: string;
    testSuiteId: string;
    BusinessUnitIds: any [] = [];
    isMongoQuery : boolean;
    collectionName : string;
}
