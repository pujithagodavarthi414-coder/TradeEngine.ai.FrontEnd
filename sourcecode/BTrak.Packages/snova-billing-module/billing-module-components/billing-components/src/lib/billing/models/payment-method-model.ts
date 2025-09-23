import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class PaymentMethodModel extends SearchCriteriaInputModelBase {
    paymentMethodId : string;
    paymentMethodName : string;
    timeStamp : any;
}