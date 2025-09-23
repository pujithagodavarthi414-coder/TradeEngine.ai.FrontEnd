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