import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientSearchInputModel } from '../models/client-search-input.model';
import { ClientContactModel } from '../models/client-contact.model';
import { ClientDeleteModel } from '../models/client-delete-model';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { RoleModel } from '../models/role-model';
import { Observable } from 'rxjs';
import { KycConfigurationModel } from '../models/clientKyc.model';
import { LeadSubmissionDetails } from '../models/lead-submissions.model';
import { ContractConfigurationModel } from '../models/purchase-contract';
import { ContractPurchaseModel } from '../models/Contract-purchased';
import { ScoModel } from '../models/sco-model';
import { ProductTableModel } from '../models/product-table.model';
import { GradeModel } from '../models/grade.model';
import { ContractModel } from '../models/contract.model';
import { CountryModel } from '../models/country-model';
import { PaymentTermModel, ShipmentBLModel } from '../models/payment-term.model';
import { LeadContractModel } from '../models/lead-contract.mdel';
import { EmployeeListModel } from '../models/employee-list-model';
import { ClientLedgerModel } from '../models/client-ledger.model';
import { SearchFileModel } from '../models/search-file.model';
import { CreditLogModel } from '../models/credit-log.model';
import { ShipmentExecutionModel } from '../models/shipment-execution.model';
import { VesselModel } from '../models/vessel.model';
import { BLModel } from '../models/bl-model';
import { LegalEntityModel } from '../models/legal-entity.model';
import { CounterPartyTypesModel } from '../models/counter-party-types.model';
import { CounterPartySettingsModel } from '../models/counterparty-settings.model';
import { KycStatusModel } from '../models/kyc-status.model';
import { KycHistoryModel } from '../models/kyc-history.model';
import { TemplateConfigModel } from '../models/template-config-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class BillingDashboardService {

  private Upsert_SecondaryContact;
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  addClient(dailyLogTimeReport: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertClientDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  addSecondaryContact(dailyLogTimeReport: any) {

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getContractTypes(templateConfigModel: TemplateConfigModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(templateConfigModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetTradeContractTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  updateSecondaryContactDetails(dailyLogTimeReport: any) {

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),

    };

    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteClient(deleteClient: ClientDeleteModel) {

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(deleteClient);
    return this.http
      .post(APIEndpoint + ApiUrls.MultipleClientDelete, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  updateClientDetails(id, dailyLogTimeReport: any) {
    let paramsobj = new HttpParams().set('id', id)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .put(APIEndpoint + ApiUrls.UpsertClientDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteSecondaryContactDetails(id) {
    let paramsobj = new HttpParams().set('id', id)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http
      .delete('http://expenseapi.btrak.io:3000/secondarycontact/' + id, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  daywiseExpense() {


    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get<any[]>(APIEndpoint + '/expensesperday', httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getGeneralledger() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get<any[]>(APIEndpoint + '/generalGenderList', httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getCountryslist() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetCountries, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getClients(clientSearch: ClientSearchInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(clientSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetClients, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  recentlyEdiitedClients() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify({ "CreatedDateTime": true });
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetClients, body, httpOptions)
      .pipe(map(result => {

        return result;
      }));
  }
  getSecondaryContactDetails(clientid) {

    let body = JSON.stringify({ "clientId": clientid });
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };

    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetSecondaryContactDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getHistory() {
    // return of(this.history)
  }
  addNewInvoice(dailyLogTimeReport: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post("http://localhost:3000/invoice", body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  upsertSecondaryContact(contactModel: ClientContactModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(contactModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getSecondaryContacts(contactModel: ClientContactModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(contactModel);
    return this.http.post(APIEndpoint + ApiUrls.GetSecondaryContacts, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  getRoles(roleModel: RoleModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
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
      .post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  GetPerformanceConfiguration(performanceConfigurationModel: KycConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformanceConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  UpsertPerformanceConfiguration(performanceConfigurationModel: KycConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPerformanceConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  UpsertClientKycConfiguration(performanceConfigurationModel: KycConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertClientKycConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  UpsertPurchaseConfiguration(performanceConfigurationModel: ContractConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPurchaseConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  GetPurchaseConfiguration(performanceConfigurationModel: ContractConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPurchaseConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  GetClientKycConfiguration(performanceConfigurationModel: KycConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetClientKycConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getClientType() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetClientTypesBasedOnRoles, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCounterPartyTypes(clientSearch: CounterPartyTypesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(clientSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetClientTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetShipToAddresses(clientSearch) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(clientSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetShipToAddresses, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertShipToAddress(counterPartyTypesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(counterPartyTypesModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertShipToAddress, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  UpsertClientType(counterPartyTypesModel: CounterPartyTypesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(counterPartyTypesModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertClientType, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  reorderClientType(counterPartyTypesModel: CounterPartyTypesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(counterPartyTypesModel);
    return this.http
      .post(APIEndpoint + ApiUrls.ReorderClientType, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getKycDocumentType() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.post(APIEndpoint + ApiUrls.GetClientKycConfiguration, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLeadSubmissions(leadSubmissionDetails: LeadSubmissionDetails) {

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(leadSubmissionDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.LeadSubmissionDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getPurchasedContract(contractPurchaseDetails: ContractPurchaseModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(contractPurchaseDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.GetContractSubmissions, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertSCO(scomodel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(scomodel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertSCO, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  UpsertSCOStatus(leadSubmissionDetails: LeadSubmissionDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(leadSubmissionDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertSCOStatus, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getLeadSubmissionsById(leadSubmissionDetails: LeadSubmissionDetails) {
    let paramsobj = new HttpParams().set('leadFormId', leadSubmissionDetails.leadFormId)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetLeadSubmissionsById, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getSco(scoModel: ScoModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(scoModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetSCOGenerations, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertproducts(productTableModel: ProductTableModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(productTableModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertProductTable, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  getProducts(poductTableModel: ProductTableModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(poductTableModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetProductsList, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getAllWareHouseUsers() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http
      .post(APIEndpoint + ApiUrls.getAllWareHouseUsers, null, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  sendSCOAcceptanceMail(scoMail) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http
      .post(APIEndpoint + ApiUrls.sendSCOAcceptanceMail, scoMail, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllGrades(gradeModel: GradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(gradeModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllGrades, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upertGrade(gradeModel: GradeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(gradeModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertGrades, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetLeadPayments(leadId) {
    let paramsobj = new HttpParams().set('leadId', leadId)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetLeadPayments, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadFile(filePath: string) {
    let paramsobj = new HttpParams().set("filePath", filePath);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
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

  UpsertLeadInvoice(ledgerModel: ClientLedgerModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ledgerModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertLeadInvoice, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getAllPaymentTerms(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllPaymentTerms, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertPaymentTerm(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertPaymentTerm, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetAllPortDetails(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllPortDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPortCategory(portCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(portCategoryModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllPortCategory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertPortDetails(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertPortDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upertContract(gradeModel: ContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(gradeModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertMasterContractDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getContractList(ContractModel: ContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetMasterContractDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upertPurchaseContract(gradeModel: ContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(gradeModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertPurchaseContract, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getPurchaseContractList(ContractModel: ContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetPurchaseContract, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getCountries(countryList: CountryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(countryList);
    return this.http.post(APIEndpoint + ApiUrls.GetCountryList, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upertLeadContract(leadContractModel: LeadContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(leadContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertLeadContractSubmissions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  CloseLead(leadContractModel: LeadContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(leadContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.CloseLead, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLeadStatus(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    let body = JSON.stringify(paymentTermModel);
    return this.http.post(APIEndpoint + ApiUrls.GetLeadStages, body, httpOptions)
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

  getAllLeadSusbmissions(leadContractModel: LeadContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(leadContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetLeadContractSubmissions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getScoGenerationById(scoModel: ScoModel) {
    let paramsobj = new HttpParams().set('leadSubmissionId', scoModel.leadSubmissionId).set('scoId',scoModel.scoId)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetScoGenerationById, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllCreditLogs(creditLogModel: CreditLogModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(creditLogModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllCreditLogs, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetAllConsignees(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllConsignee, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertConsignees(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertConsignee, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetAllConsigners(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllConsigner, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertConsigner(paymentTermModel: PaymentTermModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentTermModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertConsigner, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  UpertShipmentExecution(shipmentExecutionModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentExecutionModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertShipmentExecutions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getShipmentExecutionList(ShipmentExecutionModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ShipmentExecutionModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetShipmentExecutions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  
  getAllVessels(vesselModel: VesselModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(vesselModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllVessels, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  upsertVessel(vesselModel: VesselModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(vesselModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertVessels, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }
  GetShipmentExecutionBLById(shipmentBLModel: ShipmentBLModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetShipmentExecutionBLById, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetShipmentExecutionBLs(shipmentBLModel: ShipmentBLModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetShipmentExecutionBLs, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  UpsertShipmentExecutionBL(shipmentBLModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertShipmentExecutionBL, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetDocumentsDescriptions(referenceTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetDocumentsDescriptions+'?referenceTypeId='+referenceTypeId, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  UpsertDocumentsDescription(shipmentBLModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertDocumentsDescription, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
    }
    GetBlDescriptions(shipmentBLModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetBlDescriptions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  UpsertBlDescription(shipmentBLModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shipmentBLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertBlDescription, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
    }
  UpsertBL(bLModel: BLModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(bLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertShipmentExecutionBL, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  sendChaMail(bLModel: ShipmentExecutionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(bLModel);
    return this.http
      .post(APIEndpoint + ApiUrls.SendChaConfirmationMail, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLegalEntity(legalEntityModel: LegalEntityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(legalEntityModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertLegalEntity, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  getAllLegalEntities(legalEntityModel: LegalEntityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(legalEntityModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllLegalEntities, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  getClientKycDetails(clientSearchInputModel: ClientSearchInputModel) {
    let paramsobj = new HttpParams().set('clientId', clientSearchInputModel.clientId)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetClientKycDetails, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertKycDetails(kycConfigurationModel: KycConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(kycConfigurationModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertKycDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  getCounterPartySettings(counterPartySettingsModel: CounterPartySettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(counterPartySettingsModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetCounterPartySettings, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertCounterPartyDetails(counterPartySettingsModel: CounterPartySettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(counterPartySettingsModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertCounterPartySettings, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertKycStatus(kycStatusModel: KycStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(kycStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.upsertKycStatus, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  getAllkycStatus(kycStatusModel: KycStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(kycStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.getAllkycStatus, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  getClientKycHistory(kycHistoryModel: KycHistoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(kycHistoryModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetClientKycHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertTemplateConfiguration(templateConfigModel: TemplateConfigModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(templateConfigModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertTemplateConfiguration, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }

  getAllTemplateConfigurations(templateConfigModel: TemplateConfigModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(templateConfigModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllTemplateConfigurations, body, httpOptions)
      .pipe(map(result => {
          return result;
        }));
  }
}
