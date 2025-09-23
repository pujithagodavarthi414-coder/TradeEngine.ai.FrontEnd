import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(translate: TranslateService) {
    console.log('test 2');
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }
}
