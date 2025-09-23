import { Component, ChangeDetectorRef, Input, OnInit } from "@angular/core";
import { ProductivityReportModel } from "../models/productivityReport";
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";
import { ToastrService } from "ngx-toastr";
import * as d3 from 'd3';
import { TeamLeadsService } from "../services/teamleads.service";
import { CookieService } from "ngx-cookie-service";
import '../../globaldependencies/helpers/fontawesome-icons';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: 'app-dashboard-component-employeeProductivity',
    templateUrl: 'employee-productivity-on-yearly.component.html'
})

export class EmployeeProductivityOnYearly extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    public data: any;
    isAnyOperationIsInprogress: boolean = false;
    validationMessage: string;
    employeeList: any;
    productivity: any[] = [];
    maxProd: any;
    selectedEmployeeId: string;
    selectEmployeeFilterIsActive: boolean = false;
    date: Date = new Date();
    weekNumber: number;
    direction: any;
    isOpen: boolean = true;
    selectedDate: string = this.date.toISOString();
    dateFilterIsActive: boolean = true;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private productivityDashboardService: ProductivityDashboardService, private cookieService: CookieService, private toaster: ToastrService, private teamLeadsService: TeamLeadsService, private cdRef: ChangeDetectorRef) {
        super();
    }
    ngOnInit() {
        super.ngOnInit();
        this.selectedEmployeeId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.getSoftLabels();
        if (this.canAccess_feature_EmployeeIndex) {
            this.getProductivity();
            this.getAllEmployees();
        }
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        this.cdRef.markForCheck();
    }

    getProductivity() {
        this.isAnyOperationIsInprogress = true;
        var productivityModel = new ProductivityReportModel();
        productivityModel.userId = this.selectedEmployeeId;
        productivityModel.date = this.date;
        productivityModel.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
        this.productivityDashboardService.getProductivityReport(productivityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
                this.isAnyOperationIsInprogress = false;
                this.max();
                this.createChart();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toaster.error(this.validationMessage);
            }
            this.cdRef.detectChanges();
        }
        )
    }

    getAllEmployees() {
        this.teamLeadsService.getTeamLeadsList().subscribe((response: any) => {
            if (response.success == true) {
                this.employeeList = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    selectedEmployeesId(employeeId) {
        if (employeeId == "all") {
            this.selectedEmployeeId = "";
            this.selectEmployeeFilterIsActive = false;
        }
        else {
            this.selectedEmployeeId = employeeId;
            this.selectEmployeeFilterIsActive = true;
        }
        this.getProductivity();
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    getProductivityIndexBasedOnDate(direction) {
        this.direction = direction;
        if (direction === 'left') {
            const day = this.date.getDate();
            const month = 0 + this.date.getMonth();
            const year = this.date.getFullYear() - 1;
            const newDate = day + '/' + month + '/' + year;
            this.date = this.parse(newDate);
            this.selectedDate = this.date.toISOString();
        } else {
            const day = this.date.getDate();
            const month = this.date.getMonth()
            const year = 0 + this.date.getFullYear() + 1;
            const newDate = day + '/' + month + '/' + year;
            this.date = this.parse(newDate);
            this.selectedDate = this.date.toISOString();
        }
        this.getProductivity();
    }

    max() {
        this.productivity = [];
        for (var i = 0; i < this.data.length; i++) {
            this.productivity.push(this.data[i].productivity);

        }
        this.maxProd = Math.ceil(Math.max(...this.productivity));
        if (this.maxProd == 0)
            this.maxProd = 1;
    }
    resetAllFilters() {
        this.date = new Date();
        this.selectedDate = this.date.toISOString();
        this.selectedEmployeeId = ''
        this.selectEmployeeFilterIsActive = false;
        this.getProductivity();
    }


    public margin: any = { top: 30, right: 30, bottom: 70, left: 60 };
    public width: any = 460 - this.margin.left - this.margin.right;
    public height: any = 400 - this.margin.top - this.margin.bottom;
    public svg: any;
    createChart() {
        d3.select("#productivityChart").select('svg').remove();
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var tooltip = d3.select("#productivityToolTip").attr("class", "toolTip");

        var svg = d3.select("#productivityChart")
            .classed("svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 900 400")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform",
                "translate(250,30)");

        var x = d3.scaleBand()
            .range([0, width])
            .domain(this.data.map(function (d) { return d.monthName; }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0,300)")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append("text")
            .attr("x", 180)
            .attr("y", 350)
            .style("text-anchor", "middle")
            .text("Months");

        var y = d3.scaleLinear()
            .domain([0, this.maxProd])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -150)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Productivity");

        svg.selectAll("mybar")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d['monthName']); })
            .attr("y", function (d) { return y(0); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(0); })
            .attr("fill", "#69b3a2")
        svg.selectAll("rect")
            .data(this.data)
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(("Month: " + d['monthName']) + "<br>" + "productivity: " + (d['productivity']));
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function (d) { return y(d['productivity']); })
            .attr("height", function (d) { return height - y(d['productivity']); })
            .delay(function (d, i) { return (i * 100) })
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

}