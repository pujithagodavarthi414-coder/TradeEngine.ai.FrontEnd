import { ClientContactModel } from './client-contact.model';

export class ClientOutPutModel
{
    clientId: string;
    userId : string;
    firstName : string;
    lastName : string;
    fullName: string;
    avatarName: string;
    companyName: string;
    companyWebsite: string;
    note: string;
    ContactsOfClient : ClientContactModel[];
    userName: string;
    mobileNo: string;
    password: string;
    zipcode: string;
    street: string;
    city: string;
    state: string;
    countryId: string;
    countryName: string; 
    projectName: string;
    isArchived: boolean;
    timeStamp: string;
    userTimeStamp : string;
    profileImage : string;
    totalCount : number;

}
