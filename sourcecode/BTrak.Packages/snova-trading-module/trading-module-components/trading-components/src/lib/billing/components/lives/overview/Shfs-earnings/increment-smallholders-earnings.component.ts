import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesLabels } from '@progress/kendo-angular-charts';
import { LivesManagementService } from '../../../../services/lives-management.service';
import { AppBaseComponent } from '../../../componentbase';

@Component({
  selector: 'app-increment-smallholders-earnings',
  templateUrl: './increment-smallholders-earnings.component.html',
  styleUrls: ['./increment-smallholders-earnings.component.scss'],
})

export class IncrementInSmallholdersEarningsComponent extends AppBaseComponent implements OnInit {
    
    isAnyOperationsInprogress: boolean;
    productivityData: any;
    tableKeys: any = [];
    tableData: any;

    constructor(private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private livesService: LivesManagementService) {
        super();
    }

    ngOnInit() {
        this.getShfsIncrementSmallholdersEarnings();    
    }
    
    getShfsIncrementSmallholdersEarnings() {
        this.isAnyOperationsInprogress = true;
        var searchData = {};
        searchData["KPIType"] = "KPI03";
        this.livesService.getIncrementInSmallholdersEarnings(searchData).subscribe((response: any) => {
            this.isAnyOperationsInprogress = false;
            if(response.success) {
                this.tableKeys = [];
                if(response.data.length > 0) {
                    var keys = Object.keys(response.data[0]);
                    this.tableKeys.push("location & Respective Target SHFs", ...keys);
                    this.tableKeys = [...new Set(this.tableKeys)];
                    this.tableData = response.data;
                    console.log("response.data", response.data, this.tableKeys, keys);
                } else {

                }
            } else {
                // this.shfData = null;
            }
        });
    }
}