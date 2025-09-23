import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AccessibleIpAddressUpsertModel } from "../models/ipaddress-type-model";
import { ScriptsUpsertModel } from "../models/scripts-model";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ExpenseCategoryModel, MerchantModel } from '../models/merchant-model';
import { AppsettingsModel } from '../models/hr-models/appsetting-model';
import { TimeConfiguration } from '../models/hr-models/time-configuration-model';
import { CompanysettingsModel, ModuleDetailsModel } from '../models/company-model';
import { GenericFormType } from '../models/generic-form-type-model';
import { TesttypeModel } from '../models/testtype-model';
import { ApiUrls } from '../constants/api-urls';
import { Dashboard } from '@thetradeengineorg1/snova-custom-fields/lib/custom-fields/models/dashboard';
import { PayRollTemplateModel } from '../models/branch';
import { TimeSheetSubmissionModel } from '../models/TimeSheetSubmissionModel';
import { UploadProfileImageModel } from '../models/upload-profile-image-model';
import { StoreSearchModel } from '../models/store-search-model';
import { EmployeeInductionModel, InductionModel } from '../models/employee-induction.model';
import { FormSubmissionModel } from '../models/formsubmission.Model';
import { CustomQueryModel } from '../models/hr-models/custom-query-model';
import { UserStory } from '../models/userStory';
import { HtmlTemplateModel } from '../models/htmltemplate-type-model';
import { CustomWidgetsModel } from '../models/hr-models/custom-widget-model';
import { CustomHtmlAppModel } from '../models/hr-models/custom-html-app-model';
import { WidgetsModel } from '../models/hr-models/widget-model';
import { ProcInputAndOutputModel } from '../models/proc-inputs-outputs-model';
import { CronExpressionModel } from '../models/cron-expression-model';
import { RoleSearchCriteriaInputModel } from '../models/projects/roleSearchCriteria';
import { CustomTagsModel, CustomTagModel } from '../models/customTagsModel';
import { CompanyHierarchyModel } from '../models/company-hierarchy-model';
import { TaxCalculationTypeModel } from '../models/taxcalculationtypemodel';
import { BusinessUnitModel } from '../models/business-unit-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { TimeSheetIntervalModel } from "../models/timesheet-interval.model";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class MasterDataManagementService {
  private GET_Ip_Address = APIEndpoint + ApiUrls.GetAccessibleIpAddresses;
  private Upsert_IpAddresses = APIEndpoint + ApiUrls.UpsertAccessibleIpAddresses;
  private GET_All_Appsettings = APIEndpoint + ApiUrls.GetAppsettings;
  private Upsert_Appsettings = APIEndpoint + ApiUrls.UpsertAppSetting;
  private GET_ALL_Companysettings = APIEndpoint + ApiUrls.GetCompanysettings;
  private Get_All_GenericFormTypes = APIEndpoint + ApiUrls.GetGenericFormTypes;
  private Get_All_Configuration_Settings = APIEndpoint + ApiUrls.GetTestRailConfigurations;
  private Upsert_Configuration_Settings = APIEndpoint + ApiUrls.UpsertTestRailConfiguration;
  private GET_ALL_CompanySettingsDetails = APIEndpoint + ApiUrls.GetCompanySettingsDetails;
  private Upsert_FormType = APIEndpoint + ApiUrls.UpsertGenericFormType;
  private Get_ALL_Testcasestatus = APIEndpoint + ApiUrls.GetAllTestCaseStatuses;
  private Upsert_Testcasestatus = APIEndpoint + ApiUrls.UpsertTestCaseStatusMasterValue;
  private Upsert_TestType = APIEndpoint + ApiUrls.UpsertTestCaseTypeMasterValue;
  private Get_ALL_TestType = APIEndpoint + ApiUrls.GetAllTestCaseTypes;

  private GET_Scripts = APIEndpoint + ApiUrls.GetScripts;
  private Upsert_Script = APIEndpoint + ApiUrls.UpsertScript;

  constructor(private http: HttpClient) { }

  getIpAddress(ipAddressesTypeInputModel: AccessibleIpAddressUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ipAddressesTypeInputModel);

    return this.http.post(this.GET_Ip_Address, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getScript(scriptsInputModel: ScriptsUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(scriptsInputModel);

    return this.http.post(this.GET_Scripts, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertScript(scriptsInputModel: ScriptsUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(scriptsInputModel);

    return this.http.post(this.Upsert_Script, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  deleteScript(scriptId: string){
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.DelteScript}?scriptId=` + scriptId, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertIpAddress(ipAddressesTypeInputModel: AccessibleIpAddressUpsertModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ipAddressesTypeInputModel);

    return this.http.post(this.Upsert_IpAddresses, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }


  searchMerchants(merchantsSearchModel: MerchantModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantsSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchMerchants, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchExpenseCategories(expenseCategoriesSearchModel: ExpenseCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoriesSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchExpenseCategories, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }


  upsertExpenseCategory(expenseCategoryModel: ExpenseCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertExpenseCategory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMerchant(merchantModel: MerchantModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertMerchant, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }


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

  getAllCompanySettings(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(`${this.GET_ALL_Companysettings}`, body, httpOptions);
  }

  getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(`${this.GET_ALL_CompanySettingsDetails}`, body, httpOptions);
  }

  upsertFormType(genericFormType: GenericFormType) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(genericFormType);

    return this.http.post(this.Upsert_FormType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllFormTypes(genericFormType: GenericFormType) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(genericFormType);

    return this.http.post(this.Get_All_GenericFormTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllTestCaseStatus(testtypeModel: TesttypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(this.Get_ALL_Testcasestatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTestcasestatus(testtypeModel: TesttypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(this.Upsert_Testcasestatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }


  getAllTestCaseTypes(testtypeModel: TesttypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(this.Get_ALL_TestType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTestcase(testtypeModel: TesttypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(this.Upsert_TestType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UploadFile(formData, moduleTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  DownloadFile(scriptName,version){
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.DownloadFile}?scriptName=` + scriptName +'&version='+ version, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateDashboardName(dashboardModel: Dashboard) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(dashboardModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
  }


  getAllPayRollTemplates(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetPayRollTemplates}`, body, httpOptions);
  }

  getCompanyHierarchy(companyStructureInputModel:CompanyHierarchyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyStructureInputModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetCompanyHierarchicalStructure}`, body, httpOptions);
  }

  getBusinessUnits(businessUnitModel:BusinessUnitModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(businessUnitModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetBusinessUnits}`, body, httpOptions);
  }

  upsertCompanyHierarchy(companyStructureInputModel:CompanyHierarchyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyStructureInputModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertCompanyStructure}`, body, httpOptions);
  }

  upsertBusinessUnit(businessUnitModel: BusinessUnitModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(businessUnitModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertBusinessUnit}`, body, httpOptions);
  }

  upsertPayRollTemplate(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertPayRollTemplate}`, body, httpOptions);
  }

  getUserCountry() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(APIEndpoint + ApiUrls.GetUserCountry, httpOptions)
  }

  getAllModulesList(moduleDetailsModel: ModuleDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetModulesList}`, body, httpOptions);
  }
  
  getCompanyDocumentsSettings(companySettingsModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companySettingsModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetDocumentStorageSettings}`, body, httpOptions);
  }

  upsertCompanyModule(moduleDetailsModel: ModuleDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertCompanyModule}`, body, httpOptions);
  }


  upsertCompanysettings(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertCompanysettings}`, body, httpOptions);
  }


  getTimeSheetSubmission(timeSheetSubmissionNodel: TimeSheetSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetSubmissionNodel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetTimeSheetSubmissions}`, body, httpOptions);
  }

  getTimeSheetInterval(timeSheetIntervalModel: TimeSheetIntervalModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetIntervalModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetTimeSheetIntervals}`, body, httpOptions);
  }

  upsertTimeSheetInterval(timeSheetIntervalModel: TimeSheetIntervalModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetIntervalModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertTimeSheetInterval}`, body, httpOptions);
  }

  upsertTimeSheetSubmission(timeSheetSubmissionNodel: TimeSheetSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeSheetSubmissionNodel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertTimeSheetSubmission}`, body, httpOptions);
  }

  upsertCompanyLogo(uploadProfileImageModel: UploadProfileImageModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(uploadProfileImageModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertCompanyLogo}`, body, httpOptions);
  }

  getAllCompanyModulesList(moduleDetailsModel: ModuleDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moduleDetailsModel);

    return this.http.post(`${APIEndpoint + ApiUrls.GetCompanyModulesList}`, body, httpOptions);
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

  getAddOrEditCustomAppIsRequired() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(APIEndpoint + ApiUrls.GetAddOrEditCustomAppIsRequired, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getStores(storeSearchModel: StoreSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetStores, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetEmployeeInductions(induction: EmployeeInductionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(induction);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeInductions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertInductionConfiguration(induction: InductionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(induction);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInductionConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllInductionConfigurations(induction: InductionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(induction);

    return this.http.post(APIEndpoint + ApiUrls.GetInductionConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertCustomFormSubmission(customFormType: FormSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(APIEndpoint + ApiUrls.UpsertCustomFormSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllCustomFormSubmission(customFormType: FormSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(APIEndpoint + ApiUrls.GetCustomFormSubmissions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetQueryResult(widgetModel: CustomQueryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.GetWidgetDynamicQueryResult, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertRecurringUserStory(recurringUserStoryModel: UserStory) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(recurringUserStoryModel);

    return this.http.post(APIEndpoint + "UserStory/UserStoryApi/UpsertRecurringUserStory", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  getGenericApiData(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(model);
    return this.http.post(APIEndpoint + "BusinessSuite/BusinessSuiteApi/UpsertData", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertHtmlTemplate(htmlTemplateModel: HtmlTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(htmlTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertHtmlTemplate, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getHtmlTemplate(htmlTemplateModel: HtmlTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(htmlTemplateModel);

    return this.http.post(APIEndpoint + ApiUrls.GetHtmlTemplates, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCustomWidgets(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.GetCustomWidgets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCustomHtmlApp(customHtmlAppModel: CustomHtmlAppModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(customHtmlAppModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertCustomHtmlApp", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertWidget(widgetModel: WidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertWidget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getWidgets(widgetModel: WidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.GetWidgets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCustomWidgetProcDetails(procInputAndOutputModel: ProcInputAndOutputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(procInputAndOutputModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/GetProcInputsandOutputs", body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCronExpression(cronExpressionModel: CronExpressionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(cronExpressionModel);
    return this.http.post(APIEndpoint + "Widgets/CronExpression/UpsertCronExpression", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertProcInputsAndOutputs(procInputAndOutputModel: ProcInputAndOutputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(procInputAndOutputModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertProcInputsandOutputs", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertCustomWidget(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertCustomWidget, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  GetCustomWidgetValidator(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + ApiUrls.CustomWidgetNameValidator, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  getActTrackerRecorder() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetActTrackerRecorder, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  GetallRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
    let body = JSON.stringify(data);

    return this.http
      .post(`${APIEndpoint + "Roles/RolesApi/GetAllRoles"}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  
  searchCustomTags(searchText: string) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const customApplicationModel = new CustomTagsModel();
    customApplicationModel.searchTagText = searchText;
    const body = JSON.stringify(customApplicationModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.GetCustomApplicationTag}`,
      body,
      httpOptions
    );
  }
  
  getCustomTags(customTagsModel: CustomTagModel) {
    const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(customTagsModel);
    return this.http.post(APIEndpoint + ApiUrls.GetCustomTags, body, httpOptions)
        .pipe(map((result) => {
            return result;
        }));
}

upsertCustomTag(customTagsModel: CustomTagModel) {
  const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  const body = JSON.stringify(customTagsModel);
  return this.http.post(APIEndpoint + ApiUrls.UpsertCustomTags, body, httpOptions)
      .pipe(map((result) => {
          return result;
      }));
}

getTaxCalculationTypes(taxCalculationTypeModel: TaxCalculationTypeModel) {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  let body = JSON.stringify(taxCalculationTypeModel);

  return this.http.post(`${APIEndpoint + ApiUrls.GetTaxCalculationTypes}`, body, httpOptions);
}
getReportingPersonsExistsOrNot() {
  const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
  };
  return this.http.post(APIEndpoint + ApiUrls.GetIsHavingEmployeereportMembers, httpOptions)
      .pipe(map(result => {
          return result;
      })
      );
}

}
