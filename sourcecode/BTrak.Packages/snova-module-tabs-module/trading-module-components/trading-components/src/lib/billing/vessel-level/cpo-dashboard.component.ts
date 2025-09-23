import { DatePipe, DecimalPipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { ContractLevelDashboardModel } from "../models/vessel-level.model";
import { DashboardService } from "../services/dashboard-table.service";
import html2canvas from 'html2canvas';
@Component({
    selector: 'app-vessel-level-cpo-dashboard',
    templateUrl: './cpo-dashboard.component.html',
    styleUrls: ['./cpo-dashboard.component.scss']
})
export class CPODashboardComponent implements OnInit {
    @ViewChild('cpodashboard') listElement: ElementRef;
    @Output() fileBytes = new EventEmitter<any>();
    options: any[] = [];
    positionData: ContractLevelDashboardModel[] = [];
    positionTable: ContractLevelDashboardModel[] = [];
    totalPandL: ContractLevelDashboardModel[] = [];
    dateFrom: Date;
    dateTo: Date;
    visibleCards: boolean;
    contractUniqueId: string;
    productType: string;
    companyName: string;
    userCompanyIds: any;
    sourceCommodity: any;
    pandLINR: any;
    pandLUSD: any;
    isLoading: boolean;
    productGroup: string;
    totalContractQuantity: any;
    totalSotQuantity: any;
    sotDifference: any;
    utilizedQuantity: any;
    purchaseQuantity: any;
    utilization: any;
    netPurchases : any;
    headersModel: ContractLevelDashboardModel;
    pandLHeadersModel: ContractLevelDashboardModel;
    addBack: any;
    totalPAndL: any;
    dataSetResult: any;
    displayedColumns: any[] = [];
    displayedColumns1: any[] = [];
    displayedColumns2: any[] = [];
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

    constructor(private dashboardService: DashboardService, private cdRef: ChangeDetectorRef,
        private toastr: ToastrService, private datePipe: DatePipe, private numberPipe: DecimalPipe) {
        this.visibleCards = true;
        this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
        this.companyName = JSON.parse(localStorage.getItem("UserModel"))?.companyName;
        let dateTo = new Date();
        dateTo.setDate(dateTo.getDate() - 1)
        this.dateFrom = new Date('2023-01-01');
        this.dateTo = new Date(dateTo);
        this.productType = "IMPORTED";
        this.displayedColumns = ["producedCommodity", "producedQuantity", "soldQuantity", "realisedValue", "availableBalance", "mtmRate", "unRealisedValue"];
        this.displayedColumns1 = ["cost", "realisedCostYTD", "mtmRate", "unRealisedCost"]
        var newModel: any = {};
        newModel.producedCommodity = "COST";
        newModel.realisedValue = "REALISED COST";
        newModel.mtmRate = "MTM RATE";
        newModel.unRealisedValue = "UNREALISED COST";
        newModel.isBackground = true;
        this.headersModel = newModel;

        var newModel1: any = {};
        newModel1.producedCommodity = "COST";
        newModel1.realisedValue = "REALISED P&L (YTD)";
        newModel1.mtmRate = "MTM RATE";
        newModel1.unRealisedValue = "UNREALISED P&L";
        newModel1.isBackground = true;
        this.pandLHeadersModel = newModel1;


        this.positionData.push(this.headersModel);
        this.positionData.push(this.pandLHeadersModel);
        this.getContractUniqueIdsList();
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
                model.visualisationName = "Contract level dashboard";
                model.isSystemWidget = true;
                model.widgetName = "Contract level dashboard";
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        }, 500);
    }

    getDataList() {
        var searchModel: any = {};
        searchModel.contractUniqueId = this.contractUniqueId;
        searchModel.productType = this.productType;
        searchModel.fromDate = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        searchModel.toDate = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        searchModel.companyName = this.companyName;
        this.isLoading = true;
        this.dashboardService.getContractLevelDashboard(searchModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                if (response.data) {
                    this.dataSetResult = response.data;
                    let positionData = [];
                    if (this.dataSetResult?.productions) {
                        let productions = this.dataSetResult.productions;
                        productions.forEach((prod) => {
                            if(prod.producedQuantity == 0 && prod.soldQuantity == 0 && prod.realisedValue == 0 && prod.availableBalance == 0 &&
                                prod.mtmRate == 0 && prod.unRealisedValue == 0) {

                            } else {
                                positionData.push(prod);
                            }
                        })
                        this.cdRef.detectChanges();
                        if (positionData.length > 0) {
                            positionData.push(this.headersModel);
                        } else {
                            positionData = [];
                            positionData.push(this.headersModel);
                        }
                    }

                    if (this.dataSetResult?.profitAndLosses) {
                        let positionTable = this.dataSetResult.profitAndLosses;
                        let filteredList = _.filter(positionTable, function (filter) {
                            return (filter.cost == 'P&L (INR)') || (filter.cost == 'P&L (USD)')
                        })
                        filteredList.forEach((data) => {
                            let index = positionTable.indexOf(data);
                            if (index >= -1) {
                                positionTable.splice(index, 1);
                            }
                        })
                        positionTable.forEach((table) => {
                            var positionTable1 = new ContractLevelDashboardModel();
                            positionTable1.producedCommodity = table.cost;
                            positionTable1.realisedValue = table.realisedCostYTD;
                            positionTable1.mtmRate = table.mtmRate;
                            positionTable1.unRealisedValue = table.unRealisedCost;
                            if(positionTable1.realisedValue == 0 &&  positionTable1.mtmRate == 0 && positionTable1.unRealisedValue == 0) {

                            } else {
                                positionData.push(positionTable1);
                            }
                            
                        })

                        if (positionData.length > 0) {
                            positionData.push(this.pandLHeadersModel);
                        } else {
                            positionData = [];
                            positionData.push(this.pandLHeadersModel);
                        }

                        filteredList.forEach((data) => {
                            var positionTable1 = new ContractLevelDashboardModel();
                            positionTable1.producedCommodity = data.cost;
                            positionTable1.realisedValue = data.realisedCostYTD;
                            positionTable1.mtmRate = data.mtmRate;
                            positionTable1.unRealisedValue = data.unRealisedCost;
                            positionTable1.isBold = data.isBold;
                            if(positionTable1.realisedValue == 0 &&  positionTable1.mtmRate == 0 && positionTable1.unRealisedValue == 0) {

                            } else {
                                positionData.push(positionTable1);
                            }
                           
                        })

                        this.positionData = positionData;
                        this.cdRef.detectChanges();
                    }
                }
                else {
                    this.dataSetResult = null;
                }

                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.getCardValues();
            this.exportEmissions();

        })
    }

    getCardValues() {
        if (this.dataSetResult) {
            let data = this.dataSetResult;
            this.productGroup = data?.productGroup ? data.productGroup : '';
            this.sourceCommodity = data?.sourceCommodity;
            this.totalContractQuantity = data?.totalContractQuantity;
            this.totalSotQuantity = data?.totalSotQuantity;
            this.sotDifference = data?.sotDifference;
            this.purchaseQuantity = data?.purchaseQuantity;
            this.utilization = data?.utilization;
            this.addBack = data?.addBack;
            this.pandLINR = data?.pandLINR;
            this.pandLUSD = data?.pandLUSD;
            this.utilizedQuantity = data?.sotDifference;
            this.netPurchases = data?.purchaseQuantity;
            this.visibleCards = true;
        } else {
            this.productGroup = '';
            this.sourceCommodity = '';
            this.totalContractQuantity = '';
            this.totalSotQuantity = '';
            this.sotDifference = '';
            this.purchaseQuantity = '';
            this.utilization = '';
            this.addBack = '';
            this.pandLINR = '';
            this.pandLUSD = '';
            this.utilizedQuantity = '';
            this.netPurchases = '';
            this.visibleCards = true;
        }
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

    valueChangeEvent(event) {
        this.recallCards();
        this.getDataList();
    }

    productTypeChangeEvent(event) {
        this.contractUniqueId = null;
        this.recallCards();
        this.getContractUniqueIdsList();
    }

    recallCards() {
        this.visibleCards = false;
        this.sourceCommodity = "";
        this.totalContractQuantity = 0;
        this.totalSotQuantity = 0;
        this.sotDifference = 0;
        this.addBack = 0;
        this.purchaseQuantity = 0;
        this.utilization = 0;
        this.totalPAndL = 0;
        this.netPurchases = 0;
    }

    getRowHeaders(data) {
        return data.header;
    }

    getFormatData(element) {
        let data;
        if (element != 'COST' && element != 'REALISED COST' && element != 'MTM RATE' && element != 'UNREALISED COST'
            && element != 'REALISED P&L (YTD)' && element != 'UNREALISED P&L') {
            if (element > 0) {
                data = this.numberPipe.transform(element, '1.0-3');
            } else if (element < 0) {
                element = (-1) * (element);
                data = '(' + this.numberPipe.transform(element, '1.0-3') + ')';
            } else if (element == 0) {
                data = '';
            } else {
                data = element;
            }
        } else {
            data = element;
        }

        return data;
    }



}