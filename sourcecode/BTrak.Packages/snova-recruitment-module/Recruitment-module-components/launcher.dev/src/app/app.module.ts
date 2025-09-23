
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RecruitmentmanagementAppModule } from 'Recruitment-module-components/recruitment-components/src/lib/snovasys-recruitment-management-apps/recruitmentmanagementapp.module';
// import { AssetRoutes } from 'Assets-module-components/assets-components/src/lib/snovasys-asset-management/assetmanagement.routes';
// import { AssetmanagementModule } from 'Assets-module-components/assets-components/src/lib/snovasys-asset-management/assetmanagement.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'https://btrak643-development.snovasys.com/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // RouterModule.forRoot(AssetRoutes),
    RouterModule.forRoot([]),
    BrowserModule,
    HttpClientModule,
    RecruitmentmanagementAppModule,
    // AssetmanagementModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
