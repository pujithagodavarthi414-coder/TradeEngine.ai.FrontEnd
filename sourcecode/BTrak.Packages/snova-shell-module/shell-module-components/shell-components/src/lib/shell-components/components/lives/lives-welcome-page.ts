import { Component, OnInit, AfterViewInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, ResolveStart, ResolveEnd, NavigationStart, NavigationCancel, NavigationError, Event, } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-lives-welocme-page",
    templateUrl: "./lives-welcome-page.html"
})

export class LiveWelcomePageComponent implements OnInit {


    constructor(
        private router: Router,
        public translate: TranslateService
    ) {
    }
    ngOnInit() {
    }
    navigateToModule() {
        this.router.navigate(['lives/lives-search']);
    }
}
