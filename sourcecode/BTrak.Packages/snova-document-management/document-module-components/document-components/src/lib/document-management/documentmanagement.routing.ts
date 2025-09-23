import { Routes } from "@angular/router";
import { ViewStoreComponent } from './components/view-store.component';
import { DocumentManagementComponent } from './containers/document-management.page';
import { StoreManagementComponent } from './components/store-management.component';
import { DocumentStoreAppComponent } from './components/document-store-app.component';

export const DocumentManagementRoutes: Routes = [
  {
    path: "",
    component: DocumentManagementComponent,
    children: [
      { path: "", component: DocumentManagementComponent, data: { title: "Document management" } },
      {
        path: "store/:storeId",
        component: DocumentManagementComponent,
        data: { title: "View Store", breadcrumb: "View Store" },
        children: [
          { path: "", component: ViewStoreComponent, data: { title: "View Store", breadcrumb: "View Store" } },
        ]
      },
      {
        path: "store/:storeId/:folderId",
        component: DocumentManagementComponent,
        data: { title: "View Store", breadcrumb: "View Store" },
        children: [
          { path: "", component: ViewStoreComponent, data: { title: "View Folders", breadcrumb: "View Folders" } },
        ]
      }
    ]
  },
  {
    path: "storemanagement",
    component: StoreManagementComponent,
    data: { title: "Store Management", breadcrumb: "Store Management" }
  },
  {
    path: "document",
    component: DocumentManagementComponent,
    children: [
      { path: "", component: DocumentManagementComponent, data: { title: "Document management" } },
      {
        path: "store/:storeId",
        component: DocumentManagementComponent,
        data: { title: "View Store", breadcrumb: "View Store" },
        children: [
          { path: "", component: ViewStoreComponent, data: { title: "View Store", breadcrumb: "View Store" } },
        ]
      },
      {
        path: "store/:storeId/:folderId",
        component: DocumentManagementComponent,
        data: { title: "View Store", breadcrumb: "View Store" },
        children: [
          { path: "", component: ViewStoreComponent, data: { title: "View Folders", breadcrumb: "View Folders" } },
        ]
      }
    ]
  },
  {
    path: 'documentsapp',
    component: DocumentStoreAppComponent,
    data: { title: "Documents app", breadcrumb: "Documents app" }
  },
  {
    path: "documentmanagement",
    component: DocumentManagementComponent,
    children: [
      {
        path: "storemanagement", component: StoreManagementComponent,
        data: { title: "Store management" }
      },
    ]
  }
];
