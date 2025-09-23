import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SnovasysMessageBoxModule } from "@thetradeengineorg1/snova-message-box";
import { TimeagoModule } from "ngx-timeago";
import { FormioModule } from "angular-formio";
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AvatarModule } from 'ngx-avatar';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { ViewCustomFormComponent } from './components/view-custom-form.component';
import { ViewCustomFormHistoryComponent } from './components/view-custom-field-history.component';
import { CustomFieldHistoryComponent } from './components/custom-field-history.component';
import { CustomFieldsComponent } from './components/custom-field.component';
import { CustomFieldAppComponent } from './components/custom-fields-app.component';
import { CustomFormsComponent } from './components/custom-form.component';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { CustomFieldHistoryPipe } from './pipes/custom-field-history.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { SnovasysAvatarModule } from  '@thetradeengineorg1/snova-avatar';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from './store/reducers/index';
import * as customFiledEffects from './store/effects/index';

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.co.uk/assets/i18n/', '.json');
}

const components = [CustomFieldHistoryComponent, CustomFieldsComponent, CustomFieldAppComponent,
  CustomFormsComponent, ViewCustomFormHistoryComponent, ViewCustomFormComponent, 
  SoftLabelPipe,
  CustomAppBaseComponent, 
  CustomFieldHistoryPipe, RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe
];

@NgModule({
  declarations: components,
  imports: [
    RouterModule,
    CommonModule,
    AvatarModule,
    FlexLayoutModule,
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
    FontAwesomeModule,
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
    AvatarModule,
    SnovasysAvatarModule,
    NgSelectModule,
    SnovasysMessageBoxModule,
    MatListModule,
    FormioModule,
    StoreModule.forFeature("common", reducers.reducers),
    EffectsModule.forFeature(customFiledEffects.allCommonModuleEffects),
    ToastrModule.forRoot({
      timeOut: 5000
    })
  ],
  entryComponents: [CustomFieldHistoryComponent, CustomFieldsComponent, CustomFieldAppComponent,
    CustomFormsComponent, ViewCustomFormHistoryComponent, ViewCustomFormComponent,
    CustomAppBaseComponent],
  exports: components,
  providers: [
    SoftLabelPipe, CustomFieldHistoryPipe, RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CustomFieldsComponentModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}
