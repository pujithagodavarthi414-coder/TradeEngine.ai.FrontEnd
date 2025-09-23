import { Guid } from "guid-typescript";

export class BudgetModel {
    programId: Guid;
    programName: string;
    phase: string;
    district: string;
    targetArea: string;
    investmentReceived: any;
    budgetId: Guid;
    order: number;
    isArchived: boolean;
    formData: any;
}

export const SampleBudgetModel: BudgetModel[] = [
    {
        programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
        programName: 'SMILE PROGRAM ',
        budgetId: Guid.create(),
        phase: 'Phase 1',
        district: 'North Sumatera,Jambi,Riau',
        targetArea: ' 941 ha,684 ha,751 ha',
        investmentReceived: 'USD 22,000',
        order: 3,
        isArchived: false,
        formData: {
            entitiesInvolved: '',
            entitiesInvolved1: "24",
            entitiesInvolved2: "26",
            investmentReceivedUsd: '22,000',
            selectStage: "North Sumatera",
            selectStage1: "Jambi",
            selectStage2: "Riau",
            targetAreaDivisionInPhase01Ha: 941,
            targetAreaDivisionInPhase01Ha1: 684,
            targetAreaDivisionInPhase01Ha2: 751,
            targetShfDivisionInPhase01: 16,
            targetShfDivisionInPhase2: 18,
            targetShfDivisionInPhase3: 20,
            totalBudgetUsd: 1000,
            stakeholderName: '',
            investmentDate: '',
            balanceAmount: '500',
            investmentAmount: '22,000'
        }
    },
    {
        programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
        programName: 'SMILE PROGRAM ',
        budgetId: Guid.create(),
        phase: 'Phase 2',
        district: 'North Sumatera,Jambi,Riau',
        targetArea: ' 4,809 ha,2,261 ha,500 ha',
        investmentReceived: 'NA',
        order: 2,
        isArchived: false,
        formData: {
            entitiesInvolved: '',
            entitiesInvolved1: "24",
            entitiesInvolved2: "26",
            investmentReceivedUsd: 'NA',
            selectStage: "North Sumatera",
            selectStage1: "Jambi",
            selectStage2: "Riau",
            targetAreaDivisionInPhase01Ha: '4,809',
            targetAreaDivisionInPhase01Ha1: '2,261',
            targetAreaDivisionInPhase01Ha2: '500',
            targetShfDivisionInPhase01: 16,
            targetShfDivisionInPhase2: 18,
            targetShfDivisionInPhase3: 20,
            totalBudgetUsd: 1000,
            stakeholderName: '',
            investmentDate: '',
            balanceAmount: '500',
            investmentAmount: '22,000'
        }
    },
    {
        programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
        programName: 'SMILE PROGRAM ',
        budgetId: Guid.create(),
        phase: 'Phase 3',
        district: 'North Sumatera,Jambi,Riau',
        targetArea: ' 1,145 ha',
        investmentReceived: 'NA',
        order: 1,
        isArchived: false,
        formData: {
            entitiesInvolved: '',
            entitiesInvolved1: "24",
            entitiesInvolved2: "26",
            investmentReceivedUsd: 'NA',
            selectStage: "North Sumatera",
            selectStage1: "Jambi",
            selectStage2: "Riau",
            targetAreaDivisionInPhase01Ha: '1,145',
            targetAreaDivisionInPhase01Ha1: '',
            targetAreaDivisionInPhase01Ha2: '',
            targetShfDivisionInPhase01: 16,
            targetShfDivisionInPhase2: 18,
            targetShfDivisionInPhase3: 20,
            totalBudgetUsd: 1000,
            stakeholderName: '',
            investmentDate: '',
            balanceAmount: '500',
            investmentAmount: '22,000'
        }
    },

]