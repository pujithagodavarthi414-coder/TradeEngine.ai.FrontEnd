import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentManagementRoutes, DocumentManagementModule, DocumentStoreAppComponent, StoreManagementComponent, DocumentStoreComponent } from "@snovasys/snova-document-management";
import { CommonModule } from '@angular/common';
import * as cloneDeep_ from 'lodash/cloneDeep';
// import { TranslateModule, TranslateService } from "@ngx-translate/core";

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
        // TranslateModule,
        DocumentManagementModule,
        RouterModule.forChild([
            {
                path: '',
                children: DocumentManagementRoutes
            }
        ]),
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [
        
    ],
    entryComponents: []
})

export class DocumentManagementPackageModule { 
    static componentService = DocumentManagementComponentSupplierService;
    // constructor(
    //     public translate: TranslateService
    //   ){
    //     const browserLang: string = translate.getBrowserLang();
    //     translate.use(browserLang.match(/en|fr/) ? browserLang : "en");
    //   }
}
