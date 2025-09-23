import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from '../../models/data.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as _ from "underscore";
import { EmployeeListModel } from '../../models/employee-list.model';
import { DashboardService } from '../../services/dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-calendar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-chart.component.html',
  styleUrls: ['./calendar-chart.component.scss']
})
export class CalendarChartComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.createChart(null);
  }

  @Input()
  data: DataModel;

  @Input("procName") set _procName(data: any) {
    if (data) {
      this.procName = data;
      this.getApiData();
    }
  }

  @Input("xAndYAxisCategories") set _xAndYAxisCategories(data: any) {
    if (data && data.length > 0) {
      this.xAndYAxisCategories = null;
      this.xAndYAxisCategories = data;
      this.showLegends = false;
      if (this.xAndYAxisCategories[0].heatMapMeasure) {
        let heatMapData = JSON.parse(this.xAndYAxisCategories[0].heatMapMeasure);
        this.legendsData = null;
        this.legendsData = heatMapData.legend;
        this.cellSize = heatMapData.cellSize;
        this.showData = heatMapData.showDataInCell;
        this.createChart(null);
      }
    }
  }

  @Input("dashboardId") set _dashboardId(data: any) {
    if (data) {
      if (data) {
        this.dashboardId = 'd' + data.replace(/[-]/g, '');
      }
    }
  }

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  procName: string;
  heatMapData: any[] = [];
  xAndYAxisCategories: any;
  dashboardId: string = 'chart';
  public svg;
  years: number;
  months: number;
  legendsData: any;
  legendDataWithColor: any[] = [];
  showLegends: boolean = false;
  cellSize: any;
  showData: boolean;

  constructor(
    public datePipe: DatePipe, private toaster: ToastrService, 
    private cdRef: ChangeDetectorRef, private dashboardService: DashboardService) {
  }

  getApiData() {
    const employeeListSearchResult = new EmployeeListModel();
    employeeListSearchResult.userId = null;
    employeeListSearchResult.SpName = this.procName;
    this.dashboardService.getGenericApiData(employeeListSearchResult).subscribe((response: any) => {
      if (response.success === true) {
        this.heatMapData = response.data;
        this.createChart(null);
      }
    });
  }

  private async createChart(value): Promise<void> {
    d3.select("#" + this.dashboardId).selectAll('svg').remove();
    d3.selectAll('#week').remove();

    var week_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    var dateData = [];
    this.xAndYAxisCategories.forEach(x => {
      dateData.push({ day: this.datePipe.transform(x.date, 'yyyy-MM-dd'), count: x.value })
    });
    var weeksInMonth = function (month) {
      var m = d3.timeMonth.floor(month)
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m, 1)).length;
    }

    var minDate = d3.min(dateData, function (d: any) { return new Date(d.day) })
    var maxDate = d3.max(dateData, function (d: any) { return new Date(d.day) })

    this.years = maxDate.getFullYear() - minDate.getFullYear();
    var year = minDate.getFullYear();

    var cellMargin = 2;
    var cellSize = 20;

    if (this.cellSize) {
      cellSize = parseInt(this.cellSize);
      cellMargin = this.cellSize / 10;
    }

    var x = cellSize + 25;
    var y = 0;
    var DayPosition = cellSize;
    var yearPosition = -cellSize * 3.5;
    var sample = this;
    var height;

    
    height = cellSize * 9;

    var day = d3.timeFormat("%w");
    var week = d3.timeFormat("%U");
    var format = d3.timeFormat("%Y-%m-%d");
    var titleFormat = d3.utcFormat("%a, %d-%b-%Y");
    var monthName = d3.timeFormat("%B");
    var months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

    this.svg = d3.select("#" + this.dashboardId).append("svg")
      .attr("height", (this.years ? cellSize * 10 * (this.years + 1) : 400)).attr("width", cellSize * 100).style("height", "auto");;

    if (this.years == 0) {
      for (var i = 0; i < 7; i++) {
        this.svg.append("text")
          .attr("transform", "translate(" + x + ", " + DayPosition + ")")
          .style("text-anchor", "end")
          .text(function (d) { return week_days[i]; });
        if (i != 6) {
          DayPosition = DayPosition + cellSize + (cellSize / 10);
        }
      }

      var currentDate = new Date();
      this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", -62)
        .style("text-anchor", "end")
        .text(currentDate.getFullYear());
    }
    else {
      for (var j = 1; j <= this.years + 1; j++) {
        for (var i = 0; i < 7; i++) {
          this.svg.append("text")
            .attr("transform", "translate(45," + DayPosition + ")")
            .style("text-anchor", "end")
            .text(function (d) { return week_days[i]; });
          if (i != 6) {
            DayPosition = DayPosition + cellSize + (cellSize / 10)
          }
        }
        DayPosition = DayPosition + (cellSize * 3.3);
        this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 12)
          .attr("x", yearPosition)
          .style("text-anchor", "end")
          .text(year);
        yearPosition = yearPosition - (cellSize * 10);
        year = year + 1;
      }
    }

    var svg;
    svg = this.svg.selectAll("svg")
      .data(months)
      .enter().append("svg")
      .attr("class", "month")
      .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20))
      .attr("width", function (d) {
        var columns = weeksInMonth(d);
        return ((cellSize * columns) + (cellMargin * (columns + 1)));
      })
      .attr("y", function (d) {
        if ((monthName(d) == "January") && (minDate.getFullYear() != d.getFullYear())) {
          y = y + cellSize * 10;
        }
        return y;
      })
      .attr("x", function (d) {
        if ((monthName(d) == "January") && (minDate.getFullYear() != d.getFullYear())) {
          x = cellSize + 25;
        }
        var value = x;
        x = x + cellSize * 7;
        return value;
      })
      .append("g")

    svg.append("text")
      .attr("class", "month-name")
      .attr("y", (cellSize * 7) + (cellMargin * 8) + 15)
      .attr("x", function (d) {
        var columns = weeksInMonth(d);
        return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
      })
      .attr("text-anchor", "middle")
      .text(function (d) { return monthName(d); })

    var data = {};
    dateData.forEach(element => {
      data[element.day] = element.count;
    })

    var lookup = d3.nest()
      .key(function (d: any) { return d.day; })
      .rollup(function (leaves) {
        return d3.sum(leaves, function (d: any) { return d.count; }) as any;
      })
      .object(dateData);

    if (this.showData) {
      var rect = svg.selectAll("rect.day")
        .data(function (d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
        .enter().append("g")
        .attr("class", "group")
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 3).attr("ry", 3)
        .attr("fill", '#eaeaea')
        .attr("y", function (d: any) {
          var dd;
          dd = d;
          return (parseInt(day(d)) * cellSize) + (parseInt(day(d)) * cellMargin) + cellMargin;
        })
        .attr("x", function (d) { return ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellSize) + ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellMargin) + cellMargin; })
        .select(function (d) { return this.parentNode })
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          var y = (parseInt(day(d)) * cellSize) + (parseInt(day(d)) * cellMargin) + cellMargin;
          y = y + 17;
          var x = ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellSize) + ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellMargin) + cellMargin;
          x = x + 10;
          return "translate(" + x + "," + y + ")"
        })
        .text(function (d, i) {
          var date = sample.datePipe.transform(d, 'yyyy-MM-dd');
          return lookup[date]
        })
        .on("mouseover", function (d) {
          d3.select(this).classed('hover', true);
        })
        .on("mouseout", function (d) {
          d3.select(this).classed('hover', false);
        })
        .datum(format);
    } else {
      var rect = svg.selectAll("rect.day")
        .data(function (d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 3).attr("ry", 3)
        .attr("fill", '#eaeaea')
        .attr("y", function (d: any) { return (parseInt(day(d)) * cellSize) + (parseInt(day(d)) * cellMargin) + cellMargin; })
        .attr("x", function (d) { return ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellSize) + ((parseInt(week(d)) - parseInt(week(new Date(d.getFullYear(), d.getMonth(), 1)))) * cellMargin) + cellMargin; })
        .on("mouseover", function (d) {
          d3.select(this).classed('hover', true);
        })
        .on("mouseout", function (d) {
          d3.select(this).classed('hover', false);
        })
        .datum(format);
    }
    rect.append("title")
      .text(function (d) {
        return titleFormat(new Date(d));
      });


    var scale = d3.scaleLinear()
      .domain(d3.extent(dateData, function (d) {
        return (d.count);
      }))
      .range([0.4, 1]);

    if (this.showData) {
      rect.filter(function (d) {
        var dates = d;
        return d in lookup;
      })
        .select(function (d) { return this.parentNode })
        .select("rect")
        .style("fill", function (d) {
          if (value && lookup[d] != value) {
            return '#eaeaea';
          }
          else {
            return d3.interpolatePuBu(scale(lookup[d]));
          }
        })
        .select("title")
        .text(function (d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
    }

    else {
      rect.filter(function (d) {
        var dates = d;
        return d in lookup;
      })
        .style("fill", function (d) {
          if (value && lookup[d] != value) {
            return '#eaeaea';
          }
          else {
            return d3.interpolatePuBu(scale(lookup[d]));
          }
        })
        .select("title")
        .text(function (d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
    }

    if (this.legendsData && this.legendsData.length > 0) {
      this.legendDataWithColor = [];
      this.legendsData.forEach(element => {
        this.legendDataWithColor.push({ legendName: element.legendName, value: element.value, color: d3.interpolatePuBu(scale(element.value)) });
      });
      this.showLegends = true;
    }
  }
}
