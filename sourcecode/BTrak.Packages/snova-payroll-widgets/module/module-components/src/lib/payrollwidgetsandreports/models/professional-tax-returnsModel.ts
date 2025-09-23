import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class ProfessionalTaxReturnsMonthly extends SearchCriteriaInputModelBase {
    ranges: string;
    companyName: string;
    address: string;
    noOfEmployee: number;
    taxAmount: any;
    totalTax: any
    totalRecordsCount: number;
}