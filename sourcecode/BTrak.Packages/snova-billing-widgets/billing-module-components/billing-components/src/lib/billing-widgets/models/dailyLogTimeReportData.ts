export class DailyLogTimeReportData {
    employeeName: string;
    officeSpentTime: string;
    loggedSpentTime: string;
    overStatusTime: string;
}
export  class DailyLogTimeReport {
    searchText: string ;
    selectedDate: string;
    branchId: string;
    lineManagerId: string;
    pageLoad:boolean;
    sample:any;
    entityId:string;
}

export function createStubDailyLogTimeReportData() {
    const data = new DailyLogTimeReportData();
    data.employeeName = 'Sravan Ayanoly';
    data.officeSpentTime = '10';
    data.loggedSpentTime = '0';
    return data;
}
        
