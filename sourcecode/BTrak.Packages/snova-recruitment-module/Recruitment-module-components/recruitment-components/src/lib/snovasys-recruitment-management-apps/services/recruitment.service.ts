import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobOpeningStatus } from '../models/jobOpeningStatus';
import { Currency } from '../models/currency';
import { JobOpeningStatusInputModel } from '../models/jobOpeningStatusInputModel';
import { CompanysettingsModel } from '../models/company-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Branch } from '../models/branch';
import { CurrencyModel } from '../models/currency-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserModel } from '../models/user-model';
import { User } from '../models/user';
import { EmployeeListModel } from '../models/employee-model';
import { SoftLabelConfigurationModel } from '../models/softlabelconfiguration.model';
import { SourceUpsertModel } from '../models/SourceUpsertModel';
import { CandidateDocumentModel } from '../models/candidate-document.model';
import { JobOpening } from '../models/jobOpening.model';
import { CandidateEducationModel } from '../models/candidate-education.model';
import { CandidateExperienceModel } from '../models/candidateexperience.model';
import { CandidateHistoryModel } from '../models/candidatehistory.model';
import { CandidateJobDetailComponent } from '../../snovasys-recruitment-management/component/candidate-job-detail.component';
import { CandidateJobDetailsModel } from '../models/candidatejobdetails.model';
import { InterviewScheduleModel } from '../models/interviewschedule.model';
import { InterviewFeedbackModel } from '../models/interviewfeedback.model';
import { InterviewWorkflowModel } from '../models/interviewconfiguration.model';
import { InterviewRoundsModel } from '../models/interviewRounds.model';
import { FeedbackCommentsModel } from '../models/interviewfeedbackComments.model';
import { DocumentTypeUpsertModel } from '../models/documentTypeUpsertModel';
import { EmployeeConatctModel, HiringStatusUpsertModel } from '../models/hiringStatusUpsertModel';
import { InterviewTypeUpsertModel } from '../models/InterviewTypeUpsertModel';
import { InterviewTypesModel } from '../../snovasys-recruitment-management/models/interviewTypesmodel';
import { RatingTypeUpsertModel } from '../models/ratingTypeUpsertModel';
import { CandidateUpsertModel } from '../../snovasys-recruitment-management/models/candidateUpsertModel';
import { CandidateSearchtModel } from '../../snovasys-recruitment-management/models/candidate-search.model';
import { InterviewProcessConfigurationModel } from '../models/InterviewProcessConfigurationModel';
import { InterviewProcessModel } from '../models/InterviewProcessModel';
import { SkillsModel } from '../models/skills.model';
import { CountrySearch } from '../../snovasys-recruitment-management/models/country-search.model';
import { DesigationSearch } from '../../snovasys-recruitment-management/models/designation-search.model';
import { RoleModel } from '../models/rolesdropdown.model';
import { JobTypesSearch } from '../../snovasys-recruitment-management/models/job-type-search.model';
import { EmployementStatusSearch } from '../../snovasys-recruitment-management/models/employement-status-search.model';
import { JobOpeningStausUpsert } from '../models/job-opening-status-upsert.model';
import { ScheduleStatusModel } from '../../snovasys-recruitment-management/models/scheduleStatus.model';
import { CandidateSearchCriteriaInputModel } from '../../snovasys-recruitment-management/models/candidate-input.model';
import { UpsertFileModel } from '@snovasys/snova-file-uploader/lib/dropzone/models/upsert-file-model';
import { DeleteFileInputModel } from '../../snovasys-recruitment-management/models/deleteFileInputModel';
import { CandidateSkillsModel } from '../models/candidateskills.model';
import { SearchFileModel } from '../../snovasys-recruitment-management/models/searchFileModel';



const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class RecruitmentService {
  UpsertCandidate = "Recruitment/RecruitmentApi/UpsertCandidate";
  GetCandidateInterviewFeedBackComments = "Recruitment/RecruitmentApi/GetCandidateInterviewFeedBackComments";
  UpsertCandidateInterviewFeedBackComments = "Recruitment/RecruitmentApi/UpsertCandidateInterviewFeedBackComments";


  constructor(private http: HttpClient) { }
  getStoreConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertMultipleFiles(fileModel: UpsertFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertMultipleFiles, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteFile(deleteFileInputModel: DeleteFileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(deleteFileInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.DeleteFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFiles(searchFileModel: SearchFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.SearchFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getJobOpenings(jobOpening: JobOpening) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(jobOpening)
    return this.http.post(APIEndpoint + ApiUrls.GetJobOpenings, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }
  getUsers(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.post(APIEndpoint + ApiUrls.GetUsers, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }
  upsertJobOpening(jobOpening: JobOpening) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(jobOpening);

    return this.http.post(APIEndpoint + ApiUrls.UpsertJobOpening, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  upsertSkills(skillsModel: SkillsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(skillsModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSkills, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  getSkills(skillsModel: SkillsModel): Observable<SkillsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(SkillsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetSkills, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetSkillsByCandidates(skillsModel: SkillsModel): Observable<SkillsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(skillsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetSkillsByCandidates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getLocations(branch: Branch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branch);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetLocations, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateDocuments(candidateDocumentModel: CandidateDocumentModel): Observable<CandidateDocumentModel[]> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(candidateDocumentModel);
    return this.http.post<CandidateDocumentModel[]>(APIEndpoint + ApiUrls.UpsertCandidateDocument, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateDocuments(candidateDocumentModel: CandidateDocumentModel): Observable<CandidateDocumentModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateDocumentModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateDocuments, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateEducation(candidateEducationModel: CandidateEducationModel): Observable<CandidateEducationModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateEducationModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCandidateEducation, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateEducation(candidateEducationModel: CandidateEducationModel): Observable<CandidateEducationModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateEducationModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateEducation, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateExperience(candidateExperienceModel: CandidateExperienceModel): Observable<CandidateExperienceModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateExperienceModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCandidateExperience, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateExperience(candidateExperienceModel: CandidateExperienceModel): Observable<CandidateExperienceModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateExperienceModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateExperience, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateHistory(candidateHistoryModel: CandidateHistoryModel): Observable<CandidateHistoryModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateHistoryModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateJobDetails(candidateJobDetailsModel: CandidateJobDetailsModel): Observable<CandidateJobDetailsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateJobDetailsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCandidate, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateJobDetails(JobDetailsModel: JobOpening): Observable<JobOpening[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(JobDetailsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateJobOpenings, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateSkills(candidateSkillsModel: CandidateSkillsModel): Observable<CandidateDocumentModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateSkillsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCandidateSkill, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateSkills(candidateSkillsModel: CandidateSkillsModel): Observable<CandidateDocumentModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateSkillsModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateSkills, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getJobOpeningStatus(jobOpeningStatusInputModel: JobOpeningStatusInputModel): Observable<JobOpeningStatusInputModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(jobOpeningStatusInputModel);
    return this.http.post<JobOpeningStatusInputModel[]>(APIEndpoint + ApiUrls.GetJobOpeningStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getInterviewProcessConfiguration(interviewWorkflowModel: InterviewProcessConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewWorkflowModel);
    return this.http.post<InterviewWorkflowModel[]>(APIEndpoint + ApiUrls.GetInterviewprocessConfiguration, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertInterviewProcessConfiguration(interviewWorkflowModel: InterviewProcessConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewWorkflowModel);
    return this.http.post<InterviewWorkflowModel[]>(APIEndpoint + ApiUrls.UpsertInterviewProcessConfiguration, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllRolesDropDown(roleModel: RoleModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify({});
    return this.http.get<RoleModel[]>(APIEndpoint + ApiUrls.GetAllRolesDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  reOrderInterviewProcessConfiguration(interviewProcessConfigurationModel: InterviewProcessConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewProcessConfigurationModel);
    return this.http.post<InterviewProcessConfigurationModel[]>(APIEndpoint + ApiUrls.UpsertInterviewProcessConfiguration, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getInterviewRounds(interviewRoundsModel: InterviewRoundsModel): Observable<InterviewRoundsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewRoundsModel);
    return this.http.post<InterviewRoundsModel[]>(APIEndpoint + ApiUrls.GetInterviewTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getSources(sourceInputModel: SourceUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(sourceInputModel);

    return this.http.post(APIEndpoint + ApiUrls.GetSources, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getDocumentTypes(documentTypeInputModel: DocumentTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTypeInputModel);

    return this.http.post(APIEndpoint + ApiUrls.GetDocumentTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getHiringStatus(hiringStatusInputModel: HiringStatusUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(hiringStatusInputModel);

    return this.http.post(APIEndpoint + ApiUrls.GetHiringStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getScheduleStatus(scheduleStatusInputModel: ScheduleStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(scheduleStatusInputModel);

    return this.http.post(APIEndpoint + ApiUrls.GetScheduleStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getInterviewType(interviewTypeUpsertModel: InterviewTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewTypeUpsertModel);

    return this.http.post(APIEndpoint + ApiUrls.GetInterviewType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getInterviewProcess(interviewProcessModel: InterviewProcessModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewProcessModel);

    return this.http.post(APIEndpoint + ApiUrls.GetInterviewprocess, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getInterviewProcessConfig(interviewProcessConfiguration: InterviewWorkflowModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewProcessConfiguration);

    return this.http.post(APIEndpoint + ApiUrls.GetInterviewprocessConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRatingTypes(ratingTypeUpsertModel: RatingTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ratingTypeUpsertModel);

    return this.http.post(APIEndpoint + ApiUrls.GetInterviewRatings, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertSource(sourceInputModel: SourceUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(sourceInputModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSource, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  upsertCandidateInterviewSchedule(interviewScheduleModel: InterviewScheduleModel): Observable<any> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(interviewScheduleModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCandidateInterviewSchedule, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateInterviewSchedule(interviewScheduleModel: InterviewScheduleModel): Observable<InterviewScheduleModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewScheduleModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateInterviewSchedule, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateInterviewFeedback(interviewFeedbackModel: InterviewFeedbackModel): Observable<any> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(interviewFeedbackModel);
    return this.http.post<InterviewFeedbackModel[]>(APIEndpoint + ApiUrls.UpsertCandidateInterviewFeedBack, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateInterviewFeedback(interviewFeedbackModel: InterviewFeedbackModel): Observable<InterviewFeedbackModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(interviewFeedbackModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidateInterviewFeedBack, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCandidateInterviewFeedbackComments(feedbackCommentsModel: FeedbackCommentsModel): Observable<FeedbackCommentsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(feedbackCommentsModel);
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetCandidateInterviewFeedBackComments, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertCandidateInterviewFeedbackComments(feedbackCommentsModel: FeedbackCommentsModel): Observable<FeedbackCommentsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(feedbackCommentsModel);
    return this.http.post<any[]>(APIEndpoint + ApiUrls.UpsertCandidateInterviewFeedBackComments, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getInterviewRatings(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.post(APIEndpoint + ApiUrls.GetInterviewRatings, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getCandidatesBySkill(candidateSearchCriteriaInputModel:CandidateSearchCriteriaInputModel): Observable<CandidateSearchCriteriaInputModel> {
    const httpOptions  = { 
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(candidateSearchCriteriaInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetCandidatesBySkill, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUserCandidateInterviewSchedules(): Observable<any> {
    const httpOptions  = { 
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    
    return this.http.get(`${APIEndpoint + ApiUrls.GetUserCandidateInterviewSchedules}`, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

  approveSchedule(interviewScheduleModel: InterviewScheduleModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewScheduleModel);

    return this.http.post(APIEndpoint + ApiUrls.ApproveSchedule, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertInterviewProcess(interviewProcessModel: InterviewProcessModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewProcessModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInterviewProcess, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertInterviewJobConfiguration(interviewProcessConfigurationModel: InterviewProcessConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewProcessConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInterviewProcessConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertDocumentType(documentTypeInputModel: DocumentTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(documentTypeInputModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertDocumentType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertHiringStatus(hiringStatusInputModel: HiringStatusUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(hiringStatusInputModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertHiringStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertInterviewType(interviewTypeUpsertModel: InterviewTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(interviewTypeUpsertModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInterviewType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertRatingType(ratingTypeUpsertModel: RatingTypeUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ratingTypeUpsertModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInterviewRating, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCurrencyList(): Observable<Currency[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let currencyModel = new CurrencyModel();
    currencyModel.isArchived = false;
    let body = JSON.stringify(currencyModel);
    return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBranchList(branchSearchResult: Branch): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);

  }

  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllCompanySettings(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCompanysettings, body, httpOptions);

  }

  GetAllUsers(): Observable<User[]> {
    var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true', isActive: true };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post<User[]>(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions
    );
  }

  GetUsersList(UserInputModel: UserModel): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(UserInputModel);
    return this.http.post<User[]>(APIEndpoint + ApiUrls.GetAllUsers,
      body,
      httpOptions
    );
  }

  GetUsersListByRoles(UserInputModel: UserModel): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(UserInputModel);
    return this.http.post<User[]>(APIEndpoint + ApiUrls.GetAllUsersByRoles,
      body,
      httpOptions
    );
  }

  getUsersDropDown(searchText: string) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertUser(userModel: UserModel): Observable<UserModel[]> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userModel);
    return this.http.post<UserModel[]>(APIEndpoint + ApiUrls.UpsertUser, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeById(employeeId: string) {
    let paramsobj = new HttpParams().set('employeeId', employeeId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetEmployeeById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getAllEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllEmployeesDetails(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployeesDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeePersonalDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertEmployeeContact(employeeModel: EmployeeConatctModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeeContactDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLoggedUserData() {
    return this.http.get<any[]>(`${APIEndpoint + ApiUrls.GetLoggedInUser}`);
  }

  getUserById(userId: string): Observable<UserModel[]> {
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getsoftLabelById(softLabelId: string) {
    let paramsObj = new HttpParams().set("softLabelId", softLabelId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertCandidate(candidateUpsert: CandidateUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(candidateUpsert);
    return this.http.post(APIEndpoint + ApiUrls.UpsertCandidate, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getCandisates(candidateSearchtModel: CandidateSearchtModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(candidateSearchtModel);
    return this.http.post(APIEndpoint + ApiUrls.GetCandidates, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getCountries(countrySearch: CountrySearch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(countrySearch);
    return this.http.post(APIEndpoint + ApiUrls.GetCountries, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getDesignation(designation: DesigationSearch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(designation);
    return this.http.post(APIEndpoint + ApiUrls.GetDesignations, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getJobTypes(jobTypes: JobTypesSearch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(jobTypes);
    return this.http.post(APIEndpoint + ApiUrls.GetJobTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getEmploymentStatus(employementStatus: EmployementStatusSearch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employementStatus);
    return this.http.post(APIEndpoint + ApiUrls.GetEmploymentStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  upsertJobOpeningStaus(jobOpeningStausUpsert: JobOpeningStausUpsert) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(jobOpeningStausUpsert);
    return this.http.post(APIEndpoint + ApiUrls.UpsertJobOpeningStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }


  sendOfferLetter(candidateModel: CandidateSearchtModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(candidateModel);
    return this.http.post(APIEndpoint + ApiUrls.SendOfferLetter, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  downloadOfferLetter(candidateModel: CandidateSearchtModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(candidateModel);
    return this.http.post(APIEndpoint + ApiUrls.downloadOfferLetter, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  cancelInterviewSchedule(interviewScheduleModel: InterviewScheduleModel): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(interviewScheduleModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.CancelInterviewSchedule, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getStates() {
    var data = { StateId: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetStates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  sendHiredDocumentsMail(candidateDocumentModel : CandidateDocumentModel ): Observable<CandidateDocumentModel []> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(candidateDocumentModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.HiredDocumentsList, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertComments(commentUserInputModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(commentUserInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertComments, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetBrytumViewJobDetails(jobDetailsModel: JobOpening) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(jobDetailsModel);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetBrytumViewJobDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
