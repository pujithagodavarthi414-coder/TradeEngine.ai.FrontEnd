import { AuditCategory } from "./audit-category.model";
import { QuestionModel } from "./question.model";

export class AuditReport {
    auditReportId: string;
    projectId: string;
    auditReportName: string;
    auditReportDescription: string;
    conductId: string;
    conductName: string;
    auditRatingId: string;
    auditRatingName: string;
    
    pdfUrl: string;
    to: string;
    cc: string;
    bcc: string;
    createdByUserId: string;
    createdByUserName: string;
    createdByProfileImage: string;

    hierarchyTree: AuditCategory[];
    questionsForReport: QuestionModel[];
    questions: QuestionModel[];

    isArchived: boolean;
    isToSendMail: boolean;
    isConductArchived: boolean;

    questionsCount: number;
    answeredCount: number;
    unAnsweredCount: number;
    conductScore: number;

    createdDateTime: Date;

    timeStamp: any;
}