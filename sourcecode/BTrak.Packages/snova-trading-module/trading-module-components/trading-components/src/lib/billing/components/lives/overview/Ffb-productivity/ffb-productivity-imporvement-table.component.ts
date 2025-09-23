import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesLabels } from '@progress/kendo-angular-charts';
import { LivesManagementService } from '../../../../services/lives-management.service';
import { AppBaseComponent } from '../../../componentbase';

@Component({
  selector: 'app-ffb-productivity-imporvement-table',
  templateUrl: './ffb-productivity-imporvement-table.component.html',
  styleUrls: ['./ffb-productivity-imporvement-table.component.scss'],
})

export class FFBProductivityImporvementTableComponent extends AppBaseComponent implements OnInit {
    
    isAnyOperationsInprogress: boolean;
    productivityData: any;
    tableKeys: any = [];
    tableData: any;

    constructor(private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private livesService: LivesManagementService) {
        super();
    }

    ngOnInit() {
        this.getffbProductivity();    
    }
    
    getffbProductivity() {
        this.isAnyOperationsInprogress = true;
        var searchData = {};
        // searchData["isVerified"] = true;
        this.livesService.getImprovementFFBProductivity(searchData).subscribe((response: any) => {
            this.isAnyOperationsInprogress = false;
            if(response.success) {
                this.tableKeys = [];
                if(response.data.length > 0) {
                    var keys = Object.keys(response.data[0]);
                    this.tableKeys.push("location & Respective Target SHFs", ...keys);
                    this.tableKeys = [...new Set(this.tableKeys)];
                    this.tableData = response.data;
                } else {

                }
            } else {
            }
        });
    }
}