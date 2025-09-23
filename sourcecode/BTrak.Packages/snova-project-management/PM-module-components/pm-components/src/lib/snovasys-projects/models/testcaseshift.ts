export class TestCasesShift {
    sourceTestSuiteId: string;
    testSuiteId: string;
    testCasesList: any[];
    selectedSections: any[];
    isCopy: boolean;
    isCasesOnly: boolean;
    isHierarchical: boolean;
    isCasesWithSections: boolean;
    isAllParents: boolean;
    appendToSectionId: string;
    currentSectionId: string;
}

export class MoveTestCasesModel {
    testCaseIds: string[];
    sectionId: string;
    testSuiteId: string;
    isHierarchical: boolean;
    isCopy: boolean
}