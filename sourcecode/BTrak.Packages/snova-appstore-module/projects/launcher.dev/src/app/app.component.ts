import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from 'projects/project-components/src/lib/globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(translate: TranslateService,
    cookieService: CookieService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
    cookieService.set(LocalStorageProperties.AddOrEditCustomAppIsRequired, "true", null);
  }
}
