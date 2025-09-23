import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiUrls } from '../constants/api-urls';
import { ProgramModel } from '../models/programs-model';
import { ValidationModel } from '../models/validation-model';
import { ProgressModel } from '../models/progress-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable()
export class LivesManagementService {
  constructor(private http: HttpClient) { }

  upsertProgram(program: ProgramModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(program);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertLivesProgram, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getPrograms(program: ProgramModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(program);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramBasicDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getProgramBasicDetails(programSearchInputModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(programSearchInputModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramBasicDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getESGIndicators(esgmodel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(esgmodel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetESGIndicators, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getPhasesandIndicatorsByProgramId(esgmodel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(esgmodel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetPhasesandIndicatorsByProgramId, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertESGIndicators(esgUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(esgUpsertModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertESGIndicator, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertValidatorDetails(validatorModel: ValidationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(validatorModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertValidatorDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getValidatorDetails(validatorModel: ValidationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(validatorModel);
    return this.http.post(APIEndpoint + ApiUrls.GetValidatorDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getProgramProgress(programProgress: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(programProgress);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramProgress, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  upsertProgramProgress(progressData : ProgressModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(progressData);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertProgramProgress, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  importPrograProgress(formData) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };
    return this.http
      .post(APIEndpoint + ApiUrls.ImportPrograProgress, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getESGIndicatorsDetails() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify({});
    return this.http
      .post(APIEndpoint + ApiUrls.GetESGIndicatorsDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getBudgetAndInvestments(program: ProgramModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(program);
    return this.http
      .post(APIEndpoint + ApiUrls.GetBudgetAndInvestments, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getBudgetAndInvestmentsBasedOnProgramId(program: ProgramModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(program);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramBudgetDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertBudgetAndInvestments(budgetAndInvestments: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(budgetAndInvestments);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertBudgetAndInvestments, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getProgramOverviewDetails(programDetails: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(programDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramOverviewDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateShowInerestOnProgram(programDetails: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(programDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.UpdateShowInerestOnProgram, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getUserLevelAccess(userLevelModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userLevelModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetUserLevelAccess, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getIndependentSmallholderCertification(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(model);
    return this.http
      .post(APIEndpoint + 'Lives/LivesApi/GetIndependentSmallholderCertification', body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getCountries() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(APIEndpoint+ 'TradeManagement/TradeApi/GetFormDropdowns?DropDownType=country', httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getLivesClientList() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(APIEndpoint+ 'TradeManagement/TradeApi/GetFormDropdowns?DropDownType=livesclientslist', httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getKPI1CertifiedSHFsLocation(searchData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchData);
    return this.http
      .post(APIEndpoint + ApiUrls.GetKPI1CertifiedSHFsLocation, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getffbProductivity(searchData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchData);
    return this.http
      .post(APIEndpoint + ApiUrls.GetKPI2FFBProductivityPhase01Location, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  } 

  getImprovementFFBProductivity(searchData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchData);
    return this.http
      .post(APIEndpoint + ApiUrls.GetImprovementFFBProductivity, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getKPI3LogisticalProblemLocation(searchData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchData);
    return this.http
      .post(APIEndpoint + ApiUrls.GetKPI3LogisticalProblemLocation, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getIncrementInSmallholdersEarnings(searchData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchData);
    return this.http
      .post(APIEndpoint + ApiUrls.GetIncrementInSmallholdersEarnings, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getProgramPhases(phaseModle) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(phaseModle);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProgramPhase, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertProgramPhase(phaseUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(phaseUpsertModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertProgramPhase, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

}