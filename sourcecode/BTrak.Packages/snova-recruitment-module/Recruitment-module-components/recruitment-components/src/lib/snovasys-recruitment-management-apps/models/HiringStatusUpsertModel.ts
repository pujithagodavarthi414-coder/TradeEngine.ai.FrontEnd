export class HiringStatusUpsertModel {
    isArchived: any;
    timeStamp: any;
    hiringStatusId: string;
    status: string;
    color: string;
    order: number;
}

export class EmployeeConatctModel {
    employeeContactDetailId: string;
    employeeId: string;
    stateId: string;
    address1: string;
    address2: string;
    postalCode: string;
    countryId: string;
    homeTelephone: string;
    mobile: string;
    workTelephone: string;
    workEmail: string;
    otherEmail: string;
    contactPersonName: string;
    relationshipId: string;
    dateOfBirth: string;
    employeeContactTypeId: string;
    isArchived: boolean;
}
