import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeDependentContactSearchModel extends SearchCriteriaInputModelBase{
    contactId: string;
    employeeId: string;
    relationshipId: string;
    lastName: string;
    firstName: string;
    otherRelation: string;
    homeTelephone: string;
    mobileNo: string;
    workTelephone: string;
    isEmergencyContact: boolean;
    isDependentContact: boolean;
    addressStreetOne: string;
    addressStreetTwo: string;
    zipOrPostalCode: string;
    stateOrProvinceId: string;
    countryId: string;
    employeeDependentId: string;
}