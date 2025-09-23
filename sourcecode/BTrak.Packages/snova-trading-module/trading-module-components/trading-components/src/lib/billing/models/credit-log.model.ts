export class CreditLogModel {
    oldCreditLimit: number;
    newCreditLimit: number;
    oldAvailableCreditLimit: number;
    newAvailableCreditLimit: number;
    createdDateTime: string;
    createdUser: string;
    description: string;
    clientName: string;
    amount: number;
    isArchived: boolean;
    clientId: string;
}