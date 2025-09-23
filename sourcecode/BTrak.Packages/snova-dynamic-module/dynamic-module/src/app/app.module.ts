
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { createCustomElement } from '@angular/elements';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { UploadModule } from '@progress/kendo-angular-upload';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { DailogBoxComponent } from './dailog-box/dailog-box.component';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './globaldependencies/intercepter/jwt.interceptor';
import { EditDailogComponent } from './edit-dailog/edit-dailog.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from 'ngx-toastr';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'https://dev-btrak514.nxusworld.com/assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    AddModuleComponent,
    DailogBoxComponent,
    EditDailogComponent,
  
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    TranslateModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCheckboxModule,
    //RouterModule.forChild(BillingRoutes),
    LayoutModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    TooltipModule,
    UploadModule,
    SortableModule,
    SharedModule,
    GridModule, 
    ExcelModule,
    ChartsModule,
    FontAwesomeModule,
    NgxDropzoneModule,
    DropZoneModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
