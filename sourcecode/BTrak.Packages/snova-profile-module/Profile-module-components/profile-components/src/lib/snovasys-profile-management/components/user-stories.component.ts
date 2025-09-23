import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImminentDeadLineData } from '../models/imminentDeadLineData';
import { MyProfileService } from '../services/myProfile.service';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as introJs from 'intro.js/intro.js';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import {SoftLabelPipe} from '../pipes/soft-labels.pipe';

@Component({
    selector: 'app-profile-component-userstories',
    templateUrl: './user-stories.component.template.html'

})
export class UserStoriesComponent implements OnInit {
    softLabels: SoftLabelConfigurationModel[];
    imminentDeadLineDataDetails: ImminentDeadLineData[];
    currentDeadLineDataDetails: ImminentDeadLineData[];
    futuretDeadLineDataDetails: ImminentDeadLineData[];
    previousDeadLineDataDetails: ImminentDeadLineData[];
    anyOperationInProgress: boolean;
    isDashboard: boolean = false;
    dashboardFilters: DashboardFilterModel;
    pageSize: number;
    pageNumber: number;
    sortBy: boolean;
    SortDirectionAsc: boolean;
    employeePresenceData: any;
    totalCount: any;
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    isCanteenModuleAccess: boolean = false;
    isHrModuleAccess: boolean = false;
    isDocumentModuleAccess: boolean = false;
    isAssertModuleAccess: boolean = false;
    isTimeSheetModuleAccess: boolean = false;
    constructor(
        private myProfileService: MyProfileService, private cdRef: ChangeDetectorRef,private router: Router,private route: ActivatedRoute,
        private translateService: TranslateService,private cookieService: CookieService,private softLabel : SoftLabelPipe) {
            this.route.queryParams.subscribe(params => {
                if (!this.multiPage) {
                    this.multiPage = params['multipage'];
                }
            });
    }

    ngOnInit() {
        this.getSoftLabels();
        this.getAllUserStories();
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#us-1',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.US-1'), this.softLabels),
                    position: 'bottom'
                },
                {
                    element: '#us-2',
                    intro: this.translateService.instant('INTROTEXT.US-2'),
                    position: 'bottom'
                },
                {
                    element: '#us-3',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.US-3'), this.softLabels),
                    position: 'bottom'
                },
            ]
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getAllUserStories() {
        this.anyOperationInProgress = true;
        let imminentDeadLineData = new ImminentDeadLineData();
        imminentDeadLineData.pageSize = this.pageSize;
        imminentDeadLineData.pageNumber = this.pageNumber + 1;
        imminentDeadLineData.sortBy = this.sortBy;
        imminentDeadLineData.DependencyText = 'FutureUserStories';
        imminentDeadLineData.SortDirectionAsc = this.SortDirectionAsc;
        this.myProfileService.getAllUserStories(imminentDeadLineData).subscribe((responseData: any) => {
            this.imminentDeadLineDataDetails = responseData.data;
            if (responseData.data.length != 0)
                this.totalCount = this.imminentDeadLineDataDetails[0].totalCount;
                if (this.multiPage == "true") {
                    this.introStart();
                    this.multiPage = null;
                }
            else {
                this.totalCount = 0;
            }
            this.anyOperationInProgress = false;
        });
    }
    public async introStart() {
        await this.delay(3000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.isCanteenModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('573ec90c-3a0b-4ed8-a744-978f3a16cbe5') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/canteen-purchases"], navigationExtras);
            }
            else if (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/induction-work"], navigationExtras);
            }
            else if (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/exit-work"], navigationExtras);
            }
            else if (this.isDocumentModuleAccess =userModules.filter(x =>
                x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/signature-inviations"], navigationExtras);
            }
            else if (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
          });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
