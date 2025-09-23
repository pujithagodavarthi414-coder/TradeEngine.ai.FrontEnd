export class ChangePasswordModel{
    userId: string;
    resetGuid: string;
    newPassword: string;
    confirmPassword: string;
    timeStamp: any;
    type: number;
    isArchived: boolean;
}