export class PermissionsHistoryDetails {
    PermissionText: string;
    EditIcon: string;
    DeleteIcon: string;
}
export function createStubPermissionHistoryDetails() {
    const permissionHistoryDetails = new PermissionsHistoryDetails();

    permissionHistoryDetails.PermissionText = 'Sravan Ayanoly takes 1hr : 50min Permission on 17 - Jan - 2019 because of Last night late.';

    return permissionHistoryDetails;
}
