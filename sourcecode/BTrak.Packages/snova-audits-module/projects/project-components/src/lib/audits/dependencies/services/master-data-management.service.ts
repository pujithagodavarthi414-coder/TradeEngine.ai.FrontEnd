import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AccessibleIpAddressUpsertModel } from "../models/ipaddress-type-model";
import { GenericFormType } from "../models/generic-form-type-model";
import { TesttypeModel } from "../models/testtype-model";

import { FormSubmissionModel } from "../models/formsubmission.Model";
import { UserStory } from "../models/userStory";
import { CronExpressionModel } from "../models/cron-expression-model";
import { CustomHtmlAppModel } from "../models/hr-models/custom-html-app-model";
import { CustomQueryModel } from "../models/hr-models/custom-query-model";
import { CustomWidgetsModel } from "../models/hr-models/custom-widget-model";
import { WeekdayModel } from "../models/hr-models/weekday-model";
import { WidgetsModel } from "../models/hr-models/widget-model";
import { HtmlTemplateModel } from "../models/htmltemplate-type-model";
import { ProcInputAndOutputModel } from "../models/proc-inputs-outputs-model";
import { StoreModel } from "../models/store-model";
import { StoreSearchModel } from "../models/store-search-model";
import { InductionModel } from "../models/induction.model";
import { EmployeeInductionModel } from "../models/employee-induction.model";
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class MasterDataManagementService {

  private GET_All_ProcessDashboardStatuses = ApiUrls.GetAllButtonTypes;
  private GET_Ip_Address = ApiUrls.GetAccessibleIpAddresses;
  private Upsert_IpAddresses = ApiUrls.UpsertAccessibleIpAddresses;
  private Get_All_GenericFormTypes = ApiUrls.GetGenericFormTypes;
  private Get_All_CustomFormSubmission = ApiUrls.GetCustomFormSubmissions;
  private Get_ALL_TestType = ApiUrls.GetAllTestCaseTypes;
  private Upsert_TestType = ApiUrls.UpsertTestCaseTypeMasterValue;
  private Get_ALL_Testcasestatus = ApiUrls.GetAllTestCaseStatuses;
  private Upsert_Testcasestatus = ApiUrls.UpsertTestCaseStatusMasterValue;
  private Upsert_FormType = ApiUrls.UpsertGenericFormType;
  private Upsert_CustomFormSubmission = ApiUrls.UpsertCustomFormSubmission;
  private GET_widget = ApiUrls.GetWidgets;
  private GET_Custom_widgets = ApiUrls.GetCustomWidgets;
  private Upsert_widget = ApiUrls.UpsertWidget;
  private Upsert_Custom_widget = ApiUrls.UpsertCustomWidget;
  private Execute_Custom_query = ApiUrls.GetWidgetDynamicQueryResult;
  private Execute_Custom_query_filter = ApiUrls.GetWidgetFilterQueryBuilder;
  private Execute_Custom_widget_validator = ApiUrls.CustomWidgetNameValidator;
  private Upsert_HtmlTemplate = ApiUrls.UpsertHtmlTemplate;
  private GET_Html_Template = ApiUrls.GetHtmlTemplate;
  private GET_Custom_appIsAddOrEditFeature = ApiUrls.GetAddOrEditCustomAppIsRequired;
  constructor(private http: HttpClient) { }

  getAllFormTypes(genericFormType: GenericFormType) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(genericFormType);

    return this.http.post(APIEndpoint + this.Get_All_GenericFormTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllInductionConfigurations(induction: InductionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(induction);

    return this.http.post(APIEndpoint + ApiUrls.GetInductionConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetEmployeeInductions(induction: EmployeeInductionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(induction);

    return this.http.post(APIEndpoint + ApiUrls.UpsertInductionConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllCustomFormSubmission(customFormType: FormSubmissionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(APIEndpoint + this.Get_All_CustomFormSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertCustomFormSubmission(customFormType: FormSubmissionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(APIEndpoint + this.Upsert_CustomFormSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertFormType(genericFormType: GenericFormType) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(genericFormType);

    return this.http.post(APIEndpoint + this.Upsert_FormType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getIpAddress(ipAddressesTypeInputModel: AccessibleIpAddressUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ipAddressesTypeInputModel);

    return this.http.post(APIEndpoint + this.GET_Ip_Address, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertIpAddress(ipAddressesTypeInputModel: AccessibleIpAddressUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(ipAddressesTypeInputModel);

    return this.http.post(APIEndpoint + this.Upsert_IpAddresses, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getProcessDashboardStatuses() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(APIEndpoint + this.GET_All_ProcessDashboardStatuses, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllTestCaseTypes(testtypeModel: TesttypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(APIEndpoint + this.Get_ALL_TestType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTestcase(testtypeModel: TesttypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(APIEndpoint + this.Upsert_TestType, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllTestCaseStatus(testtypeModel: TesttypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(APIEndpoint + this.Get_ALL_Testcasestatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTestcasestatus(testtypeModel: TesttypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(testtypeModel);

    return this.http.post(APIEndpoint + this.Upsert_Testcasestatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getWidgets(widgetModel: WidgetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.GET_widget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertWidget(widgetModel: WidgetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.Upsert_widget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCustomWidgets(widgetModel: CustomWidgetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.GET_Custom_widgets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAddOrEditCustomAppIsRequired() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(APIEndpoint + this.GET_Custom_appIsAddOrEditFeature, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCustomWidgetProcDetails(procInputAndOutputModel: ProcInputAndOutputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(procInputAndOutputModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/GetProcInputsandOutputs", body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCustomWidget(widgetModel: CustomWidgetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.Upsert_Custom_widget, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  getStores(storeSearchModel: StoreSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetStores, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetQueryResult(widgetModel: CustomQueryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.Execute_Custom_query, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetQueryFilter(widgetModel: CustomQueryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.Execute_Custom_query_filter, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetValidator(widgetModel: CustomWidgetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(APIEndpoint + this.Execute_Custom_widget_validator, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertStore(storeModel: StoreModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertStore, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCronExpression(cronExpressionModel: CronExpressionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(cronExpressionModel);
    return this.http.post(APIEndpoint + "Widgets/CronExpression/UpsertCronExpression", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  UpsertRecurringUserStory(recurringUserStoryModel: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(recurringUserStoryModel);

    return this.http.post(APIEndpoint + "UserStory/UserStoryApi/UpsertRecurringUserStory", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertProcInputsAndOutputs(procInputAndOutputModel: ProcInputAndOutputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(procInputAndOutputModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertProcInputsandOutputs", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  upsertCustomHtmlApp(customHtmlAppModel: CustomHtmlAppModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(customHtmlAppModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertCustomHtmlApp", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  getHtmlTemplate(htmlTemplateModel: HtmlTemplateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(htmlTemplateModel);

    return this.http.post(APIEndpoint + this.GET_Html_Template, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertHtmlTemplate(htmlTemplateModel: HtmlTemplateModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(htmlTemplateModel);

    return this.http.post(APIEndpoint + this.Upsert_HtmlTemplate, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getGenericApiData(model: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(model);
    return this.http.post(APIEndpoint + "BusinessSuite/BusinessSuiteApi/UpsertData", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }
  getAllWeekDays(weekDayModel: WeekdayModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(weekDayModel);

    return this.http.post(APIEndpoint + ApiUrls.GetWeekDays, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
