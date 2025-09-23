export class ExpenseManagementModel {
    isArchived: boolean;
    isMyExpenses: boolean;
    expenseId: string;
    description: string;
    expenseCategoryId: string;
    paymentStatusId: string;
    cashPaidThroughId: string;
    expenseReportId: string;
    expenseStatusId: string;
    billReceiptId: string;
    claimReimbursement: boolean;
    merchantId: string;
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
    branchId: string;
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
    cronExpressionId: string;
    cronExpressionTimeStamp: any;
    jobId: string;
    expenseCategories: ExpenseManagementConfigurationModel[];
    claimedByUserId: string;
    expenseName: string;
    identificationNumber: string;
    filesCount: any;
    userId: string;
}

export class ExpenseManagementConfigurationModel {
    expenseCategoryConfigurationId: string;
    expenseCategoryId: string;
    amount: number;
    description: string;
    merchantId: string;
    expenseCategoryName: string;
}