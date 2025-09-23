import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewChildren, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment_ from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { DashboardService } from '../services/dashboard-table.service';
import * as _ from "underscore";
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import html2canvas from 'html2canvas';
const moment = moment_

@Component({
    selector: 'app-dashboard-table',
    templateUrl: './dashboard-table.component.html',
    styleUrls: ['./dashboard-table.component.css']
})
export class DashboardTableComponent implements OnInit, AfterViewInit {
    @ViewChild('dashboard') listElement: ElementRef;
    @Output() fileBytes = new EventEmitter<any>();
    enablePLTable: boolean = false;
    enableUnRealisedPLTable: boolean = false;
    enableProfitAndLoss: boolean = false;
    tableHeaders: any[] = [];
    tablePLHeaders: any[] = [];
    tableValues: any[] = [];
    unrealisedTableValues: any[] = [];
    pLRealisedTables: any[] = [];
    pLUnRealisedTables: any[] = [];
    lastTableHeader: any = {};
    isType: string;
    isContractUniqueId: string;
    isLoading: boolean;
    options: any;
    isLoadingInprogress: boolean;
    isLoadingPL: boolean;
    buttonSelected: string;
    width: any = "275";
    options1: any = [
        {
            label: "Import",
            value: "IMPORTED"
        },
        {
            label: "Local",
            value: "LOCAL"
        }
    ]
    searchTextChanged = new Subject<any>();
    subscription: Subscription;
    dataList: any = [];
    contractUniqueId: any;
    productType: any;
    searchText: any;
    filterType: any = 'day';
    dateFrom: Date;
    dateTo: Date;
    dateToday: Date;
    datestring: string;
    toDate: any;
    fromDate: any;
    dayCount: number;
    isDay: number;
    companyCreatedDateTime: string | number | Date;
    currentDate: string | number | Date;
    weekDate: Date = new Date();
    selectedWeek: any;
    selectedMonth: any;
    monthDate: Date = new Date();
    weekNumber: number;
    maxDate = new Date();
    cardValues: any;
    sourceImportCommodity: any;
    totalContractQuantity: any;
    usedContractQuantity: any;
    openingBalance: any;
    availableBalance: any;
    visibleCards: boolean;
    userCompanyIds: any;
    dataListResult: any = [];
    productGroup: any;
    companyName: any;
    isEdit: boolean;
    quantity: any;
    updatedQuantity: any;
    isQuantityLoading: boolean;
    unRealisedTotalValue: number;
    totalRealisedValue: number;
    constructor(private cookieService: CookieService, private cdRef: ChangeDetectorRef, private dashboardService: DashboardService,
        private toastr: ToastrService, private datePipe: DatePipe, private numberPipe: DecimalPipe
    ) {
        this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
        this.companyName = JSON.parse(localStorage.getItem("UserModel"))?.companyName;
        this.isEdit = false;
        this.buttonSelected = 'day';
        this.dayTypeForTimeUsage('day');
        this.dateToday = new Date();
        this.companyCreatedDateTime = new Date();
        this.productType = "IMPORTED";
        this.getContractUniqueIdsList();
        //this.companyCreatedDateTime = new Date();
        this.tableHeaders = [
            {
                label: 'CPO',
                value: 'cpoLocal',
                isSort: true
            },
            {
                label: 'Refined Palm Oil',
                value: 'refinedPalmoil',
                isSort: true
            },
            {
                label: 'RBD Palm Olien',
                value: 'rbdPalmOlien',
                isSort: true
            },
            {
                label: 'RPO 1',
                value: 'rpo1',
                isSort: true
            },
            {
                label: 'Strearin',
                value: 'strearin',
                isSort: true
            },
            {
                label: 'PFAD',
                value: 'pfad',
                isSort: true
            },
            {
                label: 'Hard Stearin',
                value: 'hardStearin',
                isSort: true
            },
            {
                label: 'Soft Stearin',
                value: 'softStearin',
                isSort: true
            },
            {
                label: 'Super Olien',
                value: 'superOlien',
                isSort: true
            },
            {
                label: 'White Olien',
                value: 'whiteOlien',
                isSort: true
            },
            {
                label: 'Calcium Soap',
                value: 'calciumSoap',
                isSort: true
            }
        ]
        this.tablePLHeaders = [
            {
                label: 'CPO',
                value: 'cpoLocal',
                isSort: true
            },
            {
                label: 'Refined Palm Oil',
                value: 'refinedPalmoil',
                isSort: true
            },
            {
                label: 'RBD Palm Olien',
                value: 'rbdPalmOlien',
                isSort: true
            },
            {
                label: 'RPO 1',
                value: 'rpo1',
                isSort: true
            },
            {
                label: 'Strearin',
                value: 'strearin',
                isSort: true
            },
            {
                label: 'PFAD',
                value: 'pfad',
                isSort: true
            },
            {
                label: 'Hard Stearin',
                value: 'hardStearin',
                isSort: true
            },
            {
                label: 'Soft Stearin',
                value: 'softStearin',
                isSort: true
            },
            {
                label: 'Super Olien',
                value: 'superOlien',
                isSort: true
            },
            {
                label: 'White Olien',
                value: 'whiteOlien',
                isSort: true
            },
            {
                label: 'Calcium Soap',
                value: 'calciumSoap',
                isSort: true
            }
        ]
        this.tableValues = [
            {
                'text': 'Sales In Quantity',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Sales in Value',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Purchase',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': true,
                'rowSpan': true,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Total FX settled in USD',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': true,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Total FX settled in INR',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': true,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Duty',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': true,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Quantity Paid',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Value in INR',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Refining Cost Incurred',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            },
            {
                'text': 'Realised P&L',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': 'TOTAL',
                'total': '',
                'isBold': true,
                'rowSpan': false,
                'fxSetteledInUsd': '',
                'fxSettledInInr': '',
                'quantityPaid': '',
                'valueInInr': '',
                'decimal': 2

            }
        ];
        this.pLRealisedTables = [
            {
                'name': 'CPO',
                'salesInQuantity': '',
                'salesInValue': '',
                'totalPurchaseFXInUSD': '',
                'totalPurchaseFXInINR': '',
                'dutyQuantityPaid': '',
                'dutyValueInINR': '',
                'refiningCostIncurred': ''
            },
            {
                'name': 'Refined Palm Oil',
                'salesInQuantity': '',
                'salesInValue': '',
                'totalPurchaseFXInUSD': '',
                'totalPurchaseFXInINR': '',
                'dutyQuantityPaid': '',
                'dutyValueInINR': '',
                'refiningCostIncurred': ''
            },
            {
                'name': 'RBD Palm Olien',
                'salesInQuantity': '',
                'salesInValue': '',
                'totalPurchaseFXInUSD': '',
                'totalPurchaseFXInINR': '',
                'dutyQuantityPaid': '',
                'dutyValueInINR': '',
                'refiningCostIncurred': ''
            },
            {
                'name': 'Refined Palm Oil',
                'salesInQuantity': '',
                'salesInValue': '',
                'totalPurchaseFXInUSD': '',
                'totalPurchaseFXInINR': '',
                'dutyQuantityPaid': '',
                'dutyValueInINR': '',
                'refiningCostIncurred': ''
            },
        ]

        this.unrealisedTableValues = [
            {
                'text': 'Closing Balance',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'MTM Value',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Purchase',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': true,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'FX value pending remittance(USD)',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'MTM Rate',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 4

            },
            {
                'text': 'Value in INR',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Quantity Unpaid',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': true,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Quantity Unpaid',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Duty MTM',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 4

            },
            {
                'text': 'Valur in INR',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Refining Cost Pending',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': '',
                'total': '',
                'isBold': false,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            },
            {
                'text': 'Unrealised P&L',
                'cpoLocal': '',
                'refinedPalmoil': '',
                'rbdPalmOlien': '',
                'rpo1': '',
                'strearin': '',
                'pfad': '',
                'hardStearin': '',
                'softStearin': '',
                'superOlien': '',
                'whiteOlien': '',
                'calciumSoap': 'TOTAL',
                'total': '',
                'isBold': true,
                'fxValuePendingRemittance': '',
                'mtmValue': '',
                'valueinr': '',
                'quantityUnPaid': '',
                'dutyMtm': '',
                'valueInrInQuantityUnpaid': '',
                'decimal': 2

            }
        ]

        this.pLUnRealisedTables = [
            {
                'name': 'CPO',
                'closingBalance': '',
                'mtmValue': '',
                'purchaseFXValueInUSD': '',
                'purchaseMTMRate': '',
                'purchaseValueInINR': '',
                'quantityUnpaid': '',
                'quantityDutyMTM': '',
                'quantityUnPaidValueInINR': '',
                'refiningCostPending': ''
            },
            {
                'name': 'Refined Palm Oil',
                'closingBalance': '',
                'mtmValue': '',
                'purchaseFXValueInUSD': '',
                'purchaseMTMRate': '',
                'purchaseValueInINR': '',
                'quantityUnpaid': '',
                'quantityDutyMTM': '',
                'quantityUnPaidValueInINR': '',
                'refiningCostPending': ''
            },
            {
                'name': 'RBD Palm Olien',
                'closingBalance': '',
                'mtmValue': '',
                'purchaseFXValueInUSD': '',
                'purchaseMTMRate': '',
                'purchaseValueInINR': '',
                'quantityUnpaid': '',
                'quantityDutyMTM': '',
                'quantityUnPaidValueInINR': '',
                'refiningCostPending': ''
            },
            {
                'name': 'Refined Palm Oil',
                'closingBalance': '',
                'mtmValue': '',
                'purchaseFXValueInUSD': '',
                'purchaseMTMRate': '',
                'purchaseValueInINR': '',
                'quantityUnpaid': '',
                'quantityDutyMTM': '',
                'quantityUnPaidValueInINR': '',
                'refiningCostPending': ''
            },
        ]

        this.subscription = this.searchTextChanged
            .pipe(debounceTime(1500),
                distinctUntilChanged()
            )
            .subscribe(term => {
                let updatedQuantity = term;
                if (updatedQuantity) {
                    this.updatedQuantity = Number(updatedQuantity)
                } else {
                    this.updatedQuantity = 0;
                }
                this.updateUserQuantity();
            })
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.exportEmissions();  
    }
    getIsBold(data) {
        return data.isBold ? "font-weight:bold;font-style:normal;font-size:larger;" : "font-style:normal;font-size:larger;";
    }

    filterByName(event) {

    }
    onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToday = event.target.value;
        this.datestring = moment(this.dateToday).format('DD-MMM-YYYY')
        this.dateFrom = event.target.value;
        this.dateTo = event.target.value;
        this.setFromDate(this.dateFrom);
        this.setToDate(this.dateTo);
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
            this.fromDate = new Date();
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
    recallCards() {
        this.visibleCards = false;
        this.productGroup = "";
        this.sourceImportCommodity = "";
        this.availableBalance = 0;
        this.totalContractQuantity = 0;
        this.usedContractQuantity = 0;
        this.openingBalance = 0;
    }
    valueChangeEvent(event) {
        this.isType = event;
        this.isEdit = false;
        this.refreshCalls();
        this.cdRef.detectChanges();
        this.getDataList();
        // this.getCardValues();
    }

    refreshCalls() {
        this.productGroup = "";
        this.sourceImportCommodity = "";
        this.availableBalance = 0;
        this.totalContractQuantity = 0;
        this.usedContractQuantity = 0;
        this.openingBalance = 0;
    }

    next() {
        this.dayCount = this.dayCount + 1;
        this.isDay = this.isDay + 1;
    }
    previous() {
        this.isDay = this.isDay + 1;
        this.dayCount = this.dayCount - 1;
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
    productTypeChangeEvent(event) {
        this.recallCards();
        this.isContractUniqueId = event;
        this.contractUniqueId = null;
        this.isEdit = false;
        this.dataList = [];
        this.getContractUniqueIdsList();
        // this.getCardValues();
    }

    enableProfitLossTable() {
        this.enableProfitAndLoss = !this.enableProfitAndLoss;
        this.cdRef.detectChanges();
        this.getProfitLossList();
        this.getUnRealisedProfitLossList();
    }


    framingRealisedPL() {
        var framingModelArray: any[] = [];
        let tableHeaders = this.tableHeaders;
        this.lastTableHeader = this.tableHeaders[this.tableHeaders.length - 1];
        let framingModel: any = {};
        framingModel.name = 'Sales In Quantity'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModel[header.value] = '';
            }
        })
        framingModel.isBold = false;
        framingModel.total = 0;
        framingModel.decimal = 3;
        framingModelArray.push(framingModel);

        let framingModelForSales: any = {};
        framingModelForSales.name = 'Sales In Value'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelForSales[header.value] = '';
            }
        })
        framingModelForSales.isBold = false;
        framingModelForSales.total = 0;
        framingModelForSales.decimal = 3;
        framingModelArray.push(framingModelForSales);

        let framingModelForPurchase: any = {};
        framingModelForPurchase.name = 'Purchase'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelForPurchase[header.value] = '';
            }
        })
        framingModelForPurchase.isBold = true;
        framingModelForPurchase.total = '';
        framingModelArray.push(framingModelForPurchase);

        let framingModelforFxInUSD: any = {};
        framingModelforFxInUSD.name = 'Total FX Settled In USD'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforFxInUSD[header.value] = '';
            }
        })
        framingModelforFxInUSD.isBold = false;
        framingModelforFxInUSD.total = 0;
        framingModelforFxInUSD.decimal = 3;
        framingModelArray.push(framingModelforFxInUSD);

        let framingModelforFxInINR: any = {};
        framingModelforFxInINR.name = 'Total FX Settled In INR'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforFxInINR[header.value] = '';
            }
        })
        framingModelforFxInINR.isBold = false;
        framingModelforFxInINR.total = 0;
        framingModelforFxInINR.decimal = 3;
        framingModelArray.push(framingModelforFxInINR);

        let framingModelforDuty: any = {};
        framingModelforDuty.name = 'Duty'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforDuty[header.value] = '';
            }
        })
        framingModelforDuty.isBold = true;
        framingModelforDuty.total = '';
        framingModelforDuty.decimal = 3;
        framingModelArray.push(framingModelforDuty);

        let framingModelforQuantityPaid: any = {};
        framingModelforQuantityPaid.name = 'Quantity Paid'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforQuantityPaid[header.value] = '';
            }
        })
        framingModelforQuantityPaid.isBold = false;
        framingModelforQuantityPaid.total = 0;
        framingModelforQuantityPaid.decimal = 3;
        framingModelArray.push(framingModelforQuantityPaid);

        let framingModelforValueInINR: any = {};
        framingModelforValueInINR.name = 'Value In INR'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforValueInINR[header.value] = '';
            }
        })
        framingModelforValueInINR.isBold = false;
        framingModelforValueInINR.total = 0;
        framingModelforValueInINR.decimal = 3;
        framingModelArray.push(framingModelforValueInINR);

        let framingModelforRefiningCost: any = {};
        framingModelforRefiningCost.name = 'Refining Cost Incurred'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforRefiningCost[header.value] = '';
            }
        })
        framingModelforRefiningCost.isBold = false;
        framingModelforRefiningCost.total = 0;
        framingModelforRefiningCost.decimal = 3;
        framingModelArray.push(framingModelforRefiningCost);

        let framingModelforRealisedPL: any = {};
        framingModelforRealisedPL.name = 'Realised P&L'
        tableHeaders.forEach((header) => {
            if (this.lastTableHeader.label == header.label) {
                framingModelforRealisedPL[header.value] = 'Total';
            } else {
                framingModelforRealisedPL[header.value] = '';
            }

        })
        framingModelforRealisedPL.isBold = true;
        framingModelforRealisedPL.total = '';
        framingModelforRealisedPL.decimal = 3;
        framingModelArray.push(framingModelforRealisedPL);

        let realisedValues = this.pLRealisedTables;
        tableHeaders.forEach((header) => {
            let filteredList = _.filter(realisedValues, function (plrealised) {
                return plrealised.name == header.label
            })
            if (filteredList.length > 0) {
                framingModelArray.forEach((array, i) => {
                    if (i == 0) {
                        if (header.label) {
                            array[header.value] = filteredList[0].salesInQuantity;
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }

                        }
                    } else if (i == 1) {
                        if (header.label) {
                            array[header.value] = filteredList[0].salesInValue
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 3) {
                        if (header.label) {
                            if (filteredList[0].totalPurchaseFXInUSD >= 0) {
                                array[header.value] = filteredList[0].totalPurchaseFXInUSD
                            }
                            else {
                                array[header.value] = (-1) * filteredList[0].totalPurchaseFXInUSD
                            }
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 4) {
                        if (header.label) {
                            if (filteredList[0].totalPurchaseFXInINR >= 0) {
                                array[header.value] = filteredList[0].totalPurchaseFXInINR
                            }
                            else {
                                array[header.value] = (-1) * filteredList[0].totalPurchaseFXInINR
                            }
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 6) {
                        if (header.label) {
                            array[header.value] = filteredList[0].dutyQuantityPaid
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 7) {
                        if (header.label) {
                            if (filteredList[0].dutyValueInINR >= 0) {
                                array[header.value] = filteredList[0].dutyValueInINR
                            } else {
                                array[header.value] = (-1) * filteredList[0].dutyValueInINR
                            }

                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 8) {
                        if (header.label) {
                            array[header.value] = filteredList[0].refiningCostIncurred
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    }
                })
            }
        })
        let totalPLRealisedData = framingModelArray.map(x => x.total);
        let totalValue = 0;

        let salesInValueTotal = 0;
        let totalFxSettledInINR = 0;
        let valueInInr = 0;
        framingModelArray.forEach((data) => {
            if (data.name == 'Sales In Value') {
                salesInValueTotal = data.total
            } else if (data.name == 'Total FX Settled In INR') {
                totalFxSettledInINR = data.total;
            } else if (data.name == 'Value In INR') {
                valueInInr = data.total;
            }
        })
        totalValue = salesInValueTotal - totalFxSettledInINR - valueInInr
        // totalPLRealisedData.forEach((val) => {
        //     if (val) {
        //         let totalRow = Number(val);
        //         totalValue = totalValue + totalRow;
        //     }
        // })
        let filteredPLRealised = _.filter(framingModelArray, function (array) {
            return array.name == 'Realised P&L';
        })
        if (filteredPLRealised.length > 0) {
            let index = framingModelArray.indexOf(filteredPLRealised[0]);
            filteredPLRealised[0].total = totalValue;
            framingModelArray[index] = filteredPLRealised[0];
        }

        console.log(framingModelArray);
        this.tableValues = framingModelArray;
        this.totalRealisedValue = totalValue;
        this.cdRef.detectChanges();

        // this.table
    }

    framingUnRealisedPL() {
        var framingModelArray: any[] = [];
        let tableHeaders = this.tablePLHeaders;
        this.lastTableHeader = this.tablePLHeaders[this.tablePLHeaders.length - 1];
        let framingModel: any = {};
        framingModel.name = 'Closing Balance'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModel[header.value] = '';
            }
        })
        framingModel.isBold = false;
        framingModel.total = 0;
        framingModel.decimal = 3;
        framingModelArray.push(framingModel);

        let framingModelForSales: any = {};
        framingModelForSales.name = 'MTM Value'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelForSales[header.value] = '';
            }
        })
        framingModelForSales.isBold = false;
        framingModelForSales.total = 0;
        framingModelForSales.decimal = 3;
        framingModelArray.push(framingModelForSales);

        let framingModelForPurchase: any = {};
        framingModelForPurchase.name = 'Purchase'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelForPurchase[header.value] = '';
            }
        })
        framingModelForPurchase.isBold = true;
        framingModelForPurchase.total = '';
        framingModelArray.push(framingModelForPurchase);

        let framingModelforFxInUSD: any = {};
        framingModelforFxInUSD.name = 'FX Value Pending Remittance(USD)'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforFxInUSD[header.value] = '';
            }
        })
        framingModelforFxInUSD.isBold = false;
        framingModelforFxInUSD.total = 0;
        framingModelforFxInUSD.decimal = 3;
        framingModelArray.push(framingModelforFxInUSD);

        let framingModelforFxInINR: any = {};
        framingModelforFxInINR.name = 'MTM Rate'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforFxInINR[header.value] = '';
            }
        })
        framingModelforFxInINR.isBold = false;
        framingModelforFxInINR.total = 0;
        framingModelforFxInINR.decimal = 4;
        framingModelArray.push(framingModelforFxInINR);

        let framingModelValueInINR: any = {};
        framingModelValueInINR.name = 'Value In INR'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelValueInINR[header.value] = '';
            }
        })
        framingModelValueInINR.isBold = false;
        framingModelValueInINR.total = 0;
        framingModelValueInINR.isPurchase = 'Purchase';
        framingModelArray.push(framingModelValueInINR);

        let framingModelforDuty: any = {};
        framingModelforDuty.name = 'Quantity Unpaid'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforDuty[header.value] = '';
            }
        })
        framingModelforDuty.isBold = true;
        framingModelforDuty.total = '';
        framingModelforDuty.decimal = 3;
        framingModelArray.push(framingModelforDuty);

        let framingModelforQuantityPaid: any = {};
        framingModelforQuantityPaid.name = 'Quantity Unpaid'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforQuantityPaid[header.value] = '';
            }
        })
        framingModelforQuantityPaid.isBold = false;
        framingModelforQuantityPaid.total = 0;
        framingModelforQuantityPaid.decimal = 3;
        framingModelArray.push(framingModelforQuantityPaid);

        let framingModelforDutyMTM: any = {};
        framingModelforDutyMTM.name = 'Duty MTM'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforDutyMTM[header.value] = '';
            }
        })
        framingModelforDutyMTM.isBold = false;
        framingModelforDutyMTM.total = 0;
        framingModelforDutyMTM.decimal = 4;
        framingModelArray.push(framingModelforDutyMTM);

        let framingModelforValueInINR: any = {};
        framingModelforValueInINR.name = 'Value In INR'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforValueInINR[header.value] = '';
            }
        })
        framingModelforValueInINR.isBold = false;
        framingModelforValueInINR.total = 0;
        framingModelforValueInINR.decimal = 3;
        framingModelforValueInINR.isPurchase = 'duty'
        framingModelArray.push(framingModelforValueInINR);

        let framingModelforRefiningCost: any = {};
        framingModelforRefiningCost.name = 'Refining Cost Pending'
        tableHeaders.forEach((header) => {
            if (header.label) {
                framingModelforRefiningCost[header.value] = '';
            }
        })
        framingModelforRefiningCost.isBold = false;
        framingModelforRefiningCost.total = 0;
        framingModelforRefiningCost.decimal = 3;
        framingModelArray.push(framingModelforRefiningCost);

        let framingModelforRealisedPL: any = {};
        framingModelforRealisedPL.name = 'UnRealised P&L'
        tableHeaders.forEach((header) => {
            if (this.lastTableHeader.label == header.label) {
                framingModelforRealisedPL[header.value] = 'Total';
            } else {
                framingModelforRealisedPL[header.value] = '';
            }

        })
        framingModelforRealisedPL.isBold = true;
        framingModelforRealisedPL.total = '';
        framingModelforRealisedPL.decimal = 4;
        framingModelArray.push(framingModelforRealisedPL);

        let realisedValues = this.pLUnRealisedTables;
        tableHeaders.forEach((header) => {
            let filteredList = _.filter(realisedValues, function (plrealised) {
                return plrealised.name?.toLowerCase() == header.label?.toLowerCase()
            })
            if (filteredList.length > 0) {
                framingModelArray.forEach((array, i) => {
                    if (i == 0) {
                        if (header.label) {
                            array[header.value] = filteredList[0].closingBalance;
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }

                        }
                    } else if (i == 1) {
                        if (header.label) {
                            array[header.value] = filteredList[0].mtmValue;
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 3) {
                        if (header.label) {
                            if (filteredList[0].purchaseFXValueInUSD >= 0) {
                                array[header.value] = filteredList[0].purchaseFXValueInUSD
                            }
                            else {
                                array[header.value] = (-1) * filteredList[0].purchaseFXValueInUSD
                            }
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 4) {
                        if (header.label) {
                            array[header.value] = filteredList[0].purchaseMTMRate
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 5) {
                        if (header.label) {
                            if (filteredList[0].purchaseValueInINR >= 0) {
                                array[header.value] = filteredList[0].purchaseValueInINR
                            } else {
                                array[header.value] = (-1) * filteredList[0].purchaseValueInINR
                            }
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 7) {
                        if (header.label) {
                            if (filteredList[0].quantityUnpaid >= 0) {
                                array[header.value] = filteredList[0].quantityUnpaid
                            } else {
                                array[header.value] = (-1) * filteredList[0].quantityUnpaid
                            }

                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 8) {
                        if (header.label) {
                            array[header.value] = filteredList[0].quantityDutyMTM
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 9) {
                        if (header.label) {
                            if (filteredList[0].quantityUnPaidValueInINR >= 0) {
                                array[header.value] = filteredList[0].quantityUnPaidValueInINR
                            } else {
                                array[header.value] = (-1) * filteredList[0].quantityUnPaidValueInINR
                            }

                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    } else if (i == 10) {
                        if (header.label) {
                            array[header.value] = filteredList[0].refiningCostPending
                            if (array[header.value]) {
                                var totalValue = Number(array[header.value]);
                                array.total = (array.total) + totalValue
                            }
                        }
                    }
                })
            }
        })

        let mtmValueTotal = 0;
        let valueInInr = 0;
        let valueInDuty = 0;
        framingModelArray.forEach((data) => {
            if (data.name == 'MTM Value') {
                mtmValueTotal = data.total
            } else if (data.name == 'Value In INR' && data.isPurchase == 'Purchase') {
                valueInInr = data.total;
            } else if (data.name == 'Value In INR' && data.isPurchase == 'duty') {
                valueInDuty = data.total;
            }
        })
        // let totalPLRealisedData = framingModelArray.map(x => x.total);
        // let totalValue = 0;
        // totalPLRealisedData.forEach((val) => {
        //     if (val) {
        //         let totalRow = Number(val);
        //         totalValue = totalValue + totalRow;
        //     }
        // })
        let totalValue = 0;
        totalValue = mtmValueTotal - valueInInr - valueInDuty;
        let filteredPLRealised = _.filter(framingModelArray, function (array) {
            return array.name == 'UnRealised P&L';
        })
        if (filteredPLRealised.length > 0) {
            let index = framingModelArray.indexOf(filteredPLRealised[0]);
            filteredPLRealised[0].total = totalValue;
            framingModelArray[index] = filteredPLRealised[0];
        }

        console.log(framingModelArray);
        this.unrealisedTableValues = framingModelArray;
        this.unRealisedTotalValue = totalValue;
    }

    getProfitLossList() {
        var searchModel: any = {};
        searchModel.contractUniqueId = this.contractUniqueId;
        searchModel.productType = this.productType;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        this.isLoadingPL = true;
        this.dashboardService.getProfitLossList(searchModel).subscribe((response: any) => {
            this.isLoadingPL = false;
            if (response.success) {
                if (response.data) {
                    let pLRealisedData = response.data;
                    this.pLRealisedTables = pLRealisedData.gridData;
                    pLRealisedData.headers && pLRealisedData.headers.length > 0 ? this.tableHeaders = pLRealisedData.headers : null;
                    this.cdRef.detectChanges();
                    this.framingRealisedPL();
                } else {
                    this.pLRealisedTables = [];
                    this.framingRealisedPL();
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getUnRealisedProfitLossList() {
        var searchModel: any = {};
        searchModel.contractUniqueId = this.contractUniqueId;
        searchModel.productType = this.productType;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        this.isLoading = true;
        this.dashboardService.getUnrealisedProfitLossList(searchModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                if (response.data) {
                    let pLRealisedData = response.data;
                    this.pLUnRealisedTables = pLRealisedData.gridData;
                    this.tablePLHeaders = pLRealisedData.headers;
                    this.cdRef.detectChanges();
                    this.framingUnRealisedPL();
                } else {
                    this.pLUnRealisedTables = [];
                    this.framingUnRealisedPL();
                }
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getContractUniqueIdsList() {
        var searchModel: any = {};
        if (this.productType === 'IMPORTED') {
            searchModel.key = 'contractDetails.contractUniqueId';
        } else if (this.productType === 'LOCAL') {
            searchModel.key = 'uniqueIdLocal';
        }
        searchModel.companyIds = this.userCompanyIds;
        searchModel.filterFormName = this.companyName;
        searchModel.filterFieldsBasedOnForm = true;
        this.dashboardService.GetFormFieldValues(searchModel).subscribe((response: any) => {
            if (response.success) {
                const selectData = [];
                response.data && response.data.fieldValues && response.data.fieldValues?.length > 0 && response.data.fieldValues.forEach(element => {
                    selectData.push({ label: element, value: element });
                });
                this.options = selectData;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }
    getCardValues() {
        if (this.dataListResult) {
            let data = this.dataListResult;
            this.productGroup = data.productGroup ? data.productGroup : '';
            this.sourceImportCommodity = data.sourceCommodity;
            this.totalContractQuantity = data.totalContractQuantity;
            this.usedContractQuantity = data.usedContractQuantity;
            this.openingBalance = data.openingBalance;
            this.availableBalance = data.avilablebalance;
            this.visibleCards = true;
        } else {
            this.productGroup = '';
            this.sourceImportCommodity = '';
            this.totalContractQuantity = '';
            this.usedContractQuantity = '';
            this.openingBalance = '';
            this.availableBalance = '';
            this.visibleCards = true;
        }
    }
    getDataList() {
        this.isEdit = false;
        this.enableProfitAndLoss = false;
        var searchModel: any = {};
        searchModel.contractUniqueId = this.contractUniqueId;
        searchModel.productType = this.productType;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        this.isLoadingInprogress = true;
        this.dashboardService.getDataList(searchModel).subscribe((response: any) => {
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
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getLabelName(header, data) {
        let result = data[header.value];
        let framingData = '';
        if (Number.isFinite(result)) {
            if (result != '' && result != 0) {
                if (data.decimal == 3) {
                    framingData = this.numberPipe.transform(result, '1.0-3');
                }
                else {
                    framingData = this.numberPipe.transform(result, '1.0-4');
                }
            }
            else {
                framingData = '';
            }
        }
        else {
            framingData = result;
        }
        return framingData;
    }

    enterQuantity(event) {
        this.searchTextChanged.next(this.quantity);
    }

    enableTextarea() {
        this.isEdit = !this.isEdit;
        this.cdRef.detectChanges();
    }

    checkNumber(event, value) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31 
          && (charCode < 48 || charCode > 57))
           return false;

        return true;
      
    }

    numberOnlyWithVal(event, value) {
        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (charCode == 46 && value.toString().includes(".") == false) {
                return true;
            }
            return false;
        }
        return true;
    }


    updateUserQuantity() {
        var updateModel: any = {};
        updateModel.uniqueId = this.contractUniqueId;
        updateModel.contractQuantity = this.updatedQuantity;
        this.isQuantityLoading = true;
        this.dashboardService.updateContractUserQuantity(updateModel).subscribe((response: any) => {
            this.isQuantityLoading = false;
            if (response.success) {
                this.getDataList();
                this.quantity = "";
                this.updatedQuantity = "";
                this.isEdit = false;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    enableRealisedPL() {
        this.enablePLTable = !this.enablePLTable;
        this.cdRef.detectChanges();
        this.getProfitLossList();
    }

    enableUnRealisedPL() {
        this.enableUnRealisedPLTable = !this.enableUnRealisedPLTable;
        this.cdRef.detectChanges();
        this.getUnRealisedProfitLossList();
    }

    
    exportEmissions() {
        setTimeout(() => {
            const list = this.listElement.nativeElement;
            html2canvas(list).then(canvas => {
                let imageData = canvas.toDataURL('image/png');
                var model: any = {};
                model.fileBytes = imageData;
                model.uniqueChartNumber = 0;
                model.visualisationName = "Table";
                model.isSystemWidget = true;
                model.widgetName = "Positions and P&L";
                this.fileBytes.emit(model);
            });
        }, 500);
    }

    waitForImagesToLoad(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const images = this.listElement.nativeElement.getElementsByTagName('img');
            let loadedCount = 0;
            const totalCount = images.length;
    
            if (totalCount === 0) {
                resolve();
            }
    
            const handleImageLoad = () => {
                loadedCount++;
                if (loadedCount === totalCount) {
                    resolve();
                }
            };
    
            for (let i = 0; i < totalCount; i++) {
                const image = images[i];
                if (image.complete) {
                    handleImageLoad();
                } else {
                    image.onload = handleImageLoad;
                    image.onerror = () => {
                        reject(new Error('Image loading failed'));
                    };
                }
            }
        });
    }

}