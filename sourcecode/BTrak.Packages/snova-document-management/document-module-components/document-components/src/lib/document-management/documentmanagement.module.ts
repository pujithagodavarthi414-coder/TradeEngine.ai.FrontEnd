import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularSplitModule } from "angular-split";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
// import { SharedModule } from 'app/shared/shared.module';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from "@ngx-translate/core";
import { GridModule } from "@progress/kendo-angular-grid";

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as DocumentManagementEffects from './store/effects/index';
import * as reducers from './store/reducers/index';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { AddFolderComponent } from './components/add-folder.component';
import { DeleteFolderAndFileComponent } from './components/delete-folder-and-file.component';
import { DocumentStoreAppComponent } from './components/document-store-app.component';
import { DocumentStoreComponent } from './components/document-store.component';
import { DocumentTreeView } from './components/document-tree-view.component';
import { FoldresFilesListComponent } from './components/folders-files-list.component';
import { ViewStoreComponent } from './components/view-store.component';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SanitizeHtmlPipe } from './pipes/sanitize.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreManagementService } from './services/store-management.service';
import { AvatarModule, AvatarSource } from 'ngx-avatar';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { RouterModule } from '@angular/router';
import { DocumentManagementComponent } from './containers/document-management.page';
import { FileSizePipe } from './pipes/filesize-pipe';
import { StoreManagementComponent } from './components/store-management.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { DocumentManagementRoutes } from './documentmanagement.routing';
import { ToastrModule } from 'ngx-toastr';
import { NgxDocViewerModule } from 'ngx-doc-viewer'; 


const components = [AddFolderComponent, DeleteFolderAndFileComponent, DocumentStoreAppComponent,
  DocumentStoreComponent, DocumentTreeView, FoldresFilesListComponent, StoreManagementComponent,
  ViewStoreComponent, CustomAppBaseComponent, DocumentManagementComponent];

const avatarColors = ["#0000FF", "#A52A2A", "#D2691E", "#8B008B", "#8B0000", "#008000"];
const avatarSourcePriorityOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS]

@NgModule({
  declarations: [AddFolderComponent, DeleteFolderAndFileComponent, DocumentStoreAppComponent,
    DocumentStoreComponent, DocumentTreeView, FoldresFilesListComponent, StoreManagementComponent,
    ViewStoreComponent, CustomAppBaseComponent, DocumentManagementComponent,
    SanitizeHtmlPipe, FetchSizedAndCachedImagePipe, FileSizePipe, RemoveSpecialCharactersPipe, SoftLabelPipe],
  imports: [
    CommonModule,
    RouterModule,
    //RouterModule.forChild(DocumentManagementRoutes),
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SatPopoverModule,
    TranslateModule,
    DropZoneModule,
    ToastrModule,
    NgxDropzoneModule,
    NgxDocViewerModule,
    // SharedModule
    StoreModule.forFeature("documentManagement", reducers.reducers),
    EffectsModule.forFeature(DocumentManagementEffects.allDocumentModuleEffects),
    AvatarModule.forRoot({
      colors: avatarColors,
      sourcePriorityOrder: avatarSourcePriorityOrder
    }),
    NgxDropzoneModule,
    GridModule,
    NgxGalleryModule,
    TreeViewModule,
    MatSlideToggleModule,
    SnovasysMessageBoxModule,
    AngularSplitModule,
    EditorModule,
  ],
  // entryComponents: components,
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe, SanitizeHtmlPipe, FetchSizedAndCachedImagePipe, FileSizePipe,
    RemoveSpecialCharactersPipe, SoftLabelPipe,
    GoogleAnalyticsService, CookieService, StoreManagementService],
  exports: components
})
export class DocumentManagementModule { }
