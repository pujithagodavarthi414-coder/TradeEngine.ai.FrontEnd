export class TestSuitesSectionsList {
    TestSuiteSectionId: string;
    TestSuiteSectionName: string;
    Casecount:number;
    TestSuiteCases: TestSuitecases[];
  }
export class TestSuitecases{
    TestSuiteCaseId: string;
    TestSuiteCaseName: string;
}
  export function createStubTestSuitessectionsList() {
    const testSuitecases = new TestSuitecases();
    testSuitecases.TestSuiteCaseId = 'C14753';
    testSuitecases.TestSuiteCaseName = '	User should able to log into the account if the Email and password is valid';
    const caseslist =[testSuitecases,testSuitecases,testSuitecases,testSuitecases,testSuitecases,testSuitecases,testSuitecases];
   const testSuitessectionsList = new TestSuitesSectionsList();
   testSuitessectionsList.TestSuiteSectionId = '';
   testSuitessectionsList.TestSuiteSectionName = 'Log in functionality';
   testSuitessectionsList.TestSuiteCases = caseslist;
   testSuitessectionsList.Casecount=7;
   return testSuitessectionsList;
}
