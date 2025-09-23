import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
    DocumentManagementRoutes,
    DocumentManagementModule,
    DocumentStoreAppComponent,
    StoreManagementComponent,
    DocumentStoreComponent
} from "@thetradeengineorg1/snova-document-management";
import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

export class DocumentManagementComponentSupplierService {

    static components =  [
      {
          name: "Documents",
          componentTypeObject: DocumentStoreAppComponent
      },
      {
          name: "Store management",
          componentTypeObject: StoreManagementComponent
      },
      {
          name:"Document Store",
          componentTypeObject: DocumentStoreComponent
      }
    ]
}

@NgModule({
    imports: [
        DocumentManagementModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: DocumentManagementRoutes
            }
        ]),
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue:moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class DocumentManagementPackageModule { 
    static componentService = DocumentManagementComponentSupplierService;
}
