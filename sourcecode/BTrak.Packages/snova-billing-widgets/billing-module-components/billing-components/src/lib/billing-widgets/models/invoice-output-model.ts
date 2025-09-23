export class InvoiceOutputModel {
    invoiceNumber: string;
    invoiceImageUrl: string;
    notes: string;
    terms: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    amountPaid: number;
    dueAmount: number;
    discount: any;
    bccEmail: string;
    ccEmail: string;
    po: string;
    title: string;
    invoiceTitle: string;
    status: string;
    colorCode: string;
    clientId: string;
    currencyId: string;
    clientName: string;
    projectName: string;
    createdDateTime: Date;
    createdByUserId: string;
    originalCreatedDateTime: Date;
    originalCreatedByUserId: string;
    inActiveDateTime: Date;
    versionNumber: number;
    totalInvoiceAmount: number;
    subTotalInvoiceAmount: number;
    invoiceDiscountAmount: number;
    timeStamp: string;
    id: string;
    scheduleName: string;
    city: string;
    companyName: string;
    zipcode: string;
    street: string;
    state: string;
    countryName: string;
    currencyCode: string;
    symbol: string;
    to: string;
    cc: string;
    bcc: string;
    invoiceTasks : InvoiceTasksModel[];
    invoiceItems : InvoiceItemsModel[];
    invoiceGoals : InvoiceGoalsModel[];
    invoiceProjects : InvoiceProjectsModel[];
    invoiceTax : InvoiceTaxModel[];
    isArchived : boolean;
    isForMail : boolean;
}

export class InvoiceTasksModel {
    invoiceTaskId: string;
    invoiceId: string;
    taskName: string;
    taskDescription: string;
    rate: number;
    hours: number;
    total: number;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number;
    order : number;
}
export class InvoiceItemsModel {
    invoiceItemId: string;
    invoiceId: string;
    itemName: string;
    itemDescription: string;
    price: number;
    quantity: number;
    total: number;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number;
    order : number;
}
export class InvoiceGoalsModel {
    invoiceGoalId: string;
    invoiceId: string;
    goalId: string;
    goalName: string;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}

export class InvoiceProjectsModel {
    invoiceProjectId: string;
    invoiceId: string;
    projectId: string;
    projectName: string;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}

export class InvoiceTaxModel {
    invoiceTaxId: string;
    invoiceId: string;
    tax: boolean;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}