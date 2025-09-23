export class TestSuiteSection {
    testSuiteSectionId: string;
    testSuiteId: string;
    sectionName: string;
    description: string;
    parentSectionId: string;
    isArchived: boolean;
    timeStamp: any;
}

export class TestSuiteSectionList {
    testSuiteSectionId: string;
    testSuiteId: string;
    sectionName: string;
    description: string;
    casesCount: number;
    totalCount: number;
}

export class TestSuiteCases {
    testSuiteName: string;
    testSuiteId: string;
    description: string;
    testRunSelectedCases: string[];
    testRunSelectedSections: string[];
    sections: TestSuiteSections[];
}

export class TestSuiteSections {
    sectionName: string;
    sectionId: string;
    sectionLevel: number;
    testSuiteId: string;
    description: string;
    casesCount: number;
    parentSectionId: string;
    testCases: TestCasesModel[];
    subSections: TestSuiteSections[];
    timeStamp: any;
}

export class TestCasesModel {
    testCaseId: string;
    title: string;
    testCaseIdentity: string;
    timeStamp: any;
}

export class TestSuiteRunSections {
    testSuiteId: string;
    sectionId: string;
    testRunId: string;
    isArchived: boolean;
    isIncludeAllCases: any;
    includeRunCases: any;
    isSectionsRequired: any;
}