import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { createCustomElement } from '@angular/elements';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule, MatDialogRef ,MAT_DIALOG_DATA ,} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { WebPagesService } from './services/webpages.service';
import { WebPageViewerComponent } from './components/web-page-viewer-component/web-page-viewer.component';
import { WebPageTemplatesListComponent } from './components/templatesListPopup/templates-list-popup.component';
import { JwtInterceptor } from './intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormioModule } from 'angular-formio';
import { ViewsFormComponent } from './components/view-form/view-form.component';
import { DynamicHtmlCreationComponent } from './components/dynamic-html-creation/dynamic-html-creation.component';
import { DynamicSubmitFormComponent } from './components/submit-form/submit-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LookUpComponent } from './components/look-up/look-up.component';
import { registerLookupComponent } from './components/look-up/look-up.formio';
import { registerCustomSelectComponent } from './components/custom-select/custom-select.formio';
import { registerRqComponent } from './components/remaining-quantity/rq.formio';
import { registerFileUploadComponent } from './components/file-uploader/file-uploader.formio';
import { registerUniqueIdComponent } from './components/unique-id/unique-id.formio';
import { UniqueIdComponent } from './components/unique-id/unique-id.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { RqComponent } from './components/remaining-quantity/rq-component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatSelectModule } from '@angular/material/select';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [
    AppComponent,
    WebPageTemplatesListComponent,
    WebPageViewerComponent,
    ViewsFormComponent,
    DynamicHtmlCreationComponent,
    DynamicSubmitFormComponent,
    LookUpComponent,
    UniqueIdComponent,
    CustomSelectComponent,
    RqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    MatProgressBarModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    FormioModule,
    MatSnackBarModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxGalleryModule,
    NgxDatatableModule,
    NgxDocViewerModule,
    MatSelectModule,
    MatSelectInfiniteScrollModule,
    ToastrModule.forRoot({
      timeOut: 5000
    })
  ],
  providers: [WebPagesService,ToastrService ,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },],
  bootstrap: [AppComponent],
  entryComponents: [DynamicSubmitFormComponent
  ]
})
export class AppModule { 
  constructor(private injector: Injector) {
    const createlayout = createCustomElement(WebPageViewerComponent, {injector});
    customElements.define('app-web-page-viewer-component',createlayout);
    const submitForm = createCustomElement(DynamicSubmitFormComponent, { injector });
    customElements.define('app-dynamic-submit-form-component', submitForm);
    // registerRatingComponent(injector);
    registerFileUploadComponent(injector);
    registerLookupComponent(injector);
    // registerWellComponent(injector)
    registerUniqueIdComponent(injector);
    registerCustomSelectComponent(injector);
    // registerCurrentDateComponent(injector);
    registerRqComponent(injector);
  }
}
