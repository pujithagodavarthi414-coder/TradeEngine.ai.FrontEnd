export class EstimateOutputModel {
    estimateNumber: string;
    estimateImageUrl: string;
    notes: string;
    terms: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    discount: any;
    bccEmail: string;
    ccEmail: string;
    po: string;
    title: string;
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
    totalEstimateAmount: number;
    subTotalEstimateAmount: number;
    estimateDiscountAmount: number;
    timeStamp: string;
    id: string;
    scheduleName: string;
    city: string;
    companyName: string;
    zipcode: string;
    street: string;
    state: string;
    countryName: string;
    CurrencyCode: string;
    Symbol: string;
    estimateTasks : EstimateTasksModel[];
    estimateItems : EstimateItemsModel[];
    estimateGoals : EstimateGoalsModel[];
    estimateProjects : EstimateProjectsModel[];
    estimateTax : EstimateTaxModel[];
    isArchived : boolean;
}

export class EstimateTasksModel {
    estimateTaskId: string;
    estimateId: string;
    taskName: string;
    taskDescription: string;
    rate: number;
    hours: number;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}
export class EstimateItemsModel {
    estimateItemId: string;
    estimateId: string;
    itemName: string;
    itemDescription: string;
    price: number;
    quantity: number;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}
export class EstimateGoalsModel {
    estimateGoalId: string;
    estimateId: string;
    goalId: string;
    goalName: string;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}

export class EstimateProjectsModel {
    estimateProjectId: string;
    estimateId: string;
    projectId: string;
    projectName: string;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}

export class EstimateTaxModel {
    estimateTaxId: string;
    estimateId: string;
    tax: boolean;
    isArchived: boolean;
    timeStamp: string;
    totalCount : number
}