export class TestSuitesList {
    TestSuiteId: string;
    TestSuiteName: string;
    SectionsCount: number;
    TestCasesCount: number;
    ActiveTestCount: number;
  }
  export function createStubTestSuitesList() {
   const testsuitesList = new TestSuitesList();
   testsuitesList.TestSuiteId = '2001';
   testsuitesList.TestSuiteName = 'Sample test suite';
   testsuitesList.TestCasesCount = 123;
   testsuitesList.SectionsCount = 45;
   testsuitesList.ActiveTestCount = 6;
   return testsuitesList;
}
