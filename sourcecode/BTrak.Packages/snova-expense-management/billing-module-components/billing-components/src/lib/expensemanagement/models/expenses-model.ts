export class ExpenseManagementModel {
    isArchived: boolean;
    isMyExpenses: boolean;
    expenseId: string;
    description: string;
    expenseCategoryId: any;
    paymentStatusId: string;
    cashPaidThroughId: string;
    expenseReportId: string;
    expenseStatusId: string;
    billReceiptId: string;
    claimReimbursement: boolean;
    merchantId: any;
    receiptDate: Date;
    expenseDate: Date;
    amount: number;
    repliedByUserId: string;
    repliedDateTime: Date;
    reason: string;
    isApproved: boolean;
    isPaid: boolean;
    isRecurringExpense: boolean = false;
    actualBudget: number;
    referenceNumber: string;
    currencyId: string;
    branchId: any;
    timeStamp: any;
    sortBy: any;
    sortDirectionAsc: any;
    searchText: string;
    pageSize: number;
    pageNumber: number;
    to: string[];
    cc: string[];
    bcc: string[];
    cronExpression: string;
    cronExpressionDescription: string;
    cronExpressionId: string;
    cronExpressionTimeStamp: any;
    jobId: string;
    expenseCategories: ExpenseManagementConfigurationModel[];
    claimedByUserId: string;
    expenseName: string;
    identificationNumber: string;
    filesCount: any;
    userId: string;
    isApprovedExpenses: boolean;
    isPendingExpenses: boolean;
    expenseDateFrom: any;
    expenseDateTo: any;
    createdDateTimeFrom: any;
    createdDateTimeTo: any;
    expenseIdList:any;
}

export class ExpenseManagementConfigurationModel {
    expenseCategoryConfigurationId: string;
    expenseCategoryId: string;
    amount: number;
    description: string;
    merchantId: string;
    expenseCategoryName: string;
}

export class ExpenseStatusModel {
    expenseStatusId: string;
    expenseStatusName: string;
    isArchived: boolean;
}