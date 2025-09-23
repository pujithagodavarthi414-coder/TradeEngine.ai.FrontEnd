import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
// import { ProjectComponentsModule } from 'projects/project-components/src/lib/project-components.module';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ExpenseManagementModule } from 'billing-module-components/billing-components/src/lib/expensemanagement/expensemanagement.module';
// import { BillingModule } from 'billing-module-components/billing-components/src/lib/billing/billing.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TrainingMatrixModule } from 'projects/project-components/src/lib/training-matrix/training-matrix.module';
// import { ExpenseManagementModel } from 'billing-module-components/billing-components/src/lib/expensemanagement/models/expenses-model';

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('TranslateHttpLoader');
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.com/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    ExpenseManagementModule,
    // BillingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  ngDoBootstrap() {

  }

 }
