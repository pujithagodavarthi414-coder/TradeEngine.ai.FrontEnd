export class EmployeeLoanModel{
    employeeLoanId: string;
    employeeId: string;
    loanAmount: number;
    loanTakenOn: Date;
    loanInterestPercentagePerMonth : number;
    timePeriodInMonths: number;
    loanTypeId: string;
    compoundedPeriodId: string;
    loanPaymentStartDate: Date;
    loanBalanceAmount: number;
    loanTotalPaidAmount: number;
    loanClearedDate: Date;
    isArchived: boolean;
    timeStamp: any;
    employeeName: string;
    loanTypeName: string;
    periodTypeName: string;
    IsApproved: boolean;
    name: string;
    description: string;
    userId: string;
}