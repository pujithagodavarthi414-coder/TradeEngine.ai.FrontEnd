import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesLabels } from '@progress/kendo-angular-charts';
import { LivesManagementService } from '../../../../services/lives-management.service';
import { AppBaseComponent } from '../../../componentbase';

@Component({
  selector: 'app-certifed-shs-north-sumatra',
  templateUrl: './certifed-shs-north-sumatra.component.html',
  styleUrls: ['./certifed-shs-north-sumatra.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CertifiedSHFsNorthSumateraComponent extends AppBaseComponent implements OnInit {
    public kendoData = [];

    public seriesLabels: SeriesLabels = {
        visible: true, // Note that visible defaults to false
        padding: 3,
        font: "bold 16px Arial, sans-serif"
    };
    
    isAnyOperationsInprogress: boolean;
    shfData: any;

    constructor(private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private livesService: LivesManagementService) {
        super();
    }

    ngOnInit() {
        this.getShfDetails();    
    }

    getShfDetails() {
        this.isAnyOperationsInprogress = true;
        var searchData = {};
        searchData["location"] = "North Sumatra";
        searchData["isVerified"] = true;
        this.livesService.getKPI1CertifiedSHFsLocation(searchData).subscribe((response: any) => {
            this.isAnyOperationsInprogress = false;
            if(response.success) {
                if(response.data.length > 0) {
                    var data1 = {category: "Total SHF's in Phase 01", value: response.data[0].totalSHFPhase1, color: "#cceeff"};
                    this.kendoData.push(data1);
                    data1 = {category: "SHF's Certified", value: response.data[0].shfCertified, color: "#28b3d6"};
                    this.kendoData.push(data1);
                    this.shfData = response.data[0];
                } else {
                    this.shfData = null;
                }
            } else {
                this.shfData = null;
            }
        });
    }
}