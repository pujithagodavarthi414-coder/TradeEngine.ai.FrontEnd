export class InvoiceLogPayment {
    invoiceId: string;
    paidAccountToId: string;
    paidAccountToName: string;
    amount: number;
    date: Date;
    paymentMethodId: string;
    paymentMethodName: string;
    referenceNumber: string;
    notes: string;
    searchText: string;
    sendReceiptTo: boolean;
    isArchived: boolean;
}