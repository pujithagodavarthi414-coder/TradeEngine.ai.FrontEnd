import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, TemplateRef, ViewEncapsulation, Renderer2, AfterViewChecked, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ChartComponent, SeriesLabels } from "@progress/kendo-angular-charts";
import { GridComponent, GridDataResult, PageChangeEvent, RowClassArgs, SelectAllCheckboxState } from "@progress/kendo-angular-grid";
import { groupBy, process, State } from "@progress/kendo-data-query";
import { drawDOM, exportImage, exportPDF, Group } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { Persistance } from "../../models/persistance.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { PersistanceService } from "../../services/persistance.service";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Dashboard } from "../../models/dashboard.model";
import { DashboardList } from "../../models/dashboard-list.model";
import { DynamicDashboardFilterModel } from "../../models/dynamic-dashboard-filter.model";
import { WidgetService } from "../../services/widget.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { CustomQueryHeadersModel } from "../../models/custom-query-headers.model";
import { CustomQueryModel } from "../../models/custom-query.model";
import { CustomWidgetsModel } from "../../models/custom-widget.model";
import { GridSettings } from "../../models/grid-settings.model";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { ProcInputAndOutputModel } from "../../models/proc-inputs-outputs.model";
import { WorkspaceList } from "../../models/workspace-list.model";
import * as moment_ from 'moment';
const moment = moment_
import * as $_ from 'jquery';
const $ = $_;

declare var kendo: any;
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CompanysettingsModel } from '../../models/company-model';
import { ApiInputDetailsModel } from '../../models/api-input-details.model';
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { UserService } from "../genericform/services/user.Service";
import { MatOption } from "@angular/material/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ExcelExportComponent } from "@progress/kendo-angular-excel-export";
import html2canvas from 'html2canvas';

@Component({
    selector: "app-customwidget-table",
    templateUrl: "./custom-widget-table-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styles: [`
    .k-grid .no-padding {
      padding: 0 !important;
    }
     .whole-cell {
       display: block;
     }
     .checkbox-widget {
        border-radius: 2px;
    margin: 0;
    padding: 0;
    width: 16px;
    height: 16px;
    line-height: normal;
    border-width: 2px;
    border-style: solid;
    outline: 0;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    -webkit-appearance: none
     }
 `],
})

export class CustomWidgetTableComponent extends CustomAppBaseComponent implements OnInit, AfterViewInit {
    headerForPivot: any;
    yCoOrdinateAlt: any;
    xCoOrdinateAlt: any;
    returnFormat: string;
    tableDataLoad: boolean = true;
    someHtmlCode: string;
    someHtmlCode1: SafeStyle;
    randomString: string;
    headerFontColor: any;
    rowBackgroundColor: any;
    headerBackgroundColor: any;
    columnFontFamily: any;
    selectAllState: SelectAllCheckboxState = 'unchecked';
    columnFontColor: any;
    selectedColumn: any;
    columnBackgroundColor: any;
    backgroundColor: string;
    isBold: boolean;
    checkedState: string;
    randomClassString: string;
    gridData: any;
    @ViewChild('grid', { static: true }) gridComp: GridComponent;
    @ViewChild('shareDialogDocument') shareDialogComponent: TemplateRef<any>;
    shareDialogId: string;
    shareDialog: any;
    isMongoQuery: boolean;
    columnsLength: number;
    collectionName: string;
    tableId: string;
    isLoadingImage: boolean;
    pieChartData: any[] = [];
    customapplicationId: string;
    colorField: string;
    items: any[] = [];
    public initSettings = {
        plugins: 'lists advlist,wordcount,paste',
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
    };

    @Input("isMongoQuery")
    set _isMongoQuery(data: boolean) {
        this.isMongoQuery = data;
    }
    @Input("collectionName")
    set _collectionName(data: string) {
        this.collectionName = data;
    }
    @Input("chartsLength") set _chartsLength(data: number) {
        this.cdRef.detectChanges();
        if (data != null) {
            if (data > 10) {
                this.delayTime = 1000;
                this.delayTime = this.delayTime * data / 2;
            }
        }
    }

    @Input("procName") set _procName(data: string) {
        if (data) {
            this.procName = data;
        }
    }

    @Input("paramsData") set _paramsData(data: any) {
        if (data) {
            this.procInputs = data;
        }
    }

    @Input("apiInputModel") set _apiInputModel(data: any) {
        if (data) {
            this.apiInputModel = data;
        }
    }

    @Input("isApi") set _isApi(data: any) {
        if (data) {
            this.isApi = data;
        }
    }

    @Input("legendsData") set _legendsData(data: any) {
        if (data) {
            this.legendsData = data;
        }
    }

    isPopUp: boolean;
    @Input('showHeaderInPopUp') set _showHeaderInPopUp(data: boolean) {
        this.isPopUp = data;
    }

    openDialogAtr: boolean = true;
    @Input("openDialog") set _openDialog(data: any) {
        this.openDialogAtr = data;
    }

    @Input("dashboardGlobalData") set _dashboardGlobalData(data: any) {
        this.dashboardGlobalData = data;
    }
    @ViewChild("createAppDialogComponet") createAppDialogComponet: TemplateRef<any>;
    @ViewChild("customAppDrillDownComponent") customAppDrillDownComponent: TemplateRef<any>;
    cursor = 'default';
    dialogOpen: boolean = true;
    @Output() persistanceJson = new EventEmitter<string>();
    @Output() fileBytes = new EventEmitter<any[]>();
    @ViewChildren("visualizationChangePopup") visualizationChangePopup;
    @ViewChildren(GridComponent) public grids: QueryList<GridComponent>;
    @ViewChild(GridComponent) public grid: GridComponent;
    @ViewChild(GridComponent) private gridTable: any;
    @ViewChild("chart") private chart: ChartComponent;
    @ViewChild("lineargauge") private linear: ChartComponent;
    @ViewChild("radialgauge") private radial: ChartComponent;
    @ViewChild("grid") private table: ExcelExportComponent;
    @ViewChild("arcgauge") private arc: ChartComponent;
    @ViewChild("pivotgrid") el: ElementRef;
    @ViewChild("configurator") pivotConfigurator: ElementRef;
    @ViewChild("pivotChart") pivotChart: ElementRef;
    completeGridData: GridDataResult;
    seriesColors: any[] = []
    previewGridColumns: CustomQueryHeadersModel[] = [];
    gridColumns: CustomQueryHeadersModel[] = [];
    selectedVisualizationType = new FormControl(null, [Validators.required]);
    persistanceId: string;
    persistanceData: any;
    isApi: boolean = false;
    isNumber: boolean;
    customWidgetId = "";
    customWidgetQuery = "";
    customWidget: any;
    filterQuery = "";
    columnformatQuery = "";
    columnAltName = "";
    public buttonCount = 5;
    public info = true;
    public type: "numeric" | "input" = "numeric";
    public pageSizes = true;
    public previousNext = true;
    public pageSize = 10;
    selectedvisualizationName: string = null;
    public skip = 0;
    pivotGrid: any;
    pivotConfiguratorElement: any;
    submittedFormId: string = null;
    isImportVisible = false;
    anyOperationInProgress = false;
    isFromGridster = false;
    isVisualizationChangeInprogress = false;
    isUserLevel: boolean;
    emptyWidget: boolean;
    appName: string = null;
    dashboardId: string = null;
    customAppVisualizationId: string = null;
    workspaceId: string = null;
    selectedVisualizationId: string = null;
    fileName: string = null;
    selectedWorkspaceforFilter: DynamicDashboardFilterModel;
    changedState: any;
    filteredGridData: any;
    showFilters: boolean;
    apiInputModel: ApiInputDetailsModel;
    columnsList: any;
    xAxisColumnsList: any;
    visualisationColors: any[] = [];
    xCoOrdinate: any = [];
    yCoOrdinate: any = [];
    selectedKpiData: any;
    kpiValue: any;
    boxData: any[] = [];
    categorySeries: any = [];
    xAxisCategories: any[];
    yAxisCategories: any[];
    yAxisColumnsList: any;
    customAppCharts: any;
    dataForView: any = 'data';
    data: any;
    chartType = null;
    dashboardName = null;
    isStackedChart = false;
    public pieData: any = [];
    public maxValue = 0;
    dashboardFilters = {
        projectId: null,
        userId: null,
        goalId: null,
        date: null,
        dateFrom: null,
        dateTo: null,
        sprintId: null,
        sprintStartdate: null,
        sprintEndDate: null,
        entityId: null,
        branchId: null,
        designationId: null,
        roleId: null,
        departmentId: null,
        isFinancialYear: null,
        isActiveEmployeesOnly: null,
        monthDate: null,
        yearDate: null,
        auditId: null,
        testSuiteId: null,
        BusinessUnitIds: null
    };
    chartData: any;
    showVisualization: boolean;
    delayTime = 3000;
    isPaginationEnable = true;
    description = "";
    isEditAppName = false;
    validationMessage: string;
    changedAppName: string;
    filterApplied: string;
    pivotChartMeasurers: any;
    pivotColumnsFilter: any;
    chartNumber: any;
    pivotChartDataSeries: any;
    xAxisPivotCategories: any;
    pivotChartYAxis: any;
    isPivotTableReady = false;
    isSingleMeasure = true;
    procName: string;
    tableGridColumns: any[] = [];
    procInputs: any;
    storedProcParams: ProcInputAndOutputModel;
    xAndYAxisCategories: any[] = [];
    gridsData: any;
    totalGridData: any;
    legendsData: any;
    heatMapMeasure: any;
    dashboardGlobalData: any;
    selectedFilterValue: string = "all";
    all: boolean = true;
    fontFamily: string;
    reportingOnly: boolean = false;
    myself: boolean = false;
    selectedWorkspaceId: string;
    workspaces: WorkspaceList[];
    workspacesList$: Observable<WorkspaceList[]>;
    defaultFilterValue: string;
    disableDropDown: boolean = false;
    widgetDataForFilter: any;
    isCustomAppAddOrEditRequire: boolean = true;
    testRailRestrictedAreas: any[] = [];
    public state: State = {
        skip: 0,
        take: 10,

        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: []
        }
    };
    hiddenColumns: string[] = [];

    public seriesLabels: SeriesLabels = {
        visible: true, // Note that visible defaults to false
        padding: 3,
        font: "bold 16px Calibri"
    };

    public gridSettings: GridSettings = {
        state: {
            skip: 0,
            take: 10,

            // Initial filter descriptor
            filter: {
                logic: "and",
                filters: []
            }
        },
        gridData: { data: [], total: 0 },
        columnsConfig: []
    };

    @Input() fromSearchBar: boolean;

    @Input("widgetData") set _widgetData(grid: any) {
        this.isCustomAppAddOrEditRequire = grid.isCustomAppAddOrEditRequire
        this.totalGridData = grid;
        this.widgetDataForFilter = grid;
        this.disableDropDown = this.totalGridData.isEditable;
        if (!this.fromSearchBar) {
            if ((grid.customWidgetId === this.customWidgetId && this.dashboardFilters === grid.dashboardFilters
                && this.filterApplied === grid.filterApplied)
                ||
                (grid.customWidgetQuery === this.customWidgetQuery && grid.filterQuery === this.filterQuery
                    && this.dashboardFilters === grid.dashboardFilters && this.filterApplied === grid.filterApplied)
            ) { } else {
                this.customWidgetId = grid.customWidgetId;
                this.chartType = grid.visualizationType;
                this.customWidgetQuery = grid.customWidgetQuery;
                this.dashboardName = grid.dashboardName;
                this.filterApplied = grid.filterApplied;
                this.filterQuery = grid.filterQuery;
                this.columnformatQuery = grid.columnformatQuery;
                this.columnAltName = grid.columnAltName;
                this.dashboardFilters = grid.dashboardFilters;
                this.submittedFormId = grid.submittedFormId;
                this.appName = (grid.customWidgetId === this.customWidgetId)
                    || (grid.customWidgetQuery === this.customWidgetQuery && grid.filterQuery === this.filterQuery) ? this.appName : null;
                this.isImportVisible = false;
                this.tableId = grid.name + 'tableId';
                this.customapplicationId = grid.name + 'Id';
                this.isFromGridster = grid.isFromGridster;
                this.persistanceId = grid.customApplicationChartId ? grid.customApplicationChartId : grid.customAppVisualizationId ?
                    grid.customAppVisualizationId : null;
                this.isUserLevel = grid.isUserLevel;
                this.emptyWidget = grid.emptyWidget;
                this.dashboardId = grid.dashboardId;
                this.workspaceId = grid.workspaceId;
                this.chartData = grid;
                this.showVisualization = grid.showVisualization;
                this.customAppVisualizationId = grid.customAppVisualizationId;
                this.chartNumber = grid.chartNumber;
                this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
                this.selectedWorkspaceforFilter.dashboardId = this.workspaceId;
                this.selectedWorkspaceforFilter.dashboardAppId = this.dashboardId;
                this.gridsData = grid;
                this.getVisualizationRelatedData(grid);
                console.log(this.chartType);

            }
        }
        else {
            if ((grid.customWidgetId === this.customWidgetId && this.dashboardFilters === grid.dashboardFilters
                && this.filterApplied === grid.filterApplied)) { } else {
                this.customWidgetId = grid.customWidgetId;
                this.customWidgetQuery = grid.customWidgetQuery;
                this.dashboardName = grid.dashboardName;
                this.filterApplied = grid.filterApplied;
                this.filterQuery = grid.filterQuery;
                this.columnformatQuery = grid.columnformatQuery;
                this.columnAltName = grid.columnAltName;
                this.dashboardFilters = grid.dashboardFilters;
                this.submittedFormId = grid.submittedFormId;
                this.appName = (grid.customWidgetId === this.customWidgetId)
                    || (grid.customWidgetQuery === this.customWidgetQuery && grid.filterQuery === this.filterQuery) ? this.appName : null;
                this.tableId = grid.name + 'tableId';
                this.customapplicationId = grid.name + 'Id';
                this.isImportVisible = false;
                this.isFromGridster = grid.isFromGridster;
                this.persistanceId = grid.customApplicationChartId ? grid.customApplicationChartId : grid.customAppVisualizationId ?
                    grid.customAppVisualizationId : null;
                this.isUserLevel = grid.isUserLevel;
                this.emptyWidget = grid.emptyWidget;
                this.dashboardId = grid.dashboardId;
                this.workspaceId = grid.workspaceId;
                this.chartData = grid;
                this.showVisualization = grid.showVisualization;
                this.customAppVisualizationId = grid.customAppVisualizationId;
                this.chartNumber = grid.chartNumber;
                this.selectedWorkspaceforFilter = new DynamicDashboardFilterModel();
                this.selectedWorkspaceforFilter.dashboardId = this.workspaceId;
                this.selectedWorkspaceforFilter.dashboardAppId = this.dashboardId;
                this.gridsData = grid;
                this.getVisualizationRelatedData(grid);
            }
        }
    }
    companySettingsModel$: Observable<any[]>;
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    isEnableTestrailBit: boolean = true;
    isTestTrailEnable: boolean = true;
    isBugBoardEnable: boolean = true;
    isBugBoardEnableBit: boolean = true;
    testRailFeaturesLIst: any[] = [];
    bugBoardFeaturesList: any[] = [];
    toMailsList: any[] = [];
    selectable: boolean = true;
    sharingisinProgress: boolean = false;
    removable = true;
    toMail: string;
    count: number;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userIds: any;
    selectedUserIds: any;
    usersList: any;
    height: any;
    selectedUserNames: any;
    commentText: any = "";
    @ViewChild("allSelected") private allSelected: MatOption;
    selectedUserEmails: any;
    sendReportForm: FormGroup;
    @ViewChildren("shareReportPopover") shareReportPopovers;
    selectedKeys: any = [];

    constructor(
        private persistanceService: PersistanceService,
        private sanitizer: DomSanitizer,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private widgetService: WidgetService,
        private userService: UserService,
        private masterDataManagementService: MasterDataManagementService,
        private softLabelPipe: SoftLabelPipe,
        private translateService: TranslateService,
        private toastr: ToastrService,
        private snackbar: MatSnackBar,
        private route: ActivatedRoute,
        private renderer: Renderer2) {
        super();
        this.selectAllState = 'unchecked';
        this.pieChartData = [
            { category: 'Eaten', value: 0.42 },
            { category: 'Not eaten', value: 0.58 }
        ]
        this.seriesColors = ["#DDFFED", "#b3ffd9", "#33FFD0", "#FFFF93", "#FFE24F", "#FFDBB7", "#FFBD75", "#B7FF81", "#97FFBC", "#FFABD5", "#FF33A6", "#ACF4FE", "#24E2FC", "#DEC6FE", "#AC70FC", "#ffff00", "#E2BC00", "#FF8E4F", "#FF4621", "#38EC81", "#00B050", "#33CCCC", "#6DD2FF", "#ff80bf", "#FF33E2", "#C8A1FD", "#964BFB"];
        this.colorField = "#5f3b3b";
        this.tableDataLoad = true;
        this.height = 'auto';
        this.fontFamily = "Calibri";
        this.sharingisinProgress = false;
        this.completeGridData = { data: [], total: 0 };
        this.gridSettings.gridData = { data: [], total: 0 };
        this.items = [];
        this.previewGridColumns = [];
        this.route.params.subscribe((params) => {
            if (params["id"] != null && params["id"] !== undefined) {
                this.selectedWorkspaceId = params["id"];
            }
        });

        let workspaceList = new WorkspaceList();
        workspaceList.workspaceId = this.selectedWorkspaceId;
        this.workspaces = _.filter(JSON.parse(localStorage.getItem(LocalStorageProperties.Dashboards)), function (workspace) { return workspace.workspaceId == workspaceList.workspaceId; });
        if (this.workspaces) {
            const worksapce = this.workspaces.length > 0 ? this.workspaces[0] : null;
            if (worksapce) {
                if (this.workspaces[0].workspaceName == "Administrator Dashboard") {
                    this.selectedFilterValue = "all";
                    this.defaultFilterValue = this.selectedFilterValue;
                    this.all = true;
                    this.reportingOnly = false;
                    this.myself = false;
                    //this.disableDropDown = false;
                }
                else if (this.workspaces[0].workspaceName == "Manager Dashboard") {
                    this.selectedFilterValue = "reportingOnly";
                    this.defaultFilterValue = this.selectedFilterValue;
                    this.all = false;
                    this.reportingOnly = true;
                    this.myself = false;
                    //this.disableDropDown = false;
                }
                else if (this.workspaces[0].workspaceName == "User Dashboard") {
                    this.selectedFilterValue = "mySelf";
                    this.defaultFilterValue = this.selectedFilterValue;
                    this.all = false;
                    this.reportingOnly = false;
                    //this.disableDropDown = true;
                    this.myself = true;
                }
            }
        }
        this.getSoftLabels();
        this.initializeCustomApplicationForm();
        this.getUsersDropDown();

        this.boxData = [
            {
                lower: 1.3,
                q1: 2.15,
                median: 2.95,
                q3: 3.725,
                upper: 4.7,
                mean: 2.9,
                outliers: [1, 9],
                year: '1996'
            }, {
                lower: 2,
                q1: 3.825,
                median: 5.45,
                q3: 6.425,
                upper: 8.2,
                mean: 5.2,
                outliers: [1.5, 2, 8.9],
                year: '1997'
            }, {
                lower: 3.8,
                q1: 4.725,
                median: 5.55,
                q3: 5.75,
                upper: 8.7,
                mean: 5.5,
                outliers: [],
                year: '1998'
            }, {
                lower: 3,
                q1: 4.375,
                median: 4.95,
                q3: 5.85,
                upper: 8,
                mean: 5.2,
                outliers: [3, 9.5],
                year: '1999'
            }, {
                lower: 2.5,
                q1: 3.925,
                median: 4.15,
                q3: 4.45,
                upper: 5.1,
                mean: 4.1,
                outliers: [],
                year: '2000'
            }, {
                lower: 2.4,
                q1: 3.725,
                median: 4.95,
                q3: 5.85,
                upper: 7.7,
                mean: 4.9,
                outliers: [2.1, 8.3, 9.8],
                year: '2001'
            }, {
                lower: 1.7,
                q1: 2.3,
                median: 3.9,
                q3: 5,
                upper: 5.5,
                mean: 3.7,
                outliers: [1.1, 9.1],
                year: '2002'
            }, {
                lower: 2.2,
                q1: 2.5,
                median: 3.1,
                q3: 3.975,
                upper: 4.3,
                mean: 3.2,
                outliers: [1.6, 1.8, 9.8],
                year: '2003'
            }, {
                lower: 1.9,
                q1: 2.7,
                median: 3.35,
                q3: 4.575,
                upper: 5.7,
                mean: 3.6,
                outliers: [1.1, 8.3],
                year: '2004'
            }
        ]
    }

    ngOnInit() {
        super.ngOnInit();
        let companyFeaturesList = "Test case status,Test case automation type,'Test case type,Time configuration settings,QA productivity report,Qa performance,QA created and executed test cases,Talko2  file uploads testrun details,All test suites,Reports details,All versions,Regression pack sections details, All testruns,TestCases priority wise,Section details for all scenarios,Milestone  details";
        this.testRailFeaturesLIst = companyFeaturesList.split(",");
        let bugBoardFeaturesList = "Goals vs Bugs count (p0,p1,p2),Project wise missed bugs count,More bugs goals list,Bugs count on priority basis,Goal work items VS bugs count,Bugs list,Priority wise bugs count,Total bugs count,Regression pack sections details, All testruns,Section details for all scenarios"
        this.bugBoardFeaturesList = bugBoardFeaturesList.split(",");
    }

    ngAfterViewInit() {
        if (this.chartType == "kpi") {
            this.exportKPIChart();
        }
    }

    checkVisualisationForTestrail() {
        let featuresList = this.testRailFeaturesLIst;
        let companyResult = featuresList.filter(item => item.trim() == this.appName.trim());
        if (companyResult.length > 0) {
            if (this.isTestTrailEnable) {
                this.isEnableTestrailBit = true;
            } else {
                this.isEnableTestrailBit = false;
            }
        } else {
            this.isEnableTestrailBit = true;
        }
        let bugboardsList = this.bugBoardFeaturesList;
        let companyBugBoardResult = bugboardsList.filter(item => item.trim() == this.appName.trim());
        if (companyBugBoardResult.length > 0) {
            if (this.isBugBoardEnable) {
                this.isBugBoardEnableBit = true;
            } else {
                this.isBugBoardEnableBit = false;
            }
        } else {
            this.isBugBoardEnableBit = true;
        }
    }

    customfilterApplied(data) {
        console.log(data);
        this.getVisualizationRelatedData(this.gridsData);
    }

    getCompanySettings() {
        if (!localStorage.getItem(LocalStorageProperties.CompanySettings)) {
            var companySettings = new CompanysettingsModel();
            companySettings.isArchived = false;
            this.masterDataManagementService.getAllCompanySettingsDetails(companySettings).subscribe((result: any) => {
                if (result.success) {
                    localStorage.setItem(LocalStorageProperties.CompanySettings, JSON.stringify(result.data));
                    this.assignCompanySettings();
                }
            });
        } else {
            this.assignCompanySettings();
        }
    }

    assignCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel.length > 0) {
            let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableTestcaseManagement");
            if (companyResult.length > 0) {
                this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
            }
            let bugBoardResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
            if (bugBoardResult.length > 0) {
                this.isBugBoardEnable = bugBoardResult[0].value == "1" ? true : false;
            }
            this.checkVisualisationForTestrail();
        }
    }

    navigateToDrillDown(rowData) {
        console.log(rowData);
    }

    onClick(rowData) {
        if (!this.customWidget) {
            return;
        }
        if (rowData.column.isCheckBox) {
            this.selectedKeys.push()
        }
        console.log(this.chartType);

        var guageTypes = ["radialgauge", "lineargauge", "arcgauge"]
        if (guageTypes.includes(this.chartType)) {
            var column = this.gridColumns.find(data => data.field === this.selectedKpiData);
            this.drillDownPopUp(null, column);
        } else if (this.chartType == 'donut') {
            var column = this.xAxisCategories.includes(rowData.category) ? this.gridColumns.find(d => d.field == this.xCoOrdinate) : null;
            if (column.subQuery) {
                this.drillDownPopUp(rowData, column);
            }
        } else if (this.chartType == 'line' || this.chartType == 'bar') {
            var column = this.gridColumns.find(data => data.field === rowData.series.name);
            if (column.subQuery) {
                var a = this.gridColumns.find(d => d.field == this.xCoOrdinate);
                rowData.dataItem = this.completeGridData.data.find(d => d[a.field] == rowData.category && d[rowData.series.name] == rowData.dataItem);
                this.drillDownPopUp(rowData, column);
            }
        }
        else if (this.chartType == 'column') {
            rowData.dataItem = null;
            var column = this.gridColumns.find(data => data.field === rowData.series.name);
            if (column.subQuery) {
                this.drillDownPopUp(rowData, column);
            }
        }
        else if (this.chartType != "kpi") {
            var column = this.gridColumns.find(data => data.field === rowData.column.field);
            if (column.subQuery) {
                this.drillDownPopUp(rowData, column);
            }
        }
        else if (this.chartType == "kpi" && this.gridColumns[0].subQuery) {
            this.drillDownPopUp(rowData, this.gridColumns[0]);
        }
    }

    drillDownPopUp(rowData, column) {
        console.log(rowData);
        console.log(column);
        console.log({ appId: this.customWidgetId, dashboardId: this.dashboardId, clikedColumnData: rowData, subQuery: column.subQuery, subQueryType: column.subQueryType, filterType: this.selectedFilterValue });
        let dialogId = "custom-app-drill-down-component";

        const dialogRef = this.dialog.open(this.customAppDrillDownComponent, {
            maxWidth: null,
            width: "98vw",
            minHeight: "70vh",
            maxHeight: "90vh",
            id: dialogId,
            disableClose: true,
            data: {
                appId: this.customWidgetId,
                formPhysicalId: dialogId,
                dashboardFilters: this.dashboardFilters,
                dashboardId: this.dashboardId, clikedColumnData: rowData, subQuery: column.subQuery, subQueryType: column.subQueryType, filterType: this.selectedFilterValue
            }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            console.log(isReloadRequired);
            this.dialogOpen = false;
            if (isReloadRequired) {
                this.dialog.closeAll();
            }
        });
    }

    getVisualizationRelatedData(grid) {
        this.procName = grid.isProc && grid.procName ? grid.procName : this.procName;
        if (!this.procName) {
            this.procName = grid ? grid.procName : null;
        }
        this.completeGridData = { data: [], total: 0 };
        if (this.customWidgetId && grid && !grid.isProc && !grid.isApi) {
            const customWidgetModel = new CustomWidgetsModel();
            customWidgetModel.isArchived = false;
            customWidgetModel.customWidgetId = this.customWidgetId;
            customWidgetModel.dashboardFilters = this.dashboardFilters;
            customWidgetModel.submittedFormId = this.submittedFormId;
            customWidgetModel.workspaceId = this.workspaceId;
            customWidgetModel.dashboardId = this.dashboardId;
            customWidgetModel.isAll = this.all;
            customWidgetModel.isReportingOnly = this.reportingOnly;
            customWidgetModel.isMyself = this.myself;
            customWidgetModel.isMongoQuery = this.isMongoQuery;
            customWidgetModel.collectionName = this.collectionName;
            this.widgetService.GetCustomWidgetData(customWidgetModel).subscribe((response: any) => {
                if (response.success === true) {
                    this.customWidget = response.data;
                    this.description = this.customWidget.description;
                    this.appName = this.dashboardName ? this.dashboardName : this.customWidget.name;
                    this.tableId = this.appName + 'tableId';
                    this.customapplicationId = this.appName + 'Id';
                    this.items = this.customWidget.queryData ? JSON.parse(this.customWidget.queryData) : [];
                    this.completeGridData.data = this.customWidget.queryData ? JSON.parse(this.customWidget.queryData) : [];
                    this.dataForView = this.customWidget.queryData ? JSON.parse(this.customWidget.queryData) : null;
                    this.cdRef.markForCheck();
                    this.completeGridData.total = this.customWidget.queryData ? JSON.parse(this.customWidget.queryData).length : 0;
                    this.tableDataLoad = false;
                    this.headerForPivot = this.customWidget.headers;
                    const columns = this.customWidget.headers;
                    this.customAppCharts = this.customWidget.allChartsDetails;
                    this.columnBackgroundColor = this.customAppCharts[0].columnBackgroundColor;
                    this.columnFontColor = this.customAppCharts[0].columnFontColor;
                    this.columnFontFamily = this.customAppCharts[0].columnFontFamily;
                    this.rowBackgroundColor = this.customAppCharts[0].rowBackgroundColor;
                    this.isBold = this.customAppCharts[0].isBold;
                    this.backgroundColor = this.customAppCharts[0].backgroundColor;
                    this.headerBackgroundColor = this.customAppCharts[0].headerBackgroundColor;
                    this.headerFontColor = this.customAppCharts[0].headerFontColor;
                    this.getCompanySettings();
                    this.previewGridColumns = [];
                    this.gridColumns = [];
                    if (columns && columns.length > 0) {
                        this.columnsLength = columns.length;
                        columns.forEach((column) => {
                            if (column.filter.toLowerCase() === "bit" || column.filter.toLowerCase() === "boolean") {
                                column.filter = "boolean";
                            } else if (column.filter.toLowerCase() === "int" || column.filter.toLowerCase() === "float" || column.filter.toLowerCase() === "decimal" || column.filter.toLowerCase() === "numeric" || column.filter.toLowerCase() === "longint" || column.filter.toLowerCase() === "double") {
                                column.filter = "number";
                            } else {
                                column.filter = "text";
                            }
                            column._width = 150;
                            this.previewGridColumns.push(column);
                        });
                        this.gridColumns = this.previewGridColumns;
                        this.selectedColumn = this.gridColumns[0].field;
                    }
                    let chartDetails: any;
                    chartDetails = this.getDefaultChartDetails();
                    if (chartDetails) {
                        this.data = this.customWidget.queryData ? JSON.parse(this.customWidget.queryData) : [];
                        this.xCoOrdinate = chartDetails.xCoOrdinate;
                        this.yCoOrdinate = chartDetails.yAxisDetails ? chartDetails.yAxisDetails.split(",") : [];
                        this.chartType = chartDetails.visualizationType;
                        this.pivotChartMeasurers = chartDetails.pivotMeasurersToDisplay;
                        let visualisationColorsJson = chartDetails.chartColorJson;
                        if (visualisationColorsJson) {
                            this.visualisationColors = JSON.parse(visualisationColorsJson);
                        }
                        columns.forEach((column) => {
                            if (chartDetails.xCoOrdinate === column.field) {
                                this.xCoOrdinateAlt = column.title == null || column.title == undefined || column.title == '' ? column.field : column.title;
                            }
                        });
                        this.checkIsStackedChart();
                        if (this.chartType == "table") {
                            this.exportGrids();
                        }
                        if (this.chartType == "lineargauge" || this.chartType == "radialgauge" || this.chartType == "arcgauge") {
                            this.exportGauge();
                        }
                        if (this.chartType == 'area' || this.chartType == 'line' || this.chartType == 'bar' || this.chartType == 'column' || this.chartType == 'pie' || this.chartType == 'donut') {
                            this.exportChart();
                        }
                        if (this.chartType == 'Heat map') {
                            this.getXAndYAxis();
                        } else {
                            this.exportKPIChart();
                        }
                    }
                    this.fileName = this.customWidget.name + ".xlsx";
                    this.isImportVisible = this.customWidget.name != null;
                    if (this.persistanceId) {
                        if (grid.persistanceJson != null) {
                            this.getPersistance(grid.persistanceJson);
                        } else {
                            this.getPersistance(null);
                        }
                    } else {
                        this.anyOperationInProgress = true;
                        this.gridSettings.columnsConfig = [...this.previewGridColumns];
                        this.loadData(this.gridSettings.state);
                    }
                }
            });
        } else if (this.customWidgetQuery !== undefined && this.customWidgetQuery != null && this.customWidgetQuery != "" && !this.procName) {
            const customQueryModel = new CustomQueryModel();
            customQueryModel.dynamicQuery = this.customWidgetQuery;
            customQueryModel.filterQuery = this.filterQuery;
            customQueryModel.columnformatQuery = this.columnformatQuery;
            customQueryModel.columnAltName = this.columnAltName;
            customQueryModel.dashboardFilters = this.dashboardFilters;
            customQueryModel.submittedFormId = this.submittedFormId;
            customQueryModel.workspaceId = this.workspaceId;
            customQueryModel.dashboardId = this.dashboardId;
            customQueryModel.isMongoQuery = this.isMongoQuery;
            customQueryModel.collectionName = this.collectionName;
            customQueryModel.chartColorJson = grid?.chartColorJson;
            this.masterDataManagementService.GetCustomWidgetQueryResult(customQueryModel).subscribe((response: any) => {
                if (response.success === true) {
                    const widgetData = response.data;
                    this.completeGridData.data = widgetData.queryData ? JSON.parse(widgetData.queryData) : [];
                    this.completeGridData.total = widgetData.queryData ? JSON.parse(widgetData.queryData).length : 0;
                    this.tableDataLoad = false;
                    this.previewGridColumns = [];
                    this.headerForPivot = widgetData.headers;
                    const columns = widgetData.headers;
                    if (columns && columns.length > 0) {
                       
                        columns.forEach((column) => {
                            if (column.filter && (column.filter.toLowerCase() === "bit" || column.filter.toLowerCase() === "boolean")) {
                                column.filter = "boolean";
                            } else if (column.filter && (column.filter.toLowerCase() === "int" || column.filter.toLowerCase() === "float" || column.filter.toLowerCase() === "decimal" || column.filter.toLowerCase() === "numeric" || column.filter.toLowerCase() === "longint" || column.filter.toLowerCase() === "double")) {
                                column.filter = "number";
                            } else {
                                column.filter = "text";
                            }
                            column._width = 150;
                            this.previewGridColumns.push(column);
                        });
                        this.gridColumns = this.previewGridColumns;
                    }
                    this.appName = this.dashboardName ? this.dashboardName : widgetData.name;
                    this.tableId = this.appName + 'tableId';
                    this.customapplicationId = this.appName + 'Id';
                    this.data = widgetData.queryData ? JSON.parse(widgetData.queryData) : [];
                    this.columnsList = widgetData.headers;
                    this.xCoOrdinate = grid.xCoOrdinate;
                    this.yCoOrdinate = grid.yCoOrdinate;
                    columns.forEach((column) => {
                        if (grid.xCoOrdinate === column.field) {
                            this.xCoOrdinateAlt = column.title == null || column.title == undefined || column.title == '' ? column.field : column.title;
                        }
                    });
                    let visualisationColorsJson = widgetData.chartColorJson;
                    if (visualisationColorsJson) {
                        this.visualisationColors = JSON.parse(visualisationColorsJson);
                    }
                    if (this.visualisationColors.length == 0) {
                        this.visualisationColors = grid?.visualisationColors;
                    }
                    this.chartType = grid.visualizationType;
                    this.pivotChartMeasurers = grid.pivotMeasurersToDisplay;
                    this.checkIsStackedChart();
                    if (this.persistanceId) {
                        if (grid.persistanceJson != null) {
                            this.getPersistance(grid.persistanceJson);
                        } else {
                            this.getPersistance(null);
                        }
                    } else {
                        this.anyOperationInProgress = true;
                        this.gridSettings.columnsConfig = [...this.previewGridColumns];
                        this.loadData(this.gridSettings.state);
                    }
                    if (this.chartType == "table") {
                        this.exportGrids();
                    }
                    if (this.chartType == "lineargauge" || this.chartType == "radialgauge" || this.chartType == "arcgauge") {
                        this.exportGauge();
                    }
                    if (this.chartType == 'area' || this.chartType == 'line' || this.chartType == 'bar' || this.chartType == 'column' || this.chartType == 'pie' || this.chartType == 'donut') {
                        this.exportChart();
                    }
                    if (this.chartType == 'Heat map') {
                        this.getXAndYAxis();
                    } else {
                        this.exportKPIChart();
                    }

                }
            });
        } else if (this.isApi || (grid && grid.isApi)) {
            if (!this.apiInputModel) {
                let apiModel = new ApiInputDetailsModel();
                apiModel.customWidgetId = this.customWidgetId;
                this.widgetService.GetCustomAppApiData(apiModel).subscribe((response: any) => {
                    if (response.success) {
                        this.apiInputModel = response.data;
                        this.apiInputModel.isForDashBoard = true;
                        this.apiInputModel.dashboardId = this.dashboardId;
                        this.apiInputModel.workspaceId = this.workspaceId;
                        this.setApiData(grid);
                    }
                });
            } else {
                this.apiInputModel.isForDashBoard = false;
                this.setApiData(grid)
            }
        } else if (grid && grid.isProc) {
            let procInputAndOutput = new ProcInputAndOutputModel();
            if (this.customWidgetId) {
                procInputAndOutput.customWidgetId = this.customWidgetId;
            }
            else {
                procInputAndOutput.customStoredProcId = grid.customStoredProcId;
            }
            procInputAndOutput.isForDashBoard = true;
            procInputAndOutput.workspaceId = this.workspaceId;
            procInputAndOutput.dashboardId = this.dashboardId;
            procInputAndOutput.dashboardFilters = this.dashboardFilters;
            this.masterDataManagementService.getProcData(procInputAndOutput).subscribe((response: any) => {
                if (response.success) {
                    var data = response.data
                    this.storedProcParams = data.procInputsAndOutputs;
                    this.appName = this.dashboardName ? this.dashboardName : this.storedProcParams.customWidgetName;
                    this.tableId = this.appName + 'tableId';
                    this.customapplicationId = this.appName + 'Id';
                    this.customAppCharts = this.storedProcParams.allChartsDetails;
                    this.columnBackgroundColor = this.customAppCharts[0].columnBackgroundColor;
                    this.columnFontColor = this.customAppCharts[0].columnFontColor;
                    this.columnFontFamily = this.customAppCharts[0].columnFontFamily;
                    this.rowBackgroundColor = this.customAppCharts[0].rowBackgroundColor;
                    this.backgroundColor = this.customAppCharts[0].backgroundColor;
                    this.isBold = this.customAppCharts[0].isBold;
                    this.headerBackgroundColor = this.customAppCharts[0].headerBackgroundColor;
                    this.headerFontColor = this.customAppCharts[0].headerFontColor;
                    this.setProcData(grid, data.upsertData);
                    this.fileName = this.storedProcParams.customWidgetName + ".xlsx";
                    this.isImportVisible = this.storedProcParams.customWidgetName != null;
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                }
            });
        } else {
            this.getProcData(grid);
        }
    }

    setApiData(grid) {
        this.widgetService.GetApiData(this.apiInputModel).subscribe((result: any) => {
            if (result.success == true) {
                if (result.data) {
                    if (this.apiInputModel.isForDashBoard && result.data.allChartsDetails && result.data.customWidgetName) {
                        this.appName = this.dashboardName ? this.dashboardName : result.data.customWidgetName;
                        this.customAppCharts = result.data.allChartsDetails;
                        this.columnBackgroundColor = this.customAppCharts[0].columnBackgroundColor;
                        this.columnFontColor = this.customAppCharts[0].columnFontColor;
                        this.columnFontFamily = this.customAppCharts[0].columnFontFamily;
                        this.rowBackgroundColor = this.customAppCharts[0].rowBackgroundColor;
                        this.isBold = this.customAppCharts[0].isBold;
                        this.backgroundColor = this.customAppCharts[0].backgroundColor;
                        this.headerBackgroundColor = this.customAppCharts[0].headerBackgroundColor;
                        this.headerFontColor = this.customAppCharts[0].headerFontColor;
                        this.fileName = result.data.customWidgetName + ".xlsx";
                        this.isImportVisible = result.data.customWidgetName != null;
                        this.tableId = this.appName + 'tableId';
                        this.customapplicationId = this.appName + 'Id';
                        this.cdRef.detectChanges();
                    }
                    this.data = JSON.parse(result.data.apiData);
                    this.completeGridData.data = this.data ? this.data : [];
                    this.completeGridData.total = this.data ? this.data.length : 0;
                    let chartDetails;
                    if (grid && (grid.dashboardId || grid.isForPreview)) {
                        chartDetails = this.getDefaultChartDetails();
                    }
                    this.xCoOrdinate = chartDetails ? chartDetails.xCoOrdinate : grid.xCoOrdinate;
                    this.yCoOrdinate = chartDetails ? chartDetails.yAxisDetails ? chartDetails.yAxisDetails.split(",") : [] : grid.yCoOrdinate;
                    this.chartType = chartDetails ? chartDetails.visualizationType : grid.visualizationType;
                    if (this.chartType === "table") {

                        this.tableGridColumns = [];
                        if (this.data && this.data.length > 0) {
                         
                            let objectKeys = Object.keys(this.data[0]);
                            objectKeys.forEach((key) => {
                                let gridColumn = { field: key, filter: "text", maxLength: 16, includeInFilters: false, width: 150 };
                                this.tableGridColumns.push(gridColumn);
                            })
                        }
                        this.gridSettings.columnsConfig = [...this.tableGridColumns];
                        this.previewGridColumns = this.gridColumns = this.gridSettings.columnsConfig;
                        this.selectedColumn = this.tableGridColumns[0].field;
                        if (this.persistanceId) {
                            if (grid.persistanceJson != null) {
                                this.getPersistance(grid.persistanceJson);
                            } else {
                                this.getPersistance(null);
                            }
                        } else {
                            this.anyOperationInProgress = true;
                            this.gridSettings.columnsConfig = [...this.previewGridColumns];
                            this.loadData(this.gridSettings.state);
                        }
                        if (!chartDetails) {
                            this.exportGrids();
                        }
                    }

                    if (this.chartType == 'Heat map') {
                        this.heatMapMeasure = chartDetails ? chartDetails.heatMapMeasure : grid.heatMapMeasure;
                        this.getXAndYAxis();
                    }
                    this.checkIsStackedChart();
                    if (this.chartType == "lineargauge" || this.chartType == "radialgauge" || this.chartType == "arcgauge") {
                        this.exportGauge();
                    }
                    this.cdRef.detectChanges();
                }
            } else {
                var validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    formatDatesInData() {
        try {
            for (var i = 0; i < this.completeGridData.data.length; i++) {
                for (var name in this.completeGridData.data[i]) {
                    try {
                        if (isNaN(this.completeGridData.data[i][name]) && Date.parse(this.completeGridData.data[i][name])) {
                            this.completeGridData.data[i][name] = moment(new Date(this.completeGridData.data[i][name])).format('DD MMMM YYYY');
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    getparamsData(grid) {
        if (!this.procName) {
            this.procName = grid.procName;
        }
        var obj = {};
        let dataTypesArray = ["uniqueidentifier", "char", "datetime", "nvarchar", "time", "bit"]
        this.storedProcParams.inputs.forEach(element => {
            if (!dataTypesArray.includes(element.dataType.toLowerCase())) {
                let errorType = Number(element.inputData);
                if (errorType == NaN && element.type === "boolean") {
                    obj[element.parameterName] = false;
                }
                obj[element.parameterName] = Number(element.inputData);
            } else {
                obj[element.parameterName] = element.inputData ? element.inputData.length > 0 ? element.inputData : null : null;
            }
        });
        obj["SpName"] = this.procName;
        obj["isForFilters"] = "true";
        obj["workspaceId"] = this.workspaceId;
        obj["dashboardId"] = this.dashboardId;
        this.procInputs = obj;
        this.getProcData(grid);
    }

    getDefaultChartDetails(): any {
        let chartDetails: any;
        const initialVisualId = this.customAppVisualizationId ?
            this.customAppVisualizationId.toLowerCase() : this.customAppVisualizationId
        const visualId = this.customAppCharts.findIndex((p) =>
            p.customApplicationChartId.toLowerCase() === initialVisualId);
        if (visualId === -1) {
            const defaultVisual = this.customAppCharts.findIndex((p) => p.isDefault === true);
            this.customAppVisualizationId = defaultVisual > -1 ?
                this.customAppCharts[defaultVisual].customApplicationChartId : this.customAppCharts[0].customApplicationChartId;
        }
        if (this.customAppVisualizationId) {
            this.selectedVisualizationType.patchValue(this.customAppVisualizationId);
            this.customAppCharts.forEach((element) => {
                if (element.customApplicationChartId == this.customAppVisualizationId) {
                    this.selectedvisualizationName = element.visualizationName;
                    chartDetails = element;
                    this.chartData.visualizationName = chartDetails.visualizationName;
                }
            });
        } else {
            chartDetails = this.customAppCharts.find((x) => x.isDefault == true);
        }
        return chartDetails;
    }

    getProcData(grid) {
        this.masterDataManagementService.getGenericApiData(this.procInputs).subscribe((response: any) => {
            if (response.success === true) {
                this.setProcData(grid, response.data)
            } else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }

    setProcData(grid, procData) {
        if (procData) {
            this.data = procData;
            this.completeGridData.data = this.data ? this.data : [];
            this.completeGridData.total = this.data ? this.data.length : 0;
            let chartDetails;
            if (grid && (grid.dashboardId || grid.isForPreview || grid.isFromListView)) {
                chartDetails = this.getDefaultChartDetails();
            }
            this.xCoOrdinate = chartDetails ? chartDetails.xCoOrdinate : grid.xCoOrdinate;
            this.yCoOrdinate = chartDetails ? chartDetails.yAxisDetails ? chartDetails.yAxisDetails.split(",") : [] : grid.yCoOrdinate;
            this.chartType = chartDetails ? chartDetails.visualizationType : grid.visualizationType;
            if (this.chartType === "table") {
                this.tableGridColumns = [];
                if (this.data && this.data.length > 0) {
                 
                    let objectKeys = Object.keys(this.data[0]);
                    objectKeys.forEach((key) => {
                        let gridColumn = { field: key, filter: "text", maxLength: 16, includeInFilters: false, width: 150 };
                        this.tableGridColumns.push(gridColumn);
                    })
                }
                this.gridSettings.columnsConfig = [...this.tableGridColumns];
                this.previewGridColumns = this.gridColumns = this.gridSettings.columnsConfig;
                this.selectedColumn = this.tableGridColumns[0].field;
                if (this.persistanceId) {
                    if (grid.persistanceJson != null) {
                        this.getPersistance(grid.persistanceJson);
                    } else {
                        this.getPersistance(null);
                    }
                } else {
                    this.anyOperationInProgress = true;
                    this.gridSettings.columnsConfig = [...this.previewGridColumns];
                    this.loadData(this.gridSettings.state);
                }
                if (!chartDetails) {
                    this.exportGrids();
                }
            }

            if (this.chartType == 'Heat map') {
                this.heatMapMeasure = chartDetails ? chartDetails.heatMapMeasure : grid.heatMapMeasure;
                this.getXAndYAxis();
            }
            this.checkIsStackedChart();
            if (this.chartType == "lineargauge" || this.chartType == "radialgauge" || this.chartType == "arcgauge") {
                this.exportGauge();
            }
            this.cdRef.detectChanges();
        }
    }

    getDimensionsFromTableHeaders() {

        var dimensions = {};
        this.previewGridColumns.forEach((column) => {
            console.log(column.field.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, ""));
            dimensions[column.field.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "")] = { caption: column.columnAltName }
        });
        return dimensions;
    }

    getMeasurersFromChartDetails() {
        var measurers = {};

        var pivotTableMeasurers = _.isObject(this.pivotChartMeasurers) ? this.pivotChartMeasurers : JSON.parse(this.pivotChartMeasurers);

        if (pivotTableMeasurers && pivotTableMeasurers.length > 0) {
            pivotTableMeasurers.forEach((column) => {
                let y = this.getMeasureFieldFormat(column.measurerField);
                measurers[column.measurerName] = { field: column.measurerField.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, ""), format: y, aggregate: column.aggregateFunction }
            });
        }
        return measurers;
    }

    getMeasureFieldFormat(field) {
        this.previewGridColumns.forEach((column) => {
            if (column.field === field) {
                if (column.columnFormatType == "Decimal2") {
                    this.returnFormat = "{0:N}";
                }
                else if (column.columnFormatType == "Comma separated") {
                    this.returnFormat = "{0:N0}";
                }
                else if (column.columnFormatType == "Decimal") {
                    this.returnFormat = "{0:N1}";
                }
                else if (column.columnFormatType == "United States Dollar") {
                    this.returnFormat = "$ {0:N0}";
                }
                else if (column.columnFormatType == "Indian Rupee") {
                    this.returnFormat = "₹ {0:N0}";
                }
                else if (column.columnFormatType == "Euro") {
                    this.returnFormat = "€{0:N0}";
                }
                else if (column.columnFormatType == "Albanian Lek") {
                    this.returnFormat = "{0:N0}€";
                }
                else if (column.columnFormatType == "Nepalese Rupee") {
                    this.returnFormat = "{0:N0}₹";
                }
                else if (column.columnFormatType == "Iceland Krona") {
                    this.returnFormat = "kr.{0:N0}";
                }
                else if (column.columnFormatType == "Hongkong Dollar") {
                    this.returnFormat = "HK${0:N0}";
                }
                else if (column.columnFormatType == "Brazilian Real") {
                    this.returnFormat = "R${0:N0}";
                }
                else if (column.columnFormatType == "Algerian Dinar") {
                    this.returnFormat = "{0:N0} د.ج.";
                }
                else if (column.columnFormatType == "Australian Dollar") {
                    this.returnFormat = "A${0:N0}";
                }
                else if (column.columnFormatType == "Canadian Dollar") {
                    this.returnFormat = "C${0:N0}";
                }
                else if (column.columnFormatType == "Afganisthan Afgani") {
                    this.returnFormat = "{0:N0}؋";
                }
                else if (column.columnFormatType == "Indonesian Rupaiah") {
                    this.returnFormat = "Rp{0:N0}";
                }
                else if (column.columnFormatType == "Pound Sterling") {
                    this.returnFormat = "£{0:N0}";
                }
                else if (column.columnFormatType == "Hungarian Forient") {
                    this.returnFormat = "{0:N0}Ft";
                }
                else if (column.columnFormatType == "Bolivian Boliviano") {
                    this.returnFormat = "Bs{0:N0}";
                }
                else if (column.columnFormatType == "Singapore Dollar") {
                    this.returnFormat = "S${0:N0}";
                } else if (column.columnFormatType == "MM/DD/YY") {
                    this.returnFormat = "{0:MM/dd/yy}";
                }
                else if (column.columnFormatType == "DD/MM/YY") {
                    this.returnFormat = "{0:dd/MM/yy}";
                }
                else if (column.columnFormatType == "D Month, Yr") {
                    this.returnFormat = "{0:d MMM, yy}";
                }
                else if (column.columnFormatType == "YY/MM/DD") {
                    this.returnFormat = "{0:yy/MM/dd}";
                }
            }
        });

        return this.returnFormat;
    }

    getDefaultColumnsFromTable() {
        const columns = this.pivotColumnsFilter ? this.pivotColumnsFilter.columns : [];
        columns.forEach((element, index) => {
            console.log(element);
            columns[index].expand = true;
        });
        return columns;
    }

    getDefaultRowsFromTable() {
        const rows = this.pivotColumnsFilter ? this.pivotColumnsFilter.rows : [];
        rows.forEach((element, index) => {
            console.log(element);
            rows[index].expand = true;
        });
        return rows;
    }

    getDefaultMeasurersSelected() {
        return this.pivotColumnsFilter ? this.pivotColumnsFilter.measurers : [];
    }
    getModelForPivot() {
        var pivotModel = {};
        this.headerForPivot.forEach((column) => {
            pivotModel[column.field.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "")] = { type: column.filter }
        });
        return pivotModel;
    }

    savePersistance(gridConfig: any) {
        const persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = this.isUserLevel;
            persistance.persistanceJson = JSON.stringify(gridConfig);
            this.persistanceService.UpsertPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    this.pivotColumnsFilter = JSON.parse(persistance.persistanceJson);
                }
            });
        }
    }

    initiatePivotTable() {

        const persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = this.isUserLevel;
            this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    if (response.data) {
                        const data = response.data;
                        this.pivotColumnsFilter = JSON.parse(data.persistanceJson);
                        this.drawPivotGrid();
                    } else {
                        this.drawPivotGrid();
                    }
                } else {
                    this.drawPivotGrid();
                }
            });
        } else {
            this.drawPivotGrid();
        }
    }

    drawPivotGrid() {

        if (this.pivotGrid) {
            this.pivotGrid.destroy();
            if (this.pivotGrid.element) {
                try {
                    this.pivotGrid.element.empty();
                } catch (exception) {
                    console.log(exception);
                }
            }
        }

        this.makeConfiguratorHidden();

        let dimensions = this.getDimensionsFromTableHeaders();
        let measurers = this.getMeasurersFromChartDetails();
        let columns = this.getDefaultColumnsFromTable();
        let rows = this.getDefaultRowsFromTable();
        let measurersSelected = this.getDefaultMeasurersSelected();
        let data = this.data;
        // Using a template reference variable
        var self = this;

        this.collapsed["columns"] = _.pluck(columns, 'name');
        this.collapsed["rows"] = _.pluck(rows, 'name');

        var id;
        var height = '400px';
        if ($("app-widgetsgridster #pivot-grid").length > 0) {
            var parents = $("#pivot-grid").parents();
            $.each(parents, function (index, value) {
                if (value.id.indexOf("widget-") != -1) {
                    id = `#${value.id}`;
                    if ($('.widget-gridster.individual-app').length > 0) {
                        if ($('mat-dialog-container .widget-gridster.individual-app').length > 0) {
                            height = `calc(90vh - 250px)`;
                        } else {
                            height = `${$(window).height() - 95}px`;
                        }
                    } else if ($(id).height() > 0) {
                        height = `${$(id).height() - 45}px`;
                    }
                }
            });
        }
        this.pivotGrid = kendo.jQuery(this.el.nativeElement).kendoPivotGrid({
            filterable: true,
            sortable: true,
            columnWidth: 50,
            height: height,
            //gather the collapsed members
            collapseMember: function (e) {
                var axis = self.collapsed[e.axis];
                var path = e.path;

                if (self.indexOfPath(path, axis) === -1) {
                    axis.push(path);
                }

            },
            //gather the expanded members
            expandMember: function (e) {
                var axis = self.collapsed[e.axis];
                var index = self.indexOfPath(e.path, axis);

                if (index !== -1) {
                    axis.splice(index, 1);
                }

            },
            messages: {
                measureFields: self.translateService.instant('PIVOTGRID.DROPMEASUREHERE'),
                columnFields: self.translateService.instant('PIVOTGRID.DROPCOLUMNHERE'),
                rowFields: self.translateService.instant('PIVOTGRID.DROPROWSHERE'),
                fieldMenu: {
                    info: self.translateService.instant('PIVOTGRID.INFO'),
                    sortAscending: self.translateService.instant('PIVOTGRID.SORTASCENDING'),
                    sortDescending: self.translateService.instant('PIVOTGRID.SORTDESCENDING'),
                    filterFields: self.translateService.instant('PIVOTGRID.FILTERFIELDS'),
                    filter: self.translateService.instant('PIVOTGRID.FILTER'),
                    include: self.translateService.instant('PIVOTGRID.INCLUDE'),
                    title: self.translateService.instant('PIVOTGRID.TITLE'),
                    clear: self.translateService.instant('PIVOTGRID.CLEAR'),
                    ok: self.translateService.instant('PIVOTGRID.OK'),
                    cancel: self.translateService.instant('PIVOTGRID.DROPROWSHERE'),
                }

            },
            dataBound: function (e) {
                self.dataBound(e);
            },
            dataSource: {
                data: data,
                schema: {
                    model: {
                        fields: this.getModelForPivot()
                    },
                    cube: {
                        dimensions: dimensions,
                        measures: measurers
                    }
                },
                columns: columns,
                rows: rows,
                measures: measurersSelected
            }
        }).data("kendoPivotGrid");
        if (!this.isFromGridster) {
            this.makeConfiguratorVisible();
        }
    }

    //Pivot Chart code starts

    collapsed = {
        columns: [],
        rows: []
    };

    flattenTree(tuples) {
        tuples = tuples.slice();
        var result = [];
        var tuple = tuples.shift();
        var idx, length, spliceIndex, children, member;

        var self = this;
        while (tuple) {
            // required for multiple measures
            if (tuple.dataIndex !== undefined) {
                result.push(tuple);
            }

            spliceIndex = 0;
            for (idx = 0, length = tuple.members.length; idx < length; idx++) {
                member = tuple.members[idx];
                children = member.children;
                if (member.measure) {
                    [].splice.apply(tuples, [0, 0].concat(self.expandMeasures(children, tuple)));
                } else {
                    [].splice.apply(tuples, [spliceIndex, 0].concat(children));
                }
                spliceIndex += children.length;
            }

            tuple = tuples.shift();
        }

        return result;
    }

    clone(tuple, dataIndex) {
        var members = tuple.members.slice();

        return {
            dataIndex: dataIndex,
            members: _.map(members, function (m) {
                return _.extend({}, m, { children: [] });
            })
        };
    }

    replaceLastMember(tuple, member) {
        tuple.members[tuple.members.length - 1] = member;
        return tuple;
    };

    expandMeasures(measures, tuple) {

        var self = this;
        return _.map(measures, function (measure: any) {
            return self.replaceLastMember(self.clone(tuple, measure.dataIndex), measure);
        });
    }

    // Check whether the tuple has been collapsed
    isCollapsed(tuple, collapsed) {
        var members = tuple.members;

        for (var idx = 0, length = collapsed.length; idx < length; idx++) {
            var collapsedPath = collapsed[idx];
            if (this.indexOfPath(this.fullPath(members, collapsedPath.length - 1), [collapsedPath]) !== -1) {
                return true;
            }
        }

        return false;
    }

    // Work with tuple names/captions
    indexOfPath(path, paths) {
        var path = path.join(",");

        for (var idx = 0; idx < paths.length; idx++) {
            if (paths[idx].join(",") === path) {
                return idx;
            }
        }

        return -1;
    }

    fullPath(members, idx) {
        var path = [];
        var parentName: any;
        if (members[idx]) {
            parentName = members[idx].name;
        }
        idx -= 1;
        while (idx > -1) {
            path.push(members[idx].name);
            idx -= 1;
        }

        if (parentName)
            path.push(parentName);

        return path;
    }

    memberCaption(member) { return member.caption };

    extractCaption(members) {
        var self = this;
        return _.map(members, self.memberCaption).join(" ");
    };

    fullPathCaptionName(members, dLength, idx) {
        var result = this.extractCaption(members.slice(0, idx + 1));
        var measureName = this.extractCaption(members.slice(dLength, members.mLength));

        if (measureName) {
            result += " - " + measureName;
        }

        return result;
    }

    getMeasurerName(member) {
        var measurerName = "";
        var measure: any = _.find(member, { levelName: 'MEASURES' });
        if (measure)
            measurerName = measure.name.replace(/\s/g, "");
        return measurerName;
    }

    //the main function that convert PivotDataSource data into understandable for the Chart widget format
    convertData(dataSource, collapsed) {
        var columnDimensionsLength = dataSource.columns().length;
        var rowDimensionsLength = dataSource.rows().length;

        var columnTuples = this.flattenTree(JSON.parse(JSON.stringify(dataSource.axes().columns.tuples)) || []);
        var rowTuples = this.flattenTree(JSON.parse(JSON.stringify((dataSource.axes().rows.tuples))) || []);
        var data = JSON.parse(JSON.stringify(dataSource.data()));
        var rowTuple, columnTuple;

        var idx = 0;
        var result = [];
        var columnsLength = columnTuples.length;

        for (var i = 0; i < rowTuples.length; i++) {
            rowTuple = rowTuples[i];

            if (!this.isCollapsed(rowTuple, collapsed.rows)) {
                for (var j = 0; j < columnsLength; j++) {
                    columnTuple = columnTuples[j];

                    if (!this.isCollapsed(columnTuple, collapsed.columns)) {
                        if (idx > columnsLength && idx % columnsLength !== 0) {
                            for (var ri = 0; ri < rowTuple.members.length; ri++) {
                                for (var ci = 0; ci < columnTuple.members.length; ci++) {
                                    //do not add root tuple members, e.g. [CY 2005, All Employees]
                                    //Add only children
                                    if (!columnTuple.members[ci].parentName || !rowTuple.members[ri].parentName) {
                                        continue;
                                    }
                                    result.push({
                                        measure: Number(data[idx].value),
                                        column: this.fullPathCaptionName(columnTuple.members, columnDimensionsLength, ci),
                                        row: this.fullPathCaptionName(rowTuple.members, rowDimensionsLength, ri),
                                        axis: this.getMeasurerName(columnTuple.members)
                                    });
                                }
                            }
                        }
                    }
                    idx += 1;
                }
            }
        }

        return result;
    }

    //pivot chart code ends 

    emptyIfPivotConfiguratorIsAvailable() {

        if (this.pivotConfiguratorElement) {
            try {
                var element = kendo.jQuery(this.pivotConfigurator.nativeElement).data("kendoPivotConfigurator");
                if (element) element.destroy();
                kendo.jQuery(this.pivotConfiguratorElement).empty();
                kendo.jQuery(this.pivotConfiguratorElement).removeClass()
            } catch (exception) {
                console.log(exception);
            }
        }
    }

    makeConfiguratorHidden() {
        this.showFilters = false;
        this.emptyIfPivotConfiguratorIsAvailable();
    }

    makeConfiguratorVisible() {
        this.showFilters = true;
        this.cdRef.detectChanges();
        this.emptyIfPivotConfiguratorIsAvailable();
        const self = this;

        this.pivotConfiguratorElement = kendo.jQuery(this.pivotConfigurator.nativeElement).kendoPivotConfigurator({
            dataSource: self.pivotGrid.dataSource,
            filterable: true,
            messages: {
                measures: self.translateService.instant('PIVOTGRID.MEASURES'),
                columns: self.translateService.instant('PIVOTGRID.COLUMNS'),
                rows: self.translateService.instant('PIVOTGRID.ROWS'),
                measuresLabel: self.translateService.instant('PIVOTGRID.MEASURESLABEL'),
                columnsLabel: self.translateService.instant('PIVOTGRID.COLUMNSLABEL'),
                rowsLabel: self.translateService.instant('PIVOTGRID.ROWSLABEL'),
                fieldsLabel: self.translateService.instant('PIVOTGRID.FIELDSLABEL'),
                fieldMenu: {
                    info: self.translateService.instant('PIVOTGRID.INFO'),
                    sortAscending: self.translateService.instant('PIVOTGRID.SORTASCENDING'),
                    sortDescending: self.translateService.instant('PIVOTGRID.SORTDESCENDING'),
                    filterFields: self.translateService.instant('PIVOTGRID.FILTERFIELDS'),
                    filter: self.translateService.instant('PIVOTGRID.FILTER'),
                    include: self.translateService.instant('PIVOTGRID.INCLUDE'),
                    title: self.translateService.instant('PIVOTGRID.TITLE'),
                    clear: self.translateService.instant('PIVOTGRID.CLEAR'),
                    ok: self.translateService.instant('PIVOTGRID.OK'),
                    cancel: self.translateService.instant('PIVOTGRID.DROPROWSHERE'),
                    operators: {
                        contains: self.translateService.instant('PIVOTGRID.CONTAINS'),
                        doesnotcontain: self.translateService.instant('PIVOTGRID.DOESNOTCONTAIN'),
                        startswith: self.translateService.instant('PIVOTGRID.STARTSWITH'),
                        endswith: self.translateService.instant('PIVOTGRID.ENDSWITH'),
                        eq: self.translateService.instant('PIVOTGRID.EQ'),
                        neq: self.translateService.instant('PIVOTGRID.NEQ')
                    }
                }
            },
            sortable: true,
            height: 400
        });
    }

    dataBound(e) {
        let pivotTable = e.sender;
        var columns = pivotTable.dataSource.columns();
        var rows = pivotTable.dataSource.rows();
        var measurers = pivotTable.dataSource.measures();

        var pivotGridConfiguration = {};

        pivotGridConfiguration['columns'] = columns;
        pivotGridConfiguration['rows'] = rows;
        pivotGridConfiguration['measurers'] = measurers;

        const gridConfig = {
            customApplicationChartId: this.customAppVisualizationId,
            chartType: this.chartType,
            pivotGridConfiguration: pivotGridConfiguration,
            chartNumber: this.chartNumber
        };

        if (!this.persistanceId) {
            this.persistanceJson.emit(JSON.stringify(gridConfig));
        } else if (this.persistanceId) {
            this.savePersistance(pivotGridConfiguration);
        }
    }

    makeChartVisible() {
        var pivotTable = this.pivotGrid;
        this.drawPivotChart(pivotTable.dataSource)
    }

    drawPivotChart(pivotTableDataSource) {
        //create/bind the chart widget
        var result: any = this.convertData(pivotTableDataSource, this.collapsed);
        this.pivotChartYAxis = this.getMeasureFieldsAxis(pivotTableDataSource);

        var measuresCount = pivotTableDataSource.measures().length;

        this.isSingleMeasure = measuresCount == 1 ? true : false;

        if (!this.isSingleMeasure) {
            var groupByAxis = groupBy(result, [{ field: "axis" }]);

            _.each(groupByAxis, function (axis: any, index) {
                var groupedRows = groupBy(axis.items, [{ field: "row" }]);
                groupByAxis[index]['items'] = groupedRows;
            })

            this.pivotChartDataSeries = groupByAxis;
        } else {
            this.pivotChartDataSeries = groupBy(result, [{ field: "row" }]);;
        }
        this.xAxisPivotCategories = _.uniq(_.pluck(result, 'column'));
        this.isPivotTableReady = true;
        this.drawPivotGrid();
    }

    getMeasureFieldsAxis(dataSource) {
        const measurers = dataSource.measures();
        var measureArray = [];
        _.each(measurers, function (element: any) {
            element['title'] = JSON.parse(JSON.stringify(element.name));
            element.name = element.name.replace(/\s/g, "");
            measureArray.push(element);
        });
        return measureArray;
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    pageChange({ skip, take }: PageChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;
        this.loadData(this.gridSettings.state);
    }

    public dataStateChange(state: State): void {
        this.gridSettings.state = state;
        this.gridSettings.gridData = process(this.completeGridData.data, state);
        if (this.selectAllState == "checked") {
            this.gridSettings.gridData.data.forEach(item => item.selected = true);
        } else {
            this.gridSettings.gridData.data.forEach(item => item.selected = false);
        }
        //this.items = this.gridSettings.gridData.data;
        this.saveGridSettings();
    }

    public onReorder(e: any): void {
        const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
        this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
        this.saveGridSettings();
    }

    public onResize(e: any): void {
        e.forEach((item) => {
            this.gridSettings.columnsConfig.find((col) => col.field === item.column.field).width = item.newWidth;
        });
        this.saveGridSettings();
    }

    public onVisibilityChange(e: any): void {
        e.columns.forEach((column) => {
            this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
        });
        this.saveGridSettings();
    }

    public saveGridSettings(): void {
        const gridConfig = {
            columnsConfig: this.gridSettings.columnsConfig,
            state: this.gridSettings.state,
            customApplicationChartId: this.customAppVisualizationId,
            chartType: this.chartType,
            chartNumber: this.chartNumber
        };
        if (this.emptyWidget) {
            this.persistanceJson.emit(JSON.stringify(gridConfig));
        } else if (this.persistanceId) {
            this.savePersistance(gridConfig);
        }
    }

    move() {
        var newArray = [];
        var arr = this.gridColumns;
        var a = 0; var b = 0; var index = 0; var c = 0;
        var obj = {};
        this.gridSettings.gridData.data.forEach(s => { index++; a = Object.keys(s).length; a > b ? c = a : c = b; obj[index - 1] = c; });
        var moreProperties = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
        var str: any = Object.keys(this.gridSettings.gridData.data[moreProperties]);
     
        str.forEach(function (s) {
            if (arr.find(d => d.field == s)) {
                newArray.push(arr.find(d => d.field == s));
            }
        });
        this.previewGridColumns = this.gridColumns = newArray;
    }

    getPersistance(inputPersistanceJson) {
        if (inputPersistanceJson != null && this.persistanceId) {
            if (inputPersistanceJson != '') {
                this.gridSettings = this.mapGridSettings(JSON.parse(inputPersistanceJson));
                this.cdRef.detectChanges();
            } else {
                this.gridSettings.columnsConfig = [...this.previewGridColumns];
                this.loadData(this.gridSettings.state);
            }
        } else if (this.persistanceId) {
            this.anyOperationInProgress = true;
            const persistance = new Persistance();
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = this.isUserLevel;
            if (this.dashboardId) {
                this.anyOperationInProgress = false;
                this.gridSettings.state = {
                    skip: 0,
                    take: 10,
                    filter: {
                        logic: "and",
                        filters: []
                    }
                }
                this.loadData(this.gridSettings.state);
            }
            else {
                this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
                    if (response.success) {
                        if (response.data) {
                            const data = response.data;
                            if (data.persistanceJson) {
                                this.anyOperationInProgress = false;
                                this.gridSettings = this.mapGridSettings(JSON.parse(data.persistanceJson));
                                this.cdRef.detectChanges();
                            } else {
                                this.anyOperationInProgress = false;
                                this.gridSettings.columnsConfig = [...this.previewGridColumns];
                                this.loadData(this.gridSettings.state);
                            }
                        } else {
                            this.anyOperationInProgress = false;
                            this.gridSettings.columnsConfig = [...this.previewGridColumns];
                            this.loadData(this.gridSettings.state);
                        }
                    } else {
                        this.anyOperationInProgress = false;
                        this.cdRef.detectChanges();
                    }
                    console.log(this.gridSettings);
                });
            }
        }
    }

    public mapGridSettings(gridSettings: GridSettings) {
        let state = gridSettings.state;
        if (state && state.filter) {
            this.mapDateFilter(state.filter);
        } else {
            gridSettings.state = {
                skip: 0,
                take: 10,
                filter: {
                    logic: "and",
                    filters: []
                }
            };
            state = gridSettings.state;
        }

        let gridSettignsNew = new GridSettings();
        gridSettignsNew.state = state;
        let x;
        let y;
        if (this.previewGridColumns != null) {
            this.previewGridColumns.forEach((values, index) => {
                if (gridSettings && gridSettings.columnsConfig && gridSettings.columnsConfig.length > 0) {
                    gridSettings.columnsConfig.forEach((value, index1) => {
                        if (values.field == value.field) {
                            x = true;
                            y = value.hidden;
                        }
                    });
                }
                if (x) {
                    this.previewGridColumns[index].hidden = y;
                } else {
                    this.previewGridColumns[index].hidden = false;
                }
            });
        }

        gridSettignsNew.columnsConfig = gridSettings.columnsConfig ? this.previewGridColumns.sort((a, b) => a.orderIndex - b.orderIndex) : null;
        gridSettignsNew.gridData = state ? process(this.completeGridData.data, state) : null;

        return gridSettignsNew;
    }

    private mapDateFilter = (descriptor: any) => {
        const filters = descriptor.filters || [];

        filters.forEach((filter) => {
            if (filter.filters) {
                this.mapDateFilter(filter);
            }
        });
    }

    private loadData(state: State): void {
        this.gridSettings.gridData = process(this.completeGridData.data, state);
        if (this.gridSettings.gridData.data.length > 0) {
            //this.items = this.gridSettings.gridData.data;
            this.move();
        }
        this.gridSettings.columnsConfig = [...this.previewGridColumns];
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
    }

    public exportToExcel(grid: GridComponent): void {
        grid.data = this.completeGridData;
        if (grid.data.data.length > 0) {
            grid.saveAsExcel();
            this.loadData(this.gridSettings.state);
        } else {
            this.toastr.info("No data found");
        }

    }

    public exportToPDF(grid: GridComponent): void {
        grid.saveAsPDF();
        this.loadData(this.gridSettings.state);
    }

    checkIsStackedChart() {
        this.emptyIfPivotConfiguratorIsAvailable();
        if (this.chartType === "stackedarea" || this.chartType === "stackedbar" || this.chartType === "stackedcolumn") {
            this.chartType = this.chartType === "stackedarea" ? "area" : this.chartType === "stackedbar" ? "bar" : "column";
            this.isStackedChart = true;
        } else {
            this.isStackedChart = false;
        }
        if (this.chartType === "area" || this.chartType === "line" || this.chartType === "bar" || this.chartType === "column"
            || this.chartType === "pie" || this.chartType === "donut") {
            this.drawChart();
        } else if (this.chartType === "kpi" || this.chartType == "lineargauge" || this.chartType == "radialgauge" || this.chartType == "arcgauge") {
            this.setKpiValue();
        } else if (this.chartType == 'pivot') {
            this.initiatePivotTable();
        } else if (this.chartType == 'Heat map') {
            this.getXAndYAxis();
        }
    }

    public exportChart(): void {
        if (this.chartType == 'area' || this.chartType == 'line' || this.chartType == 'bar' || this.chartType == 'column' || this.chartType == 'pie' || this.chartType == 'donut') {
            const visual = this.chart.exportVisual();
            exportPDF(visual, {
                paperSize: "A1",
                landscape: false,
                title: this.xCoOrdinate.toString() + " vs " + this.yCoOrdinate.toString(),
                margin: "1cm"
            }).then((dataURI) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
                saveAs(dataURI, this.xCoOrdinate.toString() + " vs " + this.yCoOrdinate.toString() + ".pdf");
            });
        } else if (this.chartType == 'lineargauge') {
            this.linear.exportImage().then((dataURI: string) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
                saveAs(dataURI, this.yCoOrdinate.toString() + ' - linear trend.png');
            });
        } else if (this.chartType == 'radialgauge') {
            this.radial.exportImage().then((dataURI: string) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
                saveAs(dataURI, this.yCoOrdinate.toString() + ' - radial trend.png');
            });
        } else if (this.chartType == 'arcgauge') {
            this.arc.exportImage().then((dataURI: string) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
                saveAs(dataURI, this.yCoOrdinate.toString() + ' - arc trend.png');
            });
        }
    }
    getFileToSendReport() {
        this.sharingisinProgress = true;
        if (this.chartType == 'area' || this.chartType == 'line' || this.chartType == 'bar' || this.chartType == 'column' || this.chartType == 'pie' || this.chartType == 'donut') {
            const visual = this.chart.exportVisual();
            exportPDF(visual, {
                paperSize: "A1",
                landscape: false,
                title: this.xCoOrdinate.toString() + " vs " + this.yCoOrdinate.toString(),
                margin: "1cm"
            }).then((dataURI) => {
                this.SendWidgetReportEmail(".pdf", this.appName.toString() + " vs " + this.yCoOrdinate.toString(), dataURI, null, null);
            });
        } else if (this.chartType == 'lineargauge') {
            this.linear.exportImage().then((dataURI: string) => {
                this.SendWidgetReportEmail(".png", this.appName.toString() + " vs " + this.yCoOrdinate.toString(), dataURI, null, null);
            });
        } else if (this.chartType == 'radialgauge') {
            this.radial.exportImage().then((dataURI: string) => {
                this.SendWidgetReportEmail(".png", this.appName.toString() + " vs " + this.yCoOrdinate.toString(), dataURI, null, null);
            });
        } else if (this.chartType == 'arcgauge') {
            this.arc.exportImage().then((dataURI: string) => {
                this.SendWidgetReportEmail(".png", this.appName.toString() + " vs " + this.yCoOrdinate.toString(), dataURI, null, null);
            });
        } else if (this.chartType == 'table') {
            let items = this.items;
            if (this.selectedKeys.length > 0) {
                items = this.selectedKeys;
            }

            this.SendWidgetReportEmail(".xlsx", this.appName, "", items, this.gridSettings.columnsConfig);

        }
    }
    SendWidgetReportEmail(fileExtension, fileName, file, data, columns) {
        var toEmails = this.selectedUserEmails;
        if (this.sendReportForm.value.toEmails != null && this.sendReportForm.value.toEmails != "" && this.sendReportForm.value.toEmails != undefined) {
            toEmails = (((toEmails != null && toEmails != "" && toEmails != undefined) ? toEmails + "," : "") + this.sendReportForm.value.toEmails.toString());
        }
        var toEmailsList = (toEmails != undefined ? toEmails : "").split(',');
        var body = this.commentText;
        var subject = this.sendReportForm.value.subject.toString();
        var reportType = "queryReport";
        this.widgetService.SendWidgetReportEmail({ toEmails: toEmailsList, fileExtension, fileName, file, reportType, data, columns, body, subject }).subscribe((result: any) => {
            if (result.success === true) {
                this.toMailsList = [];
                this.toastr.success("Report shared successfully");
                this.gridSettings.gridData.data.forEach(item => item.selected = false);
                this.cdRef.detectChanges();
                this.selectedKeys = [];
                this.closeDialog();
                this.sharingisinProgress = false;
                this.selectedUserEmails = null;
                this.toMailsList = [];
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }
    drawChart() {
        let yAxisCategories = [];
        const xAxisCategories = [];
        this.categorySeries = [];
        this.pieData = [];
        this.data.forEach((element) => {
            xAxisCategories.push(element[this.xCoOrdinate]);
        });

        this.xAxisCategories = xAxisCategories;
        if (this.yCoOrdinate && this.yCoOrdinate.length > 0) {
            this.yCoOrdinate.forEach((element) => {
                this.data.forEach((key) => {
                    let result;

                    var data = key[element].replace(/,/g, "");
                    if (isNaN(data)) {
                        this.isNumber = true;
                        result = data;
                    } else {
                        this.isNumber = false;
                        result = Number(key[element])
                    }

                    yAxisCategories.push(result);
                });
                this.yAxisCategories = yAxisCategories;
                let colorField: string;
                if (this.visualisationColors && this.visualisationColors.length > 0) {
                    let colors: any[] = [];
                    colors = this.visualisationColors;
                    colors.forEach((col) => {
                        if (col.YAxisColumnName == element) {
                            colorField = col.SelectedColor;
                        } else if (col.yAxisColumnName == element) {
                            colorField = col.selectedColor;
                        }
                    })
                }
                this.categorySeries.push({ name: element, yAxis: element, data: yAxisCategories, colorField: colorField });
                yAxisCategories = [];
            });
        }

        if (this.chartType === "pie" || this.chartType === "donut") {

            if (this.xAxisCategories && this.yAxisCategories && this.xAxisCategories.length > 0 && this.yAxisCategories.length > 0) {
                for (let i = 0; i <= this.xAxisCategories.length - 1; i++) {
                    for (let j = 0; j <= this.yAxisCategories.length - 1; j++) {
                        for (let k = 0; k <= this.data.length - 1; k++) {
                            if ((i === j) && (j === k)) {
                                this.pieData.push({ category: this.xAxisCategories[i], value: this.yAxisCategories[i], Id: this.data[i].Id ? this.data[i].Id : null });

                            }
                        }
                    }
                }
            }

            let pieData = this.pieData;
            if (pieData.length <= this.seriesColors.length) {
                pieData.forEach((record, index) => {
                    record.colorField = this.seriesColors[index];
                })
            } else {
                let i = 0;
                pieData.forEach((record, index) => {
                    if (index > 27) {
                        record.colorField = this.seriesColors[i];
                        i++;
                    } else {
                        record.colorField = this.seriesColors[index];
                    }

                })
            }

            this.pieData = pieData;
        }
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
    }

    getXAndYAxis() {
        this.xAndYAxisCategories = [];
        this.data.forEach((element) => {
            this.xAndYAxisCategories.push({ date: element[this.xCoOrdinate], value: element[this.yCoOrdinate], heatMapMeasure: this.heatMapMeasure });
        });
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
    }

    getTooltipValue(index) {
        if (this.yCoOrdinate && this.yCoOrdinate.length > 0) {
            let returndata;
            this.gridColumns.forEach((column) => {
                if (this.yCoOrdinate[index] === column.field) {
                    returndata = column.title == null || column.title == undefined || column.title == '' ? column.field : column.title;
                }
            });
            return "" + returndata;
        }
    }

    getTooltipText(category) {
        console.log(category);
    }

    setKpiValue() {
        this.selectedKpiData = this.yCoOrdinate ? this.yCoOrdinate.toString() : null;
        const values = this.selectedKpiData.split(",");
        values.forEach((element) => {
            this.data.forEach((key) => {
                this.kpiValue = key[element];
                this.maxValue = Math.pow(10, this.kpiValue ? this.kpiValue.toString().length : 0);
            });
        })
    }

    openVisualizationChangeForm(visualizationChangePopup) {
        visualizationChangePopup.openPopover();
    }

    visualizationTypeChange() {
        this.isVisualizationChangeInprogress = true;
        const selectedVisualizationId = this.selectedVisualizationType.value;
        const dashboardlist = new DashboardList();
        dashboardlist.workspaceId = this.workspaceId;
        dashboardlist.Id = this.dashboardId;
        this.selectedVisualizationId = selectedVisualizationId;
        this.customAppCharts.forEach((element) => {
            if (element.customApplicationChartId == selectedVisualizationId) {
                this.chartType = element.visualizationType;
                this.selectedvisualizationName = element.visualizationName;
                this.persistanceId = element.customApplicationChartId;
                this.xCoOrdinate = element.xCoOrdinate;
                this.yCoOrdinate = element.yAxisDetails != null ? element.yAxisDetails.split(",") : null;
                if (this.chartType == 'table') {
                    this.getPersistance(null);
                } else if (this.chartType == 'Heat map') {
                    this.heatMapMeasure = element.heatMapMeasure;
                } else {
                    this.checkIsStackedChart();
                }
                this.isVisualizationChangeInprogress = false;
                this.cdRef.detectChanges();
            }
        });
        this.updateVisualization();
        this.showFilters = false;
    }

    updateVisualization() {
        if (this.dashboardId && this.workspaceId && this.selectedVisualizationId) {
            this.isVisualizationChangeInprogress = true;
            const dashboardlist = new DashboardList();
            dashboardlist.workspaceId = this.workspaceId;
            dashboardlist.Id = this.dashboardId;
            dashboardlist.CustomAppVisualizationId = this.selectedVisualizationId;
            this.widgetService.UpsertDashboardVisuaizationType(dashboardlist).subscribe((response: any) => {
                if (response.success === true) {
                    this.isVisualizationChangeInprogress = false;
                    this.customAppVisualizationId = this.selectedVisualizationId;
                    this.visualizationChangePopup.forEach((p) => p.closePopover());
                }
            });
        }
    }

    navigateToEdit() {
        let dialogId = "create-app-dialog-componnet";
        const dialogRef = this.dialog.open(this.createAppDialogComponet, {
            width: "90vw",
            height: "90vh",
            id: dialogId,
            data: { appId: this.customWidgetId, isForHtmlApp: false, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            if (isReloadRequired === true) {
                this.getVisualizationRelatedData(this.gridsData);
            }
        });
    }

    closeVisualizationChangePopup() {
        this.visualizationChangePopup.forEach((p) => p.closePopover());
        this.customAppCharts.forEach((element) => {
            if (element.customApplicationChartId == this.customAppVisualizationId) {
                this.selectedVisualizationType.patchValue(this.customAppVisualizationId);
                this.selectedvisualizationName = element.visualizationName;
                this.chartType = element.visualizationType;
                this.persistanceId = element.customApplicationChartId;
                this.xCoOrdinate = element.xCoOrdinate;
                this.yCoOrdinate = element.yAxisDetails != null ? element.yAxisDetails.split(",") : null;
                this.checkIsStackedChart();
                this.cdRef.detectChanges();
            }
        });
    }

    public async exportGrids(): Promise<void> {
        let appName = this.appName;
        this.isPaginationEnable = false;
        await this.delay(this.delayTime);

        const promises = this.grids.map((grid) => grid.drawPDF());
        Promise.all(promises).then((groups) => {
            const rootGroup = new Group({
                pdf: {
                    multiPage: true
                }
            });
            groups.forEach((group) => {
                rootGroup.append(...group.children);
            });

            return exportPDF(rootGroup, { paperSize: "A4" });
            //return exportImage(rootGroup);
        }).then((dataUri) => {
            var model: any = {};
            model.fileBytes = dataUri;
            model.uniqueChartNumber = this.chartData.uniqueChartNumber;
            model.visualisationName = this.appName;
            model.customWidgetId = this.customWidgetId;
            model.fileType = ".pdf";
            this.fileBytes.emit(model);
            this.isPaginationEnable = true;
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            // saveAs(dataUri, (appName) + '.jpeg');
        });
    }

    public async exportKendoGrids(): Promise<void> {
        let appName = this.appName;
        this.isPaginationEnable = false;

        const promises = this.grids.map((grid) => grid.drawPDF());
        Promise.all(promises).then((groups) => {
            const rootGroup = new Group({
                pdf: {
                    multiPage: true
                }
            });
            groups.forEach((group) => {
                rootGroup.append(...group.children);
            });

            return exportImage(rootGroup);
        }).then((dataUri) => {
            saveAs(dataUri, (appName) + '.jpeg');
        });
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public async exportChartVisualizationForScheduling(): Promise<void> {
        await this.delay(2000);
        this.chart.exportImage().then((dataURI) => {
            var model: any = {};
            model.fileBytes = dataURI;
            model.uniqueChartNumber = this.chartData.uniqueChartNumber;
            model.visualisationName = this.appName;
            model.customWidgetId = this.customWidgetId;
            model.fileType = ".img";
            this.fileBytes.emit(model);
            //this.fileBytes.emit([dataURI, this.chartData.uniqueChartNumber, this.chartData.visualizationName]);
        });
    }

    public async exportGauge(): Promise<void> {
        if (this.chartType == "radialgauge") {
            await this.delay(this.delayTime);
            this.radial.exportImage().then((dataURI: string) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        } else if (this.chartType == "lineargauge") {
            await this.delay(this.delayTime);
            this.linear.exportImage().then((dataURI: string) => {
                var model: any = {};
                model.fileBytes = dataURI;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        } else {
            if (this.chartType == "arcgauge") {
                await this.delay(this.delayTime);
                this.arc.exportImage().then((dataURI: string) => {
                    var model: any = {};
                    model.fileBytes = dataURI;
                    model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                    model.visualisationName = this.appName;
                    model.customWidgetId = this.customWidgetId;
                    model.fileType = ".img";
                    this.fileBytes.emit(model);
                });
            }
        }
    }

    editAppName() {
        if (this.fromSearchBar) {
            return;
        }
        this.isEditAppName = true;
        this.changedAppName = this.appName;
        localStorage.setItem("appName", this.appName);
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.widgetService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully",
                            this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                        this.appName = JSON.parse(JSON.stringify(this.changedAppName));
                        localStorage.setItem("appName", this.appName);
                        this.changedAppName = "";
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    changeFilterValue(value) {
        if (value == "all") {
            this.all = true;
            this.reportingOnly = false;
            this.myself = false;
        }
        else if (value == "reportingOnly") {
            this.all = false;
            this.reportingOnly = true;
            this.myself = false;
        }
        else if (value == "mySelf") {
            this.all = false;
            this.reportingOnly = false;
            this.myself = true;
        }
        this.getVisualizationRelatedData(this.totalGridData);
    }

    fitContent(optionalParameters: any) {

        var interval;
        var count = 0;

        if (optionalParameters['gridsterView']) {

            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }

                    count++;

                    if ($(optionalParameters['gridsterViewSelector'] + ' .custom-app-bar-chart').length > 0) {

                        $(optionalParameters['gridsterViewSelector'] + ' .custom-app-bar-chart').height($(optionalParameters['gridsterViewSelector']).height() - 42);
                        clearInterval(interval);
                    }

                    if ($(optionalParameters['gridsterViewSelector'] + ' .custom-app-pie-chart').length > 0) {

                        $(optionalParameters['gridsterViewSelector'] + ' .custom-app-pie-chart').height($(optionalParameters['gridsterViewSelector']).height() - 42);
                        clearInterval(interval);
                    }

                    if ($(optionalParameters['gridsterViewSelector'] + ' .heat-map-report').length > 0) {

                        $(optionalParameters['gridsterViewSelector'] + ' .heat-map-report').height($(optionalParameters['gridsterViewSelector']).height() - 42);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);

        }
        else if (optionalParameters['popupView']) {

            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;

                    if ($(optionalParameters['popupViewSelector'] + ' .heat-map-report').length > 0) {

                        if (optionalParameters['isAppStoreCustomViewFromDashboard']) {

                            $(optionalParameters['popupViewSelector'] + ' .heat-map-report').css({ "height": "calc(100vh - 372px)" });
                            if ($('mat-dialog-container app-store app-widgetslist #custom-style-1').length > 0)
                                $('mat-dialog-container app-store app-widgetslist #custom-style-1').attr('id', '');
                        }
                        else {
                            $(optionalParameters['popupViewSelector'] + ' .heat-map-report').css({ "height": "calc(100vh - 400px)" });
                        }

                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);

        }
        else if (optionalParameters['individualPageView']) {

            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;

                    if ($(optionalParameters['individualPageSelector'] + ' .heat-map-report').length > 0) {

                        if (optionalParameters['isAppStoreUrl']) {
                            $(optionalParameters['individualPageSelector'] + ' .heat-map-report').css({ "height": "calc(100vh - 167px)" });
                        }
                        else {
                            $(optionalParameters['individualPageSelector'] + ' .heat-map-report').css({ "height": "calc(100vh - 160px)" });
                        }

                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }

    }

    getTitleName(text) {
        debugger;
        return this.softLabelPipe.transform(text, this.softLabels)
    }

    getHeaderTemplate(data) {
        if (this.headerBackgroundColor != null || this.headerFontColor != null) {
            return { 'white-space': 'normal', 'word-wrap': 'break-word', 'background-color': this.headerBackgroundColor, 'color': this.headerFontColor, 'font-weight': '900', 'padding-left': '10px !important;' };
        } else {
            return { 'white-space': 'normal', 'word-wrap': 'break-word', 'background-color': '#cce9FF', 'color': 'black', 'font-weight': '900', 'padding-left': '10px !important;' };
        }
    }

    getStyle(data) {
        if (this.columnFontFamily != null || this.columnBackgroundColor != null || this.columnFontColor != null) {
            return { 'width': 'max-content', 'font-family': this.columnFontFamily, 'background-color': this.columnBackgroundColor, 'color': this.columnFontColor, 'padding-left': '10px !important;' };
        } else {
            return { 'width': 'max-content', 'font-family': 'arial', 'background-color': '#FFFFFF', 'color': 'black', 'padding-left': '10px !important;' };
        }
    }

    //USEFUL COLORS
    //dark
    // update customappcolumns set columnfontcolor = 'black',
    // ColumnFontFamily='arial',ColumnBackgroundColor='white',RowBackgroundColor='#F0F7FF',HeaderBackgroundColor='#95c8f2',HeaderFontColor='black'
    // where CustomWidgetId='36A727F6-5B6E-478D-B65E-FA5A6502E0E4' --114   
    // light 
    // update customappcolumns set columnfontcolor = 'black',
    // ColumnFontFamily='arial',ColumnBackgroundColor='white',RowBackgroundColor='#F0F7FF',HeaderBackgroundColor='#cce9FF',HeaderFontColor='black'
    // where CustomWidgetId='36A727F6-5B6E-478D-B65E-FA5A6502E0E4' --114

    // update customappcolumns set columnfontcolor = '#002060',
    // ColumnFontFamily='arial',ColumnBackgroundColor='white',RowBackgroundColor='#F0F7FF',HeaderBackgroundColor='#f9cfd9',HeaderFontColor='black'
    // where CustomWidgetId='88B424C8-8490-4939-9457-1F5A9FD6C431' --111

    getGridStyle(data) {
        if (this.headerBackgroundColor > 0) {
            if (this.headerBackgroundColor != null) {
                return { 'border': '1px solid ' + this.headerBackgroundColor };
            } else {
                return { 'border': '1px solid #005073' };
            }
        } else {
            return { 'border': '1px solid #005073' };
        }
    }
    public rowCallback = (context: RowClassArgs) => {
        if (context.dataItem.isHighLight == true) {
            if (this.randomString === null || this.randomString === undefined) {
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const lengthOfCode = 5;
                this.randomString = this.makeRandom(lengthOfCode, possible);
                if (this.rowBackgroundColor != null && this.rowBackgroundColor != undefined && this.rowBackgroundColor != '') {
                    this.someHtmlCode1 = this.sanitizer.bypassSecurityTrustHtml('<style> .' + this.randomString + ' .codeColumn { background-color: ' + this.rowBackgroundColor + ' !important; }</style>');
                } else {
                    this.someHtmlCode1 = this.sanitizer.bypassSecurityTrustHtml('<style> .' + this.randomString + ' .codeColumn { background-color: #F0F7FF !important; }</style>');
                }
                return { [this.randomString]: true };
            } else {
                return { [this.randomString]: true };
            }
        }
    }

    makeRandom(lengthOfCode: number, possible: string) {
        let text = "";
        for (let i = 0; i < lengthOfCode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text.toLocaleLowerCase();
    }

    initializeCustomApplicationForm() {
        this.sendReportForm = new FormGroup({
            userIds: new FormControl("", []
            ),
            toEmails: new FormControl("", []),
            subject: new FormControl("",
                Validators.compose([
                    Validators.required
                ])),
            body: new FormControl("",
                Validators.compose([
                    Validators.required
                ]))
        })
    }
    removeToMailId(toMail) {
        const index = this.toMailsList.indexOf(toMail);
        if (index >= 0) {
            this.toMailsList.splice(index, 1);
        }
        if (this.toMailsList.length === 0) {
            this.count = 0;
        }
    }

    getUserlistByUserId() {
        const userids = this.sendReportForm.value.userIds;
        const index = userids.indexOf(0);
        if (index > -1) {
            userids.splice(index, 1);
        }
        this.selectedUserIds = userids;
        var usersList = this.usersList;
        if (userids && usersList && usersList.length > 0) {
            var users = _.filter(usersList, function (user) {
                return userids.toString().includes(user.id);
            });
            this.selectedUserNames = users.map(x => x.fullName).toString();
            this.selectedUserEmails = users.map(x => x.email).toString();
        }
    }

    toggleAllUsersSelected() {
        if (this.allSelected.selected) {
            this.sendReportForm.controls.userIds.patchValue([...this.usersList.map((item) => item.id), 0]);

        } else {
            this.sendReportForm.controls.userIds.patchValue([]);
        }
        this.getUserlistByUserId();
    }

    toggleUserPerOne(all) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.sendReportForm.controls.userIds.value.length ===
            this.usersList.length
        ) {
            this.allSelected.select();
        }
        this.getUserlistByUserId();
    }
    addToMailIds(event: MatChipInputEvent) {
        const inputTags = event.input;
        let toMailslist = [];
        const mailTags = event.value.trim();
        if (mailTags != null && mailTags != "") {
            let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            if (regexpEmail.test(mailTags)) {
                toMailslist.push(mailTags);
                this.count++;
            } else {
                // this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
            }
        }
        if (inputTags) {
            inputTags.value = " ";
        }
        this.toMailsList = toMailslist;
    }
    getUsersDropDown() {
        this.userService.GetUsersDropDown().subscribe((result: any) => {
            if (result.success === true) {
                this.usersList = result.data;
                this.cdRef.detectChanges();
            } else {
            }

        });
    }
    closeDialog() {
        //   this.shareReportPopovers.forEach((p) => p.closePopover());
        if (this.shareDialog) {
            this.shareDialog.close();
            this.shareDialog.close({ success: true });
        }
        this.initializeCustomApplicationForm();
    }
    openFilterPopover() {
        //     this.gridData = grid;
        //   shareReportPopover.openPopover();
        let dialogId = "share-template-dialog";
        this.shareDialogId = dialogId;
        let id = setTimeout(() => {
            this.shareDialog = this.dialog.getDialogById(this.shareDialogId);
        }, 1200)
        const dialogRef = this.dialog.open(this.shareDialogComponent, {
            id: dialogId,
            width: "90vw",
            height: "90vh",
            maxWidth: "90vw",
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.cdRef.detectChanges();
        });

    }
    buttonDisabledInProgress(comments) {
        this.commentText = comments.event.target.innerHTML;
        if (this.commentText) {
            this.cdRef.detectChanges();
        }
    }

    downloadImage() {
        let appName = this.appName;
        if (this.chartType != 'table') {
            this.downloadChartImage();
        } else {
            //this.exportToPDF(this.grid);
            this.isLoadingImage = true;
            this.cdRef.detectChanges();
            let id = this.tableId
            let element: HTMLElement = document.getElementById(id);
            if (this.columnsLength > 5) {
                element.style.width = "3000px";
                element.style.height = "auto";
                element.style.overflow = "visible";
            }

            drawDOM(element)
                .then((group: Group) => {
                    return exportImage(group);
                })
                .then((dataUri) => {
                    saveAs(dataUri, appName + '.jpeg');
                });
            this.isLoadingImage = false;
            this.cdRef.detectChanges();
        }

        this.isLoadingImage = false;
        this.cdRef.detectChanges();

    }

    downloadChartImage() {
        let appName = this.appName;
        this.isLoadingImage = true;
        this.cdRef.detectChanges();
        let Id = this.customapplicationId;
        var container = document.getElementById(Id);
        html2canvas(container).then(canvas => {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download = appName + ".jpeg";
            link.href = canvas.toDataURL();
            link.target = '_blank';
            link.click();
        })
        // htmlToImage.toJpeg(container)
        //     .then(function (dataUrl) {
        //         var link = document.createElement('a');
        //         link.download = appName + '.jpeg';
        //         link.href = dataUrl;
        //         link.click();
        //     });
        this.isLoadingImage = false;
        this.cdRef.detectChanges();
    }

    exportChartImage() {
        let appName = this.appName;
        if (this.chartType == 'area' || this.chartType == 'line' || this.chartType == 'bar' || this.chartType == 'column' || this.chartType == 'pie' || this.chartType == 'donut') {
            this.chart.exportImage().then((dataURI) => {
                saveAs(dataURI, appName + '.jpeg');
            });
        } else if (this.chartType == 'lineargauge') {
            this.linear.exportImage().then((dataURI: string) => {
                saveAs(dataURI, appName + '.jpeg');
            });
        } else if (this.chartType == 'radialgauge') {
            this.radial.exportImage().then((dataURI: string) => {
                saveAs(dataURI, appName + '.jpeg');
            });
        } else if (this.chartType == 'arcgauge') {
            this.arc.exportImage().then((dataURI: string) => {
                saveAs(dataURI, appName + '.jpeg');
            });
        }
    }


    public onLegendItemHover(e: any): void {
        e.sender.showTooltip(point => point.index === e.pointIndex);
    }

    public legendLabelData(data: any) {
        return data.text;
    }

    exportKPIChart() {
        setTimeout(() => {
            let Id = this.customapplicationId;
            var container = document.getElementById(Id);
            html2canvas(container).then(canvas => {
                let imageData = canvas.toDataURL('image/png');
                var model: any = {};
                model.fileBytes = imageData;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        }, this.delayTime);
    }

    exportTable() {
        let id = this.tableId
        let element: HTMLElement = document.getElementById(id);
        if (this.columnsLength > 5) {
            element.style.width = "3000px";
            element.style.height = "auto";
            element.style.overflow = "visible";
        }

        drawDOM(element)
            .then((group: Group) => {
                return exportImage(group);
            })
            .then((dataUri) => {
                var model: any = {};
                model.fileBytes = dataUri;
                model.uniqueChartNumber = this.chartData.uniqueChartNumber;
                model.visualisationName = this.appName;
                model.customWidgetId = this.customWidgetId;
                model.fileType = ".img";
                this.fileBytes.emit(model);
                //saveAs(dataUri, appName + '.jpeg');
            });
    }

    areAllItemsChecked(): boolean {
        if (this.selectedKeys.length === this.items.length) {
            return true;
        } else {
            return false;
        }
    }

    onCheckboxChange(event: any, dataItem: any): void {
        if (event.target.checked) {
            this.selectedKeys.push(dataItem);

        } else {
            let selectedColumn = this.selectedColumn;
            let selectedKeys = this.selectedKeys;
            let filteredList = selectedKeys.filter(function (rec) {
                return rec[selectedColumn] == dataItem[selectedColumn]
            })
            if (filteredList.length > 0) {
                let index = selectedKeys.indexOf(filteredList[0]);
                if (index !== -1) {
                    this.selectedKeys.splice(index, 1);
                }
                this.gridSettings.gridData.data.forEach(item => item.selected);
            }
        }

    }

    onSelectAllChange(event): void {
        if (event.target.checked) {
            this.selectedKeys = this.items;
            this.selectAllState = 'checked';
            this.gridSettings.gridData.data.forEach(item => item.selected = true);
           
        } else {
            this.selectedKeys = [];
            this.selectAllState = 'unchecked';
            this.gridSettings.gridData.data.forEach(item => item.selected = false);
        }
        // if (this.grid) {
        //     this.grid.data = [...this.gridSettings.gridData.data];

        //   }
        this.cdRef.detectChanges();
    }

    // Method to check if a dataItem is selected
    isSelected(dataItem: any): boolean {
        return this.selectedKeys.some(item => item === dataItem);
    }
}
