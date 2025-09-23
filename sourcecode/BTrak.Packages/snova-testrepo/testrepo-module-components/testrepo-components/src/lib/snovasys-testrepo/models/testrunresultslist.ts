export class TestrunResultsList {
    TestRunResultId: string;
    TestRunResultName: string;
    BlockedTestcasesCount: number;
    PassedTestCasesCount: number;
    UntestedTestCasesCount: number;
    ResetTestCasesCount: number;
    FailedTestCasesCount: number;
    CreatedBy:string;
    CreatedOn:string;
  }
  export function createStubtestrunsresultsList() {
   const testrunresult = new TestrunResultsList();
   testrunresult.TestRunResultId = '1001';
   testrunresult.TestRunResultName = 'Regression Pack';
   testrunresult.BlockedTestcasesCount = 0;
   testrunresult.PassedTestCasesCount = 13;
   testrunresult.UntestedTestCasesCount = 727;
   testrunresult.ResetTestCasesCount = 0;
   testrunresult.FailedTestCasesCount = 8;
   testrunresult.CreatedOn = '11/15/2018';
   testrunresult.CreatedBy = 'srihari@snovasys.com';
   return testrunresult;
}


