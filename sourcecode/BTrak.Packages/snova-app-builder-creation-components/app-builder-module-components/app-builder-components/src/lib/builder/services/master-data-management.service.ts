import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { Observable } from "rxjs/Observable"; 

import { FormSubmissionModel } from "../models/formsubmission.model";
import { CronExpressionModel } from "../models/cron-expression.model";
import { CustomHtmlAppModel } from "../models/custom-html-app.model";
import { CustomQueryModel } from "../models/custom-query.model";
import { CustomWidgetsModel } from "../models/custom-widget.model";
import { WidgetsModel } from "../models/widget.model";
import { ProcInputAndOutputModel } from "../models/proc-inputs-outputs.model";
import { GenericFormType } from '../components/genericform/models/generic-form-type-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CompanysettingsModel } from '../models/company-model';
import { ModuleDetailModel } from '../models/module-detail-model';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class MasterDataManagementService {

  private GET_All_ProcessDashboardStatuses = APIEndpoint + ApiUrls.GetAllButtonTypes;
  private Get_All_GenericFormTypes = APIEndpoint + ApiUrls.GetGenericFormTypes;
  private Get_All_CustomFormSubmission = APIEndpoint + ApiUrls.GetCustomFormSubmissions;
  private Upsert_CustomFormSubmission = APIEndpoint + ApiUrls.UpsertCustomFormSubmission;
  private GET_widget = APIEndpoint + ApiUrls.GetWidgets;
  private GET_Custom_widgets = APIEndpoint + ApiUrls.GetCustomWidgets;
  private Upsert_widget = APIEndpoint + ApiUrls.UpsertWidget;
  private Upsert_Import_widget = APIEndpoint + ApiUrls.UpsertImportWidget;
  private Upsert_Custom_widget = APIEndpoint + ApiUrls.UpsertCustomWidget;
  private Execute_Custom_query = APIEndpoint + ApiUrls.GetWidgetDynamicQueryResult;
  private Execute_Custom_query_filter = APIEndpoint + ApiUrls.GetWidgetFilterQueryBuilder;
  private Execute_Custom_widget_validator = APIEndpoint + ApiUrls.CustomWidgetNameValidator;
  private GET_Custom_appIsAddOrEditFeature = APIEndpoint + ApiUrls.GetAddOrEditCustomAppIsRequired;
  constructor(private http: HttpClient) { }

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


  getAllCustomFormSubmission(customFormType: FormSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(this.Get_All_CustomFormSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertCustomFormSubmission(customFormType: FormSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(customFormType);

    return this.http.post(this.Upsert_CustomFormSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getProcessDashboardStatuses() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(this.GET_All_ProcessDashboardStatuses, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getWidgets(widgetModel: WidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.GET_widget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertWidget(widgetModel: WidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Upsert_widget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertImportWidget(widgetModel: WidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Upsert_Import_widget, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getCustomWidgets(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.GET_Custom_widgets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAddOrEditCustomAppIsRequired() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(this.GET_Custom_appIsAddOrEditFeature, httpOptions)
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

  getProcData(procInputAndOutputModel: ProcInputAndOutputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(procInputAndOutputModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/GetProcData", body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCustomWidget(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Upsert_Custom_widget, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  GetCustomWidgetQueryResult(widgetModel: CustomQueryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Execute_Custom_query, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetQueryFilter(widgetModel: CustomQueryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Execute_Custom_query_filter, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetCustomWidgetValidator(widgetModel: CustomWidgetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(widgetModel);
    return this.http.post(this.Execute_Custom_widget_validator, body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  
  getAllCompanySettingsDetails(companysettingModel :CompanysettingsModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);
   
      return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);
  
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

  archiveCronExpression(cronExpressionModel: CronExpressionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(cronExpressionModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/RemoveSchedulingForCustomApp", body, httpOptions).pipe(map((result) => {
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

  upsertCustomHtmlApp(customHtmlAppModel: CustomHtmlAppModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(customHtmlAppModel);
    return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertCustomHtmlApp", body, httpOptions).pipe(map((result) => {
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
  getAllModule() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var moduleDetailModel = new ModuleDetailModel();
    moduleDetailModel.isForCustomApp = true;
    return this.http.post(APIEndpoint + "MasterData/MasterDataManagementApi/GetModulesList", moduleDetailModel, httpOptions).pipe(map((result) => {
      return result;
    }));
  }
}
