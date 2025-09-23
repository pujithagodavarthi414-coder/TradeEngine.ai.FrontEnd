import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-progress-view',
  templateUrl: './progress-view.component.html',
  styleUrls: ['./progress-view.component.scss']
})

export class ProgressViewComponent extends AppBaseComponent implements OnInit {
    selectedIndex: number;
    tabName: string;

    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {
        super();
    
    }

    ngOnInit() {

    }

    selectedTab() {
        if (this.tabName == 'KPI 01') {
          this.selectedIndex = 0;
        } else if (this.tabName == 'KPI 02') {
          this.selectedIndex = 1;
        } else if (this.tabName == 'KPI 03') {
          this.selectedIndex = 2;
        } else {
          this.selectedIndex = 0;
        }
      }

    changeRoute(event) {
        // if (event.tab.textLabel.includes("KPI 01")) {
        //   this.router.navigate([
        //     "lives/program",
        //     'kpi'
        //   ]);
        // } else if(event.tab.textLabel.includes("KPI 02")) {
        //   this.router.navigate([
        //     "lives/program",
        //     'budget'
        //   ]);
        // }else if(event.tab.textLabel.includes("KPI 03")) {
        //   this.router.navigate([
        //     "lives/program",
        //     'progress'
        //   ]);
        // }
    }
}
