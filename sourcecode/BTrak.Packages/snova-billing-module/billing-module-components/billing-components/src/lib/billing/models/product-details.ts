import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class ProductDetails extends SearchCriteriaInputModelBase{
    productDetailsId: string;
    productId: string;
    productName: string;
    productCode: string;
    supplierId: string;
    manufacturerCode: string;
    isArchived: boolean;
    searchProductCode: string;
    searchManufacturerCode: string;
    createdDate: Date;
    createdOn: Date;
    supplierName: Date;
    createdByUserId: string;
    updatedByUserId: string;
    updatedDateTime: Date;
    totalCount: number;
    timeStamp: any;
    entityId: string;
}