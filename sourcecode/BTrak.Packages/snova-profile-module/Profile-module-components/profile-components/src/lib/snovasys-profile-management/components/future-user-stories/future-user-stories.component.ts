import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyProfileService } from '../../services/myProfile.service';
import { ImminentDeadLineData } from '../../models/imminentDeadLineData';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-future-user-stories',
  templateUrl: './future-user-stories.component.html'
})

export class FutureUserStoriesComponent extends CustomAppBaseComponent implements OnInit {
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  futuretDeadLineDataDetails: ImminentDeadLineData[];
  anyOperationInProgress: boolean = false;
  pageSize: number = 10;
  pageNumber: number = 0;
  sortBy: boolean;
  searchText :string;
  employeePresenceData: any;
  totalCount: number = 0;
  sortDirectionAsc: boolean = true;

  constructor(
    private myProfileService: MyProfileService,private cookieService: CookieService,
    private cdRef: ChangeDetectorRef, private routes: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.getAllUserStories();
  }
  
  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    this.pageNumber = 0;
    if (sort.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.pageNumber = 0;
    this.getAllUserStories();
  }

  setPage(data) {
    this.pageNumber = data.offset;
    this.pageSize = 10;
    this.getAllUserStories();
  }

  getAllUserStories() {
    let userId: string;
    this.anyOperationInProgress = true;
    let imminentDeadLineData = new ImminentDeadLineData();
    if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
      userId = this.routes.url.split("/")[3];
    }
    imminentDeadLineData.pageSize = this.pageSize;
    imminentDeadLineData.pageNumber = this.pageNumber + 1;
    imminentDeadLineData.sortBy = this.sortBy;
    imminentDeadLineData.DependencyText = 'FutureUserStories';
    imminentDeadLineData.SortDirectionAsc = this.sortDirectionAsc;
    imminentDeadLineData.SortDirectionAsc = this.sortDirectionAsc;
    imminentDeadLineData.searchText = this.searchText;
    imminentDeadLineData.OwnerUserId = userId ? userId : this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.myProfileService.getAllUserStories(imminentDeadLineData).subscribe((responseData: any) => {
      this.anyOperationInProgress = false;
      this.futuretDeadLineDataDetails = responseData.data;
      if (responseData.data.length != 0)
        this.totalCount = this.futuretDeadLineDataDetails[0].totalCount;
      else {
        this.totalCount = 0;
      }
    });
  }

  search() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.searchText = this.searchText.trim();
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getAllUserStories();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.getAllUserStories();
  }

  navigateToOwnerPage(userId) {
    this.routes.navigate(["dashboard/profile", userId, "overview"]);
  }
}
