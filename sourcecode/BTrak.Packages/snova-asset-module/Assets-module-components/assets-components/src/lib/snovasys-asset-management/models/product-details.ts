import { SearchCriteriaInputModelBase } from './searchcriteriainputmodelbase';

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

export class CustomFormFieldModel {
    customFieldId: string;
    formName: string;
    formJson: string;
    formDataJson: string;
    createdDateTime: any;
    CreatedByUserId: string;
    UpdatedDateTime: Date;
    UpdatedByUserId: string;
    IsArchived: boolean;
    archivedDateTime: Date;
    archivedByUserId: string;
    isDeleted: boolean;
    timeStamp: any;
    formKeys: string;
    moduleTypeId: number;
    referenceId: string;
    referenceTypeId: string;
    fieldName: string;
    customFieldTimeStamp: any;
    customDataFormFieldId: string;
    formData: any;
    formCreatedDateTime: any;
}