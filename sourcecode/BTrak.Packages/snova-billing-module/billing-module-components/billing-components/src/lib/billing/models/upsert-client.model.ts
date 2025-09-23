import { ClientContactModel } from "./client-contact.model";


export class UpsertClientInputModel
{
    clientId: string;
    userId : string;
    fullName: string;
    companyName: string;
    companyWebsite: string;
    clientAddressId: string;
    ContactsOfClient : ClientContactModel[];
    zipcode: string;
    street: string;
    city: string;
    state: string;
    countryId: string;
    countryName: string; 
    isArchived: boolean;
    timeStamp: string;

}