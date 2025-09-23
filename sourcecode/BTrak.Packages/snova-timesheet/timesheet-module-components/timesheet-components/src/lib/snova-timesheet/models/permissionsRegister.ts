export class PermissionsRegisterDetails {
    Date: string;
    EmployeeName: string;
    DateOfPermission: string;
    Duration: string;
    StatusOfLate: string;
    Review: string;
}

export function createStubPermissionRegisterDetails() {
    const permissionRegisterDetails = new PermissionsRegisterDetails();

    permissionRegisterDetails.Date = '18-Jan-2019';
    permissionRegisterDetails.EmployeeName = 'Sravan Ayanoly';
    permissionRegisterDetails.DateOfPermission = '22-Jan-2019';
    permissionRegisterDetails.Duration = '1 hour';
    permissionRegisterDetails.StatusOfLate = 'Test Status';
    permissionRegisterDetails.Review = 'Test Review';

    return permissionRegisterDetails;
}
