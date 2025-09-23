import { NgModule, Injector, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { SatPopoverModule } from "@ncstate/sat-popover";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";

import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { RouterModule } from '@angular/router';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import '../globaldependencies/helpers/fontawesome-icons';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { WidgetslistComponent } from "./components/widgetslist/widgetslist.component";
import { AppStoreComponent } from './components/app-store/app-store.component';
import * as WidgetManagementEffects from "./dependencies/store/effects/index";
import * as reducers from "./dependencies/store/reducers/index";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { CreateAppDialogComponet } from './components/create-app-dialog/create-app-dialog.component';
import { CustomAppPopUpComponent } from './components/custom-app-popup/custom-app-popup.component';
import { TagsAndWorkspacesDisplayComponent } from './components/app-tags-worskpaces-display.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragulaModule } from "ng2-dragula";
import { AvatarSource, AvatarModule } from "ngx-avatar";
import { CookieService } from 'ngx-cookie-service';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { AppStoreModulesInfo } from './dependencies/models/appStoreModulesInfo';
import { AppStoreModulesService } from './dependencies/services/app-store.modules.service';
const avatarColors = ["#0000FF", "#A52A2A", "#D2691E", "#8B008B", "#8B0000", "#008000"];
const avatarSourcePriorityOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS]
import { AngularSplitModule } from 'angular-split';
import { OrderByPipe } from '../globaldependencies/pipes/orderby-pipe';
import { CustomAppsListViewComponent } from './components/custom-apps-listview/custom-apps-listview.component';

@NgModule({
  declarations: [
    CustomAppsListViewComponent,
    CustomAppBaseComponent,
    WidgetslistComponent,
    AppStoreComponent,
    CreateAppDialogComponet,
    CustomAppPopUpComponent,
    TagsAndWorkspacesDisplayComponent,
    AvatarComponent,
    SoftLabelPipe,
    OrderByPipe
  ],
  imports: [
    RouterModule,
    CommonModule,
    FlexLayoutModule,
    NgxPaginationModule,
    DynamicModule.withComponents([]),
    AngularSplitModule.forRoot(),
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogModule,
    SatPopoverModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FontAwesomeModule,
    DragulaModule,
    StoreModule.forFeature("widgetManagement", reducers.reducers),
    EffectsModule.forFeature(WidgetManagementEffects.allWidgetModuleEffects),
    AvatarModule.forRoot({
      colors: avatarColors,
      sourcePriorityOrder: avatarSourcePriorityOrder
    })
  ],
  // entryComponents: [
  //   CustomAppPopUpComponent,
  //   TagsAndWorkspacesDisplayComponent,
  //   CustomAppBaseComponent,
  //   WidgetslistComponent,
  //   AppStoreComponent,
  //   AvatarComponent,
  //   CreateAppDialogComponet
  // ],
  exports: [
    CustomAppPopUpComponent,
    TagsAndWorkspacesDisplayComponent,
    CustomAppBaseComponent,
    WidgetslistComponent,
    AppStoreComponent,
    AvatarComponent,
    CreateAppDialogComponet,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    SoftLabelPipe,
    OrderByPipe,
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class AppStoreModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }

  static forChild(config: AppStoreModulesInfo): ModuleWithProviders<AppStoreModule> {
    return {
      ngModule: AppStoreModule,
      providers: [
        { provide: AppStoreModulesService, useValue: config },
        {provide: 'AppStoreModuleLoader', useValue: config}
      ]
    };
  }
}


