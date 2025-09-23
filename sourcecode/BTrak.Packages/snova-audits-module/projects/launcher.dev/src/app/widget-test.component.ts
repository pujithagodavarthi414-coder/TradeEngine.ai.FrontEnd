// import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
// import * as _ from 'underscore';import { DragedWidget } from './app.module/models/dragedWidget';
// import { ToastrService } from 'ngx-toastr'; import { Guid } from 'guid-typescript';
// import { FormControl } from '@angular/forms';
// ;

// @Component({
//     selector: "widgets-test",
//     templateUrl: "./widget-test.component.html"

// })

// export class WidgetTestComponet extends CustomAppBaseComponent {

//     widgetId: Guid;
//     widget: WidgetList;
//     currentWidget: DragedWidget;
//     widgetNotFound: boolean = false;
//     anyOperationInProgress: boolean = false;
//     widgetData: any;
//     dashboardGlobalData: any;
//     currentWidgetType: number;
//     applicationId: string;
//     dashboardId: string;
//     dashboardName: string;
//     isEntryApp: boolean;
//     appTypeToBeCreated: any;
//     myControl = new FormControl();
//     widgetList: WidgetList[];

//     constructor(private widgetService: WidgetService, private toaster: ToastrService,
//         private cdref: ChangeDetectorRef

//     ) {
//         super();
//         this.openCustomWidget = _.debounce(this.openCustomWidget, 500);
//         this.searchWidget = _.debounce(this.searchWidget, 500);
//     }

//     displayEntryApp: boolean = false;

//     openCustomWidgetEntryApp() {
//         this.displayEntryApp = true;
//         this.openCustomWidget();
//     }

//     openCustomWidget() {
//         this.appTypeToBeCreated = 0;
//         this.widgetNotFound = false;
//         this.anyOperationInProgress = true;
//         const widgetId = this.widgetId.toString();
//         this.widget = new WidgetList();
//         this.widget.widgetId = widgetId;
//         if (this.displayEntryApp == true) {
//             this.widget.pageSize = 2;
//         } else {
//             this.widget.pageSize = 1;
//         }
//         this.widget.isArchived = false;
//         this.widget.pageNumber = 1;
//         this.widget.sortDirectionAsc = true;
//         this.widgetService.GetWidgetsBasedOnUser(this.widget).subscribe((responseData: any) => {
//             if (responseData.success == false) {
//                 this.widgetNotFound = false;
//                 let validationMessage = responseData.apiResponseMessages[0].message;
//                 this.toaster.error(validationMessage);
//                 this.anyOperationInProgress = false;
//             }
//             if (responseData.data.length === 0) {
//                 this.widgetNotFound = true;
//                 this.anyOperationInProgress = false;
//             } else {
//                 this.widgetNotFound = false;
//                 this.anyOperationInProgress = false;
//                 if (this.displayEntryApp == false || responseData.data.length  == 1) {
//                     let data = responseData.data[0];
//                     this.openApp(data);
//                 } else if(responseData.data.length > 1){
//                     let data = responseData.data[1];
//                     this.openApp(data);

//                 }

//             }
//             this.displayEntryApp = false;

//         });

//     }

//     searchWidget(code, value) {
//         this.systemApp = false;
//         this.widget = new WidgetList();
//         this.widget.isArchived = false;
//         this.widget.isCustomWidget = true;
//         this.widget.pageSize = 10;
//         this.widget.searchText = value;
//         this.widget.pageNumber = 1;
//         this.widget.sortDirectionAsc = true;
//         this.widgetService.GetWidgetsBasedOnUser(this.widget).subscribe((responseData: any) => {
//             if (responseData.success == false) {
//                 this.widgetNotFound = false;
//                 let validationMessage = responseData.apiResponseMessages[0].message;
//                 this.toaster.error(validationMessage);
//                 this.anyOperationInProgress = false;
//             }
//             if (responseData.data.length === 0) {
//                 this.widgetNotFound = true;
//                 this.anyOperationInProgress = false;
//             } else {
//                 this.widgetNotFound = false;
//                 this.anyOperationInProgress = false;
//                 this.widgetList = responseData.data;
//             }

//         });
//     }

//     selectedWidgetValue(event) {
//         this.widgetId = event.option.value;
//         this.openCustomWidget();
//     }

//     createApp(type) {
//         this.appTypeToBeCreated = type;
//     }

//     systemApp = false;
//     openApp(app) {
//         this.systemApp = false;
//         const customWidget: any = app;
//         if (!customWidget.isCustomWidget && !customWidget.isHtml && !customWidget.isProcess) {
//             this.systemApp = true;
//         } else if (customWidget.isCustomWidget) {

//             this.currentWidgetType = 1;
//             this.widgetData = {
//                 filterQuery: null,
//                 customWidgetQuery: null,
//                 persistanceId: null,
//                 isUserLevel: true,
//                 emptyWidget: null,
//                 customWidgetId: customWidget.widgetId,
//                 xCoOrdinate: null,
//                 yCoOrdinate: null,
//                 isFromGridster: true,
//                 visualizationType: customWidget.visualizationType,
//                 customAppVisualizationId: customWidget.customAppVisualizationId,
//                 showVisualization: true,
//                 dashboardName: null,
//                 submittedFormId: null,
//                 filterApplied: null,
//                 dashboardFilters: null,
//                 isProc: customWidget.isProc,
//                 procName: customWidget.procName,
//                 pivotMeasurersToDisplay: customWidget.pivotMeasurersToDisplay ? JSON.parse(customWidget.pivotMeasurersToDisplay) : [],
//                 persistanceJson: customWidget.persistanceJson,
//                 isCustomAppAddOrEditRequire: true,
//                 isEditable: customWidget.isEditable,
//                 filters: customWidget.filters,
//                 isCustomApp: true
//             },
//                 this.dashboardGlobalData = this.dashboardGlobalData

//         } else if (customWidget.isHtml == true) {
//             this.currentWidgetType = 2;
//             this.widgetData = {
//                 customWidgetId: customWidget.widgetId,
//                 customDashboardAppId: customWidget.dashboardId,
//                 isCustomApp: false
//             }

//         } else if (customWidget.isProcess == true) {
//             this.currentWidgetType = 3;
//             this.widgetData = {
//                 customWidgetId: customWidget.widgetId,
//                 dashboardName: customWidget.widgetName,
//                 dashboardId: customWidget.dashboardId,
//                 isEntryApp: customWidget.isEntryApp
//             }
//         }

//         this.cdref.detectChanges();
//     }

// }