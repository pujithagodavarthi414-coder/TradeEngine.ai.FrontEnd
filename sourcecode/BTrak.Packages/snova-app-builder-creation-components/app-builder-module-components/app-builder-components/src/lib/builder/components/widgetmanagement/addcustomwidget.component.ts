import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators, FormArray, FormBuilder } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Persistance } from "../../models/persistance.model";
import { PersistanceService } from "../../services/persistance.service";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { RoleManagementService } from "../../services/role-management.service";
import { CronOptions } from "cron-editor/lib/CronOptions";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { CronExpressionModel } from "../../models/cron-expression.model";
import { CustomQueryHeadersModel } from "../../models/custom-query-headers.model";
import { CustomQueryModel } from "../../models/custom-query.model";
import { CustomQueryOutputModel } from "../../models/custom-query-output.model";
import { CustomWidgetsModel } from "../../models/custom-widget.model";
import { CustomChartTypeModel } from "../../models/widget-custom-chart.model";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { WebHookModel } from "../../models/webhook.model";
import { StoredProcParamsModel } from "../../models/stored-proc-params.model";
import { ProcInputAndOutputModel } from "../../models/proc-inputs-outputs.model";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { WidgetService } from "../../services/widget.service";
import { CustomTagModel } from "../../models/custom-tags.model";
import { CustomTagService } from "../../services/customTag.service";
import cronstrue from 'cronstrue';
import { ApiInputDetailsModel } from '../../models/api-input-details.model';
import { SatPopover } from '@ncstate/sat-popover';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";

@Component({
  selector: "app-fm-component-add-custom-widget",
  templateUrl: `addcustomwidget.component.html`
})

export class AddCustomWidgetComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild("customQuery") customQuery: ElementRef;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allModuleSelected") private allModuleSelected: MatOption;
  @ViewChild("formDirective") formgroupDirective: FormGroupDirective;
  @ViewChild("addCronExpressionPopovers") addCronExpression: SatPopover;
  @ViewChild("addFormDirective") addFormgroupDirective: FormGroupDirective;
  @ViewChild("allSelectedCharts") private allSelectedCharts: MatOption;
  @ViewChildren("addVisualizationPopup") addVisualizationPopover;
  @ViewChildren("addMeasurerPopup") addMeasurerPopover;
  @ViewChildren("addColorPopup") addColorsPopover;
  @ViewChild("addMeasurerDirective") addMeasurerDirective: FormGroupDirective;
  @ViewChild("inputParamsformDirective") inputParamsformDirective: FormGroupDirective;
  @ViewChild("outputParamsformDirective") outputParamsformDirective: FormGroupDirective;
  @ViewChild("inputHeadersformDirective") inputHeadersformDirective: FormGroupDirective;
  @ViewChildren("deleteVisualizationTypePopover") deleteVisualizationTypePopover;
  @Input() selectedIndex: number | null;
  @Output() change: EventEmitter<MatRadioChange>;
  columnAltName: string;
  isEdit: boolean = false;


  @Input("fromSearch")
  set _fromSearch(data: string) {
    if (data) {
      this.fromSearch = data;
    }
  }

  @Input("tagSearchText")
  set _tagSearchText(data: string) {
    if (data) {
      this.tagSearchText = data;
    }
  }

  tagSearchText: string;
  fromSearch: string;

  @Input("selectedAppId")
  set _selectedAppId(data: string) {
    this.clearForm();
    if (data != null && data !== undefined) {
      this.isEdit = true;
      this.selectedTabIndex = 0;
      this.customWidgetId = data;
      this.editWidget();
    }
  }
  showHeaderInPopUp: boolean;

  @Input('isPopUp')
  set _isPopUp(data: boolean) {
    this.showHeaderInPopUp = data;
  }
  @Input("tagModel")
  set _tagModel(data: CustomTagModel) {
    this.tagModel = data;
  }

  selectedItem: string = '';
  customQueryString: string;
  selectCustomQuery: boolean = false;
  collectionName: string;
  @Output() closeDialog = new EventEmitter<boolean>();
  customWidgetForm: FormGroup;
  tagModel: CustomTagModel;
  subQueryForm: FormGroup;
  selectedColumnFormatItem: string = '';
  visualizationDetailsForm: FormGroup;
  scheduleForm: FormGroup;
  selectedChartIndex: CustomChartTypeModel;
  queryBuilderOutput: any;
  isArchived = false;
  isAnyOperationIsInprogress = false;
  queryOutputWithFilter: CustomQueryOutputModel;
  collections: any[] = [];
  previewGridColumns: CustomQueryHeadersModel[] = [];
  customWidgetId: string;
  customWidgetName: string;
  customWidgetModel: CustomWidgetsModel;
  widgetId: string = null;
  isLoadingInProgress: boolean;
  queryOutput: CustomQueryOutputModel;
  allChartsDetails: CustomChartTypeModel[] = [];
  defaultCustomChart: CustomChartTypeModel;
  isNewCustomChart = true;
  isShowNewForm = false;
  emailField: string;
  webUrlField: string;
  temp: any;
  isUpsertInProgress = false;
  isValidationInProgress = false;
  columnsGenerationInProgress = false;
  previewGenerationInProgress = false;
  gridData: any;
  widgetQuery: string;
  rolesDropDown: any[];
  selectedRoleIds: string[] = [];
  selectedTabIndex = 0;
  selectedVisualizationTabIndex = 0;
  filterQuery: string;
  columnformatQuery: string;
  chartType: any;
  kpiChartLength = 0;
  dashboardFilters = {
    projectId: null,
    userId: null,
    goalId: null
  };
  color1: string;
  originalQuery: string;
  isChartTypeVisualization: boolean;
  selectedvisualizationType = new FormControl(null, []);
  xAxisColumnsList: any;
  xCoOrdinate: any;
  yCoOrdinate: any = [];
  apiInputModel: ApiInputDetailsModel;
  selectedKpiData: any;
  yAxisColumnsList: any;
  selectedVisualization: any = 0;
  chartSeries = 0;
  selectedChartDetails: any;
  visualizationTypes: any[] = [];
  persistanceJson: string = null;
  selectedCharts: string[] = [];
  templateTypeDropDown: any[];
  yCorodinateSelectedColors: any[] = [];
  chartsData: any;
  bytes: any[] = [];
  fileInputBytes = [];
  clickedIndex = 0;
  runNow = false;
  enableGmailField = false;
  enableWebHookField = false;
  email = new FormControl(null, Validators.compose([
    Validators.required,
    Validators.pattern("^(([_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,}))+(?:,[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})+)*)$"),
    // Validators.pattern("(([^<>()\[\]\\.,;:\s@]+(\.[^<>()\[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"),
    Validators.maxLength(100)
  ]));
  webUrl = new FormControl(null, Validators.compose([Validators.required,
  Validators.maxLength(100)]));
  enableNotification = false;
  cronExpressionId: string;
  cronTimeStamp: string;
  jobId: string;
  clickedChartIndex = 0;
  uniqueChartNumber = 0;
  selectedChartDetailsNames: string;
  selected = new FormControl(0);
  enableSchedulingButton: boolean;
  customWidgetData: any;
  tagsList: CustomTagModel[] = [];
  webhook: WebHookModel[];
  totalTableColumns: any;
  addMeasurerForm: FormGroup;
  aggregateFunctionsList: any[] = [];
  removable = true;
  selectedMeasurerList = [];
  currentEditableChartIndex: any;
  dataOptionValue: string = "widgetQuery";
  apiOrQuery: string;
  procName: string;
  storedProcParams: StoredProcParamsModel[] = [];
  paramsData: any;
  isProc: boolean;
  isApi: boolean;
  color: string;
  isMongoQuery: boolean;
  isBodyVisible: boolean = false;
  addProcOutputForm: FormGroup;
  addInputParamsForm: FormGroup;
  addOutputParamsForm: FormGroup;
  addInputHeadersForm: FormGroup;
  visualisationColorForm: FormGroup;
  legendForm: FormGroup;
  procOutputs: FormArray;
  apiInputParams: FormArray;
  apiOutputParams: FormArray;
  apiHeaderParams: FormArray;
  legends: FormArray;
  visualisationColorList: FormArray;
  stepsCount: number = 0;
  legendStepsCount: number = 0;
  inputParamsCount: number = 0;
  outputParamsCount: number = 0;
  inputHeadersCount: number = 0;
  outputData: any;
  apiOutputData: any;
  legendsData: any;
  procOutputsData: any;
  customStoredProcId: string;
  customProcWidgetTimeStamp: string;
  isFetchOperationIsInprogress: boolean = false;
  saveProcDetails: boolean = false;
  saveFetchDetails: boolean = false;
  heatMapJson: any;
  subQueryTypes: { subQueryTypeId: number, subQueryType: string };
  columnFormatTypes: { columnFormatTypeId: number, columnFormatType: string, childId: number, parentId: number };
  columnFormatSubTypes: { columnFormatSubTypeId: string, columnFormatSubType: string };
  currencyColumnFormatTypes: { columnFormatTypeId: number, columnFormatType: string };
  numberColumnFormatTypes: { columnFormatTypeId: number, columnFormatType: string };
  datetimeColumnFormatTypes: { columnFormatTypeId: number, columnFormatType: string };
  newTags: any = [];
  inputTagsList: any = [];
  currency: string = "fa64ba35-9431-4a38-8db0-76660b05903d";
  number: string = "82BC6958-DDD1-4A3D-9B77-89CD9788FCF6";
  datetime: string = "75C37A45-CD0D-40DB-9104-D51F749ED880";
  public cronExpression = "0/1 * 1/1 * ?";
  public isCronDisabled = false;
  public cronExpressionModel: CronExpressionModel;
  public cronOptions: CronOptions = {
    formInputClass: "form-control cron-editor-input",
    formSelectClass: "form-control cron-editor-select",
    formRadioClass: "cron-editor-radio",
    formCheckboxClass: "cron-editor-checkbox",
    defaultTime: "10:00:00",
    use24HourTime: true,
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true
  };
  modulesDropDown: any[];
  selectedModuleIds: string[] = [];
  softLabels: SoftLabelConfigurationModel[];
  constructor(
    private route: ActivatedRoute, private roleManagementService: RoleManagementService,
    private masterDataManagementService: MasterDataManagementService,
    private widgetService: WidgetService,
    private customTagsService: CustomTagService,
    private toasterService: ToastrService,
    private persistanceService: PersistanceService,
    private cdRef: ChangeDetectorRef, private toaster: ToastrService, private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private snackbar: MatSnackBar) {
    super();
    this.getSoftLabelConfigurations();
    this.getCollectionsListInMongoDb();
    this.clearVisualisationColorForm();
    //this.visualisationColorForm = new FormGroup({});
    this.color = "";
    this.color1 = "";
    this.route.params.subscribe((params) => {
      this.clearForm();
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedTabIndex = 0;
        this.customWidgetId = params["id"];
        this.editWidget();
      }
    });
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ngOnInit() {
    super.ngOnInit();
    this.GetAllRoles();
    this.getSubQueryTypes();
    this.getCurrencyFormatTypes();
    this.getNumberFormatTypes();
    this.getDatetimeFormatTypes();
    this.initializeVisualizationDetailsForm();
    this.initializeAddMeasurerForm();
    this.schedulerForm();
    this.getwebhook();
    this.GetAllModules();
    this.selectedTabIndex = 0;
    this.apiValidations(this.dataOptionValue);
    let table = this.translateService.instant("APP.TABLE");
    let areaChart = this.translateService.instant("APP.AREACHART");
    let boxChart = "Box chart";
    let lineChart = this.translateService.instant("APP.LINECHART");
    let barChart = this.translateService.instant("APP.BARCHART");
    let pieChart = this.translateService.instant("APP.PIECHART");
    let columnChart = this.translateService.instant("APP.COLUMNCHART");
    let stackedAreaChart = this.translateService.instant("APP.STACKEDAREACHART");
    let stackedBarChart = this.translateService.instant("APP.STACKEDBARCHART");
    let stackedColumnChart = this.translateService.instant("APP.STACKEDCOLUMNCHART");
    let donutChart = this.translateService.instant("APP.DONUTCHART");
    let gaugeChart = this.translateService.instant("APP.GAUGECHART");
    let pivotTable = this.translateService.instant("APP.PIVOTTABLE");
    let kpiChart = this.translateService.instant("APP.KPICHART");
    let heatMap = this.translateService.instant("APP.HEATMAP");
    this.visualizationTypes.push({ name: table, value: "0" }, { name: areaChart, value: "1" }, { name: lineChart, value: "2" },
      { name: barChart, value: "3" }, { name: pieChart, value: "4" }, { name: columnChart, value: "5" },
      { name: stackedAreaChart, value: "6" },
      { name: stackedBarChart, value: "7" }, { name: stackedColumnChart, value: "8" },
      { name: donutChart, value: "9" }, { name: kpiChart, value: "10" }, { name: gaugeChart, value: "11" },
      { name: pivotTable, value: "12" }, { name: heatMap, value: "13" });

    this.templateTypeDropDown = [
      {
        name: "Email",
        value: "Email"
      },
      {
        name: "Webhook",
        value: "Webhook"
      }];
    this.aggregateFunctionsList.push({ field: "Sum", value: "sum" }, { field: "Count", value: "count" }, { field: "Average", value: "average" }, { field: "Maximum", value: "max" }, { field: "Minimum", value: "min" });
  }

  getCollectionsListInMongoDb() {
    this.widgetService.getCollectionsList().subscribe((response: any) => {
      this.collections = response.data;
      if (this.collections.length == 0) {
        this.collections = [
          {
            collectionName: 'DataSource'
          },
          {
            collectionName: 'DataSet'
          },
          {
            collectionName: 'DataSetHistory'
          },
          {
            collectionName: 'DataSourceKeys'
          },
          {
            collectionName: 'DataSourceKeysConfiguration'
          },
          {
            collectionName: 'ContractQuantity'
          }

        ]
      }
      this.cdRef.detectChanges();
    })
  }

  getSubQueryTypes() {
    this.widgetService.getSubQueryTypes().subscribe((data: any) => {
      this.subQueryTypes = data.data;
    });
  }

  getCurrencyFormatTypes() {
    this.widgetService.getColumnFormatTypesId(this.currency).subscribe((data: any) => {
      this.currencyColumnFormatTypes = data.data;
    });
  }

  getNumberFormatTypes() {
    this.widgetService.getColumnFormatTypesId(this.number).subscribe((data: any) => {
      this.numberColumnFormatTypes = data.data;
    });
  }

  getDatetimeFormatTypes() {
    this.widgetService.getColumnFormatTypesId(this.datetime).subscribe((data: any) => {
      this.datetimeColumnFormatTypes = data.data;
    });
  }

  GetAllRoles() {
    this.roleManagementService.getAllRoles().subscribe((responseData: any) => {
      this.rolesDropDown = responseData.data;
    });
  }
  GetAllModules() {
    this.masterDataManagementService.getAllModule().subscribe((response: any) => {
      if (response.success === true) {
        this.modulesDropDown = response.data;
      }
      else {
        this.toaster.error(response.apiResponseMessages[0].message);
      }
    });
  }

  getwebhook() {
    var webhookModel = new WebHookModel();
    webhookModel.isArchived = this.isArchived;

    this.widgetService.getwebhook(webhookModel).subscribe((response: any) => {
      if (response.success == true) {
        this.webhook = response.data;
      }
    });
  }

  onChange(mrChange: MatRadioChange) {
    this.apiValidations(mrChange.value);
  }

  onChangeSelect() {
    this.selectedItem != '' ? this.selectCustomQuery = true : this.selectCustomQuery = false;
    this.customQueryString = undefined;
  }

  apiValidations(type) {
    this.customWidgetForm.controls['widgetQuery'].markAsUntouched();
    this.customWidgetForm.controls['mongoQuery'].markAsUntouched();
    this.customWidgetForm.controls['procName'].markAsUntouched();
    this.customWidgetForm.controls['httpMethod'].markAsUntouched();
    this.customWidgetForm.controls['apiUrl'].markAsUntouched();
    if (type == 'widgetQuery') {
      this.customWidgetForm.controls["mongoQuery"].clearValidators();
      this.customWidgetForm.get("mongoQuery").updateValueAndValidity();
      this.customWidgetForm.controls["collectionName"].clearValidators();
      this.customWidgetForm.get("collectionName").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].setValidators([Validators.required]);
      this.customWidgetForm.get("widgetQuery").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].clearValidators();
      this.customWidgetForm.get("procName").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].setValue("");
      this.customWidgetForm.controls["httpMethod"].clearValidators();
      this.customWidgetForm.get("httpMethod").updateValueAndValidity();
      this.customWidgetForm.controls["httpMethod"].setValue("");
      this.customWidgetForm.controls["apiUrl"].clearValidators();
      this.customWidgetForm.get("apiUrl").updateValueAndValidity();
      this.customWidgetForm.controls["apiUrl"].setValue("");
      this.stepsCount = 0;
      this.inputParamsCount = 0;
      this.inputHeadersCount = 0;
      this.procName = null;
      this.isProc = false;
      this.isApi = false;
      this.isMongoQuery = false;
      this.storedProcParams = [];
      this.initializeProcOutputForm();
      this.initializeInputParamsForm();
      this.initializeOutputParamsForm();
      this.initializeInputHeadersForm();
      this.initializeLegendForm();
      var heatMapIndex = this.visualizationTypes.findIndex((p) => p.value == 13)
      if (heatMapIndex > -1) {
        this.visualizationTypes.splice(heatMapIndex, 1);
      }
    } else if (type == 'mongoQuery') {
      this.customWidgetForm.controls["mongoQuery"].setValidators([Validators.required]);
      this.customWidgetForm.get("mongoQuery").updateValueAndValidity();
      this.customWidgetForm.controls["collectionName"].setValidators([Validators.required]);
      this.customWidgetForm.get("collectionName").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].clearValidators();
      this.customWidgetForm.get("widgetQuery").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].clearValidators();
      this.customWidgetForm.get("procName").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].setValue("");
      this.customWidgetForm.controls["httpMethod"].clearValidators();
      this.customWidgetForm.get("httpMethod").updateValueAndValidity();
      this.customWidgetForm.controls["httpMethod"].setValue("");
      this.customWidgetForm.controls["apiUrl"].clearValidators();
      this.customWidgetForm.get("apiUrl").updateValueAndValidity();
      this.customWidgetForm.controls["apiUrl"].setValue("");
      this.stepsCount = 0;
      this.inputParamsCount = 0;
      this.inputHeadersCount = 0;
      this.procName = null;
      this.isProc = false;
      this.isApi = false;
      this.isMongoQuery = true;
      this.storedProcParams = [];
      this.initializeProcOutputForm();
      this.initializeInputParamsForm();
      this.initializeOutputParamsForm();
      this.initializeInputHeadersForm();
      this.initializeLegendForm();
      var heatMapIndex = this.visualizationTypes.findIndex((p) => p.value == 13)
      if (heatMapIndex > -1) {
        this.visualizationTypes.splice(heatMapIndex, 1);
      }
    } else if (type == 'proc') {
      this.customWidgetForm.controls["mongoQuery"].clearValidators();
      this.customWidgetForm.get("mongoQuery").updateValueAndValidity();
      this.customWidgetForm.controls["collectionName"].clearValidators();
      this.customWidgetForm.get("collectionName").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].setValidators([Validators.required]);
      this.customWidgetForm.get("procName").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].clearValidators();
      this.customWidgetForm.get("widgetQuery").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].setValue("");
      this.customWidgetForm.controls["httpMethod"].clearValidators();
      this.customWidgetForm.get("httpMethod").updateValueAndValidity();
      this.customWidgetForm.controls["httpMethod"].setValue("");
      this.customWidgetForm.controls["apiUrl"].clearValidators();
      this.customWidgetForm.get("apiUrl").updateValueAndValidity();
      this.customWidgetForm.controls["apiUrl"].setValue("");
      this.stepsCount = 0;
      this.inputParamsCount = 0;
      this.inputHeadersCount = 0;
      this.isProc = true;
      this.isApi = false;
      this.isMongoQuery = false;
      this.initializeProcOutputForm();
      this.initializeInputParamsForm();
      this.initializeOutputParamsForm();
      this.initializeInputHeadersForm();
      this.initializeLegendForm();
      var heatMapIndex = this.visualizationTypes.findIndex((p) => p.value == 13)
      if (heatMapIndex == -1) {
        this.visualizationTypes.push({ name: this.translateService.instant("APP.HEATMAP"), value: "13" });
      }
    } else if (type == 'api') {
      this.customWidgetForm.controls["mongoQuery"].clearValidators();
      this.customWidgetForm.get("mongoQuery").updateValueAndValidity();
      this.customWidgetForm.controls["collectionName"].clearValidators();
      this.customWidgetForm.get("collectionName").updateValueAndValidity();
      this.customWidgetForm.controls["httpMethod"].setValidators([Validators.required]);
      this.customWidgetForm.get("httpMethod").updateValueAndValidity();
      this.customWidgetForm.controls["apiUrl"].setValidators([Validators.required]);
      this.customWidgetForm.get("apiUrl").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].clearValidators();
      this.customWidgetForm.get("widgetQuery").updateValueAndValidity();
      this.customWidgetForm.controls["widgetQuery"].setValue("");
      this.customWidgetForm.controls["procName"].clearValidators();
      this.customWidgetForm.get("procName").updateValueAndValidity();
      this.customWidgetForm.controls["procName"].setValue("");
      this.customWidgetForm.controls["bodyJson"].setValue("");
      this.customWidgetForm.controls["outputRoot"].setValue("");
      this.stepsCount = 0;
      this.inputParamsCount = 0;
      this.inputHeadersCount = 0;
      this.procName = null;
      this.isProc = false;
      this.isBodyVisible = false;
      this.isApi = true;
      this.isMongoQuery = false;
      this.storedProcParams = [];
      this.initializeProcOutputForm();
      this.initializeInputParamsForm();
      this.initializeOutputParamsForm();
      this.initializeInputHeadersForm();
      this.initializeLegendForm();
      this.basicHeaders();
      var heatMapIndex = this.visualizationTypes.findIndex((p) => p.value == 13)
      if (heatMapIndex > -1) {
        this.visualizationTypes.splice(heatMapIndex, 1);
      }
    }
    this.cdRef.detectChanges();
  }

  onHttpMethodChange(method) {
    this.isBodyVisible = (method == "GET") ? false : true;
  }

  getCustomwidgetData() {
    if (this.dataOptionValue == 'widgetQuery') {
      this.apiOrQuery = 'widgetQuery';
      this.navigatetoColumnDetails(true);
    } else if (this.dataOptionValue == 'mongoQuery') {
      this.apiOrQuery = 'mongoQuery';
      this.navigatetoColumnDetails(true);
    } else if (this.dataOptionValue == 'proc') {
      this.apiOrQuery = 'proc'
      this.selectedTabIndex = 3;
      if (this.customWidgetId)
        this.bindDataForApi();
      this.getparamsData();
    } else if (this.dataOptionValue == 'api') {
      this.apiOrQuery = 'api';
      if (this.customWidgetId)
        this.bindDataForApi();
      if (this.apiOutputParams)
        this.outputParamsCount = this.apiOutputParams.controls.length;
      if (this.outputParamsCount > 0) {
        this.apiOutputData = this.addOutputParamsForm.value;
      }
      if (this.outputParamsCount == 0) {
        this.toaster.warning(this.translateService.instant('APIAPP.NOOUTPUTSADDED'))
      }
      this.getApiData();
    }
  }

  getApiData() {
    this.isAnyOperationIsInprogress = true;
    this.apiInputModel = new ApiInputDetailsModel();
    this.apiInputModel.apiUrl = this.customWidgetForm.get('apiUrl').value;
    this.apiInputModel.httpMethod = this.customWidgetForm.get('httpMethod').value;
    this.apiInputModel.bodyJson = this.customWidgetForm.get('bodyJson').value;
    this.apiInputModel.outputRoot = this.customWidgetForm.get('outputRoot').value;
    this.apiInputModel.apiHeaders = [];
    if (this.apiHeaderParams)
      this.inputHeadersCount = this.apiHeaderParams.controls.length;
    if (this.inputHeadersCount > 0) {
      this.apiInputModel.apiHeaders = this.addInputHeadersForm.get('apiHeaderParams').value;
    }
    this.widgetService.GetApiData(this.apiInputModel).subscribe((result: any) => {
      if (result.success == true) {
        this.selectedTabIndex = 3;
      } else {
        var validationMessage = result.apiResponseMessages[0].message;
        this.toasterService.error(validationMessage);
      }
      this.isAnyOperationIsInprogress = false;
    });
  }

  getApiDetails() {
    let apiModel = new ApiInputDetailsModel();
    apiModel.customWidgetId = this.customWidgetId;
    this.widgetService.GetCustomAppApiData(apiModel).subscribe((response: any) => {
      if (response.success) {
        this.customWidgetForm.controls["apiUrl"].setValue(response.data.apiUrl.trim());
        this.customWidgetForm.controls["httpMethod"].setValue(response.data.httpMethod);
        this.onHttpMethodChange(response.data.httpMethod);
        this.customWidgetForm.controls["bodyJson"].setValue(response.data.bodyJson);
        this.customWidgetForm.controls["outputRoot"].setValue(response.data.outputRoot);
        this.urlValueChange();
        const headers = response.data.apiHeaders;
        this.initializeInputHeadersForm();
        this.apiHeaderParams = this.addInputHeadersForm.get('apiHeaderParams') as FormArray;
        let index = 0;
        if (headers && headers.length > 0) {
          headers.forEach(header => {
            this.apiHeaderParams.insert(index, this.createbasicheader(header.key, header.value));
            this.inputHeadersCount = this.apiHeaderParams.controls.length;
            index = index + 1;
          });
        } else {
          this.basicHeaders();
        }
        const outputs = response.data.outputParams;
        this.initializeOutputParamsForm();
        this.apiOutputParams = this.addOutputParamsForm.get('apiOutputParams') as FormArray;
        index = 0;
        if (outputs && outputs.length > 0) {
          outputs.forEach(output => {
            this.apiOutputParams.insert(index, this.createbasicoutputs(output.field, output.filter));
            this.outputParamsCount = this.apiOutputParams.controls.length;
            index = index + 1;
          });
        }
      }
    });
  }

  getparamsData() {
    this.procName = this.customWidgetForm.get('procName').value;
    var obj = {};
    let dataTypesArray = ["uniqueidentifier", "char", "datetime", "nvarchar", "time"]
    this.storedProcParams.forEach(element => {
      if (!dataTypesArray.includes(element.dataType.toLowerCase())) {
        let errorType = Number(element.inputData);
        if (errorType === NaN && element.type === "boolean") {
          obj[element.parameterName] = false;
        }
        obj[element.parameterName] = Number(element.inputData);
      } else {
        obj[element.parameterName] = element.inputData ? element.inputData.length > 0 ? element.inputData : null : null;
      }
    });
    obj["SpName"] = this.procName;
    obj["isForFilters"] = "true";
    this.paramsData = obj;
  }


  getapiparamsData() {
    this.procName = this.customWidgetForm.get('procName').value;
    var obj = {};
    let dataTypesArray = ["uniqueidentifier", "char", "datetime", "nvarchar", "time"]
    this.storedProcParams.forEach(element => {
      if (!dataTypesArray.includes(element.dataType.toLowerCase())) {
        let errorType = Number(element.inputData);
        if (errorType === NaN && element.type === "boolean") {
          obj[element.parameterName] = false;
        }
        obj[element.parameterName] = Number(element.inputData);
      } else {
        obj[element.parameterName] = element.inputData ? element.inputData.length > 0 ? element.inputData : null : null;
      }
    });
    obj["SpName"] = this.procName;
    obj["isForFilters"] = "true";
    this.paramsData = obj;
  }

  saveProcOutputDetails() {
    this.saveProcDetails = true;
    if (this.procOutputs)
      this.stepsCount = this.procOutputs.controls.length;
    if (this.stepsCount > 0) {
      this.outputData = this.addProcOutputForm.value;
    }
    if (this.legends) {
      this.legendStepsCount = this.legends.controls.length;
    }
    if (this.legendStepsCount) {
      this.legendsData = this.legendForm.value;
    }
  }

  saveMessage() {
    this.snackbar.open("Inputs and outputs saved successfully",
      this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  bindDataForApi() {
    this.allChartsDetails.forEach(element => {
      element.gridData.customWidgetQuery = this.customWidgetForm.get("procName").value;
    });
    this.visualizationDetailsForm.patchValue(this.allChartsDetails[0].gridData);
    const selectedChartType = this.setVisualizatonTypeValue(this.allChartsDetails[0].gridData.visualizationType);
    this.visualizationDetailsForm.get("selectedvisualizationType").setValue(selectedChartType.toString());
    if (this.allChartsDetails[0].gridData.visualizationType == 'Heat map') {
      let heatMapData = JSON.parse(this.allChartsDetails[0].gridData.heatMapMeasure);
      this.legends = this.legendForm.get('legends') as FormArray;
      if (this.legends.controls) {
        for (let j = 0; j < this.legends.controls.length; j++) {
          this.legends.removeAt(0);
        }
      }
      this.legends.removeAt(0);
      if (heatMapData && heatMapData.legend) {
        this.legends = this.legendForm.get('legends') as FormArray;
        heatMapData.legend.forEach(x => {
          this.legends.push(this.formBuilder.group({
            legendName: x.legendName,
            value: x.value,
            legendColor: x.legendColor
          }))
        })
      }
      if (this.legends) {
        this.legendStepsCount = this.legends.controls.length;
      }
      else {
        this.legendStepsCount = 0;
      }
      if (heatMapData) {
        this.visualizationDetailsForm.get("cellSize").setValue(heatMapData.cellSize);
        this.visualizationDetailsForm.get("showDataInCell").setValue(heatMapData.showDataInCell);
      }
      this.visualizationDetailsForm.get("date").setValue(this.allChartsDetails[0].gridData.xCoOrdinate);
      this.visualizationDetailsForm.get("value").setValue(this.allChartsDetails[0].gridData.yCoOrdinate.toString());
    } else {
      this.visualizationDetailsForm.get("xAxisColumnName").setValue(this.allChartsDetails[0].gridData.xCoOrdinate);
      if (this.allChartsDetails[0].gridData.yCoOrdinate && this.allChartsDetails[0].gridData.yCoOrdinate.length > 0) {
        this.yCoOrdinate = this.allChartsDetails[0].gridData.yCoOrdinate;
        const visualization = this.allChartsDetails[0].gridData.visualizationType;
        if (visualization == "kpi" || visualization == "lineargauge" || visualization == "radialgauge" ||
          visualization == "arcgauge" || visualization == "gauge") {
          // tslint:disable-next-line: max-line-length
          this.visualizationDetailsForm.get("kpiSelectedData").setValue(this.allChartsDetails[0].gridData.yCoOrdinate.toString());
          if (visualization != "kpi") {
            const value = visualization == "lineargauge" ? 0 : visualization == "radialgauge" ? 1 : 2;
            this.visualizationDetailsForm.get("gaugeChartType").setValue(value);
          }
        } else {
          // tslint:disable-next-line: max-line-length
          this.visualizationDetailsForm.get("yAxisColumnName").setValue(this.allChartsDetails[0].gridData.yCoOrdinate);
          this.yCoOrdinate = this.allChartsDetails[0].gridData.yCoOrdinate;
        }
      } else if (this.allChartsDetails[0].gridData.visualizationType == 'box chart') {
        this.visualizationDetailsForm.get("categoryName").setValue(this.allChartsDetails[0].gridData.xCoOrdinate);
      }
    }
    this.visualizationTypeChange(selectedChartType);
  }

  fetchParameters() {
    let inputs = { SpName: "USP_GetStoredProcedureParameters", storedProcedureName: this.customWidgetForm.get('procName').value, isForFilters: "false" };
    this.isFetchOperationIsInprogress = true;
    this.masterDataManagementService.getGenericApiData(inputs).subscribe((response: any) => {
      if (response.success === true) {
        this.storedProcParams = response.data;
        this.saveFetchDetails = true;
        this.filterInputParameters(this.storedProcParams);
      }
      else {
        this.toaster.error(response.apiResponseMessages[0].message);
      }
      this.isFetchOperationIsInprogress = false;
    });
  }

  filterInputParameters(inputs) {
    inputs.forEach(data => {
      if (data.dataType.toLowerCase() === "bit" || data.dataType.toLowerCase() === "boolean") {
        data.type = "boolean";
      } else if (data.dataType.toLowerCase() === "datetime" || data.dataType.toLowerCase() === "time") {
        data.type = "date";
      }
      else {
        data.type = "text"
      }
    });
  }

  initializeProcOutputForm() {
    this.addProcOutputForm = new FormGroup({
      procOutputs: this.formBuilder.array([])
    });
  }



  inputParamsChange() {
    let changes = this.addInputParamsForm.get('apiInputParams').value;
    var paramString = "";
    if (changes && changes.length > 0 && (changes[0].key != "" || changes[0].value != "")) {
      var paramString = "?";
      changes.forEach(change => {
        if (change.key != "" || change.value != "") {
          if (paramString.length > 1) paramString = paramString + "&";
          if (change.key) paramString = paramString + change.key;
          if (change.value) paramString = paramString + "=" + change.value;
        }
      });
    }
    var url = this.customWidgetForm.get('apiUrl').value;
    if (url != null && url != "" && url.includes('?')) {
      url = url.split('?')[0];
    }
    this.customWidgetForm.get('apiUrl').setValue(url + paramString);
  }

  urlValueChange() {
    var url = this.customWidgetForm.get('apiUrl').value;
    let params = "";
    if (url != null && url != "" && url.includes('?')) {
      params = url.split('?')[1];
    }
    this.initializeInputParamsForm();
    this.addInputParamsForm.controls["apiInputParams"].setValue([]);
    this.apiInputParams = this.formBuilder.array([]);
    this.cdRef.detectChanges();
    if (params != "") {
      const index = -1;
      params.split('&').forEach((pair) => {
        var key = pair.split('=') ? pair.split('=')[0] : "";
        var value = pair.split('=') ? pair.split('=')[1] : "";
        if (key != "" || value != "") {
          const formGroup = this.formBuilder.group({
            key: new FormControl(key, Validators.compose([Validators.required])),
            value: new FormControl(value, Validators.compose([Validators.required]))
          });
          this.apiInputParams = this.addInputParamsForm.get('apiInputParams') as FormArray;
          this.apiInputParams.insert(index + 1, formGroup);
        }
      })
    }
    this.inputParamsCount = this.apiInputParams.controls.length;
  }

  initializeInputParamsForm() {
    this.addInputParamsForm = new FormGroup({
      apiInputParams: this.formBuilder.array([])
    });
  }

  initializeOutputParamsForm() {
    this.addOutputParamsForm = new FormGroup({
      apiOutputParams: this.formBuilder.array([])
    });
  }

  initializeInputHeadersForm() {
    this.addInputHeadersForm = new FormGroup({
      apiHeaderParams: this.formBuilder.array([])
    });
  }

  initializeLegendForm() {
    this.legendForm = new FormGroup({
      legends: this.formBuilder.array([])
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      field: new FormControl('', Validators.compose([Validators.required])),
      filter: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  createLegendItem(): FormGroup {
    return this.formBuilder.group({
      legendName: new FormControl('', Validators.compose([Validators.required])),
      value: new FormControl('', Validators.compose([Validators.required])),
      legendColor: new FormControl('', Validators.compose([]))
    });
  }

  createVisualisationItem(item): FormGroup {
    return this.formBuilder.group({
      yAxisColumnName: new FormControl(item, Validators.compose([Validators.required])),
      selectedColor: new FormControl('', Validators.compose([]))
    });
  }



  createApiInputItem(): FormGroup {
    return this.formBuilder.group({
      key: new FormControl('', Validators.compose([])),
      value: new FormControl('', Validators.compose([]))
    });
  }

  createApiOutputItem(): FormGroup {
    return this.formBuilder.group({
      field: new FormControl('', Validators.compose([Validators.required])),
      filter: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  addItem(index): void {
    this.procOutputs = this.addProcOutputForm.get('procOutputs') as FormArray;
    this.procOutputs.insert(index + 1, this.createItem());
    this.stepsCount = this.procOutputs.controls.length;
    this.filterColumnDataForAxis(null);
  }

  basicHeaders() {
    this.apiHeaderParams = this.addInputHeadersForm.get('apiHeaderParams') as FormArray;
    this.apiHeaderParams.insert(0, this.createbasicheader("Content-Type", "application/json"));
    this.apiHeaderParams.insert(1, this.createbasicheader("Cache-Control", "no-cache"));
    this.inputHeadersCount = this.apiHeaderParams.controls.length;
  }

  createbasicheader(key: any, value: any): FormGroup {
    return this.formBuilder.group({
      key: new FormControl(key, Validators.compose([])),
      value: new FormControl(value, Validators.compose([]))
    });
  }

  createbasicoutputs(field: any, filter: any): FormGroup {
    return this.formBuilder.group({
      field: new FormControl(field, Validators.compose([])),
      filter: new FormControl(filter, Validators.compose([]))
    });
  }

  addApiInputItem(index): void {
    this.apiInputParams = this.addInputParamsForm.get('apiInputParams') as FormArray;
    this.apiInputParams.insert(index + 1, this.createApiInputItem());
    this.inputParamsCount = this.apiInputParams.controls.length;
    this.filterColumnDataForAxis(null);
  }

  addApiOutputItem(index): void {
    this.apiOutputParams = this.addOutputParamsForm.get('apiOutputParams') as FormArray;
    this.apiOutputParams.insert(index + 1, this.createApiOutputItem());
    this.outputParamsCount = this.apiOutputParams.controls.length;
    this.filterColumnDataForAxis(null);
  }

  addApiHeaderItem(index): void {
    this.apiHeaderParams = this.addInputHeadersForm.get('apiHeaderParams') as FormArray;
    this.apiHeaderParams.insert(index + 1, this.createApiInputItem());
    this.inputHeadersCount = this.apiHeaderParams.controls.length;
    this.filterColumnDataForAxis(null);
  }

  addLegendItem(index): void {
    this.legends = this.legendForm.get('legends') as FormArray;
    this.legends.insert(index + 1, this.createLegendItem());
    this.legendStepsCount = this.legends.controls.length;
    this.filterColumnDataForAxis(null);
  }

  addVisualisationItem() {
    this.visualisationColorList = this.visualisationColorForm.get('visualisationColorList') as FormArray;
    let yAxisColumnsList = this.yCoOrdinate;
    yAxisColumnsList.forEach((insert, index) => {
      this.visualisationColorList.insert(index, this.createVisualisationItem(insert));
    })

  }

  removeItemAtIndex(removableIndex) {
    this.procOutputs.removeAt(removableIndex);
    this.stepsCount = this.procOutputs.controls.length;
  }

  removeApiInputParamAtIndex(removableIndex) {
    this.apiInputParams.removeAt(removableIndex);
    this.inputParamsCount = this.apiInputParams.controls.length;
  }

  removeApiOutputParamAtIndex(removableIndex) {
    this.apiOutputParams.removeAt(removableIndex);
    this.outputParamsCount = this.apiOutputParams.controls.length;
  }

  removeApiInputHeaderAtIndex(removableIndex) {
    this.apiHeaderParams.removeAt(removableIndex);
    this.inputHeadersCount = this.apiHeaderParams.controls.length;
  }

  removeLegendItemAtIndex(removableIndex) {
    this.legends.removeAt(removableIndex);
    this.legendStepsCount = this.legends.controls.length;
  }

  initializeAddMeasurerForm() {
    this.addMeasurerForm = new FormGroup({
      measurerField: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      measurerName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ),
      aggregateFunction: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    });

  }

  initializeVisualizationDetailsForm() {
    this.visualizationDetailsForm = new FormGroup({
      selectedvisualizationType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      visualizationName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ),
      xAxisColumnName: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      yAxisColumnName: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      isDefault: new FormControl(null, []),
      kpiSelectedData: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      gaugeChartType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      date: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      value: new FormControl(null,
        Validators.compose([
          Validators.required,
        ])
      ),
      showDataInCell: new FormControl(null, []),
      cellSize: new FormControl(null,
        Validators.compose([
          Validators.min(20)
        ])
      ),
      categoryName: new FormControl(null, []),
    })
  }

  schedulerForm() {
    this.emailField = null;
    this.webUrlField = null;
    this.scheduleForm = new FormGroup({
      cronExpressionName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      charts: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      templateType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      email: new FormControl(null, []
      ),
      webUrl: new FormControl(null, []
      ),
    })
  }

  clearVisualisationColorForm() {
    this.visualisationColorForm = new FormGroup({
      visualisationColorList: this.formBuilder.array([])
    })
  }

  clearForm() {
    this.customWidgetForm = new FormGroup({
      customWidgetName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.maxLength(1000)
        ])),
      selectedRoles: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      selectedModules: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),

      widgetQuery: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      mongoQuery: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      collectionName: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      dataOption: new FormControl(this.dataOptionValue,
        Validators.compose([
          Validators.required
        ])
      ),
      procName: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      apiUrl: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      httpMethod: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      bodyJson: new FormControl(null,
        Validators.compose([])
      ),
      outputRoot: new FormControl(null,
        Validators.compose([])
      )
    });
  }

  setVisualizatonTypeValue(visualizationType: string) {
    // tslint:disable-next-line: max-line-length
    visualizationType = (visualizationType === "lineargauge" || visualizationType === "radialgauge" || visualizationType === "arcgauge") ? "gauge" : visualizationType;
    let visualizationTypeValue;
    visualizationTypeValue = visualizationType === "table" ? 0 : visualizationType === "area" ? 1 :
      visualizationType === "line" ? 2 : visualizationType === "bar" ? 3 : visualizationType === "pie"
        ? 4 : visualizationType === "column" ? 5 : visualizationType === "stackedarea" ? 6 : visualizationType === "stackedbar" ? 7
          : visualizationType === "stackedcolumn" ? 8 : visualizationType === "donut" ? 9 : visualizationType === "kpi" ? 10
            : visualizationType === "gauge" ? 11 : visualizationType === "pivot" ? 12 : visualizationType === "Heat map" ? 13 : visualizationType === "box chart" ? 14 : null;
    return visualizationTypeValue;
  }

  editWidget() {
    this.initializeProcOutputForm();
    this.initializeInputParamsForm();
    this.initializeOutputParamsForm();
    this.initializeLegendForm();
    this.isAnyOperationIsInprogress = true;
    const customWidgetModel = new CustomWidgetsModel();
    customWidgetModel.isArchived = this.isArchived;
    customWidgetModel.customWidgetId = this.customWidgetId;
    this.masterDataManagementService.getCustomWidgets(customWidgetModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isAnyOperationIsInprogress = false;
        this.customWidgetData = response.data[0];
        if (this.customWidgetData.isMongoQuery == true) {
          this.customWidgetData.mongoQuery = this.customWidgetData.widgetQuery;
        }
        this.collectionName = this.customWidgetData.collectionName;
        this.customWidgetForm.patchValue(this.customWidgetData);
        // this.subQueryForm.patchValue({
        //     'typeOfQuery': this.customWidgetData.subQueryType,
        //     'query': this.customWidgetData.subQuery
        // });
        this.dataOptionValue = this.customWidgetData.isProc ? 'proc' : this.customWidgetData.isApi ? 'api' : this.customWidgetData.isMongoQuery ? 'mongoQuery' : 'widgetQuery';
        if (this.dataOptionValue == 'proc') {
          let type = 'proc'
          this.apiValidations(type);
          this.isProc = true;
          this.isApi = false;
          this.getProcDetails();
          this.getparamsData();
        } else if (this.dataOptionValue == 'api') {
          let type = 'api'
          this.apiValidations(type);
          this.isProc = false;
          this.isApi = true;
          this.getApiDetails();
        } else if (this.dataOptionValue == 'mongoQuery') {
          let type = 'mongoQuery'
          this.apiValidations(type);
          this.isProc = false;
          this.isApi = false;
          this.isMongoQuery = true;
        }
        else {
          let type = 'widgetQuery'
          this.apiValidations(type);
          this.isProc = false;
          this.isApi = false;
        }
        this.customProcWidgetTimeStamp = response.data[0].customProcWidgetTimeStamp;
        this.customStoredProcId = response.data[0].customStoredProcId;
        // tslint:disable-next-line: max-line-length
        const selectedAppChartsDetails = response.data[0].allChartsDetails;
        if (selectedAppChartsDetails && selectedAppChartsDetails.length > 0) {
          selectedAppChartsDetails.forEach((element) => {
            const selectedChartDetail = new CustomChartTypeModel();
            this.gridData = {
              // tslint:disable-next-line: triple-equals
              filterQuery: element.filterQuery == "'null'" ? null : this.queryBuilderOutput,
              customWidgetId: element.customWidgetId,
              customWidgetQuery: element.customWidgetQuery,
              persistanceId: (element.customApplicationChartId && element.customApplicationChartId !== undefined) ?
                element.customApplicationChartId : null,
              isUserLevel: false,
              emptyWidget: (element.customApplicationChartId && element.customApplicationChartId !== undefined) ?
                false : true,
              xCoOrdinate: element.xCoOrdinate,
              yCoOrdinate: element.yAxisDetails != null ? element.yAxisDetails.split(",") : null,
              visualizationType: element.visualizationType,
              chartNumber: this.chartSeries,
              visualizationName: element.visualizationName,
              isDefault: element.isDefault,
              customApplicationChartId: element.customApplicationChartId,
              isProc: this.isProc,
              isApi: this.isApi,
              isMongoQuery: this.isMongoQuery,
              customStoredProcId: this.customStoredProcId,
              uniqueChartNumber: this.uniqueChartNumber,
              dashboardFilters: this.dashboardFilters,
              heatMapMeasure: element.heatMapMeasure,
              pivotMeasurersToDisplay: element.pivotMeasurersToDisplay ?
                JSON.parse(element.pivotMeasurersToDisplay) : new Array(),
              visualisationColors: element.chartColorJson ?
                JSON.parse(element.chartColorJson) : new Array(),
              chartColorJson: element.chartColorJson
            };
            selectedChartDetail.gridData = this.gridData;
            this.chartSeries = this.chartSeries + 1;
            this.allChartsDetails.push(selectedChartDetail);
            this.uniqueChartNumber = this.uniqueChartNumber + 1;
            if (selectedChartDetail.gridData.visualizationType === "kpi") {
              this.kpiChartLength = this.kpiChartLength + 1;
            }
          });
        }
        this.bindDefaultChartDetails(response.data[0]);
      } else {
        this.toaster.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  bindDefaultChartDetails(firstVisualizationDetails) {
    this.defaultCustomChart = firstVisualizationDetails.allChartsDetails.find((x) => x.isDefault);
    this.isNewCustomChart = false;
    const selectedVisualization = this.setVisualizatonTypeValue(this.defaultCustomChart.visualizationType);
    this.isChartTypeVisualization = (selectedVisualization === 0 || selectedVisualization === 12 ? false : true);
    this.originalQuery = firstVisualizationDetails.widgetQuery;
    this.chartType = firstVisualizationDetails.visualizationType;
    this.selectedChartIndex = this.defaultCustomChart;
    this.customWidgetForm.get("selectedRoles").patchValue([]);
    if (firstVisualizationDetails.roleIds != null) {
      const roleIds = firstVisualizationDetails.roleIds.split(",");
      this.customWidgetForm.get("selectedRoles").patchValue(roleIds);
    }
    this.bindColumnChart(this.selectedChartIndex);

    this.customWidgetForm.get("selectedModules").patchValue([]);
    if (firstVisualizationDetails.moduleIds != null) {
      const moduleIds = firstVisualizationDetails.moduleIds.split(",");
      this.customWidgetForm.get("selectedModules").patchValue(moduleIds);
    }
    this.cronExpression = firstVisualizationDetails.cronExpression;
    this.cdRef.detectChanges();
    if (firstVisualizationDetails.templateType === "Email") {
      this.enableGmailField = true;
      this.emailField = firstVisualizationDetails.templateUrl;
      this.webUrlField = null;
    } else {
      this.enableWebHookField = true;
      this.webUrlField = firstVisualizationDetails.templateUrl;
      this.emailField = null;
    }


    firstVisualizationDetails.templateType === "Email" ? this.email.patchValue(firstVisualizationDetails.templateUrl) : null;
    firstVisualizationDetails.templateType === "Webhook" ? this.webUrl.patchValue(firstVisualizationDetails.templateUrl) : null;
    this.cronTimeStamp = firstVisualizationDetails.timeStamp;
    this.jobId = firstVisualizationDetails.jobId;
    this.isAnyOperationIsInprogress = false;
    firstVisualizationDetails.cronExpression == null ? this.cronExpression = "0/1 * 1/1 * ?" :
      this.cronExpressionId = firstVisualizationDetails.cronExpressionId;
    this.scheduleForm.patchValue(firstVisualizationDetails);
  }

  getProcDetails() {
    let procInputAndOutput = new ProcInputAndOutputModel();
    procInputAndOutput.customWidgetId = this.customWidgetId;
    this.masterDataManagementService.getCustomWidgetProcDetails(procInputAndOutput).subscribe((response: any) => {
      if (response.success) {
        this.saveFetchDetails = true;
        this.storedProcParams = response.data.inputs;
        this.filterInputParameters(this.storedProcParams);
        if (response.data.outputs && response.data.outputs.length > 0) {
          this.procOutputsData = response.data.outputs;
          this.filterColumnDataForAxis(this.procOutputsData);
          this.procOutputs = this.addProcOutputForm.get('procOutputs') as FormArray;
          response.data.outputs.forEach(x => {
            this.procOutputs.push(this.formBuilder.group({
              field: x.field,
              filter: x.filter
            }))
          })
          this.saveProcOutputDetails();
        }
        if (response.data.legends && response.data.legends.length > 0) {
          this.legendsData = response.data.legends;
          this.legends = this.legendForm.get('legends') as FormArray;
          response.data.legends.forEach(x => {
            this.legends.push(this.formBuilder.group({
              legendName: x.legendName,
              value: x.value,
              legendColor: x.legendColor
            }))
          })
          this.saveProcOutputDetails();
        }
      }
    });
  }

  navigatetocustomwidgets(isReloadRequired) {
    this.selectCustomQuery = false;
    this.selectedItem = '';
    //this.customQuery.nativeElement.value = undefined;
    this.closeDialog.emit(isReloadRequired);
    // this.router.navigate(["/appmanagement/customapps"]);
  }

  navigatetoMainDetails() {
    this.selectedTabIndex = 0;
  }

  toggleRolesPerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.customWidgetForm.get("selectedRoles").value.length === this.rolesDropDown.length
    ) {
      this.allSelected.select();
    }
  }

  toggleAllRolesSelected() {
    if (this.allSelected.selected && this.rolesDropDown) {
      this.customWidgetForm.get("selectedRoles").patchValue([
        ...this.rolesDropDown.map((item) => item.roleId),
        0
      ]);
      this.selectedRoleIds = this.rolesDropDown.map((item) => item.roleId);
    } else {
      this.customWidgetForm.get("selectedRoles").patchValue([]);
    }
  }

  compareSelectedRolesFn(rolesList: any, selectedRoles: any) {
    if (rolesList === selectedRoles) {
      return true;
    } else {
      return false;
    }
  }

  toggleModulePerOne() {
    if (this.allModuleSelected.selected) {
      this.allModuleSelected.deselect();
      return false;
    }
    if (
      this.customWidgetForm.get("selectedModules").value.length === this.modulesDropDown.length
    ) {
      this.allModuleSelected.select();
    }
  }

  toggleAllModuleSelected() {
    if (this.allModuleSelected.selected && this.modulesDropDown) {
      this.customWidgetForm.get("selectedModules").patchValue([
        ...this.modulesDropDown.map((item) => item.moduleId),
        0
      ]);
      this.selectedModuleIds = this.modulesDropDown.map((item) => item.moduleId);
    } else {
      this.customWidgetForm.get("selectedModules").patchValue([]);
    }
  }

  compareSelectedModuleFn(rolesList: any, selectedModules: any) {
    if (rolesList === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  navigatetoColumnDetails(isFromMainDetails: boolean) {
    if (isFromMainDetails) {
      this.isValidationInProgress = true;
      if (this.customWidgetData) {
        // this.subQueryForm.patchValue({
        //     typeOfQuery: this.customWidgetData.subQueryType,
        //     query: this.customWidgetData.subQuery
        // });
        this.selectedItem = this.customWidgetData.subQueryType;
        this.customQueryString = this.customWidgetData.subQuery;
        this.selectedColumnFormatItem = this.customWidgetData.formatType;
        // this.subQueryForm.get('typeOfQuery').setValue(this.customWidgetData.subQueryType);
        // this.subQueryForm.get('query').setValue(this.customWidgetData.subQuery);
      }
      const customWidgetModel = new CustomWidgetsModel();
      customWidgetModel.customWidgetName = this.customWidgetForm.get("customWidgetName").value;
      customWidgetModel.description = this.customWidgetForm.get("description").value;
      customWidgetModel.selectedRoleIds = this.customWidgetForm.get("selectedRoles").value;
      customWidgetModel.widgetQuery = this.customWidgetForm.get("widgetQuery").value;
      if (this.isMongoQuery == true) {
        customWidgetModel.widgetQuery = this.customWidgetForm.get("mongoQuery").value;
      }
      customWidgetModel.collectionName = this.customWidgetForm.get("collectionName").value;

      customWidgetModel.isMongoQuery = this.isMongoQuery;
      if (this.originalQuery && this.originalQuery.trim() !== customWidgetModel.widgetQuery.trim()) {
        this.toaster.warning("As the query is modified,please redraw the charts with edited query data in order to get the custom apps properly.");
        this.allChartsDetails.forEach((element) => {
          element.gridData.xCoOrdinate = null;
          element.gridData.yCoOrdinate = null;
          element.gridData.yAxisDetails = null;
          element.gridData.pivotMeasurersToDisplay = [];
        });
      }
      customWidgetModel.customWidgetId = this.customWidgetId;
      this.masterDataManagementService.GetCustomWidgetValidator(customWidgetModel).subscribe((response: any) => {
        if (response.success === true) {
          this.queryOutput = response.data;
          if (this.allChartsDetails && this.allChartsDetails.length > 0) {
            this.allChartsDetails.forEach((element) => {
              element.columnsDetails = this.queryOutput;
              element.chartNumber = this.chartSeries + 1;
              element.yAxisColumnName = element.yAxisDetails ? element.yAxisDetails.split(",") : null;
              element.pivotMeasurersToDisplay = element.pivotMeasurersToDisplay ? element.pivotMeasurersToDisplay.length > 0 ?
                JSON.parse(element.pivotMeasurersToDisplay) : [] : [];
            });
          }
          if (this.queryOutput.headers && this.queryOutput.headers.length > 0) {
            this.queryOutput.headers.forEach((header) => {
              if (this.isEdit == false) {
                header.columnAltName = header.field;
              }
              if (header.filter != null && (header.filter.toLowerCase() === "uniqueidentifier" || header.filter.toLowerCase() === "timestamp")) {
                header.isAvailableForFiltering = false;
              } else {
                header.isAvailableForFiltering = true;
              }
            });

            this.queryOutput.headers.forEach((header) => {
              //datetime
              if (header.filter != null && (header.filter.toLowerCase() === "date" || header.filter.toLowerCase() === "datetime")) {
                header.columnFormatTypes = this.datetimeColumnFormatTypes;
              }
              //number
              else if (header.filter != null && (header.filter.toLowerCase() === "float" || header.filter.toLowerCase() === "nvarchar" || header.filter.toLowerCase() === "int"
                || header.filter.toLowerCase() === "decimal" || header.filter.toLowerCase() === "numeric" ||
                header.filter.toLowerCase() === "varchar" || header.filter.toLowerCase() === "char" ||
                header.filter.toLowerCase() === "bigint" || header.filter.toLowerCase() === "longint" || header.filter.toLowerCase() === "money")) {
                header.columnFormatTypes = this.numberColumnFormatTypes;

              }

            });
          }
          this.isAnyOperationIsInprogress = false;
          this.selectedTabIndex = 1;
        } else {
          this.toaster.error(response.apiResponseMessages[0].message);
          this.isAnyOperationIsInprogress = false;
        }
        this.isValidationInProgress = false;
      });
    } else {
      this.selectedTabIndex = 1;
    }
  }

  buildColumnFormatInputs(headers: CustomQueryHeadersModel[]) {
    let jsonHeadersObject = {};
    if (headers && headers.length > 0) {
      headers.forEach(item => jsonHeadersObject[item.field] = item.columnFormatTypeId);
      let jsonHeaders = JSON.stringify(jsonHeadersObject);
      this.columnformatQuery = jsonHeaders;
      return jsonHeaders;
    } else {
      return '';
    }

  }
  buildColumnAltNames(headers: CustomQueryHeadersModel[]) {
    let jsonHeadersObject = {};
    if (headers && headers.length > 0) {
      headers.forEach(item => jsonHeadersObject[item.field] = item.columnAltName);
      let jsonHeaders = JSON.stringify(jsonHeadersObject);
      this.columnAltName = jsonHeaders;
      return jsonHeaders;
    }
    else {
      return '';
    }
  }

  navigateToFilterDetails(isFromColumns, isPrevious) {
    if (isFromColumns) {
      // console.log(this.selectedItem, this.selectCustomQuery, this.customQueryString);
      this.filterQuery = null;
      this.columnformatQuery = null,
        this.columnAltName = null,
        this.queryBuilderOutput = null;
      this.previewGridColumns = [];
      const headers = this.queryOutput?.headers;
      this.columnformatQuery = this.buildColumnFormatInputs(headers);
      this.columnAltName = this.buildColumnAltNames(headers);
      this.cdRef.detectChanges();
      if (headers && headers.length > 0) {
        this.previewGridColumns.push(...headers);
      }


    } else {
      this.filterQuery = this.queryBuilderOutput;
    }
    if (this.isProc || this.isApi) {
      this.selectedTabIndex = 0;
    } else if (this.isMongoQuery) {
      this.getCustomTable(isPrevious);
    }
    else {
      this.selectedTabIndex = 2;
    }
  }

  builderOutput(value) {
    this.queryBuilderOutput = value === "'null" ? null : value;
  }

  getCustomTable(isPrevious) {
    const customQueryModel = new CustomQueryModel();
    if (this.isMongoQuery) {
      customQueryModel.dynamicQuery = this.customWidgetForm.get("mongoQuery").value;
      customQueryModel.isMongoQuery = true;
    }
    else {
      customQueryModel.dynamicQuery = this.customWidgetForm.get("widgetQuery").value;
    }
    customQueryModel.collectionName = this.customWidgetForm.get("collectionName").value;
    customQueryModel.filterQuery = this.queryBuilderOutput;
    customQueryModel.columnformatQuery = this.buildColumnFormatInputs(this.queryOutput.headers);
    customQueryModel.columnAltName = this.buildColumnAltNames(this.queryOutput.headers);
    if (this.selectedChartIndex) {
      customQueryModel.chartColorJson = this.selectedChartIndex.chartColorJson;
    }
    this.masterDataManagementService.GetCustomWidgetQueryResult(customQueryModel).subscribe((response: any) => {
      if (response.success === true) {
        this.queryOutputWithFilter = response.data;
        this.setDefaultForm();
        if (isPrevious == true) {
          this.selectedTabIndex = 1;
        } else {
          this.selectedTabIndex = 3;
        }

      } else {
        this.toaster.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }


  navigateToOverviewDetails() {
    if (this.isProc || this.isApi) {
      this.selectedTabIndex = 3;
    }
    else {
      const customQueryModel = new CustomQueryModel();
      if (this.isMongoQuery) {
        customQueryModel.dynamicQuery = this.customWidgetForm.get("mongoQuery").value;
        customQueryModel.isMongoQuery = true;
      }
      else {
        customQueryModel.dynamicQuery = this.customWidgetForm.get("widgetQuery").value;
      }
      customQueryModel.collectionName = this.customWidgetForm.get("collectionName").value;
      customQueryModel.filterQuery = this.queryBuilderOutput;
      customQueryModel.columnformatQuery = this.buildColumnFormatInputs(this.queryOutput.headers);
      customQueryModel.columnAltName = this.buildColumnAltNames(this.queryOutput.headers);
      this.masterDataManagementService.GetCustomWidgetQueryResult(customQueryModel).subscribe((response: any) => {
        if (response.success === true) {
          this.queryOutputWithFilter = response.data;
          this.setDefaultForm();
          if (this.isMongoQuery) {
            this.selectedTabIndex = 1;
          } else {
            this.selectedTabIndex = 3;
          }

        } else {
          this.toaster.error(response.apiResponseMessages[0].message);
          this.isAnyOperationIsInprogress = false;
        }
      });
    }
  }

  setDefaultForm() {
    if (this.allChartsDetails && this.allChartsDetails.length > 0) {
      this.allChartsDetails.forEach((element) => {
        if (this.isMongoQuery) {
          element.gridData.customWidgetQuery = this.customWidgetForm.get("mongoQuery").value;
        }
        else {
          element.gridData.customWidgetQuery = this.customWidgetForm.get("widgetQuery").value;
        }
        element.gridData.filterQuery = this.queryBuilderOutput;
        element.gridData.columnformatQuery = this.buildColumnFormatInputs(this.queryOutput.headers);
        element.gridData.columnAltName = this.buildColumnAltNames(this.queryOutput.headers);
      });

      const defaultChartDetails = this.allChartsDetails[0];
      this.visualizationDetailsForm.patchValue(defaultChartDetails.gridData);
      const selectedChartType = this.setVisualizatonTypeValue(defaultChartDetails.gridData.visualizationType);
      this.visualizationDetailsForm.get("selectedvisualizationType").setValue(selectedChartType.toString());
      this.visualizationDetailsForm.get("xAxisColumnName").setValue(defaultChartDetails.gridData.xCoOrdinate);
      this.visualizationDetailsForm.get("categoryName").setValue(defaultChartDetails.gridData.xCoOrdinate);
      this.yCoOrdinate = this.allChartsDetails[0].gridData.yCoOrdinate;
      if (defaultChartDetails.gridData.yCoOrdinate && defaultChartDetails.gridData.yCoOrdinate.length > 0) {
        this.yCoOrdinate = this.allChartsDetails[0].gridData.yCoOrdinate;
        const visualization = defaultChartDetails.gridData.visualizationType;
        this.bindDataForYAxis(visualization, defaultChartDetails.gridData.yCoOrdinate);
      }
      this.visualizationTypeChange(selectedChartType.toString());
      this.bindFormData(0);
    }
  }

  visualizationTypeChange(value) {
    this.isChartTypeVisualization = value == "0" || value == "12" ? false : true;
    this.chartType = (value == "0" ? "table" : value == "1" ? "area" : value == "2" ? "line" : value == "3" ?
      "bar" : value == "4" ? "pie" : value == "5" ? "column" : value == "6" ? "stackedarea" : value == "7" ?
        "stackedbar" : value == "8" ? "stackedcolumn" : value == "9" ? "donut" : value == "10" ? "kpi" : value == "11" ?
          "gauge" : value == "12" ? "pivot" : value == "13" ? "Heat map" : value == "14" ? "box chart" : null);

    if (this.chartType === "kpi" || this.chartType === "gauge") {
      this.visualizationDetailsForm.controls["kpiSelectedData"].setValidators([Validators.required]);
      this.visualizationDetailsForm.get("kpiSelectedData").updateValueAndValidity();
      if (this.chartType === "gauge") {
        this.visualizationDetailsForm.controls["gaugeChartType"].setValidators([Validators.required]);
        this.visualizationDetailsForm.get("gaugeChartType").updateValueAndValidity();
      } else {
        this.visualizationDetailsForm.controls["gaugeChartType"].clearValidators();
        this.visualizationDetailsForm.get("gaugeChartType").updateValueAndValidity();
      }
      this.clearValidators();
    } else if (this.chartType === "pivot" || this.isChartTypeVisualization) {
      this.clearKpiAndGaugeValidators();
      this.clearValidators();
    } else if (this.chartType == "box chart") {
      this.visualizationDetailsForm.controls["categoryName"].setValidators([Validators.required]);
      this.visualizationDetailsForm.get("categoryName").updateValueAndValidity();
    } else if (!this.isChartTypeVisualization) {
      this.clearValidators();
      this.clearKpiAndGaugeValidators();
    }
    if (this.chartType == 'Heat map') {
      this.clearValidators();
      this.clearKpiAndGaugeValidators();
      this.visualizationDetailsForm.controls["date"].setValidators([Validators.required]);
      this.visualizationDetailsForm.get("date").updateValueAndValidity();
      this.visualizationDetailsForm.controls["value"].setValidators([Validators.required]);
      this.visualizationDetailsForm.get("value").updateValueAndValidity();
      this.visualizationDetailsForm.controls["cellSize"].setValidators([Validators.min(20)]);
      this.visualizationDetailsForm.get("value").updateValueAndValidity();
    }
    if (this.apiOrQuery == 'widgetQuery' || this.apiOrQuery == 'mongoQuery') {
      this.filterColumnDataForAxis(this.queryOutputWithFilter?.headers);
    } else if (this.apiOrQuery == 'api') {
      this.filterColumnDataForAxis(null);
    }
    else {
      this.filterColumnDataForAxis(null);
    }
    this.visualizationDetailsForm.controls["isDefault"].clearValidators();
    this.visualizationDetailsForm.get("isDefault").updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  clearValidators() {
    this.visualizationDetailsForm.controls["xAxisColumnName"].clearValidators();
    this.visualizationDetailsForm.get("xAxisColumnName").updateValueAndValidity();
    this.visualizationDetailsForm.controls["yAxisColumnName"].clearValidators();
    this.visualizationDetailsForm.get("yAxisColumnName").updateValueAndValidity();
    this.visualizationDetailsForm.controls["date"].clearValidators();
    this.visualizationDetailsForm.get("date").updateValueAndValidity();
    this.visualizationDetailsForm.controls["value"].clearValidators();
    this.visualizationDetailsForm.get("value").updateValueAndValidity();
    this.visualizationDetailsForm.controls["cellSize"].clearValidators();
    this.visualizationDetailsForm.get("cellSize").updateValueAndValidity();
    this.visualizationDetailsForm.controls["categoryName"].clearValidators();
    this.visualizationDetailsForm.get("categoryName").updateValueAndValidity();
  }

  clearKpiAndGaugeValidators() {
    this.visualizationDetailsForm.controls["kpiSelectedData"].clearValidators();
    this.visualizationDetailsForm.get("kpiSelectedData").updateValueAndValidity();
    this.visualizationDetailsForm.controls["gaugeChartType"].clearValidators();
    this.visualizationDetailsForm.get("gaugeChartType").updateValueAndValidity();
    this.visualizationDetailsForm.controls["date"].clearValidators();
    this.visualizationDetailsForm.get("date").updateValueAndValidity();
    this.visualizationDetailsForm.controls["value"].clearValidators();
    this.visualizationDetailsForm.get("value").updateValueAndValidity();
  }

  filterColumnDataForAxis(columnsList: any) {
    this.xAxisColumnsList = [];
    this.yAxisColumnsList = [];
    if (this.apiOrQuery == 'proc' && this.outputData) {
      columnsList = this.outputData.procOutputs;
    }
    if (this.apiOrQuery == 'api' && this.apiOutputData) {
      columnsList = this.apiOutputData.apiOutputParams;
    }
    // else if (this.apiOrQuery == 'proc') {
    //     columnsList = this.procOutputsData;
    // }
    // this.xAxisColumnsList = columnsList.filter(((column) => (column.filter.toLowerCase().match(/(^|\W)datetime($|\W)/))
    //     || (column.filter.toLowerCase().indexOf("date") > -1)
    //     || (column.filter.toLowerCase().indexOf("time") > -1)
    //     || (column.filter.toLowerCase().indexOf("nvarchar") > -1)));

    // this.yAxisColumnsList = columnsList.filter(((column) => (column.filter.toLowerCase().indexOf("int") > -1)
    //     || (column.filter.toLowerCase().indexOf("float") > -1)
    //     || (column.filter.toLowerCase().indexOf("decimal") > -1)
    //     || (column.filter.toLowerCase().indexOf("nvarchar") > -1)
    //     || (column.filter.toLowerCase().indexOf("numeric") > -1)
    //     || (column.filter.toLowerCase().indexOf("time") > -1)
    //     || (column.filter.toLowerCase().indexOf("money") > -1)
    // ));

    if (this.chartType != 'Heat map' && columnsList) {
      columnsList.forEach(column => {
        if (column.filter && (column.filter.toLowerCase().match(/(^|\W)datetime($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)date($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)time($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)string($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)nvarchar($|\W)/))) {
          this.xAxisColumnsList.push(column);
          this.cdRef.detectChanges();
        }

        if (column.filter && (column.filter.toLowerCase().match(/(^|\W)int($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)float($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)decimal($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)nvarchar($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)string($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)numeric($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)time($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)money($|\W)/))) {
          this.yAxisColumnsList.push(column);
          this.cdRef.detectChanges();
        }
      });
    }

    if (this.chartType == 'Heat map' && columnsList) {
      columnsList.forEach(column => {
        if (column.filter && (column.filter.toLowerCase().match(/(^|\W)datetime($|\W)/)
          || column.filter.toLowerCase().match(/(^|\W)date($|\W)/))) {
          this.xAxisColumnsList.push(column);
          this.cdRef.detectChanges();
        }

        if (column.filter && (column.filter.toLowerCase().match(/(^|\W)int($|\W)/))) {
          this.yAxisColumnsList.push(column);
          this.cdRef.detectChanges();
        }
      });
    }

    if (this.chartType != 'Heat map' && (this.apiOrQuery == 'widgetQuery' || this.apiOrQuery == 'mongoQuery')) {
      this.totalTableColumns = JSON.parse(JSON.stringify(columnsList));
    }
  }

  createNewVisualizationType(addVisualizationPopup) {
    this.isNewCustomChart = true;
    this.currentEditableChartIndex = null;
    this.chartType = null;
    if (this.legends) {
      this.legends.controls.forEach((x, i) => {
        console.log(x);
        this.legends.removeAt(i);
      });
    }
    this.legendStepsCount = 0;
    this.initializeVisualizationDetailsForm();
    addVisualizationPopup.openPopover();
    this.visualizationTypeChange("0");
  }

  visualizationTabChange(event) {
    let clickedIndex: any;
    if (event.tab) {
      clickedIndex = event.index
      this.clickedIndex = clickedIndex;
      if (event.tab.textLabel === "+") {
        this.selectedvisualizationType = new FormControl(null, []);
        this.initializeVisualizationDetailsForm();
        this.isNewCustomChart = true;
      } else {
        this.isNewCustomChart = false;
      }
    } else if (event === "+") {
      this.selectedvisualizationType = new FormControl(null, []);
      this.initializeVisualizationDetailsForm();
      this.isNewCustomChart = true;
    } else {
      clickedIndex = event;
      this.isNewCustomChart = false;
    }
    this.clickedChartIndex = clickedIndex;
    this.selectedVisualizationTabIndex = clickedIndex;
    this.currentEditableChartIndex = clickedIndex;
    this.bindFormData(clickedIndex);
  }

  bindFormData(clickedIndex) {
    if (this.allChartsDetails && this.allChartsDetails.length > 0) {
      for (let i = 0; i < this.allChartsDetails.length; i++) {
        if (i === clickedIndex) {
          const selectedChart = this.allChartsDetails[i].gridData;
          this.selectedChartIndex = selectedChart;
          this.visualizationDetailsForm.patchValue(selectedChart);
          const selectedChartType = this.setVisualizatonTypeValue(selectedChart.visualizationType);
          if (selectedChart.visualizationType == 'area' || selectedChart.visualizationType == 'bar' || selectedChart.visualizationType == 'line' || selectedChart.visualizationType == 'column' || selectedChart.visualizationType == 'stackedbar' || selectedChart.visualizationType == 'stackedarea' || selectedChart.visualizationType == 'stackedcolumn') {
            this.bindColumnChart(selectedChart);
          }
          this.visualizationDetailsForm.get("selectedvisualizationType").setValue(selectedChartType.toString());
          if (selectedChart.visualizationType == 'Heat map') {
            //this.visualizationTypeChange(selectedChartType.toString());
            let heatMapData = JSON.parse(selectedChart.heatMapMeasure);
            this.legends = this.legendForm.get('legends') as FormArray;
            if (this.legends.controls) {
              for (let z = 0; z < this.legends.controls.length; z++) {
                this.legends.removeAt(0);
              }
            }
            this.legends.removeAt(0);
            if (heatMapData && heatMapData.legend) {
              this.legends = this.legendForm.get('legends') as FormArray;
              heatMapData.legend.forEach(x => {
                this.legends.push(this.formBuilder.group({
                  legendName: x.legendName,
                  value: x.value,
                  legendColor: x.legendColor
                }))
              })
            }
            if (this.legends) {
              this.legendStepsCount = this.legends.controls.length;
            } else {
              this.legendStepsCount = 0;
            }
           

            if (heatMapData) {
              this.visualizationDetailsForm.get("cellSize").setValue(heatMapData.cellSize);
              this.visualizationDetailsForm.get("showDataInCell").setValue(heatMapData.showDataInCell);
            }
            this.visualizationDetailsForm.get("date").setValue(selectedChart.xCoOrdinate);
            this.visualizationDetailsForm.get("value").setValue(selectedChart.yCoOrdinate.toString());
            this.chartType = selectedChart.visualizationType;
          } else {
            this.visualizationDetailsForm.get("xAxisColumnName").setValue(selectedChart.xCoOrdinate);

            this.visualizationTypeChange(selectedChartType.toString());
            this.chartType = selectedChart.visualizationType;
            if (selectedChart.yCoOrdinate && selectedChart.yCoOrdinate.length > 0) {
              this.bindDataForYAxis(selectedChart.visualizationType, selectedChart.yCoOrdinate);
            }
            if (selectedChart.pivotRowsToDisplay && selectedChart.pivotRowsToDisplay.length > 0) {
              this.visualizationDetailsForm.get("pivotRowsToDisplay").setValue(selectedChart.pivotRowsToDisplay);
            }
           
          }
        }
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
    }
  }

  opendeleteVisualizationTypePopover(deleteVisualizationTypePopover, chartsDetails) {
    this.selectedChartDetails = chartsDetails;
    deleteVisualizationTypePopover.openPopover();
  }

  deleteSelectedVisualizationType() {
    const selectedChartsDetails = this.selectedChartDetails;
    const selectedChartIndex = this.allChartsDetails.findIndex((x) =>
      x.gridData.chartNumber === selectedChartsDetails.gridData.chartNumber);
    this.allChartsDetails.splice(selectedChartIndex, 1);
    const index = this.bytes.findIndex((x) => x.uniqueChartNumber === selectedChartsDetails.gridData.uniqueChartNumber);
    // tslint:disable-next-line: no-unused-expression
    index > -1 ? this.bytes.splice(index, 1) : null;
    let chartNumber = 0;
    this.allChartsDetails.forEach((element) => {
      element.gridData.chartNumber = chartNumber;
      chartNumber = chartNumber + 1;
    });
    this.visualizationTabChange(selectedChartsDetails.gridData.chartNumber);
    if (selectedChartsDetails.gridData.visualizationType === "kpi") {
      if (this.kpiChartLength > 0) {
        this.kpiChartLength = this.kpiChartLength - 1;
        this.enableSchedulingButton = false;
      }
    }
  }

  closeDeleteVisualizationPopover() {
    this.deleteVisualizationTypePopover.forEach((p) => p.closePopover());
  }

  GaugeTypeSelected(event) {
    this.chartType = event.value === 0 ? "lineargauge" : event.value === 1 ? "radialgauge" : "arcgauge";
  }

  xAxisSelected(event) {
    this.xCoOrdinate = event.value;
  }

  yAxisSelected(event) {
    this.yCoOrdinate = event.value;
  }

  kpiSelectedData(event) {
    this.yCoOrdinate = event.value;
  }

  addMeasurerToList() {

    const measurer = this.addMeasurerForm.value;
    if (this.currentEditableChartIndex != null && this.allChartsDetails && this.allChartsDetails.length > 0) {
      this.allChartsDetails[this.currentEditableChartIndex].gridData.pivotMeasurersToDisplay.push(measurer);
    } else {
      this.selectedMeasurerList.push(measurer);
    }

    this.addMeasurerPopover.forEach((p) => p.closePopover());

  }

  removeMeasurer(measurer, currentMeasurerIndex) {

    if (currentMeasurerIndex != null && this.allChartsDetails && this.allChartsDetails.length > 0) {
      const measurerIndex: number =
        this.allChartsDetails[currentMeasurerIndex].gridData.pivotMeasurersToDisplay.findIndex((x) => _.isEqual(x, measurer));
      if (measurerIndex !== -1) {
        this.allChartsDetails[currentMeasurerIndex].gridData.pivotMeasurersToDisplay.splice(measurerIndex, 1);
      }
    } else {
      const index: number = this.selectedMeasurerList.findIndex(x => _.isEqual(x, measurer));
      if (index !== -1) {
        this.selectedMeasurerList.splice(index, 1);
      }
    }
  }

  closeMeasurerForm() {
    this.addMeasurerDirective.resetForm();
    this.selectedMeasurerList = [];
    this.addMeasurerPopover.forEach((p) => p.closePopover());
  }

  openAddMeasurerPopup(addMeasurerPopup, currentChartIndex) {
    this.initializeAddMeasurerForm();
    this.currentEditableChartIndex = currentChartIndex;
    addMeasurerPopup.openPopover();
  }

  checkIsDefaultExisted() {
    if (this.visualizationDetailsForm.get("isDefault").value) {
      if (this.allChartsDetails && this.allChartsDetails.length > 0) {
        const defaultVisualizationType = this.allChartsDetails.findIndex((x) => (x.gridData.isDefault === true));
        if (defaultVisualizationType > -1) {
          this.allChartsDetails[defaultVisualizationType].gridData.isDefault = null;
        }
      }
    }
  }

  closeVisualizationForm() {
    this.addFormgroupDirective.resetForm();
    this.addVisualizationPopover.forEach((p) => p.closePopover());
    this.bindFormData(this.clickedChartIndex);
  }

  drawChart(selectedChartNumber) {
    this.enableSchedulingButton = true;
    let previousVisualizationType = null;
    let uniqueChartNumber;
    const selectedChartDetail = new CustomChartTypeModel();
    let isValidated = true;
    if (this.allChartsDetails && this.allChartsDetails.length > 0) {
      if (this.isNewCustomChart) {
        this.allChartsDetails.forEach((element) => {
          // tslint:disable-next-line: max-line-length
          if (element.gridData.visualizationName.toLowerCase() === this.visualizationDetailsForm.get("visualizationName").value.toLowerCase()) {
            this.toaster.error("Visualization with this name already exists in this app.");
            isValidated = false;
            return;
          }
        });
        this.chartSeries = this.chartSeries + 1;
        this.uniqueChartNumber = this.uniqueChartNumber + 1;
      } else {
        var editedChart = this.allChartsDetails.findIndex((x) =>
          x.gridData.chartNumber === selectedChartNumber.gridData.chartNumber);
        isValidated = true;
      }
    }
    if (isValidated) {
      if (!this.isNewCustomChart) {
        uniqueChartNumber = this.allChartsDetails[editedChart].gridData.uniqueChartNumber;
        this.chartSeries = this.allChartsDetails[editedChart].gridData.chartNumber;
        previousVisualizationType = this.allChartsDetails[editedChart].gridData.visualizationType;
      }

      if (this.legendStepsCount) {
        this.legendsData = this.legendForm.value;
      } else {
        this.legendsData = null;
      }

      if (this.chartType === 'Heat map') {
        let heatMap = { legend: this.legendsData ? this.legendsData.legends : null, cellSize: this.visualizationDetailsForm.get('cellSize').value, showDataInCell: this.visualizationDetailsForm.get('showDataInCell').value, legendColor: this.legendsData ? this.legendsData.legendColor : null };
        this.heatMapJson = JSON.stringify(heatMap);
      }

      let query;

      if (this.isMongoQuery) {
        query = this.customWidgetForm.get("mongoQuery").value;
      } else {
        query = this.customWidgetForm.get("widgetQuery").value;
      }
      let colorJson;
      if(!this.isNewCustomChart) {
        let colors = this.visualisationColorForm.value.visualisationColorList;
        if (colors.length > 0) {
          colorJson = JSON.stringify(colors);
        } else {
          colorJson = this.allChartsDetails[editedChart].gridData.chartColorJson;
        }
      }

      this.gridData = {
        filterQuery: this.queryBuilderOutput === "'null'" ? null : this.queryBuilderOutput,
        columnformatQuery: this.queryOutput == undefined ? JSON.stringify([]) : this.buildColumnFormatInputs(this.queryOutput.headers),
        columnAltName: this.queryOutput == undefined ? JSON.stringify([]) : this.buildColumnAltNames(this.queryOutput.headers),
        customWidgetId: null,
        customWidgetQuery: query,
        persistanceId: (this.customWidgetId && this.customWidgetId !== undefined) ? this.customWidgetId : null,
        isUserLevel: false,
        emptyWidget: (this.customWidgetId && this.customWidgetId !== undefined) ? false : true,
        xCoOrdinate: this.chartType === 'Heat map' ? this.visualizationDetailsForm.get("date").value : this.chartType == 'box chart' ? this.visualizationDetailsForm.get("categoryName").value : this.visualizationDetailsForm.get("xAxisColumnName").value,
        yCoOrdinate: (this.chartType === "kpi" || this.chartType === "lineargauge" || this.chartType === "radialgauge" ||
          this.chartType === "arcgauge") ? this.visualizationDetailsForm.get("kpiSelectedData").value
          : this.chartType === 'Heat map' ? this.visualizationDetailsForm.get("value").value : this.visualizationDetailsForm.get("yAxisColumnName").value,
        visualizationType: this.chartType,
        chartNumber: this.chartSeries,
        visualizationName: this.visualizationDetailsForm.get("visualizationName").value,
        isDefault: this.visualizationDetailsForm.get("isDefault").value,
        isFromGridster: false,
        customApplicationChartId: this.allChartsDetails[editedChart] ?
          this.allChartsDetails[editedChart].gridData.customApplicationChartId : null,
        dashboardId: null,
        uniqueChartNumber: this.isNewCustomChart ? this.uniqueChartNumber : uniqueChartNumber,
        isProc: null,
        isApi: null,
        dashboardFilters: this.dashboardFilters,
        pivotMeasurersToDisplay: new Array(),
        heatMapMeasure: this.heatMapJson,
        chartColorJson: colorJson,
        visualisationColors: this.visualisationColorForm.value.visualisationColorList
      };

      if (this.isNewCustomChart) {
        this.gridData.pivotMeasurersToDisplay = (this.selectedMeasurerList && this.selectedMeasurerList.length > 0) ?
          this.selectedMeasurerList : new Array();
      } else {
        this.gridData.pivotMeasurersToDisplay =
          this.allChartsDetails[editedChart].gridData.pivotMeasurersToDisplay && this.allChartsDetails[editedChart].gridData.pivotMeasurersToDisplay.length > 0 ?
            this.allChartsDetails[editedChart].gridData.pivotMeasurersToDisplay : new Array();
      }
      selectedChartDetail.gridData = this.gridData;
      if (!this.isNewCustomChart) {
        this.allChartsDetails.splice(editedChart + 1, 0, selectedChartDetail);
        if (editedChart > -1) {
          this.allChartsDetails.splice(editedChart, 1);
        }
      } else {
        this.allChartsDetails.push(selectedChartDetail);
        this.addFormgroupDirective.resetForm();
        this.selectedMeasurerList = [];
        this.addVisualizationPopover.forEach((p) => p.closePopover());
        if (this.isNewCustomChart) {
          this.clickedChartIndex = this.allChartsDetails.length - 1;
          this.currentEditableChartIndex = this.allChartsDetails.length - 1;
          this.clickedIndex = this.allChartsDetails.length - 1;
          this.selectedVisualizationTabIndex = this.allChartsDetails.length - 1;
        }
        this.bindFormData(this.clickedChartIndex);
      }
      this.setKpiLength(selectedChartDetail, previousVisualizationType);
      this.isNewCustomChart = false;
    }
  }

  setKpiLength(selectedChartDetail, previousVisualizationType) {
    if (selectedChartDetail.gridData.visualizationType === "kpi") {
      if (selectedChartDetail.gridData.visualizationType === "kpi" && this.isNewCustomChart) {
        this.kpiChartLength = this.kpiChartLength + 1;
        this.enableSchedulingButton = false;
      } else if (!this.isNewCustomChart && selectedChartDetail.gridData.visualizationType === "kpi") {
        const index = this.bytes.findIndex((x) => x.uniqueChartNumber === this.uniqueChartNumber)
        if (index > -1) {
          this.bytes.splice(index, 1);
          this.kpiChartLength = this.kpiChartLength + 1;
        }
        this.enableSchedulingButton = false;
      }
    } else if (this.kpiChartLength > 0 && previousVisualizationType === "kpi") {
      this.kpiChartLength = this.kpiChartLength - 1;
      this.enableSchedulingButton = false;
    }
  }

  enableScheduling() {
    if (this.bytes.length === (this.allChartsDetails.length - this.kpiChartLength) && !this.enableSchedulingButton) {
      return false;
    } else {
      return true;
    }
  }

  enableFinish() {
    if (this.allChartsDetails && this.allChartsDetails.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  upsertWidget() {
    this.isUpsertInProgress = true;
    this.isAnyOperationIsInprogress = true;
    const queryModel = new CustomWidgetsModel();
    queryModel.customWidgetId = this.customWidgetId;
    // queryModel.subQuery = this.customQueryString;
    // queryModel.subQueryType = this.selectedItem;
    // queryModel.subQuery = this.subQueryForm.get('query').value;
    // queryModel.subQueryType = this.subQueryForm.get('typeOfQuery').value;
    this.widgetService.UpsertCustomWidgetSubQuery(queryModel).subscribe((res: any) => {
      res.success ? console.log(res) : this.toaster.error(res.apiResponseMessages[0].message);
    })
    const customWidgetModel = new CustomWidgetsModel();
    customWidgetModel.description = this.customWidgetForm.get("description").value;
    customWidgetModel.customWidgetName = this.customWidgetForm.get("customWidgetName").value;
    if (this.isMongoQuery) {
      customWidgetModel.widgetQuery = this.customWidgetForm.get("mongoQuery").value;
      customWidgetModel.isMongoQuery = true;
    } else {
      customWidgetModel.widgetQuery = this.customWidgetForm.get("widgetQuery").value;
    }
    customWidgetModel.collectionName = this.customWidgetForm.get("collectionName").value;
    customWidgetModel.filterQuery = this.queryBuilderOutput;
    customWidgetModel.customWidgetId = this.customWidgetId;
    customWidgetModel.defaultColumns = this.previewGridColumns;
    customWidgetModel.isProc = this.procName ? true : false;
    customWidgetModel.isApi = this.isApi ? true : false;
    customWidgetModel.procName = this.procName;
    customWidgetModel.cronExpressionName = this.scheduleForm.value.cronExpressionName;
    customWidgetModel.templateType = this.scheduleForm.value.templateType;
    customWidgetModel.selectedRoleIds = this.customWidgetForm.get("selectedRoles").value;
    customWidgetModel.moduleIds = this.customWidgetForm.get("selectedModules").value;
    const chartDetails = [];
    this.allChartsDetails.forEach(x => {
      const gridData = x.gridData;
      gridData.yAxisDetails = gridData.yCoOrdinate == null ? null : gridData.yCoOrdinate.toString();
      const value = x.gridData.pivotMeasurersToDisplay ? JSON.stringify(x.gridData.pivotMeasurersToDisplay) : null;
      gridData.pivotMeasurersToDisplay = value;
      chartDetails.push(gridData);
    });
    const defaultVisualizationType = chartDetails.findIndex((x) => x.isDefault === true);
    if (defaultVisualizationType <= -1) {
      chartDetails[0].isDefault = true;
    }
    customWidgetModel.chartsDetails = chartDetails;
    this.masterDataManagementService.upsertCustomWidget(customWidgetModel).subscribe((response: any) => {
      if (response.success === true) {
        this.widgetId = response.data;
        this.savePersistance(this.widgetId);
        if (this.apiOrQuery == 'proc') {
          this.upsertProcInputsAndOutputs(response.data);
        } else if (this.apiOrQuery == 'api') {
          this.upsertApiAppDetails(this.widgetId);
        }
        this.getWidget(response.data);
        const customTagsModel = new CustomTagModel();
        customTagsModel.referenceId = response.data;
        customTagsModel.tagsList = this.tagsList;
        this.customTagsService.upsertCustomTag(customTagsModel).subscribe((result: any) => {
          if (result.success === true) {
            this.isAnyOperationIsInprogress = false;
          } else {
            var validationMessage = result.apiResponseMessages[0].message;
            this.toasterService.error(validationMessage);
          }
        });
      } else {
        this.toaster.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  getTagsList(tags) {
    this.tagsList = JSON.parse(JSON.stringify(tags));;
    if (this.newTags && this.newTags.length == 0) {
      this.newTags = JSON.parse(JSON.stringify(tags));
    }
    if (this.checkTags(this.newTags, this.tagsList)) {
      this.newTags = tags;
    }
    else {
      this.tagsList = JSON.parse(JSON.stringify(this.newTags));
      this.inputTagsList = this.tagsList;
    }
  }

  setPersistance(event) {

    const persistanceJson = JSON.parse(event);
    const currentChartIndex = this.allChartsDetails.findIndex(x => x.gridData.chartNumber == persistanceJson.chartNumber);

    if (persistanceJson.chartType == "pivot") {
      this.allChartsDetails[currentChartIndex].gridData.persistanceJson = JSON.stringify(persistanceJson.pivotGridConfiguration);
    } else if (persistanceJson.chartType == "table") {
      this.allChartsDetails[currentChartIndex].gridData.persistanceJson = JSON.stringify(persistanceJson);
    }
    this.cdRef.detectChanges();
  }

  savePersistance(widgetId) {
    const persistance = new Persistance();
    persistance.referenceId = widgetId;
    persistance.isUserLevel = false;
    persistance.persistanceJson = this.persistanceJson;
    this.persistanceService.UpsertPersistance(persistance).subscribe((response: any) => {
      if (response.success) {
        this.persistanceJson = null;
        this.isUpsertInProgress = false;
        this.isAnyOperationIsInprogress = false;
        this.navigatetocustomwidgets(true);
      }
    });
  }

  getWidget(widgetId) {
    const customWidgetModel = new CustomWidgetsModel();
    customWidgetModel.isArchived = this.isArchived;
    customWidgetModel.customWidgetId = widgetId;
    this.masterDataManagementService.getCustomWidgets(customWidgetModel).subscribe((response: any) => {
      if (response.success === true) {
        this.chartsData = response.data;
        const selectedChartList = [];
        this.chartsData[0].allChartsDetails.forEach((element) => {
          this.selectedCharts.forEach((selectedChart) => {
            if (element.visualizationName == selectedChart) {
              selectedChartList.push(element.customApplicationChartId);
            }
          });
        });

        this.selectedCharts.forEach((element) => {
          this.bytes.forEach((fileBytes) => {
            if (fileBytes.visualizationName == element) {
              this.fileInputBytes.push({ visualizationName: fileBytes.visualizationName, fileByteStrings: fileBytes.bytes });
            }
          });
        });

        this.selectedCharts = selectedChartList;
        this.upsertCronExpression(widgetId);
      }
    });
  }

  upsertProcInputsAndOutputs(widgetId) {
    let procInputAndOutput = new ProcInputAndOutputModel();
    procInputAndOutput.procName = this.procName;
    procInputAndOutput.customWidgetId = widgetId;
    procInputAndOutput.inputs = this.storedProcParams;
    if (this.outputData)
      procInputAndOutput.outputs = this.outputData.procOutputs;
    if (this.legendsData)
      procInputAndOutput.legends = this.legendsData.legends;

    procInputAndOutput.customStoredProcId = this.customStoredProcId;
    procInputAndOutput.timeStamp = this.customProcWidgetTimeStamp;
    this.masterDataManagementService.upsertProcInputsAndOutputs(procInputAndOutput).subscribe((response: any) => {
      if (response.success === true) {
        this.widgetId = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.toaster.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
      this.isUpsertInProgress = false;
    });
  }

  upsertApiAppDetails(widgetId) {
    const apiInputModel = new ApiInputDetailsModel();
    apiInputModel.apiUrl = this.customWidgetForm.get('apiUrl').value;
    apiInputModel.httpMethod = this.customWidgetForm.get('httpMethod').value;
    apiInputModel.bodyJson = this.customWidgetForm.get('bodyJson').value;
    apiInputModel.outputRoot = this.customWidgetForm.get('outputRoot').value;
    apiInputModel.customWidgetId = widgetId;
    apiInputModel.apiHeaders = [];
    apiInputModel.outputParams = [];
    if (this.apiHeaderParams)
      this.inputHeadersCount = this.apiHeaderParams.controls.length;
    if (this.inputHeadersCount > 0) {
      apiInputModel.apiHeaders = this.addInputHeadersForm.get('apiHeaderParams').value;
    }
    if (this.apiOutputParams)
      this.outputParamsCount = this.apiOutputParams.controls.length;
    if (this.outputParamsCount > 0) {
      apiInputModel.outputParams = this.addOutputParamsForm.get('apiOutputParams').value;
    }
    this.widgetService.UpsertApiData(apiInputModel).subscribe((result: any) => {
      if (result.success === true) {
        this.isAnyOperationIsInprogress = false;
      } else {
        var validationMessage = result.apiResponseMessages[0].message;
        this.toasterService.error(validationMessage);
      }
    });
  }

  upsertCronExpression(customWidgetId) {
    if (this.scheduleForm.valid) {
      this.selectedCharts.forEach((element) => {
        this.bytes.forEach((fileBytes) => {
          if (fileBytes.visualizationName == element) {
            this.fileInputBytes.push({ visualizationName: fileBytes.visualizationName, fileByteStrings: fileBytes.bytes });
          }
        });
      });
      let cronExpressionModel = new CronExpressionModel();
      this.isUpsertInProgress = true;
      cronExpressionModel.customWidgetId = customWidgetId;
      cronExpressionModel.selectedCharts = this.selectedCharts.toString();
      cronExpressionModel.fileBytes = this.fileInputBytes;
      cronExpressionModel.runNow = this.runNow;
      cronExpressionModel.cronExpression = this.cronExpression;
      cronExpressionModel.cronExpressionDescription = cronstrue.toString(this.cronExpression);
      if (this.enableGmailField) {
        cronExpressionModel.templateUrl = this.emailField;
      } else {
        cronExpressionModel.templateUrl = this.webUrlField;
      }
      cronExpressionModel.cronExpressionId = this.cronExpressionId;
      cronExpressionModel.cronExpressionName = this.scheduleForm.value.cronExpressionName;
      cronExpressionModel.templateType = this.scheduleForm.value.templateType;
      cronExpressionModel.timeStamp = this.cronTimeStamp;
      cronExpressionModel.jobId = this.jobId;
      this.getSelectedCharts();
      cronExpressionModel.selectedChartName = this.selectedChartDetailsNames.toString();
      cronExpressionModel.CustomAppName = this.customWidgetForm.get("customWidgetName").value;
      this.masterDataManagementService.upsertCronExpression(cronExpressionModel).subscribe((response: any) => {
        if (response.success === true) {
          this.widgetId = response.data;
          this.isAnyOperationIsInprogress = false;
        } else {
          this.toaster.error(response.apiResponseMessages[0].message);
          this.isAnyOperationIsInprogress = false;
        }
        this.isUpsertInProgress = false;
        this.runNow = false;
      });
    }
  }

  navigateToScheduler() {
    if (this.customWidgetData && this.customWidgetData.selectedCharts && this.customWidgetData.selectedCharts.length) {
      const selectedCharts = this.customWidgetData.selectedCharts.split(",");
      const selectedChartList = [];
      selectedCharts.forEach((element) => {
        this.allChartsDetails.forEach((selectedChart) => {
          if (element == selectedChart.gridData.customApplicationChartId) {
            selectedChartList.push(selectedChart.gridData.chartNumber);
            this.selectedCharts.push(selectedChart.gridData.visualizationName);
          }
        });
      });
      selectedChartList.push(-1);
      this.scheduleForm.get("charts").patchValue(selectedChartList);
      this.getSelectedCharts();
    }
    this.selectedTabIndex = 4;
  }

  toggleAllChartsSelected() {
    let allChartData;
    if (this.allSelectedCharts.selected) {
      allChartData = this.allChartsDetails.filter(items => items.gridData.visualizationType !== "kpi");
      this.scheduleForm.get("charts").patchValue([
        ...allChartData.map((item) => item.gridData.chartNumber),
        -1
      ]);
      this.selectedCharts = allChartData.map((item) => item.gridData.visualizationName);
    } else {
      this.scheduleForm.get("charts").patchValue([]);
    }
    this.getSelectedCharts();
  }

  toggleChartsPerOne() {
    if (this.allSelectedCharts.selected) {
      this.allSelectedCharts.deselect();
      return false;
    }
    if (
      this.scheduleForm.get("charts").value.length === (this.allChartsDetails.length - this.kpiChartLength)
    ) {
      this.allSelectedCharts.select();
    }
    this.cdRef.detectChanges();
  }

  getSelectedCharts() {
    const component = this.scheduleForm.value.charts;
    const index = component.indexOf(-1);
    if (index > -1) {
      component.splice(index, 1);
    }
    const chartsList = this.allChartsDetails;
    const selectedChartsList = _.filter(chartsList, (role) => {
      return component.toString().includes(role.gridData.chartNumber);
    })
    const chartNames = selectedChartsList.map((x) => x.gridData.visualizationName);
    this.selectedCharts = chartNames;
    this.selectedChartDetailsNames = chartNames.toString();
  }

  compareSelectedChartsFn(chartsList: any, charts: any) {
    if (chartsList === charts) {
      return true;
    } else {
      return false;
    }
  }

  enableSchedulingDetails(event) {
    if (event === "Email") {
      this.enableGmailField = true;
      this.enableWebHookField = false;
      this.enableNotification = false;

    } else if (event === "Webhook") {
      this.enableWebHookField = true;
      this.enableGmailField = false;
      this.enableNotification = false;
    } else {
      this.enableWebHookField = false;
      this.enableGmailField = false;
      this.enableNotification = true;
    }
  }

  enableButtons() {
    if (this.scheduleForm.valid) {
      if ((this.email.valid && this.enableGmailField) || (this.webUrl.valid && this.enableWebHookField) || this.enableNotification) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  fileBytes(event) {
    const index = this.bytes.findIndex(x => x.uniqueChartNumber == event[1])
    if (index > -1) {
      this.bytes.splice(index, 1);
      this.bytes.push({ uniqueChartNumber: event.uniqueChartNumber, bytes: event.fileBytes, visualizationName: event.visualizationName })
    } else {
      this.bytes.push({ uniqueChartNumber: event.uniqueChartNumber, bytes: event.fileBytes, visualizationName: event.visualizationName })
    }
    this.enableSchedulingButton = false;
    this.cdRef.detectChanges();
  }

  runNowCron() {
    this.runNow = true;
    this.upsertWidget();
  }

  bindDataForYAxis(visualization, data) {
    if (visualization === "kpi" || visualization === "lineargauge" || visualization === "radialgauge" ||
      visualization === "arcgauge" || visualization === "gauge") {
      this.visualizationDetailsForm.get("kpiSelectedData").setValue(data.toString());
      if (visualization !== "kpi") {
        const value = visualization === "lineargauge" ? 0 : visualization === "radialgauge" ? 1 : 2;
        this.visualizationDetailsForm.get("gaugeChartType").setValue(value);
      }
    } else {
      this.visualizationDetailsForm.get("yAxisColumnName").setValue(data);
    }
  }

  checkDisabled() {
    if (this.isProc) {
      if (!this.customWidgetForm.valid || !this.saveProcDetails || !this.saveFetchDetails || !this.addProcOutputForm.valid) {
        return true;
      }
      else {
        return false
      }
    } else if (this.isApi) {
      if (!this.customWidgetForm.valid || !this.addInputHeadersForm.valid || !this.addInputParamsForm.valid || !this.addOutputParamsForm.valid) {
        return true;
      }
      else {
        return false
      }

    } else {
      if (!this.customWidgetForm.valid || this.isAnyOperationIsInprogress || this.isValidationInProgress) {
        return true;
      }
      else {
        return false
      }
    }
  }

  closeSchedulingDialog() {
    this.addCronExpression.close();
  }

  isRemoveScheduling() {
    this.isLoadingInProgress = true;
    let cronExpressionModel = new CronExpressionModel();
    cronExpressionModel.customWidgetId = this.customWidgetId;
    cronExpressionModel.cronExpressionId = this.cronExpressionId;
    cronExpressionModel.isArchived = true;
    this.masterDataManagementService.archiveCronExpression(cronExpressionModel).subscribe((data: any) => {
      this.isLoadingInProgress = false;
      if (data.success) {
        this.addCronExpression.close();
        this.cronExpressionId = null;
        this.schedulerForm();
        this.allChartsDetails = [];
        this.editWidget();
      } else {
        this.toaster.error("", data.apiResponseMessages[0].message);
      }
    })

  }

  openPopOver() {
    this.addCronExpression.open();
  }

  getCollectionChange(event) {
    this.collectionName = event;
    this.cdRef.detectChanges();
  }

  checkTags(newList, oldList) {
    let newTempList = [];
    let oldTempList = [];
    if (newList && oldList) {
      newList.forEach(element => {
        newTempList.push(element.tag)
      });
      oldList.forEach(element => {
        oldTempList.push(element.tag)
      });

      if (newTempList.length !== oldTempList.length) {
        return false;
      };
      for (let i = 0; i < newTempList.length; i++) {
        if (!newTempList.includes(oldTempList[i])) {
          return false;
        };
      };
      return true;
    }
  }

  openAddColorPopup(colorPopUp) {
    colorPopUp.openPopover();
    let yCoOrdinate = this.yCoOrdinate;
    this.color = "";
    this.bindColumnChart(this.selectedChartIndex);
    //this.visualisationColorForm = new FormGroup({});
    // this.visualisationColorForm = new FormGroup(group);
  }

  bindColumnChart(selectedChart) {
    let colorsList;
    if(selectedChart.chartColorJson) {
     colorsList = JSON.parse(selectedChart.chartColorJson)
    }
    let updatedColorList: any[] = [];
    this.clearVisualisationColorForm();
    this.visualisationColorList = this.visualisationColorForm.get('visualisationColorList') as FormArray;
    if (this.visualisationColorList.controls) {
      for (let z = 0; z < this.visualisationColorList.controls.length; z++) {
        this.visualisationColorList.removeAt(0);
      }
    }
    this.visualisationColorList.removeAt(0);
    if (colorsList && colorsList.length > 0) {
      this.visualisationColorList = this.visualisationColorForm.get('visualisationColorList') as FormArray;
      let yCoOrdinate = this.yCoOrdinate;
      yCoOrdinate.forEach((coordinate) => {
        let filteredList = _.filter(colorsList, function (filter) {
          return filter.YAxisColumnName == coordinate
        })
        if (filteredList.length > 0) {
          updatedColorList.push(filteredList[0])
        } else {
          var newModel: any = {};
          newModel.YAxisColumnName = coordinate;
          newModel.SelectedColor = "";
          updatedColorList.push(newModel);
        }

      })
      updatedColorList.forEach(x => {
        this.visualisationColorList.push(this.formBuilder.group({
          yAxisColumnName: x.YAxisColumnName,
          selectedColor: x.SelectedColor
        }))
      })
    } else {
      this.addVisualisationItem();
    }
  }

  onChangeColor(color: string): void {
    this.color = color;
  }
  //this.categoryForm.patchValue({ color });

  getColorPickerColour(event) {
    console.log(event);
    return event.value.selectedColor;
  }


  getIndexColor(i) {
    return window['color' + i];
  }

  getItemColor(item, data) {
    console.log(item, data);
  }

  getItemValue(item, data, value) {
    console.log(item, data, value);
  }

  saveColorsForChart() {
    let colors = this.visualisationColorForm.value.visualisationColorList;
    console.log("colors", colors);
    //this.visualisationColors = this.visualisationColorForm.value.visualisationColorList;
    this.addColorsPopover.forEach((p) => p.closePopover());
  }

  closeColorPalateDialog() {
    this.addColorsPopover.forEach((p) => p.closePopover());
  }
}
