export class PayrollRun{
    id: string;
    RunDate: string;
    BankSubmittedFilePointer: string;
    PayrollStartDate: string;
    PayrollEndDate: string;
    InActiveDateTime: string;
    BranchId: string;
    PayrollStatusId: string;
    PayrollStatusName: string;
    Comments: string;
    IsPayslipReleased: boolean;
    FileName: string;
    BranchName: string;
    employmentStatusIds: any;
    employeeIds: any;
    employmentStatusNames: string;
    employeeNames: string;
    templateName: string;
    templateId : string;
    employeeDetailsList: any;
}