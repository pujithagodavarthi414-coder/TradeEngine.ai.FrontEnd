import { NgModule, Injector } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { DigitOnlyModule } from '@uiowa/digit-only';

import * as dropzoneReducers from './dropzone/store/reducers/index';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { LayoutModule } from '@angular/cdk/layout';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AvatarComponent } from 'ngx-avatar/lib/avatar.component';
import { CookieService } from 'ngx-cookie-service';
import { MomentUtcDateAdapter } from './globaldependencies/helpers/moment-utc-date-adapter';
import { FileUploadService } from './dropzone/services/fileUpload.service';
import { SoftLabelConfigurationService } from './dropzone/services/softlabels.service';
import { StoreManagementService } from './dropzone/services/store-management.service';
import { JwtInterceptor } from './globaldependencies/helpers/jwt.interceptor';
import { reducers, metaReducers } from '../store/reducers/index';
import { FileSizePipe } from './dropzone/pipes/filesize-pipe';
import { SoftLabelPipe } from './dropzone/pipes/softlabels.pipes';
import { FetchSizedAndCachedImagePipe } from './dropzone/pipes/fetchSizedAndCachedImage.pipe';
import * as  AllCommonModuleEffects from "./dropzone/store/effects/index";
import { DropZoneComponent } from './dropzone/containers/dropzone.component';
import { DropZoneModule } from './dropzone/dropzone.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// export function HttpLoaderFactory(httpClient: HttpClient) {
//   console.log('inside http loader child');
//   return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.co.uk/assets/i18n/', '.json');
// }
const dialogMock = {
  close: () => { }
};

@NgModule({
  declarations: [
    CustomAppBaseComponent,
    DropZoneComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    SatPopoverModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NgxDatatableModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // }),
    //training-matrix
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    StoreModule.forFeature("common", dropzoneReducers.reducers),
    EffectsModule.forFeature(AllCommonModuleEffects.allCommonModuleEffects),
    DropZoneModule
  ],
  // entryComponents: [
    // // FileSizePipe,
    // // SoftLabelPipe,
    // // FetchSizedAndCachedImagePipe,
    // DropZoneComponent
  // ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    FileUploadService,
    SoftLabelConfigurationService,
    StoreManagementService,
    TranslateService,
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class ProjectComponentsModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}
