import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';

@Component({
  selector: "extra-goal-filters",
  templateUrl: "extra-filters.component.html",
})

export class ExtraFiltersComponent {

  @Output() filtersRemoved = new EventEmitter<any>();
  isSprintsEnable: boolean;
  filtersData: any;
  filterName: string;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  projectLabel: string;
  goalLabel: string;
  sortByText: string;

  constructor(public filtersDialog: MatDialogRef<ExtraFiltersComponent>,private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
      this.getCompanySettings();
    this.filtersData = data.filtersData;
    this.getSortByText(this.filtersData.sortBy);
    this.getSoftLabels();
  }

  onNoClick(): void {
    this.filtersDialog.close();
  }

  ngOnInit() {

  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (companyResult.length > 0) {
        this.isSprintsEnable = companyResult[0].value == "1" ? true : false;
      }
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  getSortByText(sortBy){
    if (sortBy == "createdDateTime") {
      this.sortByText = "Created date";
    }
    if (sortBy == "updatedDateTime") {
      this.sortByText = "Updated date";
    }
    if (sortBy == "estimatedTime") {
      this.sortByText = "Estimated time";
    }
    if (sortBy == "deadlineDate") {
      this.sortByText = "Deadline date";
    }
    if (sortBy == "ownerName") {
      this.sortByText = "Owner name";
    }
  }

  clearWorkItemFilter() {
    this.filtersData.selectedOwners = null;
    this.filtersData.ownerUserId = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearResponsibleFilter() {
    this.filtersData.goalResponsibleUserId = null;
    this.filtersData.selectedUsers = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearProjects() {
    this.filtersData.projectId = null;
    this.filtersData.selectedProjects = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearGoalFilter() {
    this.filtersData.selectedGoalStatus = null;
    this.filtersData.goalStatusId = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearUserStoryStatusFilter() {
    this.filtersData.selectedUserStoryStatus = null;
    this.filtersData.userStoryStatusId = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearOptions() {
    this.filtersData.isIncludedArchive = null;
    this.filtersData.isIncludedPark = null;
    this.filtersData.isOnTrack = null;
    this.filtersData.isNotOnTrack = null;
    this.filtersData.isTracked = null;
    this.filtersData.isProductive = null;
    this.filtersData.selectedGoalFilters = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearGoalTags() {
    this.filtersData.tags = null;
    this.filtersData.goalTags = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearWorkItems() {
    this.filtersData.workItemTags = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearDateFrom() {
    this.filtersData.deadLineDateFrom = null;
    this.filtersData.dateFrom = null;
    this.filtersRemoved.emit(this.filtersData);
  }
  clearDateTo() {
    this.filtersData.deadLineDateTo = null;
    this.filtersData.dateTo = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearGoalName() {
    this.filtersData.goalName = null;
    this.filtersData.goalShortName = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearDependencyUser() {
    this.filtersData.dependencyUserIds = null;
    this.filtersData.selectedDependencyUsers = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearBugCausedUser() {
    this.filtersData.bugCausedUserIds = null;
    this.filtersData.selectedBugCausedUsers = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearWorkItemTypes() {
    this.filtersData.userStoryTypeIds = null;
    this.filtersData.selectedUserStoryTypes = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearUserStoryName() {
    this.filtersData.userStoryName = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearVersionName() {
    this.filtersData.versionName = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearBugPriorities() {
    this.filtersData.bugPriorityIds = null;
    this.filtersData.selectedBugPriorities = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearComponets() {
    this.filtersData.projectFeatureIds = null;
    this.filtersData.selectedComponents = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearCreateDateFrom() {
    this.filtersData.createdDateFrom = null;
    this.filtersRemoved.emit(this.filtersData);
  }
  clearCreateDateTo() {
    this.filtersData.createdDateTo = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearUpdateDateFrom() {
    this.filtersData.updatedDateFrom = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearUpdateDateTo() {
    this.filtersData.updatedDateTo = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSortBy() {
    this.filtersData.sortBy = null;
    this.sortByText = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSprintName() {
    this.filtersData.sprintName = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSprintStartDate() {
    this.filtersData.sprintStartDate = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSprintEndDate() {
    this.filtersData.sprintEndDate = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSprintFilter() {
    this.filtersData.selectedSprintStatus = null;
    this.filtersData.sprintStatusId = null;
    this.filtersRemoved.emit(this.filtersData);
  }

  clearSprintResponsibleFilter() {
    this.filtersData.selectedSprintUsers = null;
    this.filtersData.sprintResponsiblePersonIds = null;
    this.filtersRemoved.emit(this.filtersData);
  }

}