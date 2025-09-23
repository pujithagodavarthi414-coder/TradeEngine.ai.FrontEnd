import { Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { NewclientComponent } from './components/newclient/newclient.component';
import { CreatescheduleComponent } from './components/schedule/createschedule/createschedule.component';
import { ViewScheduleComponent } from './components/schedule/viewschedule.component';
import { EditScheduleComponent } from './components/schedule/edit-schedule.component';
import { AddedclientspageComponent } from './components/addedclientspage/addedclientspage.component';
import { ClientKycConfigurationComponent } from './components/client-Kyc/client-kyc-configuration.component';
import { ScoDecisionComponent } from './components/sco/sco-decision.component';
import { ShipmentExecutionForm } from './components/supplier-process/shipment-execution-form.component';
import { LegalEntityComponent } from './components/legal-entity.component';
import { KycDetailsSubmissionComponent } from './components/kyc-details-submission.component';
import { CounterPartySettingsComponent } from './components/counter-party-settings/counter-party-settings.component';
import { ViewFileComponent } from './components/view-file/view-file.component';

export const BillingRoutes: Routes = [

  {
    path: 'clients', component: ClientsComponent, data: { title: 'clients', breadcrumb: 'clients' }
  },
  {
    path: 'editclientdetails/:id', component: NewclientComponent, data: { title: 'newclient', breadcrumb: 'newclient' }
  },
  {
    path: 'addclient', component: NewclientComponent, data: { title: 'newclient', breadcrumb: 'newclient' }
  },
  {
    path: 'createschedule', component: CreatescheduleComponent, data: { title: 'createschedule', breadcrumb: 'createschedule' }
  },
  {
    path: 'addedclientspage/:id', component: AddedclientspageComponent, data: { title: 'addedclientspage', breadcrumb: 'addedclientspage' }
  },
  {
    path: 'clientkyc', component: ClientKycConfigurationComponent, data: { title: 'clientkyc', breadcrumb: 'clientkyc' }
  },
  { path: 'viewschedule', component: ViewScheduleComponent, data: { title: 'Schedule', breadcrumb: 'Schedule' } },
  { path: 'editschedule', component: EditScheduleComponent, data: { title: 'Schedule', breadcrumb: 'Schedule' } },
  { path: 'scoAcceptOrReject/:id1/:id2', component: ScoDecisionComponent, data: { title: 'SCO submit', breadcrumb: 'SCOsubmit' } },
  { path: 'scoAcceptOrReject/:id', component: ScoDecisionComponent, data: { title: 'SCO submit', breadcrumb: 'SCOsubmit' } },
  {
    path: 'shipmentExecution/:id', component: ShipmentExecutionForm, data: { title: 'Shipment Execution', breadcrumb: 'shipmentExecution' }
  },
  {
    path: 'shipmentExecution/:id1/:id2', component: ShipmentExecutionForm, data: { title: 'Shipment Execution', breadcrumb: 'shipmentExecution' }
  },
  {
    path: 'kycDetailsSubmission/:id', component: KycDetailsSubmissionComponent, data: { title: 'KYC Submission', breadcrumb: 'kycSubmission' }
  },
  {
    path: 'counterPartySettings/:id', component: CounterPartySettingsComponent, data: { title: 'Counter party settings', breadcrumb: 'CounterPartySettings' }
  },
  {
    path: 'FileApi/UploadedFormDocuments', component: ViewFileComponent, data: { title: 'view file', breadcrumb: 'ViewFile' }
  }
  
];