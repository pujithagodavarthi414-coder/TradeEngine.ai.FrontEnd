import { NgModule, Injector } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { AvatarModule } from 'ngx-avatar';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { FeedBackComponent } from './components/submit-feedback.component';
import { FeedbackListComponent } from './components/feedbacks-list.component';
import { SubmitBugComponent } from './components/bug-feedback.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { TimeagoModule } from "ngx-timeago";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from './store/reducers/index';
import * as feedbackEffects from './store/effects/index';
import { SoftLabelPipe } from './pipes/softlabels.pipes';

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.co.uk/assets/i18n/', '.json');
}

@NgModule({
  declarations: [CustomAppBaseComponent, SubmitBugComponent, FeedbackListComponent, FeedBackComponent,
    RemoveSpecialCharactersPipe, UtcToLocalTimePipe,SoftLabelPipe],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    AvatarModule,
    NgxGalleryModule,
    MatGridListModule,
    MatRadioModule,
    SnovasysAvatarModule,
    NgxDropzoneModule,
    DropZoneModule,
    TimeagoModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatDatepickerModule,
    SatPopoverModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCheckboxModule,
    SnovasysMessageBoxModule,
    InfiniteScrollModule,
    MatListModule,
    StoreModule.forFeature("shared", reducers.reducers),
    EffectsModule.forFeature(feedbackEffects.allSharedModuleEffects),
  ],
  entryComponents: [SubmitBugComponent, FeedbackListComponent, FeedBackComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    RemoveSpecialCharactersPipe,
    UtcToLocalTimePipe,
    SoftLabelPipe
  ],
  exports: [SubmitBugComponent, FeedbackListComponent, FeedBackComponent]
})

export class FeedbackModule {
  constructor(private injector: Injector) {
  }
}
