import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { DocumentManagementModule, DocumentStoreAppComponent, StoreManagementComponent } from "@thetradeengineorg1/snova-document-management";


export class DocumentManagementComponentSupplierService {

  static components =  [
    {
        name: "Documents",
        componentTypeObject: DocumentStoreAppComponent
    },
    {
        name: "Store management",
        componentTypeObject: StoreManagementComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    DocumentManagementModule
  ]
})
export class DocumentManagementPackageModule {
  static componentService = DocumentManagementComponentSupplierService;
}
