    export class UserManagement {
    Name: string;
    Email: string;
    Role: string;
    Branch: string;
    IsActive: string;
    IsAdmin: string;
    Action: string;
}

export function createStubUserManagement() {
    const userManagement = new UserManagement();

    userManagement.Name = 'Bala Koti';
    userManagement.Email = 'balakoti@snovasys.com';
    userManagement.Role = 'UI Designer';
    userManagement.Branch = 'Hyderabad';
    userManagement.IsActive = 'True';
    userManagement.IsAdmin = 'False';
    userManagement.Action = 'Edit';

    return userManagement;
}
