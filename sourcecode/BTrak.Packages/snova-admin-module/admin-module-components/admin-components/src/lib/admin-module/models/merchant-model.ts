export class MerchantModel {
    merchantId: string;
    merchantName: string;
    description: string;
    isArchived: boolean;
    timeStamp: any;
    sortDirectionAsc: boolean;
}

export class ExpenseCategoryModel {
    expenseCategoryId: string;
    expenseCategoryName: string;
    description: string;
    accountCode: string;
    isSubCategory: boolean;
    isArchived: boolean;
    timeStamp: any;
}