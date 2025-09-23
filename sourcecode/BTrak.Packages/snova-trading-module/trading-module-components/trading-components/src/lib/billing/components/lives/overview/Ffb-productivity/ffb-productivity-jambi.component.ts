import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesLabels } from '@progress/kendo-angular-charts';
import { LivesManagementService } from '../../../../services/lives-management.service';
import { AppBaseComponent } from '../../../componentbase';

@Component({
  selector: 'app-ffb-productivity-jambi',
  templateUrl: './ffb-productivity-jambi.component.html'
})

export class FFBProductivityJambiComponent extends AppBaseComponent implements OnInit {
    xAxisCategories: any[];
    categorySeries: any = [];
    yCoOrdinate: any = ["numberOfShFsAttended", "numberofTrainingCamps"];

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
        this.getffbProductivity();    
    }

    getTooltipValue(index) {
        if (this.yCoOrdinate && this.yCoOrdinate.length > 0) {
            let returndata;
            this.categorySeries.forEach((column) => {
                if (this.yCoOrdinate[index] === column.field) {
                    returndata = (column.name == null || column.name == undefined || column.name == '') ? column.field : column.name;
                }
            });
            return "" + returndata;
        }
    }

    getffbProductivity() {
        this.isAnyOperationsInprogress = true;
        var searchData = {};
        searchData["location"] = "Jambi";
        searchData["isVerified"] = true;
        this.livesService.getffbProductivity(searchData).subscribe((response: any) => {
            this.isAnyOperationsInprogress = false;
            this.xAxisCategories = [];
            this.categorySeries = [];
            if(response.success) {
                if(response.data.length > 0) {
                    response.data.forEach(x => {
                        this.xAxisCategories.push(x.month);
                    });
                    let yAxisCategories = [];
                    this.yCoOrdinate.forEach(element => {
                        response.data.forEach(x => {
                            yAxisCategories.push(x[element]);
                        });
                        var value = "";
                        var colorValue = "";
                        if(element == "numberOfShFsAttended") {
                            value = "Number of SHFs attended";
                            colorValue = "#ffe162";
                        } else if(element == "numberofTrainingCamps"){
                            value = "Number of Training Camps";
                            colorValue = "#4cd180";
                        }
                        this.categorySeries.push({name: value, yAxis: value, field:element, data: yAxisCategories, colorField: colorValue});
                        yAxisCategories = [];
                    });
                } else {

                }
            } else {
                // this.shfData = null;
            }
        });
    }
}