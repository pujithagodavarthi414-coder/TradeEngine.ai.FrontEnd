import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ApplicationRef, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormioModule, Formio } from 'angular-formio';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { CreateFormComponent } from './create-form-component/create-form-component';
import { SubmitFormComponent } from './submit-form/submit-form.component';
import { ViewsFormComponent } from './view-form/view-form.component';
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { OrderByPipe } from './pipes/orderby-pipe';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './globaldependencies/intercepter/jwt.interceptor';
import { FormService } from './services/formService';
import { AddFormTypeComponent } from './edit-form/add-form-type-component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import "./globaldependencies/helpers/fontawesome-icons";
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.co.uk/assets/i18n/', '.json');
}
import { FormBuilderService } from './services/formBuilderService';
import FormioContrib from './data-source/index';
(Formio as any).use(FormioContrib);
//export default FormioContrib;

// import FormioContribWell from './well/well-container/index';
// (Formio as any).use(FormioContribWell);
//export default wellcontainer;

import FormioContribContainer from './data-grid/data-grid-container/index';
(Formio as any).use(FormioContribContainer);

//(Formio as any).use(FormioContribDate);
(Formio as any).use({
  components: {
    mydatetime: UniqueDateTimeComponent
  }
});
(Formio as any).use({
  components: {
    mylinkdatetime: UniqueDateTimeLinkComponent
  }
});

import FormioContribLookup from './lookup/index';
import { RatingWrapperComponent } from './rating/rating-wrapper.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerFileUploadComponent } from './file-uploader/file-uploader.formio';
import { FileSizePipe } from './pipes/filesize-pipe';
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FileUploadComponent } from './file-uploader/file-upload.component';
import { LookUpComponent } from './look-up/look-up.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CustomFormBuilderComponent } from './form-builder/form-builder.component';
import { registerLookupComponent } from './look-up/look-up.formio';
import { SubmitPublicFormComponent } from './submit-form/submit-public-form.component';
import UniqueDateTimeComponent from './current-date/currentDate-components/components/currentDate';
import { UniqueIdComponent } from './unique-id/unique-id.component';
import { registerUniqueIdComponent } from './unique-id/unique-id.formio';
import UniqueDateTimeLinkComponent from './current-date/currentDate-components/components/currentDateLink';
import { registerCustomSelectComponent } from './custom-select/custom-select.formio';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { RqComponent } from './remaining-quantity/rq-component';
import { registerRqComponent } from './remaining-quantity/rq.formio';
import { SubmitFormComponentDup } from './submit-form-dup/submit-form.component';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { WebPageTemplatesListComponent } from './templatesListPopup/templates-list-popup.component';
import { WebPageViewerComponent } from './web-page-viewer-component/web-page-viewer.component';
import { WebPagesService } from './services/webpages.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DynamicHtmlCreationComponent } from './dynamic-html-creation/dynamic-html-creation.component';
import { DynamicSubmitFormComponent } from './submit-form/dynamic-submit-form.component';
import { PDFPreviewComponent } from './preview/preview.component';
import { DocumentEditorAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { ToolbarModule, TabModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule, ComboBoxModule, DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SliderModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { CustomMessageDialogContentComponent } from './custom-message-dialog/custom-message-dialog-component';
import { WebPageViewerUnAuthComponent } from './web-page-viewer-unauth-component/web-page-viewer-unauth.component';
import { DynamicHtmlCreationUnAuthComponent } from './dynamic-html-creation/dynamic-html-creation-unauth.component';
import { DynamicSubmitFormUnAuthComponent } from './submit-form-unauth/dynamic-submit-form-unauth.component';
import { registerSingleFileUploadComponent } from './lives-image-uploader/lives-image-uploader.formio';
import { LivesImageUploadComponent } from './lives-image-uploader/lives-image-upload.component';
(Formio as any).use(FormioContribLookup);

const components = [
  AppComponent,
  CreateFormComponent,
  SubmitFormComponent,
  SubmitFormComponentDup,
  ViewsFormComponent,
  AddFormTypeComponent,
  OrderByPipe,
  CustomAppBaseComponent,
  RemoveSpecialCharactersPipe,
  FetchSizedAndCachedImagePipe,
  RatingWrapperComponent,
  FileUploadComponent,
  LivesImageUploadComponent,
  CustomFormBuilderComponent,
  LookUpComponent,
  UniqueIdComponent,
  PDFPreviewComponent,
  SubmitPublicFormComponent,
  CustomSelectComponent,
  RqComponent,
  WebPageTemplatesListComponent,
  WebPageViewerComponent,
  DynamicHtmlCreationComponent,
  DynamicHtmlCreationUnAuthComponent,
  DynamicSubmitFormComponent,
  CustomMessageDialogContentComponent,
  WebPageViewerUnAuthComponent,
  DynamicSubmitFormUnAuthComponent
];
@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    SatPopoverModule,
    MatIconModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    CommonModule,
    FlexLayoutModule,
    NgbModule,
    MatButtonModule,
    TimeagoModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    NgxDatatableModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxPaginationModule,
    MatListModule,
    NgxGalleryModule,
    NgxDropzoneModule,
    NgxDocViewerModule,
    FormioModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FlexLayoutModule,
    ColorPickerModule,
    MatSelectInfiniteScrollModule,
    DocumentEditorAllModule,
    DocumentEditorContainerModule,
    ToolbarModule,
    TabModule,
    DropDownListModule,
    ComboBoxModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    SliderModule,
    NumericTextBoxModule,
    TreeViewModule,
    DialogModule,
    FontAwesomeModule,
    TreeViewModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [CustomAppBaseComponent , PDFPreviewComponent],
  exports: components,
  providers: [RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe, DatePipe, FileSizePipe, DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    FormService,
    WebPagesService,
    FormBuilderService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    //Formio.use(FormioContrib);
    const createForm = createCustomElement(CreateFormComponent, { injector });
    customElements.define('app-create-form-component', createForm);
    const formBuilder_1 = createCustomElement(CustomFormBuilderComponent, { injector: this.injector });
    customElements.define('app-form-builder-component', formBuilder_1);
    const submitForm = createCustomElement(SubmitFormComponent, { injector });
    customElements.define('app-submit-form-component', submitForm);
    // const dynamicSubmitForm = createCustomElement(DynamicSubmitFormComponent, { injector });
    // customElements.define('app-dynamic-submit-form-component', dynamicSubmitForm);
    // const dynamicSubmitFormUnAuth = createCustomElement(DynamicSubmitFormUnAuthComponent, { injector });
    // customElements.define('app-dynamic-submit-form-unauth-component', dynamicSubmitFormUnAuth);
    const viewForm = createCustomElement(ViewsFormComponent, { injector });
    customElements.define('app-view-form-component', viewForm);
    const submitPublicForm = createCustomElement(SubmitPublicFormComponent, { injector });
    customElements.define('app-submit-public-form-component', submitPublicForm);
    const createlayout = createCustomElement(WebPageViewerComponent, {injector});
    customElements.define('app-web-page-viewer-component',createlayout); 
    const webViewUnAuth = createCustomElement(WebPageViewerUnAuthComponent, {injector});
    customElements.define('app-web-page-viewer-unauth-component',webViewUnAuth); 
    // registerRatingComponent(injector);
    registerFileUploadComponent(injector);
    registerSingleFileUploadComponent(injector);
    registerLookupComponent(injector);
    // registerWellComponent(injector)
    registerUniqueIdComponent(injector);
    registerCustomSelectComponent(injector);
    // registerCurrentDateComponent(injector);
    registerRqComponent(injector);
  }

  public ngDoBootstrap(appRef: ApplicationRef): void {
    // if (document.querySelector('app-root')) {
    //   appRef.bootstrap(AppComponent);
    // }
     if (document.querySelector('app-create-form-component')) {
      appRef.bootstrap(CreateFormComponent);
     }
    // if (document.querySelector('app-submit-form-component')) {
    //   appRef.bootstrap(SubmitFormComponent);
    // }
    // if (document.querySelector('app-form-builder')) {
    //   appRef.bootstrap(CustomFormBuilderComponent);
    // }
  }
}
