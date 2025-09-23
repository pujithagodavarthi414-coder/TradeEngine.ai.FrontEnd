export class CreditNoteModel
{
    id: string;
    siteId: string;
    grdId: string;
    bankId: string;
    month: Date;
    startDate: Date;
    endDate: Date;
    entryDate: Date;
    year: Date;
    term: string;
    isTVAApplied: boolean;
    isArchived: boolean;
    isGenerateInvoice: boolean;
    timeStamp: any;
}