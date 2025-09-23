import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyProfileService } from '../../services/myProfile.service';
import { ImminentDeadLineData } from '../../models/imminentDeadLineData';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-imminent-deadlines-details',
  templateUrl: './imminent-deadlines-details.component.html'
})

export class ImminentDeadlinesDetailsComponent extends CustomAppBaseComponent implements OnInit {
  imminentDeadLineDataDetails: ImminentDeadLineData[];
  softLabels: SoftLabelConfigurationModel[];

  anyOperationInProgress: boolean;
  pageSize: number = 10;
  pageNumber: number = 0;
  sortBy: boolean;
  employeePresenceData: any;
  totalCount: number = 0;
  sortDirectionAsc: boolean = true;

  constructor(private cdRef: ChangeDetectorRef, private myProfileService: MyProfileService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getAllUserStories();
  }

  getSoftLabels() {
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
    this.getAllUserStories();
  }

  setPage(data) {
    this.pageNumber = data.offset;
    this.pageSize = 10;
    this.getAllUserStories();
  }

  getAllUserStories() {
    this.anyOperationInProgress = true;
    let imminentDeadLineData = new ImminentDeadLineData();
    imminentDeadLineData.pageSize = this.pageSize;
    imminentDeadLineData.pageNumber = this.pageNumber + 1;
    imminentDeadLineData.sortBy = this.sortBy;
    imminentDeadLineData.DependencyText = 'ImminentDeadLine';
    imminentDeadLineData.SortDirectionAsc = this.sortDirectionAsc;
    imminentDeadLineData.SortDirectionAsc = this.sortDirectionAsc;
    this.myProfileService.getAllUserStories(imminentDeadLineData).subscribe((responseData: any) => {
      this.imminentDeadLineDataDetails = responseData.data;
      if (responseData.data.length != 0)
        this.totalCount = this.imminentDeadLineDataDetails[0].totalCount;
      else {
        this.totalCount = 0;
      }
      this.anyOperationInProgress = false;
    });
  }

}
