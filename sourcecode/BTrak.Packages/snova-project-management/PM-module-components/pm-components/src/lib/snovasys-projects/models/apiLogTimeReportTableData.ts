export class ApiLogTimeReportTableData {
  employeeName: string;
  officeSpentTime: string;
  loggedSpentTime: string;
}

export function createStubApiLogTimeReportTableData() {
  const data = new ApiLogTimeReportTableData();
  data.employeeName = "Sravan Ayanoly";
  data.officeSpentTime = "12";
  data.loggedSpentTime = "11";

  return data;
}
