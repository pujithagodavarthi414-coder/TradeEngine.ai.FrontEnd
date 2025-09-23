import { Component, OnInit, Input, OnDestroy, Renderer2, ChangeDetectionStrategy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as sharedModuleReducers from "../../store/reducers/index";
import { Observable } from "rxjs";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ThemeModel } from '../../models/themes.model';
import { UserModel } from '../../models/user';
import { LayoutService } from '../../services/layout.service';
import { ThemeService } from '../../services/theme.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-header-top",
  templateUrl: "./header-top.component.html",
})

export class HeaderTopComponent implements OnInit, OnDestroy {
  themeModel$: Observable<ThemeModel>;
  layoutConf: any;
  menuItems: any;
  egretThemes: any[] = [];
  currentLang = "en";
  availableLangs = [
    {
      name: "English",
      code: "en"
    },
    {
      name: "తెలుగు",
      code: "te"
    },
    {
      name: "한국어",
      code: "ko"
    }
  ];
  @Input() notificPanel;
  authenticatedUserRecord$: Observable<UserModel>;

  constructor(
    private layout: LayoutService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private store: Store<State>,
    public cookieService: CookieService,
    
  ) { }

  ngOnInit() {
    this.themeModel$ = this.store.pipe(select(sharedModuleReducers.getThemeModel));
    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;
    this.authenticatedUserRecord$ = this.store.pipe(
      select(sharedModuleReducers.getAuthenticatedUserModel)
    );
  }

  ngOnDestroy() { }

  setLang() {

    this.translate.use(this.currentLang);
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);

    if (currentCulture === 'null' || currentCulture === 'undefined') {
        currentCulture = 'en';
    }
    this.currentLang = currentCulture;
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.set(LocalStorageProperties.CurrentCulture, this.currentLang, null, environment.cookiePath, window.location.hostname, false, "Strict");
  }

  changeTheme(theme) {
    // this.themeService.changeTheme(this.renderer, theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === "closed") {
      return this.layout.publishLayoutChange({
        sidebarStyle: "full"
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: "closed"
    });
  }
}
