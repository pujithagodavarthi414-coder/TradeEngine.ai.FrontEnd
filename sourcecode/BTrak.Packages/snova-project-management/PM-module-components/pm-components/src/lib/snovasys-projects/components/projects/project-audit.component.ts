import { OnInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsDialogComponent } from '../dialogs/projects-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-pm-component-project-activity",
    templateUrl: "project-audit.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectAuditComponent extends CustomAppBaseComponent implements OnInit {
  softLabels: SoftLabelConfigurationModel[];
  Projects: string = 'Projects';
    constructor(private dialog: MatDialog) { 
        super();
    }
    ngOnInit() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
       super.ngOnInit();
    }

    
  openProjectsDialog() {
    const projectDialog = this.dialog.open(ProjectsDialogComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      data: { projectId: null }
    });
    projectDialog.afterClosed().subscribe(() => {
    });
  }

}