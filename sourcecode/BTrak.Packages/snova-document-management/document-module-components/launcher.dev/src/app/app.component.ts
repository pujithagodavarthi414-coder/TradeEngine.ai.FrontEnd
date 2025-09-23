import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  dashboardId = '74CF6BC6-370B-CF20-EA34-479C40001990';
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }
}
