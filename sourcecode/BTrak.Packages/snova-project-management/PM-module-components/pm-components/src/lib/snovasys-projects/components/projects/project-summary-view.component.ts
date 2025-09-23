// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { Store, select } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Project } from "../../models/project";
import { ProjectSearchResult } from "../../models/ProjectSearchResult";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
@Component({
  selector: "app-pm-component-project-summary",
  templateUrl: "project-summary-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSummaryViewComponent extends CustomAppBaseComponent implements OnInit {
  
  @ViewChild("editProjectPopover") editProjectPopover: SatPopover;
  @Input() projectSearchResult: ProjectSearchResult;
  @Input() isForDialog = false;
  @Input() isArchived: boolean;
  @Input() projectLabel: string;
  @Output() GetProjectsbyName = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("archivePopover") archivePopover: SatPopover;
  anyOperationInProgress$: Observable<boolean>;
  //projectRelatedData$: Observable<ProjectList>;
  testSuitesCount$: Observable<number>;
  testRunsCount$: Observable<number>;
  testMilestonesCount$: Observable<number>;
  reportsCount$: Observable<number>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  isEditProject = false;

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels$ = JSON.parse(LocalStorageProperties.SoftLabels);
  }


  fetchProjectRecord(projectSearchResult: ProjectSearchResult) {
    if (!projectSearchResult.isArchived) {
      this.router.navigate([
        "projects/projectstatus",
        projectSearchResult.projectId,
        "active-goals"
      ]);
    } else {
        let toastrText = 'Please unarchive this'+''+ this.projectLabel;
      this.toastr.warning("", toastrText);
    }
  }

  closeDialog(event) {
    const popover = this.archivePopover;
    if (popover) {
      popover.close();
    }
  }

  checkPermissionsForMatMenu(projectSearchResult: ProjectSearchResult, archivepermission, unarchivepermission) {
    if (projectSearchResult.isArchived) {
      if (unarchivepermission) {
        return true;
      } else {
        return false;
      }
    } else {
      if (archivepermission) {
        return true;
      } else {
        return false;
      }
    }
  }

  editProject() {
    this.editProjectPopover.open();
    this.isEditProject = true;
  }

  closeProjectDialog() {
    const popover = this.editProjectPopover;
    if (popover) { popover.close(); }
    this.isEditProject = false;
  }
}
