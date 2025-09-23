import { DatePipe, DecimalPipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../services/dashboard-table.service";
import * as moment from "moment";
import * as _ from "underscore";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import html2canvas from 'html2canvas';


@Component({
    selector: 'app-consolidated-level-dashboard',
    templateUrl: './consolidated-dashboard.component.html',
    styleUrls: ['./consolidated-dashboard.component.scss']
})

export class ConsolidatedDashboardComponent implements OnInit {
    @Input("productGroup")
    set _productGroup(data: any) {
        this.commodity = data;
        if (this.commodity) {
            this.companyName = JSON.parse(localStorage.getItem("UserModel"))?.companyName;
            this.buttonSelected = 'dateRange';
            this.dayTypeForTimeUsage('dateRange');
            this.dateToday = new Date();
            this.companyCreatedDateTime = new Date();
        }
    }
    @ViewChild('consolidatedDashboard') listElement: ElementRef;
    @Output() fileBytes = new EventEmitter<any>();
    options: any[] = [];
    dataListResult: any = [];
    companiesList: any = [];
    dataList: any[] = [];
    pandLTableValues: any[] = [];
    commodity: string;
    companyName: string;
    buttonSelected: string;
    selectedMonth: string;
    selectedWeek: string;
    dateToday: Date;
    monthDate: Date;
    fromDate: Date;
    toDate: Date;
    currentDate: Date;
    totalSalesQuantity: any;
    totalSourceQuantity: any;
    totalLocalContracts: any;
    totalImportContracts: any;
    companyCreatedDateTime: Date;
    enableProfitAndLoss: boolean;
    isLoadingInprogress: boolean;
    visibleCards: boolean;
    isLoadingPL: boolean;
    dateFrom: Date;
    dateTo: Date;
    filterType: any;
    isDay: number;
    dayCount: number;
    datestring: string;
    weekDate: Date;
    weekNumber: any;

    constructor(private toastr: ToastrService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe,
        private dashboardService: DashboardService, private numberPipe: DecimalPipe) {
        this.searchCompaniesList();
        this.options = [
            {
                label: 'Palm Oil',
                value: 'Palm Oil'
            },
            {
                label: 'Sun Flower Oil',
                value: 'Sun Flower Oil'
            },
            {
                label: 'Ricebran Oil',
                value: 'Ricebran Oil'
            },
            {
                label: 'Soyabean Oil',
                value: 'Soyabean Oil'
            },
            {
                label: 'Glycerin',
                value: 'Glycerin'
            }
        ]
    }
    ngOnInit() {

    }

    searchCompaniesList() {
        var searchModel: any = {};
        searchModel.isArchived = false;
        this.dashboardService.searchCompanies(searchModel).subscribe((response: any) => {
            if (response.success) {
                this.companiesList = response.data;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    valueChangeEvent(event) {
        if (event) {
            this.commodity = event.value;
        } else {
            this.commodity = null;
        }
        this.cdRef.detectChanges();
        this.recallCards();
        this.getDataList();
    }

    getDataList() {
        this.enableProfitAndLoss = false;
        var searchModel: any = {};
        searchModel.productType = this.commodity;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        searchModel.companyName = this.companyName;
        searchModel.isConsolidated = true;
        this.isLoadingInprogress = true;
        this.dashboardService.getConsolidatedDashboard(searchModel).subscribe((response: any) => {
            this.isLoadingInprogress = false;
            if (response.success) {
                this.dataListResult = response.data;
                if (this.dataListResult) {
                    let dataResult = this.dataListResult.gridData;
                    if (dataResult && dataResult.length > 0) {
                        let productResult = dataResult[0];
                        if (productResult.productName.includes("Product Group:")) {
                            this.dataList = dataResult.splice(1);
                        } else {
                            this.dataList = dataResult;
                        }
                    }
                    else {
                        this.dataList = [];
                    }
                }
                else {
                    this.dataList = [];
                }
                this.getCardValues();
                this.exportEmissions();
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
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
                model.visualisationName = "Consolidated dashboard";
                model.isSystemWidget = true;
                model.widgetName = "Contract level dashboard";
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        }, 500);
    }


    onChange(selected) {
        this.buttonSelected = selected.value;
        this.dayTypeForTimeUsage(this.buttonSelected);
    }

    dayTypeForTimeUsage(clickType) {
        this.filterType = clickType;
        this.isDay = 0;
        this.dayCount = 7;
        if (clickType == "day") {
            this.dateToday = new Date();
            this.dateToday.setDate(this.dateToday.getDate());
            this.datestring = moment(this.dateToday).format('DD-MMM-YYYY')
            this.dateFrom = this.dateToday;
            this.dateTo = this.dateToday;
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        }

        else if (clickType == "week") {
            console.log('week')
            this.weekDate = new Date();
            this.weekDate.setDate(this.weekDate.getDate());
            var dateLocal = new Date();
            var first = this.weekDate.getDate() - this.weekDate.getDay() + 1;
            var last = first + 6;
            this.dateFrom = new Date(this.weekDate.setDate(first));
            this.dateTo = new Date(dateLocal.setDate(last));
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            console.log(this.weekNumber)
        }
        else if (clickType == "month") {
            this.monthDate = new Date();
            this.monthDate.setDate(this.monthDate.getDate() - 1);
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            this.selectedMonth = this.monthDate.toISOString();
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        }

        else {
            this.fromDate = new Date('2022-12-01');
            this.fromDate.setDate(this.fromDate.getDate());
            this.toDate = new Date();
            this.toDate.setDate(this.toDate.getDate());
            this.dateFrom = this.fromDate;
            this.dateTo = this.toDate;
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        }
        this.recallCards();
        this.getDataList();
    }

    timeSheetDetailsForDay(clickType, buttonType) {
        this.dateToday = new Date(this.dateToday);
        if (clickType == "backward") {
            this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() - 7 : this.dateToday.getDate() - 1));
            if (buttonType == "week") {
                this.isDay = 8;
                this.dayCount = 1;
            }
        }
        else {
            this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() + 7 : this.dateToday.getDate() + 1));
            if (buttonType == "week") {
                this.isDay = 0;
                this.dayCount = 7;
            }
        }
        this.dateFrom = this.dateToday;
        this.dateTo = this.dateToday;
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToday = event.target.value;
        this.datestring = moment(this.dateToday).format('DD-MMM-YYYY')
        this.dateFrom = event.target.value;
        this.dateTo = event.target.value;
        this.setFromDate(this.dateFrom);
        this.setToDate(this.dateTo);
    }

    getForwordValues() {
        if (this.filterType === 'day') {
            this.timeSheetDetailsForDay('forward', 'day');
            this.next();
        }
        else if (this.filterType === 'week') {
            this.getWeekBasedOnDate('right')
        }
        else if (this.filterType === 'month') {
            this.getMonthBasedOnDate('right')
        }
        this.recallCards();
        this.getDataList();
    }

    getBackwordValues() {
        if (this.filterType === 'day') {
            this.timeSheetDetailsForDay('backward', 'day');
            this.previous();
        }
        else if (this.filterType === 'week') {
            this.getWeekBasedOnDate('left')
        }
        else if (this.filterType === 'month') {
            this.getMonthBasedOnDate('left')
        }
        this.recallCards();
        this.getDataList();
    }

    getWeekNumber(selectedWeek) {
        const currentDate = selectedWeek.getDate();
        const monthStartDay = (new Date(this.weekDate.getFullYear(), this.weekDate.getMonth(), 1)).getDay();
        const weekNumber = (selectedWeek.getDate() + monthStartDay) / 7;
        const week = (selectedWeek.getDate() + monthStartDay) % 7;
        this.selectedWeek = selectedWeek.toISOString();
        if (week !== 0) {
            return Math.ceil(weekNumber);
        } else {
            return weekNumber;
        }
    }

    getWeekBasedOnDate(direction) {
        if (direction === 'right') {
            const day = this.weekDate.getDate() + 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            let first = this.weekDate.getDate() - this.weekDate.getDay() + 1;
            let last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        } else {
            const day = this.weekDate.getDate() - 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            let newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.parse(newDate));
            var first = this.weekDate.getDate() - this.weekDate.getDay() + 1;
            var last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        }
        this.setDateFrom(this.dateFrom);
        this.setDateTo(this.dateTo);
    }

    setDateFrom(date) {
        if (new Date(date) < new Date(this.companyCreatedDateTime)) {
            date = this.companyCreatedDateTime;
        }
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year);
    }

    setDateTo(date) {
        if (new Date(date) > new Date(this.currentDate)) {
            date = this.currentDate;
        }
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year);
    }

    setFromDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year);
    }
    setToDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year);
    }

    getMonthBasedOnDate(direction) {
        var monthValue;
        if (direction === 'right') {
            const day = this.monthDate.getDate();
            const month = 0 + (this.monthDate.getMonth() + 1) + 1;
            const year = this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        } else {
            const day = this.monthDate.getDate();
            const month = (this.monthDate.getMonth() + 1) - 1;
            const year = 0 + this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            var num = new Date(year, month, 0).getDate();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        }

    }

    next() {
        this.dayCount = this.dayCount + 1;
        this.isDay = this.isDay + 1;
    }
    previous() {
        this.isDay = this.isDay + 1;
        this.dayCount = this.dayCount - 1;
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

    getIsBold(data) {
        return data.isBold ? "font-weight:bold;font-style:normal;font-size:larger;" : "font-style:normal;font-size:larger;";
    }

    enableProfitLossTable() {
        this.enableProfitAndLoss = !this.enableProfitAndLoss;
        this.cdRef.detectChanges();
        this.getProfitAndLossBasedOnInstanceLevel();
    }

    getProfitAndLossBasedOnInstanceLevel() {
        var searchModel: any = {};
        searchModel.productType = this.commodity;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        searchModel.companyName = this.companyName;
        searchModel.isConsolidated = true;
        this.isLoadingPL = true;
        this.dashboardService.getProfitLossListForConsolidatedDashboard(searchModel).subscribe((response: any) => {
            this.isLoadingPL = false;
            if (response.success) {
                if (response.data) {
                    let pLRealisedData = response.data;
                    this.pandLTableValues = pLRealisedData;
                    this.cdRef.detectChanges();

                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getCardValues() {
        if (this.dataListResult) {
            let data = this.dataListResult;
            this.totalImportContracts = data.totalImportContracts;
            this.totalLocalContracts = data.totalLocalContracts;
            this.totalSourceQuantity = data.totalSourceQuantity;
            this.totalSalesQuantity = data.totalSalesQuantity;
            this.visibleCards = true;
        } else {
            this.totalImportContracts = '';
            this.totalLocalContracts = '';
            this.totalSourceQuantity = '';
            this.totalSalesQuantity = '';
            this.visibleCards = true;
        }
    }

    recallCards() {
        this.visibleCards = false;
        this.totalImportContracts = 0;
        this.totalLocalContracts = 0;
        this.totalSourceQuantity = 0;
        this.totalSalesQuantity = 0;
    }

    getTotalValue(data) {
        var totalValue = Number(data.realisedTotal) + Number(data.unRealisedTotal);
        if (totalValue > 0 || totalValue < 0) {
            var totalDisplay = this.numberPipe.transform(totalValue, '1.0-3');
            return totalDisplay;
        } else {
            return 0;
        }
    }

    getCompanyName(companyId) {
        if (companyId) {
            let companiesList = this.companiesList;
            let filteredList = _.filter(companiesList, function (filter) {
                return filter.companyId == companyId;
            })
            if (filteredList.length > 0) {
                return filteredList[0].companyName;
            } else {
                return "";
            }
        }
        else {
            return "";
        }
    }
}