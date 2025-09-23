import { Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { NewclientComponent } from './components/newclient/newclient.component';
import { AddedclientspageComponent } from './components/addedclientspage/addedclientspage.component';
import { KycDetailsSubmissionComponent } from './components/kyc-details-submission.component';
import { CounterPartySettingsComponent } from './components/counter-party-settings/counter-party-settings.component';
import { ViewFileComponent } from './components/view-file/view-file.component';
import { ContractTemplateListComponent } from './components/contract/contract-template-list.component';
import { TradeTemplateListComponent } from './components/master-data/trade-templates-list.component';
import { LivesSearchComponent } from './components/lives/lives-search/lives-search.component';
import { ProgramViewComponent } from './components/lives/program/program-view.component';
import { ValidatorsPageComponent } from './components/lives/validators/validators-page.component';
import { ObjectAndBackgroundSmileComponent } from './components/lives/smile-program/objective-background-smile.component';
import { SmileLevelTwoComponent } from './components/lives/smile-program/smile-level2.component';
import { ProgramComponent } from './components/work/program-component';
import { SmileBudgetBreakDownComponent } from './components/lives/smile-program/smile-budget-breakdown.component';
import { CollaborationTableComponent } from './components/lives/collaboration/collaboration-table-component';
import { LiveWelcomePageComponent } from './components/lives/lives-welcome-page';
import { ProgressViewComponent } from './components/lives/progress/progress-view.component';
import { SummaryTableViewComponent } from './components/lives/Summary/summary-table-view.component';
import { SmallHolderApplication } from './components/apps/small-holder-app.component';
import { OverviewComponent } from './components/lives/overview/overview.component';
import { WebPageViewComponent } from './components/lives/overview/web-page-viewer.component';


export const BillingRoutes: Routes = [
  {
    path: '', pathMatch: 'full', component: ClientsComponent, data: { title: 'clients', breadcrumb: 'clients' }
  },
  {
    path: 'clients', component: ClientsComponent, data: { title: 'clients', breadcrumb: 'clients' }
  },
  {
    path: 'trade-templates', component: TradeTemplateListComponent, data: { title: 'clients', breadcrumb: 'clients' }
  },
  {
    path: 'contract-templates', component: ContractTemplateListComponent, data: { title: 'clients', breadcrumb: 'clients' }
  },
  {
    path: 'editclientdetails/:id', component: NewclientComponent, data: { title: 'newclient', breadcrumb: 'newclient' }
  },
  {
    path: 'addclient', component: NewclientComponent, data: { title: 'newclient', breadcrumb: 'newclient' }
  },
  {
    path: 'addedclientspage/:id', component: AddedclientspageComponent, data: { title: 'addedclientspage', breadcrumb: 'addedclientspage' }
  },
  {
    path: 'kycDetailsSubmission/:id', component: KycDetailsSubmissionComponent, data: { title: 'KYC Submission', breadcrumb: 'kycSubmission' }
  },
  {
    path: 'counterPartySettings/:id', component: CounterPartySettingsComponent, data: { title: 'Counter party settings', breadcrumb: 'CounterPartySettings' }
  },
  {
    path: 'FileApi/UploadedFormDocuments', component: ViewFileComponent, data: { title: 'view file', breadcrumb: 'ViewFile' }
  },
  {
    path: 'lives-search', component: LivesSearchComponent, data: { title: 'lives-search', breadcrumb: 'lives-search' }
  },
  {
    path: 'validators', component: ValidatorsPageComponent, data: { title: 'validators', breadcrumb: 'validators' }
  },
  {
    path: 'program/:id/:tab', component: ProgramViewComponent, data: { title: 'view program', breadcrumb: 'view program' }
  },
  {
    path: 'object-background/:id', component: ObjectAndBackgroundSmileComponent, data: { title: 'object-background', breadcrumb: 'object-background' }
  },
  {
    path: 'smile-level-two/:programId', component: SmileLevelTwoComponent, data: { title: 'level2', breadcrumb: 'level2' }
  },
  {
    path: 'register-program', component: ProgramComponent, data: { title: 'register-program', breadcrumb: 'register-program' }
  },
  {
    path: 'smile-budget-breakdown/:id', component: SmileBudgetBreakDownComponent, data: { title: 'budget-breakdown', breadcrumb: 'budget-breakdown' }
  },
  { path: 'welcome', component: LiveWelcomePageComponent, data: { title: 'welcome', breadcrumb: 'welcome' } },
  {
    path: 'collaborations', component: CollaborationTableComponent, data: { title: 'collaborations', breadcrumb: 'collaborations'}
  },
  {
    path: 'summary', component: SummaryTableViewComponent, data: { title: 'summary', breadcrumb: 'summary'}
  },
  {
    path: 'progress', component: ProgressViewComponent, data: { title: 'progress', breadcrumb: 'progress'}
  },
  {
    path: 'app', component: SmallHolderApplication, data: { title: 'app', breadcrumb: 'app'}
  },
  {
    path: 'overview', component: OverviewComponent, data: { title: 'Overview', breadcrumb: 'Overview'}
  },
  {
    path: 'webpageview', component: WebPageViewComponent, data: { title: 'Overview', breadcrumb: 'Overview'}
  }
];