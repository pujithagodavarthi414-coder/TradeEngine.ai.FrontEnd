export class SelectEmployeeDropDownList {
    EmployeeId: string;
    EmployeeName: string;
}
export function createStubSelectEmployeeDropDownList() {
    const selectEmployeeDropDownList = new SelectEmployeeDropDownList();

    selectEmployeeDropDownList.EmployeeName = 'Sravan Ayanoly';

    return selectEmployeeDropDownList;
}
