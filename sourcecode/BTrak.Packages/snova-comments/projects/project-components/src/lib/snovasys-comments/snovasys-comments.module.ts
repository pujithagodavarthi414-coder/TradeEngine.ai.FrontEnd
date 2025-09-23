import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditorModule } from "@tinymce/tinymce-angular";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  HttpClientModule
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
import { TranslateModule } from "@ngx-translate/core";
import "./shared/helpers/fontawesom-icons";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from './shared/helpers/moment-utc-date-adapter';

import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { SnovasysCommentsComponent } from './snovasys-comments.component';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SnovasysAppPipesModule } from  '@snovasys/snova-app-pipes';
import { SnovasysCallsComponent } from './snovasys-make-call/snovasys-make-call.component';
import { SnovasysCRMComponent } from './snovasys-crm/snovasys-crm.component';
import { SnovasysCallLogsComponent } from './snovasys-call-log/snovasys-call-log.component';
import { SnovasysLogCallsComponent } from './snovasys-log-call/snovasys-log-call.component';
import { SnovasysPayComponent } from './snovasys-pay/snovasys-pay.component';
import { SnovasysVideoCallComponent } from './snovasys-video-call/snovasys-video-call.component';
import { VideoCallComponent } from './snovasys-video-call/video-call.component';
import { SnovasysVideoPlayComponent } from './snovasys-video-call/video-play.component';
import { SnovasysSmsComponent } from './snovasys-sms/snovasys-sms.component';

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
    EditorModule,
    TimeagoModule.forChild(),
    FlexLayoutModule,
    TranslateModule.forChild(),
    SnovasysAvatarModule,
    SnovasysMessageBoxModule,
    SnovasysAppPipesModule,
    NgxMaterialTimepickerModule,

  ],
  declarations: [
    SnovasysCommentsComponent,
    SnovasysCallsComponent,
    SnovasysCRMComponent,
    SnovasysCallLogsComponent,
    SnovasysLogCallsComponent,
    SnovasysPayComponent,
    SnovasysVideoCallComponent,
    VideoCallComponent,
    SnovasysVideoPlayComponent,
    SnovasysSmsComponent
  ],
  exports:[
    SnovasysCommentsComponent,
    SnovasysCallsComponent,
    SnovasysCRMComponent,
    SnovasysCallLogsComponent,
    SnovasysLogCallsComponent,
    SnovasysPayComponent,
    SnovasysVideoCallComponent,
    VideoCallComponent,
    SnovasysVideoPlayComponent,
    SnovasysSmsComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class SnovasysCommentsModule { }
