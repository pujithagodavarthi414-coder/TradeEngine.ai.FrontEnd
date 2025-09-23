import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
    DocumentManagementRoutes,
    DocumentManagementModule,
    DocumentStoreAppComponent,
    StoreManagementComponent,
    DocumentStoreComponent
} from "@snovasys/snova-document-management";
import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@snovasys/snova-shell-module';
import { info } from '../../app/common/modules';
import * as cloneDeep_ from 'lodash/cloneDeep';

const cloneDeep = cloneDeep_;

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
        ShellModule.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) }),
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: (cloneDeep(info) as shellModulesInfo) }
    ],
    entryComponents: []
})

export class DocumentManagementPackageModule { 
    static componentService = DocumentManagementComponentSupplierService;
}
