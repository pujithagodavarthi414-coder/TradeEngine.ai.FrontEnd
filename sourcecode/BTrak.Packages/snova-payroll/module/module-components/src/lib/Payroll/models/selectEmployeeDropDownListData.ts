export class SelectEmployeeDropDownListData {
    EmployeeId: string;
    EmployeeName: string;
}

export function createStubSelectEmployeeDropDownListData() {
    const selectEmployeeDropDownListData = new SelectEmployeeDropDownListData();
    selectEmployeeDropDownListData.EmployeeName = 'Sravan Ayanoly';

    return selectEmployeeDropDownListData;
}