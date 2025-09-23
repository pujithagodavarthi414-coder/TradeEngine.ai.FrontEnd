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
    countryCode: string; 
    projectName: string;
    isArchived: boolean;
    timeStamp: string;
    userTimeStamp : string;
    profileImage : string;
    totalCount : number;
    clientType: string;
    leadFormId: string;
    leadFormData: string;
    leadFormJson: string;
    contractFormId: string;
    contractFormData: string;
    contractFormJson: string;
    clientAddressId: string;
    kycDocument: string;
    clientAddressTimeStamp: string;
    roleId: any;
    email: string;
    isClientKyc: boolean;
    creditLimit: number;
    components: any[];
    isForLeadSubmission: boolean;
    availableCreditLimit: number;
    creditsAllocated: number;
}
