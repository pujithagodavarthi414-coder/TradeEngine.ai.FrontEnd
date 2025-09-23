import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { SatPopoverModule } from "@ncstate/sat-popover";
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatCommonModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialogContainer } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";

//training-matrix
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { CustomTrainingCoursesViewComponent } from './components/training-courses-view-component/training-courses-view.component';
import { CustomAddTrainingCourseDialogComponent } from './components/add-new-training-course-component/add-new-training-course.component';
import { CustomTrainingCourseAssignmentComponent } from './components/training-course-assignment-component/training-course-assignment.component';
import { CustomTrainingMatrixViewComponent } from './components/training-matrix-view-component/training-matrix-view.component';
export { TrainingRoutes } from './training-matrix.routes';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

import { AvatarModule } from 'ngx-avatar';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@progress/kendo-angular-grid';
import { RemoveSpecialCharactersPipe } from './dependencies/pipes/removeSpecialCharacters.pipe';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { SoftLabelPipe } from './dependencies/pipes/softlabels.pipes';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { CustomTrainingRecordViewComponent } from './components/training-record-component/training-record.component';
import '../globaldependencies/helpers/fontawesome-icons';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    declarations: [
      CustomAppBaseComponent,
      CustomTrainingCoursesViewComponent,
      CustomAddTrainingCourseDialogComponent,
      CustomTrainingCourseAssignmentComponent,
      CustomTrainingMatrixViewComponent,
      CustomTrainingRecordViewComponent,
      RemoveSpecialCharactersPipe,
      AvatarComponent,
      SoftLabelPipe,
    ],
    imports: [
      OverlayModule,
      PortalModule,
      MatCommonModule,
      CommonModule,
      FlexLayoutModule,
      MatButtonModule,
      TranslateModule,
      SatPopoverModule,
      MatCardModule,
      MatProgressBarModule,
      MatFormFieldModule,
      MatSlideToggleModule,
      FontAwesomeModule,
      MatInputModule,
      FormsModule,
      MatTooltipModule,
      MatIconModule,
      ReactiveFormsModule,
      MatDividerModule,
      MatSnackBarModule,
      MatChipsModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatButtonToggleModule,
      AvatarModule,
      NgSelectModule,
      SnovasysMessageBoxModule,
      GridModule
    ],
    entryComponents: [
      CustomAppBaseComponent,
      CustomTrainingCoursesViewComponent,
      CustomAddTrainingCourseDialogComponent,
      CustomTrainingCourseAssignmentComponent,
      CustomTrainingMatrixViewComponent,
      CustomTrainingRecordViewComponent,
      AvatarComponent,
    ],
    exports: [
      CustomAppBaseComponent,
      CustomTrainingCoursesViewComponent,
      CustomAddTrainingCourseDialogComponent,
      CustomTrainingCourseAssignmentComponent,
      CustomTrainingMatrixViewComponent,
      CustomTrainingRecordViewComponent,
      MatCommonModule
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      TranslateService,
      CookieService,
      SoftLabelPipe,
      { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      { provide: DateAdapter, useClass: MomentUtcDateAdapter },
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {} },
      MatDialog,
      MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
      MatDialogContainer
    ]
  })
export class TrainingMatrixModule {
  constructor() {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}