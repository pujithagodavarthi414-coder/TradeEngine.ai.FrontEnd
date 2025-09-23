import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppsettingsModel } from '../models/hr-models/appsetting-model';
import { CompanysettingsModel, ModuleDetailsModel } from '../models/hr-models/company-model';
import { TimeConfiguration } from '../models/hr-models/time-configuration-model';
import { TimeSheetSubmissionModel } from '../models/TimeSheetSubmissionModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { UploadProfileImageModel } from '../models/upload-profile-image-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class MaterSettingService {

    constructor(private http: HttpClient) { }

    private GET_All_Appsettings = APIEndpoint + ApiUrls.GetAppsettings;
    private Upsert_Appsettings = APIEndpoint + ApiUrls.UpsertAppSetting;

    private GET_ALL_Companysettings = APIEndpoint + ApiUrls.GetCompanysettings;
    private GET_ALL_CompanySettingsDetails = APIEndpoint + ApiUrls.GetCompanySettingsDetails;
    private Upsert_Companysettings = APIEndpoint + ApiUrls.UpsertCompanysettings;
    
    private Get_All_Configuration_Settings = APIEndpoint + ApiUrls.GetTestRailConfigurations;
    private Upsert_Configuration_Settings = APIEndpoint + ApiUrls.UpsertTestRailConfiguration;
    private Upsert_TimeSheet_submission = APIEndpoint + ApiUrls.UpsertTimeSheetSubmission;
    private Get_TimeSheet_submission = APIEndpoint + ApiUrls.GetTimeSheetSubmissions;

    private GetModulesList = APIEndpoint + ApiUrls.GetModulesList;
    private GetCompanyModulesList = APIEndpoint + ApiUrls.GetCompanyModulesList;
    private UpsertCompanyModule = APIEndpoint + ApiUrls.UpsertCompanyModule;
    private UpsertCompanyLogo = APIEndpoint + ApiUrls.UpsertCompanyLogo;

    private Get_SoftLabel_Configurations = APIEndpoint + ApiUrls.GetSoftLabelConfigurations;
    private Upsert_SoftLabel_Configurations = APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations;

    getAllAppSettings(appsettingsModel: AppsettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(appsettingsModel);

    return this.http.post(`${this.GET_All_Appsettings}`, body, httpOptions);
  }

  upsertAppsettings(appsettingsModel: AppsettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(appsettingsModel);

    return this.http.post(`${this.Upsert_Appsettings}`, body, httpOptions);
  }

  getAllCompanySettings(companysettingModel :CompanysettingsModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);
   
      return this.http.post(`${this.GET_ALL_Companysettings}`, body, httpOptions);
  
  }

  getAllCompanySettingsDetails(companysettingModel :CompanysettingsModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);
   
      return this.http.post(`${this.GET_ALL_CompanySettingsDetails}`, body, httpOptions);
  
  }

  getAllModulesList(moduleDetailsModel :ModuleDetailsModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${this.GetModulesList}`, body, httpOptions);
  }

  getAllCompanyModulesList(moduleDetailsModel :ModuleDetailsModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${this.GetCompanyModulesList}`, body, httpOptions);
  }
  
  upsertCompanysettings(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(`${this.Upsert_Companysettings}`, body, httpOptions);
  }

  upsertCompanyLogo(uploadProfileImageModel: UploadProfileImageModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(uploadProfileImageModel);

    return this.http.post(`${this.UpsertCompanyLogo}`, body, httpOptions);
  }

  upsertCompanyModule(moduleDetailsModel: ModuleDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${this.UpsertCompanyModule}`, body, httpOptions);
  }

  getTimeConfigurationSettings(configurationSettingModel: TimeConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(configurationSettingModel);

    return this.http.post(`${this.Get_All_Configuration_Settings}`, body, httpOptions);
  }

  upsertTimeConfigurationSettings(configurationSettingModel: TimeConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(configurationSettingModel);

    return this.http.post(`${this.Upsert_Configuration_Settings}`, body, httpOptions);
  }

  GetTimeSheetSubmissionFrequency(searchText: string) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetTimeSheetSubmissionTypes, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertTimeSheetSubmission(timeSheetSubmissionNodel: TimeSheetSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetSubmissionNodel);

    return this.http.post(`${this.Upsert_TimeSheet_submission}`, body, httpOptions);
  }

  getTimeSheetSubmission(timeSheetSubmissionNodel: TimeSheetSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetSubmissionNodel);

    return this.http.post(`${this.Get_TimeSheet_submission}`, body, httpOptions);
  }

  getSoftLabelConfigurations(softLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabelConfigurationModel);

    return this.http.post(`${this.Get_SoftLabel_Configurations}`, body, httpOptions);
  }

  upsertSoftLabelConfigurations(softLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabelConfigurationModel);

    return this.http.post(`${this.Upsert_SoftLabel_Configurations}`, body, httpOptions);
  }
}
