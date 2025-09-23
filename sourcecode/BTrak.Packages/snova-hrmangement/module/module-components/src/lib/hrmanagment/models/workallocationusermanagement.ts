export class WorkAllocationUserManagement {
    EmployeeName: string;
    MaxAllocatedWork: string;
    MinAllocatedWork: string;
    Edit: string;
}

export function createStubWorkallocationUserManagement() {
    const workAllocationUserManagement = new WorkAllocationUserManagement();

    workAllocationUserManagement.EmployeeName = 'Bala Koti';
    workAllocationUserManagement.MaxAllocatedWork = '20';
    workAllocationUserManagement.MinAllocatedWork = '15';
    workAllocationUserManagement.Edit = '';

    return workAllocationUserManagement;
}

