import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { GroupBy, PositionModel } from "../models/position-model";
import * as _ from "underscore";
import { DashboardService } from "../services/dashboard-table.service";
import { DatePipe, DecimalPipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import * as $_ from 'jquery';
import { Router } from "@angular/router";
const $ = $_;
import html2canvas from 'html2canvas';
@Component({
    selector: 'app-daily-position-table',
    templateUrl: './daily-position-table.component.html',
    styleUrls: ['./daily-position-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class DailyPositionTableComponent implements OnInit {
    @ViewChild('positionTable') listElement: ElementRef;
    @Output() fileBytes = new EventEmitter<any>();
    currentMonth: Date;
    dateTo: Date;
    isLoading: boolean;
    dateFrom: Date;
    originalData: PositionModel[] = [];
    displayedColumns = ["commodity", "openingBalance", "ytDgross", "ytDgross1", "ytDgross2", "ytDgross3", "ytDgross4", "ytDgross5", "ytDgross6", "ytDgross7", "totalGross", "netClosing", "netOpening", "dayChange", "dayChangeMtm", "dailyMTM", "dayPAndL", "mtdpAndL", "ytdRealisedPAndL", "ytdUnRealisedPAndL", "ytdTotalPAndL"];
    innerdisplayedColumns: ["commodity", "openingBalance", "ytDgross", "ytDgross1", "ytDgross2", "ytDgross3", "ytDgross4", "ytDgross5", "ytDgross6", "ytDgross7", "totalGross", "netClosing", "netOpening", "dayChange", "dayChangeMtm", "dailyMTM", "dayPAndL", "mtdpAndL", "ytdRealisedPAndL", "ytdUnRealisedPAndL", "ytdTotalPAndL"];
    groupColumns: ["groupName", "ytDgrossText", "totalGrossText", "dayChangeMtmValue", "dailyMTMValue"]
    dataSource: any = [];
    monthString: any[] = [];
    selectedDate: Date;
    positionTable: PositionModel[] = [];
    tradingRowSpan: number;
    rowSpanOpeningBalace: number;
    tollingRowSpan: number;
    spanningColumns = ['positionName', 'commodity'];
    expandedElement: PositionModel;
    isFromDashboard: boolean;;
    isIconVisible: boolean;
    groupByColumns: string[] = [];
    spans = [];
    constructor(private cdRef: ChangeDetectorRef, private dashboardService: DashboardService,
        private datePipe: DatePipe, private toastr: ToastrService, private numberPipe: DecimalPipe,
        private route: Router) {
        if (this.route.url.includes('dashboard-management/dashboard')) {
            this.isFromDashboard = true;
        } else {
            this.isFromDashboard = false;
        }
        this.groupByColumns = ['positionName'];
        this.currentMonth = new Date();
        let dateTo = new Date();
        dateTo.setDate(dateTo.getDate() - 1)
        this.dateFrom = new Date('01-01-2023');
        this.dateTo = new Date(dateTo);
        this.currentMonth = new Date();
        this.selectedDate = new Date();
        var i = 0;
        for (i = 1; i <= 7; i++) {
            var date = new Date();
            date = new Date(date.getFullYear(), date.getMonth(), 1);
            date.setMonth(date.getMonth() + i);
            this.monthString.push(date);

        }
        this.getDataList();
    }

    ngOnInit() {

    }

    

    exportEmissions() {
        setTimeout(() => {
            let Id = "emissions";
            const list = this.listElement.nativeElement;
            html2canvas(list).then(canvas => {
                let imageData = canvas.toDataURL('image/png');
                var model: any = {};
                model.fileBytes = imageData;
                model.uniqueChartNumber = 0;
                model.visualisationName = "DAILY POSITIONS & P n L REPORTING";
                model.isSystemWidget = true;
                model.widgetName = "Daily Positions & P n L Reporting";
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        }, 500);
    }

    getMatCardScroll() {
        if (this.isFromDashboard == true) {
            return 'mat-card-table-height'
        } else {
            return 'mat-card-height'
        }
    }

    isGroup(index, item): boolean {
        return item.isGroupBy;
    }

    getBoldRow(element) {
        if (element.positionName == element.commodity) {
            return true;
        } else {
            return false;
        }
    }

    getDataList() {
        var searchModel: any = {};
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        this.isLoading = true;
        this.dashboardService.getConsolidatedVesselDashboard(searchModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                if (response.data) {
                    let dataSource = response.data;
                    dataSource.forEach((source) => {
                        if (source.positionName == 'ORIMU ANA' || source.positionName == 'ORIMU SG') {
                            source.positionName = 'SG ORIMU';
                        }
                        if (source.commodity == 'ORIMU SG') {
                            source.commodity = 'SG ORIMU';
                            source.groupName = 'SG ORIMU';
                        }
                        if (source.commodity == 'ORIMU ANA-Total') {
                            source.commodity = 'SG ORIMU-TOTAL'
                        }
                        if (source.commodity == 'Paper & Futures') {
                            source.commodity = 'PAPER & FUTURES'
                        }
                        if (source.positionName != 'GRAND TOTAL' && source.commodityKey != 'SG ANA-TOTAL' && source.commodityKey != 'SG ORIMU-TOTAL' && (source.positionName && source.positionName.toLowerCase()) == (source.commodity && source.commodity.toLowerCase())) {
                            source.isGroupBy = true;
                            source.groupName = source.positionName;
                            if (source.positionName == 'SG ANA' || source.positionName == 'SG ORIMU') {
                                source.ytDgrossText = 'YTD PRICED WITH AAA';
                                source.totalGrossText = 'YTD SALES TO INDIA';
                            } else if (source.positionName == 'ANA INDIA PHYSICAL (TOLLING)') {
                                source.dailyMTMValue = source.dailyMTM;
                                source.dayChangeMtmValue = source.dayChangeMtm;
                               
                            }
                        }
                        else if (source.positionName == 'GRAND TOTAL') {
                            source.isBold = true;
                        }
                    })
                    dataSource = this.getFilteredRecords(dataSource);
                    this.dataSource = dataSource;
                } else {
                    this.dataSource = [];
                }
                this.originalData = this.dataSource;
                this.exportEmissions();
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    expandElementRow(data) {
        let originalData = this.dataSource;
        if (this.expandedElement != null && data != this.expandedElement) {
            originalData.forEach((rec) => {
                if (this.expandedElement.commodity == rec.subGroupName && this.expandedElement.positionName == rec.positionName && this.expandedElement.companyName == rec.companyName
                ) {
                    rec.isHide = !rec.isHide;
                    rec.isExpanded = !rec.isExpanded
                }
            })
        }
        this.expandedElement = this.expandedElement == data ? null : data;
        if (this.expandedElement) {
            originalData.forEach((rec) => {
                if (data.commodity == rec.subGroupName && data.positionName == rec.positionName && data.companyName == rec.companyName) {
                    rec.isHide = !rec.isHide;
                    rec.isExpanded = !rec.isExpanded
                }
            })
            this.dataSource = originalData;
        } else {
            let dataSource = this.dataSource;
            dataSource.forEach((rec) => {
                if (data.commodity == rec.subGroupName && data.positionName == rec.positionName && data.companyName == rec.companyName) {
                    rec.isHide = !rec.isHide;
                    rec.isExpanded = !rec.isExpanded
                }
            })
            this.dataSource = dataSource;
        }
        this.cdRef.detectChanges();
    }

    getmtmStyle(data) {
        if (data) {
            if (data.commodity == 'GRAND TOTAL' || data.commodity == 'Ana India-Total' || data.commodity == 'Umiro India-Total'
                || data.commodity == 'SG ANA-Total' || data.commodity == 'SG ORIMU-TOTAL') {
                return 'grand-total-daily-mtm'
            } else if (data.isExpanded == true) {
                return 'text-background-daily-mtm-child'
            } else {
                return 'text-background-daily-mtm'
            }
        }

    }

    gettradingPlStyle(data) {
        if (data) {
            if (data.commodity == 'GRAND TOTAL' || data.commodity == 'Ana India-Total' || data.commodity == 'Umiro India-Total'
                || data.commodity == 'SG ANA-Total' || data.commodity == 'SG ORIMU-TOTAL') {
                return 'grand-total-trading-pl'
            } else if (data.isExpanded == true) {
                return 'text-background-trading-child'
            } else {
                return 'text-background-trading-pl'
            }
        }
    }

    getOpeningBalanceStyle(data) {
        if (data) {
            if (data.commodity == 'GRAND TOTAL' || data.commodity == 'Ana India-Total' || data.commodity == 'Umiro India-Total'
                || data.commodity == 'SG ANA-Total' || data.commodity == 'SG ORIMU-TOTAL') {
                return 'grand-total-opening-balance'
            } else if (data.isExpanded == true) {
                return 'text-background-opening-balance-child'
            } else {
                return 'text-background-opening-balance'
            }
        }

    }



    getHideData(element) {
        if (element.isGroupBy == true || element.isHide == true) {
            return true;
        } else {
            return false;
        }
    }

    getFilteredRecords(dataSource) {
        let filteredDataSources = [];
        dataSource.forEach((element) => {
            if (element.isGroupBy == true || element.commodity == 'GRAND TOTAL' || element.commodity == 'SG ANA-Total' || element.commodity == 'SG ORIMU-TOTAL') {
                element.isHide = false;
                filteredDataSources.push(element);
            } else {
                if ((element.openingBalance == 0 || element.openingBalance == -999999) && element.ytDgross == 0 && element.ytDgross1 == 0 && element.ytDgross2 == 0 &&
                    element.ytDgross3 == 0 && element.ytDgross4 == 0 && element.ytDgross5 == 0 && element.ytDgross6 == 0 && (element.ytDgross7 == 0 || element.ytDgross7 == -88888) &&
                    element.totalGross == 0 && element.netOpening == 0 && element.netClosing == 0 && element.dayChange == 0 && element.dayChangeMtm == 0
                    && element.dailyMTM == 0 && element.dayPAndL == 0 && element.mtdpAndL == 0 && element.ytdRealisedPAndL == 0 &&
                    element.ytdUnRealisedPAndL == 0 && element.ytdTotalPAndL == 0) {
                    let children = element.children;

                } else {
                    let children = element.children;
                    if (children && children.length > 0) {
                        element.isHide = false;
                        filteredDataSources.push(element);
                        children.forEach((child) => {
                            if ((child.openingBalance == 0 || child.openingBalance == -999999) && child.ytDgross == 0 && child.ytDgross1 == 0 && child.ytDgross2 == 0 &&
                                child.ytDgross3 == 0 && child.ytDgross4 == 0 && child.ytDgross5 == 0 && child.ytDgross6 == 0 && (child.ytDgross7 == 0 || child.ytDgross7 == -88888) &&
                                child.totalGross == 0 && child.netOpening == 0 && child.netClosing == 0 && child.dayChange == 0 && child.dayChangeMtm == 0
                                && child.dailyMTM == 0 && child.dayPAndL == 0 && child.mtdpAndL == 0 && child.ytdRealisedPAndL == 0 &&
                                child.ytdUnRealisedPAndL == 0 && child.ytdTotalPAndL == 0) {


                            } else {
                                child.isHide = true;
                                child.isExpanded = false;
                                child.subGroupName = element.commodity;
                                child.companyName = element.companyName;
                                filteredDataSources.push(child);
                            }
                        })

                    } else {
                        element.isHide = false;
                        if ((element.positionName == 'SG ORIMU' && element.commodity != 'SG ORIMU-TOTAL' && element.commodity != 'Sub Total') ||
                            (element.positionName == 'SG ANA' && element.commodity != 'SG ANA-Total' && element.commodity != 'Sub Total') ||
                            (element.positionName == 'PAPER & FUTURES' && element.commodity != 'Sub Total')) {
                            element.subGroupName = element.positionName;
                            element.isHide = true;
                        }
                        filteredDataSources.push(element);
                    }

                }
            }
        })
        return filteredDataSources;
    }

    getHideRow(element) {
        if (element.openingBalance == 0 && element.ytDgross == 0 && element.ytDgross1 == 0 && element.ytDgross2 == 0 &&
            element.ytDgross3 == 0 && element.ytDgross4 == 0 && element.ytDgross5 == 0 && element.ytDgross6 == 0 && element.ytDgross7 == 0 &&
            element.netOpening == 0 && element.netClosing == 0 && element.dayChange == 0 && element.dayChangeMtm == 0
            && element.dailyMTM == 0 && element.dayPAndL == 0 && element.mtdpAndL == 0 && element.ytdRealisedPAndL == 0 &&
            element.ytdUnRealisedPAndL == 0 && element.ytdTotalPAndL == 0) {
            return true;
        } else {
            return false;
        }
    }

    showExpandIcon(element) {
        if (element.children.length > 0) {
            let children = element.children;
            let filteredlist = _.filter(children, function (rec) {
                return (rec.openingBalance == 0 && rec.ytDgross == 0 && rec.ytDgross1 == 0 && rec.ytDgross2 == 0 &&
                    rec.ytDgross3 == 0 && rec.ytDgross4 == 0 && rec.ytDgross5 == 0 && rec.ytDgross6 == 0 && rec.ytDgross7 == 0 &&
                    rec.netOpening == 0 && rec.netClosing == 0 && rec.dayChange == 0 && rec.dayChangeMtm == 0
                    && rec.dailyMTM == 0 && rec.dayPAndL == 0 && rec.mtdpAndL == 0 && rec.ytdRealisedPAndL == 0 &&
                    rec.ytdUnRealisedPAndL == 0 && rec.ytdTotalPAndL == 0)
            })
            if (filteredlist.length > 0) {
                filteredlist.forEach((fil) => {
                    let index = children.indexOf(fil);
                    children.splice(index, 1);
                })
            }
            if (children.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    getFontSizeAndColor(data) {
        if (data.commodity.toUpperCase() == 'GRAND TOTAL' || data.commodity == 'Ana India-Total' || data.commodity == 'Umiro India-Total'
            || data.commodity == 'SG ANA-Total' || data.commodity == 'SG ORIMU-TOTAL') {

            return 'grand-total-font'

        }
        else if (data.isBold == true) {
            return 'text-bold'
        }
    }

    getFontSize(data, value) {
        if (data.commodity.toUpperCase() == 'GRAND TOTAL' || data.commodity == 'Ana India-Total' || data.commodity == 'Umiro India-Total'
            || data.commodity == 'SG ANA-Total' || data.commodity == 'SG ORIMU-TOTAL') {
            if (value > 0) {
                return 'grand-total-font-positive'
            } else {
                return 'grand-total-font'
            }
        }
        else if (data.isBold == true) {
            return 'text-bold'
        }
    }



    getFormatData(element) {
        let data;
        if (element > 0) {
            data = this.numberPipe.transform(element, '1.0-3');
        } else if (element < 0 && element != -999999 && element != -88888) {
            element = (-1) * (element);
            data = '(' + this.numberPipe.transform(element, '1.0-3') + ')';
        } else if (element == -999999) {
            data = '';
        } else if (element == -88888) {
            data = '';
        } else if (element == 0) {
            data = '';
        } else {
            data = element;
        }
        return data;
    }

    getFormatDataChange(element) {
        let data;
        if (element > 0) {
            data = this.numberPipe.transform(element, '1.0-3');
        } else if (element < 0 && element != -999999 && element != -88888) {
            element = (-1) * (element);
            data = '(' + this.numberPipe.transform(element, '1.0-3') + ')';
        } else if (element == -999999) {
            data = '';
        } else if (element == -88888) {
            data = '';
        } else {
            data = element;
        }
        return data;
    }

    getCommodityName(commodity) {
        if (commodity.toUpperCase() == 'GRAND TOTAL' || commodity == 'Ana India-Total' || commodity == 'Umiro India-Total'
            || commodity == 'SG ANA-Total' || commodity == 'SG ORIMU-TOTAL') {
            return commodity.toUpperCase()
        } else {
            return commodity;
        }
    }

    // fitContent(optionalParameters: any) {

    //     if (optionalParameters['gridsterView']) {

    //         if ($(optionalParameters['gridsterViewSelector'] + ' #widget-scroll-id').length > 0) {

    //             var appHeight = $(optionalParameters['gridsterViewSelector']).height();
    //             var contentHeight = appHeight - 45;
    //             $(optionalParameters['gridsterViewSelector'] + ' #widget-scroll-id').height(contentHeight);

    //             setTimeout(function () {
    //                 $('#table-1' + ' datatable-body').addClass('widget-scroll');
    //                 $('#table-2' + ' datatable-body').addClass('widget-scroll');
    //             }, 1000);

    //         }

    //     }

    // }

}


