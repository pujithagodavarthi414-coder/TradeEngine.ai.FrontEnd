import { Component, OnInit, AfterViewInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, ResolveStart, ResolveEnd, NavigationStart, NavigationCancel, NavigationError, Event, } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { of } from "rxjs";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from "../../constants/localstorage-properties";
import { HRManagementService } from "../../services/hr-management.service";

@Component({
    selector: "app-lives-welocme-page",
    templateUrl: "./lives-welcome-page.html"
})

export class LiveWelcomePageComponent implements OnInit {
    companyMainLogo: any = "https://bviewstorage.blob.core.windows.net/3d19eb4e-9015-4e83-9d1f-2a2936e0c171/hrm/b52ce424-5d4d-49d4-8d0f-eea378853d39/version-1/lives.jpg";
    selectedLangulage: any='english';

    constructor(
        private router: Router,
        public translate: TranslateService,
        private cookieService: CookieService,
        private hrManagementService: HRManagementService
    ) {  
        this.selectedLangulage = 'english';
        var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
        if(this.companyMainLogo == "" || this.companyMainLogo == null || this.companyMainLogo == undefined) {
          this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
        } 
    }
    ngOnInit() {
    var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
    if(this.companyMainLogo == "" || this.companyMainLogo == null || this.companyMainLogo == undefined) {
      this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    } 
    }
    navigateToModule() {
        this.router.navigate(['lives/lives-search']);
    }
    changeLanguage(lang){
        this.selectedLangulage = lang;
    }
    getStyleForLang(lang){
        if(this.selectedLangulage == 'english' && lang == 'english'){
            return 'btn-warning mr-05';
        } else if(this.selectedLangulage == 'bahasa' && lang == 'bahasa'){
            return 'btn-warning';
        } else if(lang == 'english'){
            return 'btn-warning-unselect mr-05';
        } else if(lang == 'bahasa'){
            return 'btn-warning-unselect';
        }
    }

    getTheme() {
        this.hrManagementService.getThemes().subscribe((response: any) => {
          if (response.success) {
            this.companyMainLogo = response[0].companyMainLogo;
          }
        });
      }
}
