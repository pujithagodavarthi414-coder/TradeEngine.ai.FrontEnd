export class CompanyPaymentUpsertModel{
    
    CardHolderName :string;
    SubscriptionType :string;
    CardHolderBillingAddress :string;
    CardNumber:any;
    CardExpiryDate:string;
    CardSecurityCode:string;
    TotalAmount:any;
    StripeTokenId:string;
    PlanName:string;
    StripeCustomerId:string;
    StripePaymentId:string;
    Status:string;
    NoOfPurchases:number;
    Email : string;
    AddressOptions : any;
}