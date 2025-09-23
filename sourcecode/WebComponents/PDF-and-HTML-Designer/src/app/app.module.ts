import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DocumentEditorAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { ToolbarModule, TabModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule, ComboBoxModule, DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SliderModule, NumericTextBoxModule, ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DocumentEditormainComponent } from './components/document-editor/document-editor.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DocumentService } from './services/document.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PreviewComponent } from './components/preview/preview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { GridModule } from '@progress/kendo-angular-grid';
import '@progress/kendo-ui';
import { MongoQueryEditorComponent } from './components/mongo-query-editor/mongo-query-editor-component';
import { MatDialogModule, MatDialogRef ,MAT_DIALOG_DATA ,} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JwtInterceptor } from './intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { ProfilePipe } from './pipes/profile-pipe';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DocumentEditormainComponent,
    MongoQueryEditorComponent,
    TitlebarComponent,
    PreviewComponent,
    ProfilePipe
  ],
  imports: [
    BrowserModule,
    DocumentEditorAllModule,
    DocumentEditorContainerModule,
    ToolbarModule,
    TabModule,
    DropDownListModule,
    ComboBoxModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    SliderModule,
    NumericTextBoxModule,
    ColorPickerModule,
    TreeViewModule,
    DialogModule,
    GridModule,
    FontAwesomeModule,
    TreeViewModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSnackBarModule,

    ToastrModule.forRoot({
      timeOut: 5000
    })
  ],
  providers: [DocumentService,PageService, SortService, FilterService, GroupService,ToastrService ,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService,ProfilePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DocumentEditormainComponent,
    MongoQueryEditorComponent,
    PreviewComponent
  ]
})
export class AppModule { 
  constructor(private injector: Injector) {
    const createlayout = createCustomElement(LayoutComponent, {injector});
    customElements.define('app-layout-component',createlayout)
  }
}
