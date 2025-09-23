import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }

  dashboardId = "1D1008B9-1133-496A-B9C5-0001075516C5";
}
