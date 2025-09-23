import { CommonModule } from "@angular/common";
import {
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  ModuleWithProviders
} from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgSelectModule } from "@ng-select/ng-select";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { GridsterModule } from "angular-gridster2";
import { HeatMapDatePipe } from "../globaldependencies/pipes/heat-map-date-pipe";
import { MomentUtcDateAdapter } from "../globaldependencies/directives/moment-utc-date-adapter";
import { PaletteLabelPipe } from "../globaldependencies/pipes/palette-label.pipe";
import { AppDialogComponent } from "./components/app-dialog/app-dialog.component";
import { HiddenWorkspaceslistComponent } from "./components/hiddenworkspaces/hiddenworkspaceslist.component";
import { TabsViewComponent } from "./components/tabs-view/tabs-view.component";
import { WidgetsgridsterComponent } from "./components/widgetsgridster/widgetsgridster.component";
import { AppTagsFilterPipe } from "../globaldependencies/pipes/app-tags-filter.pipe";
import { WidgetNameFilterPipe } from "../globaldependencies/pipes/widgets-name-filter.pipe";
import { EditorModule } from "@tinymce/tinymce-angular";
import * as WidgetManagementEffects from "./dependencies/store/effects/index";
import * as reducers from "./dependencies/store/reducers/index";
export { WidgetRoutes } from "./widget.routing";

import { CustomAppsListViewComponent } from "./components/custom-apps-listview/custom-apps-listview.component";
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase'
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { CustomAppFilterComponent } from './components/app-custom-filter/app-custom-filter.component';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { NgMessageTemplateDirective } from '../globaldependencies/directives/message-box.directive';
import { sentencePipe } from '../globaldependencies/pipes/sentence-case.pipe';
import { AvatarSource, AvatarModule } from "ngx-avatar";
import { DynamicModule } from '@thetradeengineorg1/snova-ndc-dynamic';
import { CookieService } from "ngx-cookie-service";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import "../globaldependencies/helpers/fontawesome-icons";
import { WidgetRoutes } from './widget.routing';
import { ModulesService } from './dependencies/services/modules.service';
import { modulesInfo } from './dependencies/models/modulesInfo';
import { WidgetLoadingComponent } from './components/widget-loading-component/widgetloading.component';

import { DragulaModule } from "ng2-dragula";
const avatarColors = ["#0000FF", "#A52A2A", "#D2691E", "#8B008B", "#8B0000", "#008000"];
const avatarSourcePriorityOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS]
import { AngularSplitModule } from 'angular-split';
import { WINDOW_PROVIDERS } from '../globaldependencies/helpers/window.helper';
import { FilteredListviewComponent } from './components/apps-filtes-listview/apps-filters-listview';
import { SelectAllComponent } from "./components/select-all/select-all.component";
import { ListViewFilterComponent } from './components/list-view-filter/list-view-filter.component';


export const MY_FORMATS = {
  parse: {
    dateInput: "DD-MMM-YYYY"
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: "DD-MMM-YYYY"
  }
};

@NgModule({
  imports: [
    DynamicModule.withComponents([]),
    RouterModule,
    MatSnackBarModule,
    SatPopoverModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    CommonModule,
    MatAutocompleteModule,
    GridsterModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    NgSelectModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    DragulaModule,
    EditorModule,
    StoreModule.forFeature("widgetManagement", reducers.reducers),
    EffectsModule.forFeature(WidgetManagementEffects.allWidgetModuleEffects),
    AngularSplitModule,
    AvatarModule.forRoot({
      colors: avatarColors,
      sourcePriorityOrder: avatarSourcePriorityOrder
    }),
  ],
  declarations: [AppDialogComponent, HiddenWorkspaceslistComponent, CustomAppBaseComponent,
    TabsViewComponent, WidgetNameFilterPipe, AppTagsFilterPipe, HeatMapDatePipe,
    PaletteLabelPipe, WidgetsgridsterComponent, CustomAppsListViewComponent, SoftLabelPipe,
    CustomAppFilterComponent, FilteredListviewComponent, AvatarComponent, RemoveSpecialCharactersPipe,
    MessageBoxComponent, SelectAllComponent, NgMessageTemplateDirective, sentencePipe,
    WidgetLoadingComponent,ListViewFilterComponent
  ],
  exports: [AppDialogComponent, HiddenWorkspaceslistComponent, CustomAppBaseComponent,
    TabsViewComponent, WidgetNameFilterPipe, AppTagsFilterPipe, HeatMapDatePipe,
    PaletteLabelPipe, WidgetsgridsterComponent, CustomAppsListViewComponent, SoftLabelPipe,
    CustomAppFilterComponent, FilteredListviewComponent, AvatarComponent, RemoveSpecialCharactersPipe,
    MessageBoxComponent, NgMessageTemplateDirective, sentencePipe, WidgetLoadingComponent,ListViewFilterComponent
  ],
  entryComponents: [
    WidgetsgridsterComponent,
    WidgetLoadingComponent,
    CustomAppsListViewComponent,
    TabsViewComponent,
    HiddenWorkspaceslistComponent,
    AppDialogComponent,
    FilteredListviewComponent,
    SelectAllComponent
  ],
  providers: [
    WINDOW_PROVIDERS,
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, HeatMapDatePipe, PaletteLabelPipe, SoftLabelPipe, CookieService, DatePipe,
    CurrencyPipe, WidgetNameFilterPipe,
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class WidgetModule {
  static forChild(config: modulesInfo): ModuleWithProviders<WidgetModule> {
    return {
      ngModule: WidgetModule,
      providers: [
        { provide: ModulesService, useValue: config },
        { provide: 'ModulesService', useValue: config }
      ]
    };
  }
}
