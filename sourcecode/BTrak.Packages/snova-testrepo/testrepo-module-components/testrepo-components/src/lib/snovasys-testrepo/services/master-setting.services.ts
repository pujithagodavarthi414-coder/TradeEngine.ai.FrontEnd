import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiUrls } from '../constants/api-urls';
import { AppsettingsModel } from '../models/appsetting-model';
import { CompanysettingsModel, ModuleDetailsModel } from '../models/company-model';
import { UploadProfileImageModel } from '../models/upload-profile-image-model';
import { TimeConfiguration } from '../models/time-configuration-model';
import { TimeSheetSubmissionModel } from '../models/TimeSheetSubmissionModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: 'root'
})

export class MaterSettingService {

  constructor(private http: HttpClient) { }

  getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);

  }

  getTimeConfigurationSettings(configurationSettingModel: TimeConfiguration) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(configurationSettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetTestRailConfigurations, body, httpOptions);
  }
}
