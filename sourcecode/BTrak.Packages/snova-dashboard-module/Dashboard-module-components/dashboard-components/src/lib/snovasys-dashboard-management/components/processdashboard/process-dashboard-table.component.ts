import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-process-dashboard-table',
  templateUrl: './process-dashboard-table.component.html'
})

export class ProcessDashboardTableComponent implements OnInit {
  @Input() processDashboard;
  @Input() anyOperationInProgress: boolean;
  @ViewChild('myTable') table: any;
  softLabels: SoftLabelConfigurationModel[];
  projectLabel: string;
  goalLabel: string;
  workItemLabel: string;
  Offset: string;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.workItemLabel = this.softLabels[0].userStoryLabel;
      this.cdRef.markForCheck();
    }
  }

  onDetailToggle() {
  }

}
