import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  referenceId: string = 'b3d6d99d-68f0-4f57-9a61-801ba87556d1'

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }
}
