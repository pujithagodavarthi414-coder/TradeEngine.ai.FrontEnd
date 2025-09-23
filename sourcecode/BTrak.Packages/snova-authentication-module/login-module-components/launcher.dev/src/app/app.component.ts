import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from 'login-module-components/login-components/src/lib/globaldependencies/constants/localstorage-properties';
import { WINDOW } from 'login-module-components/login-components/src/lib/snova-authentication/helpers/window.helper';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { ThemeModel } from 'login-module-components/login-components/src/lib/snova-authentication/models/themes.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(translate: TranslateService, private cookieService: CookieService, @Inject(WINDOW) private window: Window,
    public router: Router

  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }

  ngOnInit() {
    localStorage.setItem("Environment", JSON.stringify(environment));

    const defaultThemeModel = new ThemeModel()
    defaultThemeModel.companyThemeId = "0929D35A-3573-4B06-93FB-C7D46AAFA918";
    defaultThemeModel.companyMiniLogo = "assets/images/nxus-logo.png";
    defaultThemeModel.companyMainLogo = "assets/images/nxus-logo.png";
  }
}
