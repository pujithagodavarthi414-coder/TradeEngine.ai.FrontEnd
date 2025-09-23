import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { HrComponentsModule } from 'module/module-components/src/lib/hrmanagment/components/hr-components.module';
//import { HrmanagmentModule } from 'module/module-components/src/lib/hrmanagment/hrmanagment.module';
//import { FoodOrderModule } from 'module/module-components/src/lib/food-orders/foodOrder.module';
import { CanteenModule } from 'module/module-components/src/lib/canteen/canteen.module';

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
    CanteenModule,
    //FoodOrderModule,
    // HrComponentsModule,
    // HrmanagmentModule,
    //EmployeeListModule,
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
