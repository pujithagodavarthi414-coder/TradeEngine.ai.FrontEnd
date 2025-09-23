import { InvoiceFilterModel } from "./invoice-filter-model";

export class InvoiceInputModel {
    invoiceId: string;
    searchText: string;
    invoiceStatusId: string;
    invoiceStatusName: string;
    invoiceStatusColor: string;
    sortBy: string;
    pageSize: number;
    pageNumber: number;
    sortDirectionAsc: boolean;
    isArchived: boolean;
    invoiceFilter: InvoiceFilterModel[];
    projectActive: boolean
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