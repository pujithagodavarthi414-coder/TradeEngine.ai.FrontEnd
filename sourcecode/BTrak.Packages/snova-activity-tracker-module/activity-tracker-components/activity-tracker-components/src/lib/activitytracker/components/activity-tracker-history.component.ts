import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ActivityHistoryModel } from '../models/activity-history.model';
import { TimeUsageService } from '../services/time-usage.service';
import * as introJs from 'intro.js/intro.js';

@Component({
    selector: "app-fm-component-activityhistory",
    templateUrl: `activity-tracker-history.component.html`
})

export class ActivityTrackerHistoryComponent extends CustomAppBaseComponent {

    loading: boolean;
    historyDetails: ActivityHistoryModel[] = [];
    pageSizeOptions: number[] = [20, 40, 60, 80, 100];
    pageSize: number = 20;
    pageIndex: number = 0;
    selectedCategory: string;
    introJS = new introJs();
    multiPage: string = null;
    constructor(private timeUsageService: TimeUsageService,
        private toastr: ToastrService,
        private translateService: TranslateService, private routes: Router, private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef) {
        super();
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
        this.introEnable();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getActivityTrackerHistory();
    }
    ngAfterViewInit() {

        //this.introJS.start();
    }


    getActivityTrackerHistory() {
        let historyModel = new ActivityHistoryModel();
        historyModel.pageNumber = this.pageIndex + 1;
        historyModel.pageSize = this.pageSize;
        historyModel.selectedCategory = this.selectedCategory;
        this.loading = true;
        this.timeUsageService.GetActivityTrackerHistory(historyModel).subscribe((response: any) => {
            if (response.success) {
                this.historyDetails = response.data;
            }
            else {
                this.historyDetails = [];
            }
            this.loading = false;
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
        });
    }

    getFilteredAssetComments(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageIndex = 0;
        } else {
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.getActivityTrackerHistory();
    }

    profilePage(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
    }

    reLoad() {
        this.pageSize = 20;
        this.pageIndex = 0;
        this.selectedCategory = null;
        this.getActivityTrackerHistory();
    }

    searchByCategory(event) {
        this.pageSize = 20;
        this.pageIndex = 0;
        this.selectedCategory = event;
        this.getActivityTrackerHistory();
    }

    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            // preserveQueryParams: true
        }

        this.introJS.start().oncomplete(() => {

        });
    }

    introEnable() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#history-1',
                    intro: "It will displays activity tracker configuration history with username, category, action that shuld be perfomed and time when he performed that action.",
                    position: 'top'
                },
                {
                    element: '#history-2',
                    intro: "Here we can get Reload button to reload the data.",
                    position: 'bottom'
                },
                {
                    element: '#history-3',
                    intro: "Here we can get Advanced Search button to perform search operation on the data by category.",
                    position: 'bottom'
                }

            ]
        });
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}