import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from 'module/module-components/src/lib/globaldependencies/constants/constant-variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  moduleTypeId = 17;
  referenceTypeId = "88944C8E-97F3-4736-935F-4A0530E39876";
  selectedStoreId: null;
  referenceId : "c896b38e-9383-4d0b-a1d8-364c6e7f1ec6"
  isButtonVisible = true;


  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
