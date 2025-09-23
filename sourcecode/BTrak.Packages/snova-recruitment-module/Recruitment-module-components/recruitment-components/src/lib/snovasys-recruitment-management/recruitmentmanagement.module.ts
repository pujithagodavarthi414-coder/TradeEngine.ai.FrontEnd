import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
// import { LocationManagementPageComponent } from './containers/location-management.page';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
// import * as AssetManagementEffects from './store/effects/index';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxMaskModule } from 'ngx-mask';
import { TimeagoModule } from 'ngx-timeago';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentRoutes } from './recruitment.routes';
import {  JobStatusFilterPipe } from './pipes/jobfilter.pipe';
import { JobStatusColorFilterPipe} from './pipes/jobStatusColor.pipe';
import { JobResponsibleFilterPipe } from './pipes/jobResponsiblePerson.pipes';
import { HiringManagerfilterPipe } from './pipes/hiringManagerFilter.pipes';
import { SortByComparatorPipe } from './pipes/soryByComponent.pipe';
import { AssigneefilterPipe } from './pipes/assigneeFilter.pipe';
import { ManagerFilterPipe } from './pipes/managerFilter.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';



export const appRoutes: Routes = [{ path: '' }];

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

const components = [
  // LocationManagementPageComponent,
  JobStatusFilterPipe,
  HiringManagerfilterPipe,
  SortByComparatorPipe,
  ManagerFilterPipe,
  AssigneefilterPipe,
  JobStatusColorFilterPipe,
  JobResponsibleFilterPipe,
   RemoveSpecialCharactersPipe,
  FetchSizedAndCachedImagePipe,
  CustomAppBaseComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    // StoreModule.forFeature("assetManagement", reducers.reducers),
    // EffectsModule.forFeature(AssetManagementEffects.allAssetModuleEffects),
    MatTooltipModule,
    DigitOnlyModule,
    TranslateModule,
    SatPopoverModule,
    PerfectScrollbarModule,
    TimeagoModule.forChild(),
    NgxMaskModule.forRoot(),
    RouterModule
  ],
  declarations: components,
  exports: components,
  entryComponents: [],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    JobStatusFilterPipe,
    HiringManagerfilterPipe,
    AssigneefilterPipe,
    ManagerFilterPipe,
    SortByComparatorPipe,
    JobStatusColorFilterPipe,
    JobResponsibleFilterPipe,
    RemoveSpecialCharactersPipe,
    FetchSizedAndCachedImagePipe,
    CookieService
  ]
})
export class RecruitmentmanagementModule {
}
