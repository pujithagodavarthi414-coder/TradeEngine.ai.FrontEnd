import { Injectable } from '@angular/core';
import { Observable, zip, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuditCompliance } from '../models/audit-compliance.model';
import { AuditCategory } from '../models/audit-category.model';
import { AuditConduct } from '../models/audit-conduct.model';
import { QuestionType } from '../models/question-type.model';
import { QuestionModel } from '../models/question.model';
import { QuestionsShiftModel } from '../models/questions-shift.model';
import { AuditReport } from '../models/audit-report.model';
import { AuditComplainceInputModel } from '../models/audit-details.model';
import { QuestionHistoryModel } from '../models/question-history.model';
import { ApiUrls } from '../dependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserModel } from '../dependencies/models/user';
import { HrBranchModel } from '../dependencies/models/hr-models/branch-model';
import { DashboardList } from '../dependencies/models/dashboardList';
import { AuditImpactModel, AuditRiskModel } from '../models/audit-impact.module';
import { AuditPriorityModel } from '../models/audit-priority.module';
import { CustomFormFieldModel } from '../models/custom-form-field.model';
import { EntityRoleFeatureModel } from '../dependencies/models/entityRoleFeature';
import { ActionCategory } from '../models/action-category.model';
import { AuditRating } from '../models/audit-rating.model';
import { CategoryModel } from '../models/reorder-model';

@Injectable({
    providedIn: 'root',
})

export class AuditService {
    private masterQuestionTypesData = new BehaviorSubject(null);
    private questionTypesData = new BehaviorSubject(null);
    private rolesData = new BehaviorSubject(null);
    private updatedAudit = new BehaviorSubject(null);
    redirectedConductId: string;

    constructor(private http: HttpClient) { }

    getConductQuestionsforActionLinking(projectId, questionName) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var paramsObj = new HttpParams().set("projectId", projectId).set("questionName", questionName);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsObj
        }

        return this.http.get(APIEndpoint + ApiUrls.GetConductQuestionsForActionLinking, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditRelatedCounts(projectId) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var paramsObj = new HttpParams().set("projectId", projectId);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsObj
        }

        return this.http.get(APIEndpoint + ApiUrls.GetAuditRelatedCounts, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getConductUserDropdown(isBranchFilter: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        var paramsObj = new HttpParams().set('isBranchFilter', isBranchFilter);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsObj
        }

        return this.http.get(APIEndpoint + ApiUrls.GetConductsUserDropDown, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getBrachDropdown(branch: HrBranchModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(branch);

        return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAudits(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SearchAudits, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAudit(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAudit, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditCompliances(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditCompliances, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditsFolderView(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditsFolderView, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getConductsFolderView(conduct: AuditConduct) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(conduct);

        return this.http.post(APIEndpoint + ApiUrls.GetConductsFolderView, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditFolders(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditFolders, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditCompliance(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditCompliance, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditFolder(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditFolder, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    createAuditVersion(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.CreateAuditVersion, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditRelatedVersions(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var paramsObj = new HttpParams().set("auditId", audit.auditId);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsObj
        };

        return this.http.get(APIEndpoint + ApiUrls.GetAuditRelatedVersions, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    cloneAudit(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.CloneAudit, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditTags(searchText: string, selectedIds: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        var paramsObj = new HttpParams().set("searchText", searchText).set("selectedIds", selectedIds);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsObj
        }

        return this.http.get(APIEndpoint + ApiUrls.GetTags, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditTags(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditTags, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditCategories(auditCategory: AuditCategory) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(auditCategory);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditCategories, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditCategoriesForConducts(auditCategory: AuditCategory) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(auditCategory);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditCategoriesForConducts, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchCategories(auditId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        let auditModel = new AuditCompliance();
        auditModel.auditId = auditId;
        auditModel.auditVersionId = null;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(auditModel);

        return this.http.post(APIEndpoint + ApiUrls.GetCategoriesAndSubcategories, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchVersionCategories(auditId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        let auditModel = new AuditCompliance();
        auditModel.auditId = null;
        auditModel.auditVersionId = auditId;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(auditModel);

        return this.http.post(APIEndpoint + ApiUrls.GetCategoriesAndSubcategories, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditCategory(auditCategory: AuditCategory) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(auditCategory);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditCategory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditConducts(audit: AuditConduct) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditConducts, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditConduct(audit: AuditConduct) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditConduct, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    reConductAudit(audit: AuditConduct) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.ReConductAudit, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    submitAuditConduct(audit: AuditConduct) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SubmitAuditConduct, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchMasterQuestionTypes(type: QuestionType) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(type);

        return this.http.post(APIEndpoint + ApiUrls.SearchMasterQuestionTypes, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchQuestionTypes(questionType: QuestionType) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(questionType);

        return this.http.post(APIEndpoint + ApiUrls.SearchQuestionTypes, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertQuestionType(questionType: QuestionType) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(questionType);

        return this.http.post(APIEndpoint + ApiUrls.UpsertQuestionType, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertMasterQuestionType(questionType: QuestionType) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(questionType);

        return this.http.post(APIEndpoint + ApiUrls.UpsertQuestionType, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditQuestion(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditQuestion, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditQuestions(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditQuestions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditConductQuestions(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditConductQuestions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchCustomFieldForms(question: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.SearchCustomFieldForms, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchActionsByQuestionId(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.SearchConductQuestionActions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }


    updatecustomField(customField: CustomFormFieldModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(customField);

        return this.http.post(APIEndpoint + ApiUrls.UpsertCustomFieldForm, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    submitConductQuestion(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.SubmitAuditConductQuestion, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    moveQuestionsToCategory(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.MoveAuditQuestionsToAuditCategory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchQuestionsByFilters(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.GetQuestionsByFilters, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    copyOrMoveQuestions(copyOrMoveModel: QuestionsShiftModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(copyOrMoveModel);

        return this.http.post(APIEndpoint + ApiUrls.CopyOrMoveQuestions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditQuestionHistory(question: QuestionModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditQuestionHistory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditOverallActivity(question: QuestionHistoryModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(question);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditOverallHistory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    reOrderQuestions(questionIdList: string[]) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(questionIdList);

        return this.http.post(APIEndpoint + ApiUrls.ReOrderQuestions, body, httpOptions);
    }

    reOrderCategories(model: CategoryModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.ReorderCategories, body, httpOptions)
                    .pipe(map(result => {
                        return result;
                    }));
    }

    upsertAuditReport(reportModel: AuditReport) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(reportModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditReport, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchAuditReports(reportModel: AuditReport) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(reportModel);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditReports, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchUsers(userModel: UserModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(userModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchDetailedAuditReport(reportModel: AuditReport) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(reportModel);

        return this.http.post(APIEndpoint + ApiUrls.SearchAuditConductQuestions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    downloadOrSendPdfAuditReport(reportModel: AuditReport) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(reportModel);

        return this.http.post(APIEndpoint + ApiUrls.SendAuditReportAsPdf, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getMasterData() {
        return this.masterQuestionTypesData.asObservable();
    }

    assignMasterData(data) {
        this.masterQuestionTypesData.next(data);
    }

    clearMasterData() {
        this.masterQuestionTypesData.next(null);
    }

    assignUpdatedAudit(data) {
        this.updatedAudit.next(data);
    }

    getUpdatedAudit() {
        return this.updatedAudit.asObservable();
    }

    clearUpdatedAudit() {
        this.updatedAudit.next(null);
    }

    getQuestionTypeData() {
        return this.questionTypesData.asObservable();
    }

    assignQuestionTypeData(data) {
        this.questionTypesData.next(data);
    }

    clearQuestionTypeData() {
        this.questionTypesData.next(null);
    }

    getRolesData() {
        return this.rolesData.asObservable();
    }

    assignRolesData(data) {
        this.rolesData.next(data);
    }

    clearRolesData() {
        this.rolesData.next(null);
    }

    getSubmittedAudits(auditInputModel: AuditComplainceInputModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(auditInputModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchSubmittedAudits, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getNonComplainceAudits(auditInputModel: AuditComplainceInputModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.SearchNonCompalintAudits, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getComplainceAudits() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        return this.http.post(APIEndpoint + ApiUrls.SearchNonCompalintAudits, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditsByBranch(auditInputModel: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditByBranch, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditConductTimeline(auditInputModel: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditConductTimeline, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditImpact(auditInputModel: AuditImpactModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditImpact, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditRisk(auditInputModel: AuditRiskModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditRisk, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getActionCategories(catgeoryModel: ActionCategory) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(catgeoryModel);

        return this.http.post(APIEndpoint + ApiUrls.GetActionCategories, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertActionCategory(catgeoryModel: ActionCategory) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(catgeoryModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertActionCategory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditRatings(ratingModel: AuditRating) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(ratingModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditRatings, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditRating(ratingModel: AuditRating) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(ratingModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditRating, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditImpact(auditInputModel: AuditImpactModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditImpact, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditRisk(auditInputModel: AuditRiskModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditRisk, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAuditPriority(auditInputModel: AuditPriorityModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditPriority, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertAuditPriority(auditInputModel: AuditPriorityModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(auditInputModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditPriority, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    triggerJob(jobId: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        return this.http.get(APIEndpoint + ApiUrls.TriggerJob + '?jobId=' + jobId, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    downloadAuditsCsvTemplate() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var url = APIEndpoint + ApiUrls.DownloadAuditsCsvTemplate;
        return this.http.get(url, { responseType: "arraybuffer" });
    }

    downloadConductsCsvTemplate() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var url = APIEndpoint + ApiUrls.DownloadConductsCsvTemplate;
        return this.http.get(url, { responseType: "arraybuffer" });
    }

    ImportAuditFromCsv(formData, projectId) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };

        return this.http.post(APIEndpoint + ApiUrls.UploadAuditsFromCsv + '?projectId=' + projectId, formData, httpOptions);
    }

    ImportAuditFromExcel(formData, projectId) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };

        return this.http.post(APIEndpoint + ApiUrls.UploadAuditsFromExcel + '?projectId=' + projectId, formData, httpOptions);
    }

    ImportConductFromCsv(formData, projectId) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };

        return this.http.post(APIEndpoint + ApiUrls.UploadConductsFromCsv + '?projectId=' + projectId, formData, httpOptions);
    }

    GetAuditDataForJson(exportModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(exportModel);

        return this.http.post(APIEndpoint + ApiUrls.GetAuditDataForJson, body, httpOptions);
    }

    sendConductLinkToMails(model) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.SendConductLinkToMails, body, httpOptions);
    }

    exportAuditConduct(model) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.ExportAuditConduct, body, httpOptions);
    }

    GetCustomizedDashboardId(dashboard: DashboardList) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(dashboard);

        return this.http.post(APIEndpoint + ApiUrls.GetCustomizedDashboardId, body, httpOptions);
    }
    getDefaultWorkflows() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.post(APIEndpoint + ApiUrls.GetDefaultWorkflows, httpOptions);
    }
    upsertAuditQuestionHistory(dashboard: QuestionHistoryModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(dashboard);

        return this.http.post(APIEndpoint + ApiUrls.UpsertAuditQuestionHistory, body, httpOptions);
    }

    SubmitAuditCompliance(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this.http.post(APIEndpoint + ApiUrls.SubmitAuditCompliance, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPermittedEntityRoleFeaturesByUserId() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        var entityFeatureModel = new EntityRoleFeatureModel();
        let body = JSON.stringify(entityFeatureModel);

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };

        return this.http.post(APIEndpoint + ApiUrls.GetAllEntityRoleFeaturesByUserId, body, httpOptions);
    }

    downloadFile(filePath: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        let paramsobj = new HttpParams().set("filePath", filePath);
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
}