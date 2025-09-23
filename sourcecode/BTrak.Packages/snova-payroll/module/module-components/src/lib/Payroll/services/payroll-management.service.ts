import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PayrollRun } from '../models/payroll-run';
import { WorkflowTrigger } from '../models/workflow-trigger.model';
import { map } from 'rxjs/operators';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { PayrollStatus } from '../models/payroll-status';
import { Observable } from "rxjs";
import { CompanyRegistrationModel } from '../models/company-registration-model';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { PayRollComponentModel } from '../models/PayRollComponentModel';
import { PayRollTemplateConfigurationModel } from '../models/PayRollTemplateConfigurationModel';
import { EmploymentStatusSearchModel } from '../models/employment-status-search-model';
import { EmployeeListModel } from '../models/employee-list-model';
import { HrBranchModel } from '../models/branch-model';
import { PayRollRunEmployeeComponentModel } from '../models/payrollrunemployeecomponentmodel';
import { PayfrequencyModel } from '../models/payfrequency-model';
import { Branch } from '../models/branch';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { PayRollArchiveInputModel } from '../models/payrollarchiveinputmodel';
import { PayRollRunEmployeeComponentYTDModel } from '../models/payrollrunemployeecomponentytdmodel';

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
@Injectable({
  providedIn: 'root'
})
export class PayrollManagementService {
  private GetPayrollRun = APIEndpoint + ApiUrls.GetPayrollRunList;
  private GetPayrollStatusList = APIEndpoint + ApiUrls.GetPayrollStatusList;
  private GET_Currencies = APIEndpoint + ApiUrls.SearchSystemCurrencies;
  private GET_ALL_PayRollTemplate = APIEndpoint + ApiUrls.GetPayRollTemplates;
  private Upsert_PayRollTemplate = APIEndpoint + ApiUrls.UpsertPayRollTemplate;
  private GET_ALL_PayRollComponent = APIEndpoint + ApiUrls.GetPayRollComponents;
  private GET_ALL_Component = APIEndpoint + ApiUrls.GetComponents;
  private GET_ALL_PayRollTemplateConfiguration = APIEndpoint + ApiUrls.GetPayRollTemplateConfigurations;
  private Upsert_PayRollTemplateConfiguration = APIEndpoint + ApiUrls.UpsertPayRollTemplateConfiguration;
  private Upsert_PayRollRunEmployeeComponent = APIEndpoint + ApiUrls.UpsertPayRollRunEmployeeComponent;

  constructor(private http: HttpClient) { }

  getPayrollRunList(isArchived) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(`${this.GetPayrollRun}?isArchived=` + isArchived, httpOptions);
  }
  getAllstatusList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(this.GetPayrollStatusList, httpOptions);
  }

  getPayrollRunemployeeList(payrollRunId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetPayrollRunemployeeList}?payrollRunId=` + payrollRunId, httpOptions)
  }
  getPaySlipDetailsList(payrollRunId, employeeId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetPaySlipDetails}?payrollRunId=` + payrollRunId + '&employeeId=' + employeeId, httpOptions)
  }

  insertPayrollRun(PyrollRun: PayrollRun) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PyrollRun);

    // return this.http.post(`${APIEndpoint + ApiUrls.InsertPayrollRun}, body, httpOptions);
    return this.http.post(`${APIEndpoint + ApiUrls.InsertPayrollRun}`, body, httpOptions);

  }

  insertFinalPayRollRun(PyrollRun: PayrollRun) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PyrollRun);

    // return this.http.post(`${APIEndpoint + ApiUrls.InsertPayrollRun}, body, httpOptions);
    return this.http.post(`${APIEndpoint + ApiUrls.FinalPayRollRun}`, body, httpOptions);

  }

  updatePayrollRunEmployee(PyrollRunEmployee: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PyrollRunEmployee);

    return this.http.post(`${APIEndpoint + ApiUrls.UpdatePayrollRunEmployeeStatus}`, body, httpOptions);

  }

  updatePayrollRunStatus(PyrollRun: PayrollStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PyrollRun);

    return this.http.post(`${APIEndpoint + ApiUrls.UpdatePayrollRunStatus}`, body, httpOptions);
  }

  runPaymentForPayRollRun(payrollRunId: string, templateType: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.RunPaymentForPayRollRun}?payrollRunId=` + payrollRunId+ '&templateType=' + templateType, httpOptions);
  }

  getPayrollRunEmployeeCount(payrollRunId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetPayrollRunEmployeeCount}?payrollRunId=` + payrollRunId, httpOptions)
  }

  downloadPayslip(payrollRunId, employeeId) {
    debugger;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.get(`${APIEndpoint + ApiUrls.DownloadPaySlip}?payrollRunId=` + payrollRunId + '&employeeId=' + employeeId, httpOptions)
  }

  sendEmailWithPayslip(payrollRunId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(`${APIEndpoint + ApiUrls.SendEmailWithPayslip}?payrollRunId=` + payrollRunId, httpOptions)
  }


  getWorkflowsByReferenceId(triggerModel: WorkflowTrigger) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(triggerModel);

    return this.http.post(APIEndpoint + ApiUrls.GetWorkFlowTriggers, body, httpOptions)
  }


  getCurrencies(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.GET_Currencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPayRollTemplates(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
  }


  upsertPayRollTemplate(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.Upsert_PayRollTemplate}`, body, httpOptions);
  }

  getAllPayRollComponents(payRollComponentModel: PayRollComponentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollComponentModel);

    return this.http.post(`${this.GET_ALL_PayRollComponent}`, body, httpOptions);
  }


  getAllComponents(PayRollTemplateModel: PayRollTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateModel);

    return this.http.post(`${this.GET_ALL_Component}`, body, httpOptions);
  }

  getAllPayRollTemplateConfigurations(PayRollTemplateConfigurationModel: PayRollTemplateConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateConfigurationModel);

    return this.http.post(`${this.GET_ALL_PayRollTemplateConfiguration}`, body, httpOptions);
  }

  upsertPayRollTemplateConfiguration(PayRollTemplateConfigurationModel: PayRollTemplateConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollTemplateConfigurationModel);

    return this.http.
      post(`${this.Upsert_PayRollTemplateConfiguration}`, body, httpOptions);
  }

  getAllEmploymentStatuses(employmentStatusModel: EmploymentStatusSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employmentStatusModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetEmploymentStatus}`, body, httpOptions)
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


  getBranches(branchModel: HrBranchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  updateUserTask(taskId, isApproved) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.CompleteUserTask}?taskId=` + taskId + "&isApproved=" + isApproved, httpOptions)
  }

  payRollRunUploadTemplate(payRollRunOutPutModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(payRollRunOutPutModel);
    return this.http.post(APIEndpoint + ApiUrls.GetPayRollRunTemplate, body, httpOptions);
  }

  getEmployeeLeaveDetailsList(payRollRunId) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetPayRollRunEmployeeLeaveDetailsList}?payRollRunId=` + payRollRunId, httpOptions)
  }

  upsertPayRollRunEmployeeComponent(PayRollRunEmployeeComponentModel: PayRollRunEmployeeComponentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollRunEmployeeComponentModel);

    return this.http.post(`${this.Upsert_PayRollRunEmployeeComponent}`, body, httpOptions);
  }


  getPayFrequency(payfrequencyModel: PayfrequencyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(payfrequencyModel);
    return this.http.post(APIEndpoint + ApiUrls.GetPayFrequency, body, httpOptions)
      .pipe(map((result) => {
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

  upsertPayFrequency(PayfrequencyModel: PayfrequencyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(PayfrequencyModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertPayFrequency, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  archivePayRoll(payRollArchiveInputModel: PayRollArchiveInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(payRollArchiveInputModel);

    return this.http.post(`${APIEndpoint + ApiUrls.ArchivePayRoll}`, body, httpOptions);
  }

  upsertPayRollRunEmployeeComponentYTD(PayRollRunEmployeeComponentYTDModel: PayRollRunEmployeeComponentYTDModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(PayRollRunEmployeeComponentYTDModel);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertPayRollRunEmployeeComponentYTD}`, body, httpOptions);
  }
}
