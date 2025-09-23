import { CommonModule, DatePipe } from "@angular/common";
import { NgModule, ModuleWithProviders, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgSelectModule } from "@ng-select/ng-select";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DragulaModule } from "ng2-dragula";
import { ColorPickerModule } from "ngx-color-picker";
// import { NgxFloatButtonModule } from "ngx-float-button";
import { AllProjectsPageComponent } from "../snovasys-projects/containers/allprojects.page";
import { ProjectManagementComponentsModule } from "./components/pm-components.module";
import { AllgoalsComponent } from "./containers/allgoals.page";
import { ProjectOverViewComponent } from "./containers/project-overview.page";
import { ProjectStatusPageComponent } from "./containers/projectStatus.page";
import * as ProjectManagementEffects from "./store/effects/index";
import * as projectReducers from "./store/reducers/index";
import { GridModule } from "@progress/kendo-angular-grid";
import { NgxGalleryModule } from 'ngx-gallery-9';
import { WorkItemUploadPopupComponent } from "./components/dialogs/work-item-upload.component";
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {SnovasysMessageBoxModule} from "@snovasys/snova-message-box"
import { WorkFlowTriggerDialogComponent } from '../globaldependencies/components/workflow-trigger-dialog.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../globaldependencies/components/featurecomponentbase';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { DropZoneModule } from "@snovasys/snova-file-uploader";
import { GoogleAnalyticsService } from '../globaldependencies/services/google-analytics.service';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { AppStoreDialogComponent } from './components/dialogs/app-store-dialog.component';
import { projectModulesInfo } from './models/projectModulesInfo';
import { ProjectModulesService } from './services/project.modules.service';
import { ProjectsAreaComponent } from './components/projects-area.component';
import { ProjectRolesComponent } from './components/project-roles.component';
import { ProjectReportsAndSettingsComponent } from './components/projects-reports-and-settings';
import { AdhocUniqueDetailComponent } from "./components/adhoc-work/adhoc-unique-detail.component";

export const COMPONENTSS = [AllProjectsPageComponent,
  ProjectStatusPageComponent,
  AllgoalsComponent,
  ProjectOverViewComponent,
  WorkItemUploadPopupComponent,
  WorkFlowTriggerDialogComponent,
  AppFeatureBaseComponent,
  CustomAppBaseComponent,
  AppStoreDialogComponent,ProjectsAreaComponent,ProjectRolesComponent,ProjectReportsAndSettingsComponent
  ];
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
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
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    DragulaModule,
    RouterModule,
    TranslateModule,
    MatTooltipModule,
    ColorPickerModule,
    ReactiveFormsModule,
    SnovasysAvatarModule,
    StoreModule.forFeature("projectManagement", projectReducers.reducers),
    EffectsModule.forFeature(ProjectManagementEffects.allProjectModuleEffects),
    ProjectManagementComponentsModule,
    SatPopoverModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    // NgxFloatButtonModule,
    NgSelectModule,
    DropZoneModule,
    MatAutocompleteModule,
    TranslateModule,
    LayoutModule,
    MatExpansionModule,
    GridModule,
    NgxGalleryModule,
    SnovasysMessageBoxModule,
    DynamicModule,
    DynamicModule.withComponents([]),
  ],
  declarations: COMPONENTSS,
  exports: [COMPONENTSS, AdhocUniqueDetailComponent],
  entryComponents: [WorkItemUploadPopupComponent,WorkFlowTriggerDialogComponent,AppStoreDialogComponent],
  
  providers: [DatePipe,
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    GoogleAnalyticsService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class ProjectsModule {
  static forChild(config: projectModulesInfo): ModuleWithProviders<ProjectsModule> {
    return {
      ngModule: ProjectsModule,
      providers: [
        {provide: ProjectModulesService, useValue: config },
        {provide: 'ProjectModuleLoader', useValue: config}
      ]
    };
  }
}
