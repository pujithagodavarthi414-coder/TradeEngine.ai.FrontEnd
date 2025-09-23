import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/authentication.reducers";
import * as commonModuleReducers from "../../store/reducers/index";
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { ProcessDashboard } from '../../models/maindashboard';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import { ProcessDashboardService } from '../../services/processdashboard.service';
import { LiveDashboardService } from '../../services/live-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-processdashboard',
  templateUrl: './process-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ProcessdashboardComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  processDashboard: ProcessDashboard;
  processDashboardPop: ProcessDashboard;
  proccessDashboardId: string = null;
  anyOperationInProgress: boolean;
  forwarddisable: any;
  live: any;
  allProcessDashboardStatusesList: any[] = [{ 'ProcessDashboardStatusId': 'fdbfgnb', " ProcessDashboardStatusName": "test", ProcessDashboardHexaValue: 'red' }];
  nextEnable: boolean = false;
  @ViewChild('snapShotPopOver') snapshotPopOver: SatPopover
  roleFeaturesIsInProgress$: any;
  generatedDateTime: Date;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  validationMessage: string;

  constructor(
    private ProcessDashboardService: ProcessDashboardService,
    private store: Store<State>, private LiveDashboardService: LiveDashboardService,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super()
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getLatestProcessDashboardId();
    this.GetAllProcessDashboardStatuses();
    this.getEntityDropDown();

    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  previous() {
    let proccessDashboardId;
    proccessDashboardId = this.proccessDashboardId
    this.proccessDashboardId = (Number(this.proccessDashboardId) - 1).toString();
    this.getProcessDashboardSummary(this.proccessDashboardId, this.selectedEntity);
    this.nextEnable = true;
    this.cdRef.detectChanges();
  }

  snapshot() {
    this.processDashboardPop = this.processDashboard;
  }

  next() {
    this.proccessDashboardId = (Number(this.proccessDashboardId) + 1).toString();
    this.getProcessDashboardSummary(this.proccessDashboardId, this.selectedEntity);
    if (this.forwarddisable == this.proccessDashboardId) {
      this.nextEnable = false;
    }
  }

  getProcessDashboardSummary(processDashboardId: string, entityId) {
    this.anyOperationInProgress = true;
    this.ProcessDashboardService.getProcessDashboardSummary(processDashboardId, entityId)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data && responseData.data.length > 0) {
            this.generatedDateTime = responseData.data[0].generatedDateTime;
          }
          this.processDashboard = responseData.data;
          this.anyOperationInProgress = false;
          this.cdRef.detectChanges();
        }
      });
    this.cdRef.detectChanges();
  }

  GetAllProcessDashboardStatuses() {
    this.LiveDashboardService.getAllProcessDashboardStatuses()
      .subscribe((responseData: any) => {
      });
    this.cdRef.detectChanges();
  }

  getLocationId(seatingModel, locationPopover) {
    locationPopover.openPopover();
    this.cdRef.detectChanges();
  }

  getLatestProcessDashboardId() {
    this.ProcessDashboardService.getLatestProcessDashboardId()
      .subscribe((responseData: any) => {
        this.getProcessDashboardSummary(responseData.data, this.selectedEntity);
        this.proccessDashboardId = responseData.data
        this.forwarddisable = this.proccessDashboardId;
      });
    this.cdRef.detectChanges();
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getLatestProcessDashboardId();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getLatestProcessDashboardId();
  }
}
