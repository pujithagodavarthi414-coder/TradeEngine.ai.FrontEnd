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
import { EmailTemplateModel } from '../models/email-template.model';
import { ContractStatusModel } from '../models/contract-status.model';
import { InvoiceStatusModel } from '../models/invoice-status.model';
import { ContractTemplateModel } from '../models/contract-template';
import { ToleranceModel } from '../models/tolerance.model';
import { PaymentConditionModel } from '../models/payment-condition.model';
import { TradeTemplateModel } from '../models/trade-template-model';
import { RFQRequestModel } from '../models/rfq-request.model';
import { RFQStatusModel } from '../models/rfq-status.model';
import { SwitchBlModel } from '../models/switch-bl.model';
import { VesselConfirmationStatusModel } from '../models/vessel-confirmation-statusmodel';
import { PortCategoryModel } from '../models/port-category.model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class BillingDashboardService {

  private Upsert_SecondaryContact;
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  public Get_DropDownType_Values = APIEndpoint + 'TradeManagement/TradeApi/GetFormDropdowns?DropDownType=';
  public Get_User_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetUsersBasedonRole?roles=';

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
  resendKycMail(ReSendKycEmail: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(ReSendKycEmail);
    return this.http
      .post(APIEndpoint + ApiUrls.ReSendKycEmail, body, httpOptions)
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

  getClients(clientSearch) {
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
  getDropDown(type) {
    let paramsobj = new HttpParams().set('DropDownType',type)
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // params: type
    };

    return this.http.get(this.Get_DropDownType_Values+type, httpOptions)
      .pipe(map(result => {
        return result;
      }));
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
  GetExecutionStepsURLs(contractModel) {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

  };
  let body = JSON.stringify(contractModel);
  return this.http.post(APIEndpoint + ApiUrls.GetExecutionStepsURLs, body, httpOptions)
    .pipe(map(result => {
      return result;
    }));
}
  getContractHistory(contractId,contractType) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetContractHistory + '?contractId=' + contractId+'&contractType='+contractType, httpOptions)
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
  getPurchaseBlDraftList(purchaseDetails: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(purchaseDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.GetPurchaseContractDraftBlDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getRFQListForVesselContracts(ContractModel: ContractModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ContractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetRFQListForVesselContracts, body, httpOptions)
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
    let paramsobj = new HttpParams().set('leadSubmissionId', scoModel.leadSubmissionId).set('scoId', scoModel.scoId)
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
      .get(APIEndpoint + ApiUrls.GetDocumentsDescriptions + '?referenceTypeId=' + referenceTypeId, httpOptions)
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

  getAllEmailTemplates(emailTemplateModel: EmailTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(emailTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllEmailTemplates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getHtmlTagsById(emailTemplateModel: EmailTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(emailTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetHtmlTagsById, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertEmailTemplate(emailTemplateModel: EmailTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(emailTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertEmailTemplate, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllcontractStatus(contractStatusModel: ContractStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(contractStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllContractStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertContractStatus(contractStatusModel: ContractStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(contractStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertContractStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllRFQStatus(rfqStatusModel: RFQStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllRFQStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertRFQStatus(rfqStatusModel: RFQStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertRFQStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllVesselConfirmation(rfqStatusModel: VesselConfirmationStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllVesselConfirmationStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertVesselConfirmationStatus(rfqStatusModel: VesselConfirmationStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertVesselConfirmationStatus, body, httpOptions)
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

  upsertPortCategory(portCategoryModel: PortCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(portCategoryModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertPortCategory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllInvoiceStatus(invoiceStatusModel: InvoiceStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(invoiceStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllInvoiceStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getAllInvoicePaymentStatus(invoiceStatusModel: InvoiceStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(invoiceStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllInvoicePaymentStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertInvoiceStatus(invoiceStatusModel: InvoiceStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(invoiceStatusModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertInvoiceStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getContractTemplates(ContractTemplateModel: ContractTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ContractTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetContractTemplates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertContractTemplate(ContractTemplateModel: ContractTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(ContractTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertContractTemplate, body, httpOptions)
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

  upsertContract(contractModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(contractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertContract, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertVesselContract(contractModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(contractModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertVesselContract, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileDetailsBase64(fileDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileDetails);
    return this.http.post<any>(APIEndpoint + 'File/FileApi/SaveFileBase64', body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllTolerances(toleranceModel: ToleranceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(toleranceModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllTolerances, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertTolerance(toleranceModel: ToleranceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(toleranceModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertTolerance, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPaymentConditions(paymentConditionModel: PaymentConditionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentConditionModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllPaymentConditions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertPaymentCondition(paymentConditionModel: PaymentConditionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(paymentConditionModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertPaymentCondition, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTradeTemplates(tradeTemplateModel: TradeTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(tradeTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetTradeTemplates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertTradeTemplate(tradeTemplateModel: TradeTemplateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(tradeTemplateModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertTradeTemplate, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTemplateTypes(templateConfigModel: TemplateConfigModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(templateConfigModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetTradeTemplateTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertRFQRequestAndSend(rfqRequestModel: RFQRequestModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqRequestModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertRFQRequestAndSend, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpdateRFQRequest(rfqRequestModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(rfqRequestModel);
    return this.http
      .post(APIEndpoint + ApiUrls.UpdateRFQRequest, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  ShareQ88Document(shareQ88DocumentInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shareQ88DocumentInputModel);
    return this.http.post(APIEndpoint + ApiUrls.ShareQ88Document, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  updateQ88Document(updateQ88DocumentInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(updateQ88DocumentInputModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateQ88DocumentStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }
  upsertSwitchBl(switchBlModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(switchBlModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertSwitchBlContract, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }
  getRealSwitchBl(switchBlModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(switchBlModel);
    return this.http.post(APIEndpoint + ApiUrls.GetSwitchBlContracts, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getSwitchBlDetails(switchBlModel: SwitchBlModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(switchBlModel);
    return this.http.post(APIEndpoint + ApiUrls.GetSwitchBlBuyerContracts, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  GetLinkedExecutionPurchaseAndSales(GetLinkedPurchaseAndSales: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(GetLinkedPurchaseAndSales);
    return this.http
      .post(APIEndpoint + ApiUrls.GetLinkedPurchaseAndSales, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetDocPurchaseAndSaleXpSteps(getDoc: any){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(getDoc);
    return this.http
      .post(APIEndpoint + ApiUrls.GetXPSteps, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  reminderShareBlDraftPuchase(shareBLDraft: any){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(shareBLDraft);
    return this.http
      .post(APIEndpoint + ApiUrls.ShareBLDraft, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertFormExecution(stepDetails: any){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(stepDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertFormExecution, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  xpStepsInsert(stepsInsert: any){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(stepsInsert);
    return this.http
      .post(APIEndpoint + ApiUrls.UpsertXPSteps, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  updateXPStepAlert(stepsInsert: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(stepsInsert);
    return this.http
      .post(APIEndpoint + ApiUrls.UpdateXPStepAlert, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  generatePdfofInvoiceSteps(data: any){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(data);
    return this.http
      .post(APIEndpoint + ApiUrls.GeneratePdfofInvoiceSteps, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  contarctLinkDraft(){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    //let body = JSON.stringify();
    return this.http
      .post(APIEndpoint + ApiUrls.GetClient, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getGenericForms(data) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(data);
    return this.http
      .post(APIEndpoint + ApiUrls.GetGenericForms, body, httpOptions)
      .pipe(map(result => {
        return result;
    }));
  }

  getExecutionSteps(purchaseModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(purchaseModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetExecutionStepUrls, body, httpOptions)
      .pipe(map(result => {
        return result;
    }));
  }
}
