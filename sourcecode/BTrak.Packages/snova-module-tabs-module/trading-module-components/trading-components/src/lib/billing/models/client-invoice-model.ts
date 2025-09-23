import { SearchCriteriaInputModelBase } from './../../../common/models/searchCriteriaInputModelBase';

export class    GetClientInvoiceModel{
    invoiceNumber: string;
    notes: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    clientName: string;
    status: string;
    createdDateTime: Date;
    createdByUserId: string;
    originalCreatedDateTime: Date;
    originalCreatedByUserId: string;
    inActiveDateTime: Date;
    versionNumber: number;
    timeStamp: string;
    id: string;
    overdue: number;
    draft: number;
    outstanding: number;
    inputCommandGuid: string;
    inputCommandTypeGuid: string;
    CurrencyCode : string;
    Symbol : string
}