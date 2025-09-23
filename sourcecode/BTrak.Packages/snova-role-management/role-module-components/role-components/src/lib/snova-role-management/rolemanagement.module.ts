import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DATE_FORMATS,MAT_DATE_LOCALE,DateAdapter } from "@angular/material/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';


import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';


import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
// import { NgMasonryGridModule } from 'ng-masonry-grid';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SatPopoverModule } from '@ncstate/sat-popover';

import { RoleManagementContainerComponent } from './containers/role-management';
import { EntityPermissionsComponent } from './components/entity-permissions.component';
import { RolePermissionsComponent } from './components/role-permissions.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MapToKeysPipe } from './pipes/groupBy.pipe';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';

import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { SoftLabelPipe } from './pipes/softlabels.pipes';

import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { CapitalizeFirstPipe } from './pipes/capitalizeFirst.pipe';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { CookieService } from 'ngx-cookie-service';
import { RoleManagementRoutes } from './rolemanagement.routing';
import { RoleDialogComponent } from './components/role-dialog.component';
import { EntityRoleDialogComponent } from './components/entity-role-dialog.component';

export const COMPONENTS = [CustomAppBaseComponent, RoleDialogComponent,EntityRoleDialogComponent, RoleManagementContainerComponent, SoftLabelPipe, MapToKeysPipe, CapitalizeFirstPipe, RolePermissionsComponent, EntityPermissionsComponent];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    FontAwesomeModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    RouterModule,
    // RouterModule.forChild(RoleManagementRoutes),
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // NgMasonryGridModule,
    PerfectScrollbarModule,
    MatTooltipModule,
    TranslateModule,
    ReactiveFormsModule,
    SatPopoverModule,
    SnovasysMessageBoxModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  entryComponents:[RoleDialogComponent, EntityRoleDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    SoftLabelPipe,
    MapToKeysPipe,
    CapitalizeFirstPipe,
    TranslateService,
    CookieService
  ]
})
export class RoleManagementModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}