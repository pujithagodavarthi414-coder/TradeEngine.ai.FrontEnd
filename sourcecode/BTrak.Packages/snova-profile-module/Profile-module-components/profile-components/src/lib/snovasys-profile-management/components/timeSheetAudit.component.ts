import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TimeSheetAuditModel } from '../models/timeSheetAuditModel';
import { TimeFeedHistoryModel } from '../models/time-feed-history-model';
import { MyProfileService } from '../services/myProfile.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Page } from '../models/Page.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-profile-component-timeSheetAudit',
  templateUrl: 'timeSheetAudit.component.html'
})

export class TimeSheetAuditComponent extends CustomAppBaseComponent implements OnInit {

  maxDate = new Date();
  DateFrom = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
  minDate = this.DateFrom;
  DateTo = new Date();
  page = new Page();
  SortBy: string;
  SortDirection: string;

  timeSheetAuditModel: TimeSheetAuditModel;
  timeSheetAudit: TimeFeedHistoryModel[];
  introJS = new introJs();
  multiPage: string = null;
  userId: string = '';
  isTimeSheetModuleAccess: boolean = false;
  isHrModuleAccess: boolean = false;

  constructor(private datePipe: DatePipe, private myProfileService: MyProfileService, private routes: Router,
    private cookieService: CookieService,private route: ActivatedRoute, private translateService: TranslateService) {
    super();
    this.route.queryParams.subscribe(params => {
      if (!this.multiPage) {
          this.multiPage = params['multipage'];
      }
  });
  }

  ngOnInit() {
    super.ngOnInit();
    this.page.size = 20;
    this.page.pageNumber = 0;
    this.getAllTimeSheets();
  }
  ngAfterViewInit() {
    this.introJS.setOptions({
      steps: [
        {
          element: '#ta-1',
          intro: this.translateService.instant('INTROTEXT.TA-1'),
          position: 'bottom'
        },
        {
          element: '#ta-2',
          intro: this.translateService.instant('INTROTEXT.TA-2'),
          position: 'bottom'
        },
      ]
    });
  }

  getAllTimeSheets() {
    let timeSheetModel = new TimeSheetAuditModel();
    if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
      timeSheetModel.UserId = this.routes.url.split("/")[3];
    }
    let datefrom = this.DateFrom;
    let dateto = this.DateTo;
    timeSheetModel.DateFrom = datefrom;
    timeSheetModel.DateTo = dateto;
    timeSheetModel.PageNumber = this.page.pageNumber + 1;
    timeSheetModel.PageSize = this.page.size;
    timeSheetModel.SortBy = this.SortBy;
    timeSheetModel.SortDirection = this.SortDirection;
    this.myProfileService.getAllTimeSheets(timeSheetModel)
      .subscribe((responseData: any) => {
        this.timeSheetAudit = responseData.data;
        this.page.totalElements = this.timeSheetAudit.length > 0 ? this.timeSheetAudit[0].totalCount : 0;
        this.page.totalPages = this.page.totalElements / this.page.size;
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
      }
      });
  }

  onDateFromChange(event) {
    this.DateFrom = event.target.value;
    this.minDate = this.DateFrom;
    this.getAllTimeSheets();
  }

  onDateToChange(event) {
    this.DateTo = event.target.value;
    this.getAllTimeSheets();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllTimeSheets();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.SortBy = sort.prop;
    if (sort.dir === 'asc')
      this.SortDirection = "ASC";
    else
      this.SortDirection = "DESC";
    this.getAllTimeSheets();
  }
  public async introStart() {
    await this.delay(2000);
    const navigationExtras: NavigationExtras = {
        queryParams: { multipage: true },
        queryParamsHandling: 'merge',
        //preserveQueryParams: true
    }

    this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
      this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
      let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
    });
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
