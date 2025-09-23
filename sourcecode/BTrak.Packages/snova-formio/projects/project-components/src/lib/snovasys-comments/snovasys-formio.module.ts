import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  HttpClientModule, HTTP_INTERCEPTORS
} from "@angular/common/http";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule, MatRippleModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import "./globaldependencies/helpers/fontawesome-icons"
import { FlexLayoutModule } from "@angular/flex-layout";
import { TimeagoModule } from "ngx-timeago";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { registerFileUploadComponent } from './file-uploader/file-uploader.formio';
import { FileSizePipe } from './pipes/filesize-pipe';
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FormioModule, Formio, FormBuilderComponent } from 'angular-formio';

import FormioContrib from './data-source/index';
(Formio as any).use(FormioContrib);
import { FileUploadComponent } from './file-uploader/file-upload.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CustomFormBuilderComponent } from './form-builder/form-builder.component';
import FormioContribLookup from './lookup/index';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { JwtInterceptor } from './globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilderService } from './services/formBuilderService';
import { FormService } from './services/formService';
import "./globaldependencies/helpers/fontawesome-icons"
(Formio as any).use(FormioContribLookup);

const components = [FileUploadComponent,
  CustomFormBuilderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatDialogModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatExpansionModule,
    SatPopoverModule,
    TimeagoModule.forChild(),
    FlexLayoutModule,
    TranslateModule.forChild(),
    NgxGalleryModule,
    NgxDropzoneModule,
    NgxDocViewerModule,
    FormioModule,
  ],
  declarations: components,
  exports: [components
  ],
  providers: [
    RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe, DatePipe, FileSizePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    TranslateService,
    CookieService,
    FormService,
    FormBuilderService,
  ]
})
export class SnovasysFormioModule { }
