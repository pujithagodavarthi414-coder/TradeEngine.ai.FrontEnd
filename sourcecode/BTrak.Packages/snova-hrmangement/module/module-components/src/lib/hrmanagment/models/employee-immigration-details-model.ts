export class EmployeeImmigrationDetailsModel{
    employeeImmigrationId: string;
    employeeId: string;
    document: string;
    documentNumber: string;
    issuedDate: Date;
    expiryDate: Date;
    eligibleStatus: string;
    countryId: string;
    eligibleReviewDate: Date;
    comments: string;
    activeFrom: Date;
    activeTo: Date;
    isArchived: boolean;

    firstName: string;
    surName: string;
    userName: string;
    email: string;
    countryName: string;
    timeStamp: any;
    totalCount: number
}