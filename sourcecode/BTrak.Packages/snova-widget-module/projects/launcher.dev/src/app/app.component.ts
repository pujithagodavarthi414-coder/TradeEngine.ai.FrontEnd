import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  id:string="0837a7e2-f420-40bf-abea-ce31f2c15dbe";
  constructor(translate: TranslateService
    ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
