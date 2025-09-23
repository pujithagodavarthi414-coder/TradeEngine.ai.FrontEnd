// import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from "angularx-social-login"
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { StoreModule } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";

import { NgxDropzoneModule } from "ngx-dropzone";
import * as reducers from "./store/reducers/index";
import * as CommonModuleEffects from "./store/effects/index";
import { DropZoneComponent } from './containers/dropzone.component';
import { EffectsModule } from '@ngrx/effects';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { FileSizePipe } from './pipes/filesize-pipe';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const classesToInclude = [
  DropZoneComponent,
  FetchSizedAndCachedImagePipe,
  FileSizePipe,
  SoftLabelPipe
]

// export function getAuthServiceConfigs() {
//   let config = new AuthServiceConfig([
//     {
//       id: GoogleLoginProvider.PROVIDER_ID,
//       provider: new GoogleLoginProvider("649948039644-84r79k6962a4t6lb47orgkdppcgb7b6m.apps.googleusercontent.com")
//     }
//   ]);
//   return config;
// }

@NgModule({
  declarations: classesToInclude,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  //  SocialLoginModule,
    MatTableModule,
    StoreModule.forFeature("common", reducers.reducers),
    EffectsModule.forFeature(CommonModuleEffects.allCommonModuleEffects),
    MatTooltipModule,
    FontAwesomeModule,
    TranslateModule,
    MatButtonToggleModule,
    NgxDropzoneModule,
    HttpClientModule,
    MatSnackBarModule,
    NgxGalleryModule
  ],
  exports: [classesToInclude],
  entryComponents: [DropZoneComponent],
  providers: [
    CookieService,
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: getAuthServiceConfigs
    // },
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider("649948039644-84r79k6962a4t6lb47orgkdppcgb7b6m.apps.googleusercontent.com")
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // },
    SoftLabelPipe,
    FetchSizedAndCachedImagePipe,
    FileSizePipe,
    DatePipe
  ]
})
export class DropZoneModule { }
